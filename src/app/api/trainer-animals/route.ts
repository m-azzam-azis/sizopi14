import { NextResponse } from "next/server";
import { JadwalPenugasan } from "@/db/models/jadwalPenugasan";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const username = url.searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { message: "Username parameter is required" },
        { status: 400 }
      );
    }

    const jadwalModel = new JadwalPenugasan();

    // Get animals involved in attractions where this trainer is assigned
    const query = `
      SELECT DISTINCT
        h.id,
        h.nama,
        h.spesies,
        h.status_kesehatan,
        h.url_foto,
        a.nama_atraksi
      FROM 
        JADWAL_PENUGASAN jp
        JOIN ATRAKSI a ON jp.nama_atraksi = a.nama_atraksi
        JOIN BERPARTISIPASI b ON a.nama_atraksi = b.nama_fasilitas
        JOIN HEWAN h ON b.id_hewan = h.id
      WHERE 
        jp.username_lh = $1
      ORDER BY
        h.nama
    `;

    const animals = await jadwalModel.customQuery(query, [username]);

    return NextResponse.json(animals);
  } catch (error: any) {
    console.error("Error fetching trainer animals:", error);
    return NextResponse.json(
      { message: "Failed to fetch trainer animals", error: error.message },
      { status: 500 }
    );
  }
}
