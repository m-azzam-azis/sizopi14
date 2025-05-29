import { NextRequest, NextResponse } from "next/server";
import pool from "@/db/db"; 

export async function GET(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url);
      const username = searchParams.get("username");
      
      if (!username) {
        return NextResponse.json({ error: "Username tidak diberikan" }, { status: 400 });
      }
    
      const adopterQuery = `
        SELECT ad.id_adopter
        FROM adopter ad
        JOIN pengguna p ON ad.username_adopter = p.username
        WHERE p.username = $1
      `;
      
      const adopterResult = await pool.query(adopterQuery, [username]);
      
      if (adopterResult.rows.length === 0) {
        return NextResponse.json({ error: "Pengguna bukan adopter" }, { status: 404 });
      }
      
      const adopterId = adopterResult.rows[0].id_adopter;
      
      // Ambil detail adopter
      const adopterDetailsQuery = `
        SELECT 
          ad.id_adopter, 
          ad.username_adopter, 
          ad.total_kontribusi,
          p.email,
          p.no_telepon,
          CASE 
            WHEN i.nama IS NOT NULL THEN i.nama
            WHEN o.nama_organisasi IS NOT NULL THEN o.nama_organisasi
            ELSE 'Unknown'
          END as name,
          CASE 
            WHEN i.id_adopter IS NOT NULL THEN 'individu'
            WHEN o.id_adopter IS NOT NULL THEN 'organisasi'
            ELSE NULL
          END as type,
          pg.alamat as address
        FROM adopter ad
        JOIN pengguna p ON ad.username_adopter = p.username
        JOIN pengunjung pg ON p.username = pg.username_P
        LEFT JOIN individu i ON ad.id_adopter = i.id_adopter
        LEFT JOIN organisasi o ON ad.id_adopter = o.id_adopter
        WHERE ad.id_adopter = $1
      `;
      
      const adopterDetails = await pool.query(adopterDetailsQuery, [adopterId]);
      
      // Ambil data adopsi untuk adopter ini
      const adoptionsQuery = `
        SELECT 
          h.id as id_hewan,
          h.nama as nama_hewan,
          h.spesies,
          h.status_kesehatan,
          h.url_foto,
          a.status_pembayaran,
          a.kontribusi_finansial,
          a.tgl_mulai_adopsi,
          a.tgl_berhenti_adopsi
        FROM adopsi a
        JOIN hewan h ON a.id_hewan = h.id
        WHERE a.id_adopter = $1
      `;
      
      const adoptions = await pool.query(adoptionsQuery, [adopterId]);
      
      return NextResponse.json({
        adopter: adopterDetails.rows[0] || null,
        adoptions: adoptions.rows || []
      });
    } catch (error) {
      console.error("Error saat mengambil data adopsi:", error);
      return NextResponse.json(
        { error: "Terjadi kesalahan saat mengambil data adopsi"},
        { status: 500 }
      );
    }
  }