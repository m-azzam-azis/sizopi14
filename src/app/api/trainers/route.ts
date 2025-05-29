import { NextResponse } from "next/server";
import { PelatihHewan } from "@/db/models/pelatihHewan";

export async function GET() {
  try {
    const pelatihModel = new PelatihHewan();

    // Query to get trainers with user details
    const query = `
      SELECT ph.*, p.nama_depan, p.nama_belakang, p.username
      FROM PELATIH_HEWAN ph
      JOIN PENGGUNA p ON ph.username_lh = p.username
    `;

    const data = await pelatihModel.customQuery(query);

    console.log("Fetched trainers:", data);

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error("Error fetching trainers:", error);
    return NextResponse.json(
      { message: "Failed to fetch trainers", error: error.message },
      { status: 500 }
    );
  }
}
