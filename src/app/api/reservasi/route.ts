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

      await reservasiModel.updateReservation({
        username_P,
        nama_fasilitas,
        tanggal_kunjungan: new Date(tanggal_kunjungan),
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
      WHERE username_P = $1 AND nama_fasilitas = $2 AND tanggal_kunjungan = $3
    `;

    const currentReservation = await reservasiModel.customQuery(query, [
      username_P,
      nama_fasilitas,
      format(new Date(tanggal_kunjungan), "yyyy-MM-dd"),
    ]);

    if (currentReservation.length === 0) {
      return NextResponse.json(
        { message: "Reservation not found" },
        { status: 404 }
      );
    }

    const currentTickets = parseInt(currentReservation[0].jumlah_tiket);

    if (jumlah_tiket > currentTickets) {
      const additionalTickets = jumlah_tiket - currentTickets;

      const capacityCheck = await reservasiModel.checkCapacity(
        nama_fasilitas,
        new Date(tanggal_kunjungan),
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

    await reservasiModel.updateReservation({
      username_P,
      nama_fasilitas,
      tanggal_kunjungan: new Date(tanggal_kunjungan),
      jumlah_tiket: currentTickets,
      new_status: dbStatus,
      new_jumlah_tiket: jumlah_tiket,
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
