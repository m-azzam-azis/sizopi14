import { NextResponse } from "next/server";
import { Reservasi } from "@/db/models/reservasi";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const facilityName = searchParams.get("facility");
    const dateStr = searchParams.get("date");
    const username = searchParams.get("username");
    const currentTickets = searchParams.get("currentTickets");
    const status = searchParams.get("status");

    if (!facilityName || !dateStr) {
      return NextResponse.json(
        { message: "Missing required parameters" },
        { status: 400 }
      );
    }

    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(5, 7);
    const day = dateStr.substring(8, 10);
    const formattedDateStr = `${year}-${month}-${day}`;
    const date = new Date(formattedDateStr);

    console.log("Checking capacity for date:", formattedDateStr);

    const reservasiModel = new Reservasi();

    const query = `
      SELECT 
        f.kapasitas_max,
        COALESCE(SUM(r.jumlah_tiket) FILTER (WHERE r.status = 'Aktif' AND r.tanggal_kunjungan::date = $2::date), 0) AS tiket_terjual,
        f.kapasitas_max - COALESCE(SUM(r.jumlah_tiket) FILTER (WHERE r.status = 'Aktif' AND r.tanggal_kunjungan::date = $2::date), 0) AS kapasitas_tersedia
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
  } catch (error: any) {
    console.error("Error checking capacity:", error);
    return NextResponse.json(
      { message: "Error checking capacity", error: error.message },
      { status: 500 }
    );
  }
}
