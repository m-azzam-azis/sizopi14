import pool from "@/db/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const username = url.searchParams.get("username");
    const type = url.searchParams.get("type");
    
    if (!username || !type) {
      return NextResponse.json(
        { error: "Username dan tipe diperlukan" },
        { status: 400 }
      );
    }

    // Periksa apakah adopter ada dengan username dan tipe yang diberikan
    let query;
    if (type === "individu") {
      query = `
        SELECT 
          a.id_adopter, 
          i.nama as name, 
          p.alamat as address, 
          pg.no_telepon as noTelp
        FROM adopter a
        JOIN individu i ON a.id_adopter = i.id_adopter
        JOIN pengunjung p ON a.username_adopter = p.username_P
        JOIN pengguna pg ON p.username_P = pg.username
        WHERE a.username_adopter = $1
      `;
    } else if (type === "organisasi") {
      query = `
        SELECT 
          a.id_adopter, 
          o.nama_organisasi as name, 
          p.alamat as address, 
          pg.no_telepon as noTelp
        FROM adopter a
        JOIN organisasi o ON a.id_adopter = o.id_adopter
        JOIN pengunjung p ON a.username_adopter = p.username_P
        JOIN pengguna pg ON p.username_P = pg.username
        WHERE a.username_adopter = $1
      `;
    } else {
      return NextResponse.json(
        { error: "Tipe tidak valid. Harus 'individu' atau 'organisasi'" },
        { status: 400 }
      );
    }

    const result = await pool.query(query, [username]);
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { found: false, message: "Adopter tidak ditemukan" },
        { status: 404 }
      );
    }

    // Pastikan properti nama sesuai dengan yang diharapkan form
    const adopter = {
      ...result.rows[0],
      // Jika notelp ada tetapi noTelp tidak ada, gunakan notelp
      noTelp: result.rows[0].noTelp || result.rows[0].notelp
    };

    return NextResponse.json({ 
      found: true,
      adopter
    }, { status: 200 });

  } catch (error) {
    console.error("Error memverifikasi adopter:", error);
    return NextResponse.json(
      { error: "Gagal memverifikasi adopter"},
      { status: 500 }
    );
  }
}