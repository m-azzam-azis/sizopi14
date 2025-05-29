import { NextResponse } from "next/server";
import { decode } from "jsonwebtoken";
import { cookies } from "next/headers";
import { PenjagaHewan } from "@/db/models/penjagaHewan";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded: any = decode(token.value);
    const username = decoded?.data?.username;

    if (!username) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const query = `
      SELECT COUNT(DISTINCT p.id_hewan) as feeding_count
      FROM PAKAN p
      JOIN MEMBERI m ON p.id_hewan = m.id_hewan AND p.jadwal = m.jadwal
      WHERE m.username_jh = $1
    `;

    const penjagaHewanModel = new PenjagaHewan();

    const result = await penjagaHewanModel.customQuery(query, [username]);
    const feedingCount = parseInt(result[0]?.feeding_count || "0", 10);

    return NextResponse.json({ feedingCount });
  } catch (error) {
    console.error("Error fetching feeding count:", error);
    return NextResponse.json(
      { error: "Failed to fetch feeding count" },
      { status: 500 }
    );
  }
}
