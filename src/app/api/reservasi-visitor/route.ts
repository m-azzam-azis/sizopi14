import { NextResponse } from "next/server";
import { Reservasi } from "@/db/models/reservasi";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");
    const type = searchParams.get("type");

    if (!username && !type) {
      return NextResponse.json(
        { message: "Missing required parameters" },
        { status: 400 }
      );
    }

    const reservasiModel = new Reservasi();
    let data;

    if (username && !type) {
      data = await reservasiModel.getVisitorReservations(username);
      return NextResponse.json({ reservations: data });
    }

    if (type === "available") {
      const dateString = searchParams.get("date");
      const date = dateString ? new Date(dateString) : new Date();

      const attractions = await reservasiModel.getAvailableAttractions(date);
      const rides = await reservasiModel.getAvailableRides(date);

      return NextResponse.json({
        attractions,
        rides,
      });
    }

    if (type === "attraction" && searchParams.get("name")) {
      const dateString = searchParams.get("date");
      const date = dateString ? new Date(dateString) : new Date();
      data = await reservasiModel.getAttractionDetails(
        searchParams.get("name")!,
        date
      );
      return NextResponse.json({ data });
    }

    if (type === "ride" && searchParams.get("name")) {
      const dateString = searchParams.get("date");
      const date = dateString ? new Date(dateString) : new Date();
      data = await reservasiModel.getRideDetails(
        searchParams.get("name")!,
        date
      );
      return NextResponse.json({ data });
    }

    return NextResponse.json(
      { message: "Invalid request parameters" },
      { status: 400 }
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error processing request:", error);
    return NextResponse.json(
      { message: "Server error", error: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username_P, nama_fasilitas, tanggal_kunjungan, jumlah_tiket } =
      body;

    if (!username_P || !nama_fasilitas || !tanggal_kunjungan || !jumlah_tiket) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const reservasiModel = new Reservasi();

    const capacityCheck = await reservasiModel.checkCapacity(
      nama_fasilitas,
      new Date(tanggal_kunjungan),
      jumlah_tiket
    );

    if (!capacityCheck.enough) {
      return NextResponse.json(
        { message: capacityCheck.message },
        { status: 400 }
      );
    }

    const result = await reservasiModel.createReservation({
      username_P,
      nama_fasilitas,
      tanggal_kunjungan: new Date(tanggal_kunjungan),
      jumlah_tiket,
    });

    return NextResponse.json({
      message: "Reservation created successfully",
      reservation: result,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error creating reservation:", error);
    return NextResponse.json(
      { message: "Server error", error: errorMessage },
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
      new_jumlah_tiket,
    } = body;

    if (!username_P || !nama_fasilitas || !tanggal_kunjungan) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const reservasiModel = new Reservasi();

    try {
      await reservasiModel.updateReservation({
        username_P,
        nama_fasilitas,
        tanggal_kunjungan: new Date(tanggal_kunjungan),
        jumlah_tiket: 1,
        new_tanggal_kunjungan: new_tanggal_kunjungan
          ? new Date(new_tanggal_kunjungan)
          : undefined,
        new_jumlah_tiket: new_jumlah_tiket,
      });

      return NextResponse.json({ message: "Reservasi updated successfully" });
    } catch (dbError) {
      const errorMessage =
        dbError instanceof Error ? dbError.message : "Unknown error";
      console.error("Database error:", errorMessage);

      return NextResponse.json({ message: errorMessage }, { status: 400 });
    }
  } catch (error) {
    console.error("Error updating reservation:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Failed to update reservation", error: errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");
    const facility = searchParams.get("facility");
    const date = searchParams.get("date");

    if (!username || !facility || !date) {
      return NextResponse.json(
        { message: "Missing required parameters" },
        { status: 400 }
      );
    }

    const reservasiModel = new Reservasi();

    const result = await reservasiModel.cancelReservation(
      username,
      facility,
      new Date(date)
    );

    if (!result) {
      return NextResponse.json(
        { message: "Reservation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Reservation cancelled successfully",
      reservation: result,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error cancelling reservation:", error);
    return NextResponse.json(
      { message: "Server error", error: errorMessage },
      { status: 500 }
    );
  }
}
