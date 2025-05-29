import { NextResponse } from "next/server";
import { Reservasi } from "@/db/models/reservasi";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const facilityName = searchParams.get("facility");
    const dateStr = searchParams.get("date");
    const currentTickets = searchParams.get("currentTickets");
    const status = searchParams.get("status");

    if (!facilityName || !dateStr) {
      return NextResponse.json(
        { message: "Missing required parameters" },
        { status: 400 }
      );
    }

    const formattedDateStr = dateStr.split("T")[0];

    console.log("Checking capacity for date:", formattedDateStr);

    const reservasiModel = new Reservasi();

    const query = `
      SELECT 
        f.kapasitas_max,
        COALESCE(SUM(r.jumlah_tiket) FILTER (WHERE r.status = 'Aktif' AND DATE(r.tanggal_kunjungan) = DATE($2::date)), 0) AS tiket_terjual,
        f.kapasitas_max - COALESCE(SUM(r.jumlah_tiket) FILTER (WHERE r.status = 'Aktif' AND DATE(r.tanggal_kunjungan) = DATE($2::date)), 0) AS kapasitas_tersedia
      FROM FASILITAS f
      LEFT JOIN RESERVASI r ON f.nama = r.nama_fasilitas 
      WHERE f.nama = $1
      GROUP BY f.kapasitas_max
    `;

    const result = await reservasiModel.customQuery(query, [
      facilityName,
      formattedDateStr,
    ]);

    if (result.length === 0) {
      return NextResponse.json(
        { message: "Facility not found" },
        { status: 404 }
      );
    }

    const { kapasitas_max, tiket_terjual, kapasitas_tersedia } = result[0];
    const currentTicketsNum = currentTickets ? parseInt(currentTickets) : 0;

    const max_allowed =
      parseInt(kapasitas_tersedia) +
      (status !== "Aktif" ? 0 : currentTicketsNum);

    const adjustedCapacity = {
      kapasitas_max: parseInt(kapasitas_max),
      tiket_terjual: parseInt(tiket_terjual),
      kapasitas_tersedia: parseInt(kapasitas_tersedia),
      max_allowed: max_allowed,
    };

    return NextResponse.json(adjustedCapacity);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error checking capacity:", error);
    return NextResponse.json(
      { message: "Error checking capacity", error: errorMessage },
      { status: 500 }
    );
  }
}
