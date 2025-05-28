import { NextRequest, NextResponse } from "next/server";
import pool from "@/db/db"; // Import pool langsung

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");
    
    if (!username) {
      return NextResponse.json({ error: "Username tidak diberikan" }, { status: 400 });
    }

    // Query untuk mencari adopter berdasarkan username
    const query = `
      SELECT ad.* 
      FROM adopter ad
      JOIN pengguna p ON ad.username_adopter = p.username
      WHERE p.username = $1
    `;
    
    // Gunakan pool langsung
    const result = await pool.query(query, [username]);
    
    if (result.rows.length > 0) {
      const adopter = result.rows[0];
      return NextResponse.json({
        id: adopter.id_adopter,
        username: adopter.username_adopter,
        totalKontribusi: adopter.total_kontribusi
      });
    }
    
    return NextResponse.json({ error: "Pengguna bukan adopter" }, { status: 404 });
  } catch (error) {
    console.error("Error saat memeriksa status adopter:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memeriksa status adopter" },
      { status: 500 }
    );
  }
}