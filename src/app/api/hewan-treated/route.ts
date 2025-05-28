import { NextResponse } from "next/server";
import { decode } from "jsonwebtoken";
import { cookies } from "next/headers";
import { CatatanMedis } from "@/db/models/catatanMedis";

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
      SELECT COUNT(DISTINCT id_hewan) as animals_treated
      FROM CATATAN_MEDIS
      WHERE username_dh = $1
    `;

    const catatanMedisModel = new CatatanMedis();
    const result = await catatanMedisModel.customQuery(query, [username]);
    const animalsTreated = parseInt(result[0]?.animals_treated || "0", 10);

    return NextResponse.json({ animalsTreated });
  } catch (error) {
    console.error("Error fetching animals treated count:", error);
    return NextResponse.json(
      { error: "Failed to fetch animals treated count" },
      { status: 500 }
    );
  }
}
