import { NextResponse } from "next/server";
import { Reservasi } from "@/db/models/reservasi";
import { format } from "date-fns";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "attraction";

    const reservasiModel = new Reservasi();

    let data;
    if (type === "attraction") {
      data = await reservasiModel.getAllAttractionReservationsForAdmin();
    } else if (type === "ride") {
      data = await reservasiModel.getAllRideReservationsForAdmin();
    } else {
      return NextResponse.json(
        { message: "Invalid reservation type" },
        { status: 400 }
      );
    }

    return NextResponse.json({ data });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching reservation data:", error);
    return NextResponse.json(
      { message: "Failed to fetch reservation data", error: errorMessage },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      username_P,
      nama_fasilitas,
      tanggal_kunjungan,
      new_tanggal_kunjungan,
      jumlah_tiket,
      status,
      type,
    } = body;

    if (!username_P || !nama_fasilitas || !tanggal_kunjungan) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const reservasiModel = new Reservasi();

    if (status === "Dibatalkan") {
      const dbStatus = "Batal";

      const formattedDate = formatDateForUpdate(tanggal_kunjungan);
      const dateObject = new Date(formattedDate);

      await reservasiModel.updateReservation({
        username_P,
        nama_fasilitas,
        tanggal_kunjungan: dateObject,
        jumlah_tiket,
        new_status: dbStatus,
      });

      return NextResponse.json({
        message: `${
          type === "attraction" ? "Attraction" : "Ride"
        } reservation cancelled successfully`,
      });
    }

    const query = `
      SELECT jumlah_tiket, tanggal_kunjungan 
      FROM RESERVASI
      WHERE username_P = $1 
      AND nama_fasilitas = $2 
      AND tanggal_kunjungan::text = $3
    `;

    function formatDateForQuery(date: string | Date) {
      const d = new Date(date);
      d.setDate(d.getDate() + 1);
      return d.toISOString().split("T")[0];
    }

    function formatDateForUpdate(date: string | Date) {
      const d = new Date(date);
      return d.toISOString().split("T")[0];
    }

    const dateString = formatDateForQuery(tanggal_kunjungan);

    const currentReservation = await reservasiModel.customQuery(query, [
      username_P,
      nama_fasilitas,
      dateString,
    ]);

    console.log("username_P", username_P);
    console.log("nama_fasilitas", nama_fasilitas);
    console.log("date used", dateString);
    console.log("currentReservation", currentReservation);

    if (currentReservation.length === 0) {
      return NextResponse.json(
        { message: "Reservation not found" },
        { status: 404 }
      );
    }

    const currentTickets = parseInt(currentReservation[0].jumlah_tiket);
    const newDate = new_tanggal_kunjungan
      ? new Date(new_tanggal_kunjungan)
      : new Date(tanggal_kunjungan);

    if (jumlah_tiket > currentTickets) {
      const additionalTickets = jumlah_tiket - currentTickets;

      const capacityCheck = await reservasiModel.checkCapacity(
        nama_fasilitas,
        newDate,
        additionalTickets
      );

      if (!capacityCheck.enough) {
        return NextResponse.json(
          { message: capacityCheck.message },
          { status: 400 }
        );
      }
    }

    const dbStatus = status === "Terjadwal" ? "Aktif" : "Batal";

    const formattedOriginalDate = formatDateForUpdate(tanggal_kunjungan);
    const dateObject = new Date(formattedOriginalDate);

    await reservasiModel.updateReservation({
      username_P,
      nama_fasilitas,
      tanggal_kunjungan: dateObject,
      jumlah_tiket,
      new_status: dbStatus,
      new_jumlah_tiket: jumlah_tiket,
      new_tanggal_kunjungan: new_tanggal_kunjungan
        ? new Date(formatDateForUpdate(new_tanggal_kunjungan))
        : undefined,
    });

    return NextResponse.json({
      message: `${
        type === "attraction" ? "Attraction" : "Ride"
      } reservation updated successfully`,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error updating reservation:", error);
    return NextResponse.json(
      { message: "Failed to update reservation", error: errorMessage },
      { status: 500 }
    );
  }
}
