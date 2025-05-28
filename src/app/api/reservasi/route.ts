import { NextResponse } from "next/server";
import { Reservasi } from "@/db/models/reservasi";

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
  } catch (error: any) {
    console.error("Error fetching reservation data:", error);
    return NextResponse.json(
      { message: "Failed to fetch reservation data", error: error.message },
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

    const dbStatus = status === "Terjadwal" ? "Aktif" : "Batal";

    await reservasiModel.updateReservation({
      username_P,
      nama_fasilitas,
      tanggal_kunjungan: new Date(tanggal_kunjungan),
      jumlah_tiket,
      new_status: dbStatus,
      new_jumlah_tiket: jumlah_tiket,
    });

    return NextResponse.json({
      message: `${
        type === "attraction" ? "Attraction" : "Ride"
      } reservation updated successfully`,
    });
  } catch (error: any) {
    console.error("Error updating reservation:", error);
    return NextResponse.json(
      { message: "Failed to update reservation", error: error.message },
      { status: 500 }
    );
  }
}
