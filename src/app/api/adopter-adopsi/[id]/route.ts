import { NextRequest, NextResponse } from "next/server";
import pool from "@/db/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    
    const query = `
      SELECT 
        h.id,
        h.nama as name,
        h.spesies as species, 
        h.nama_habitat as habitat,
        h.url_foto as imageUrl,
        h.status_kesehatan,
        a.id_adopter as ownerId,
        a.tgl_mulai_adopsi as startDate,
        a.tgl_berhenti_adopsi as endDate,
        a.status_pembayaran as paymentStatus,
        a.kontribusi_finansial,
        CASE 
          WHEN i.nama IS NOT NULL THEN i.nama
          WHEN o.nama_organisasi IS NOT NULL THEN o.nama_organisasi
          ELSE 'Unknown'
        END as adopter_name,
        CASE 
          WHEN i.id_adopter IS NOT NULL THEN 'individu'
          WHEN o.id_adopter IS NOT NULL THEN 'organisasi'
          ELSE NULL
        END as adopter_type,
        ad.username_adopter
      FROM hewan h
      JOIN adopsi a ON h.id = a.id_hewan
      JOIN adopter ad ON a.id_adopter = ad.id_adopter
      LEFT JOIN individu i ON a.id_adopter = i.id_adopter
      LEFT JOIN organisasi o ON a.id_adopter = o.id_adopter
      WHERE h.id = $1
    `;
    
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Data hewan adopsi tidak ditemukan" },
        { status: 404 }
      );
    }
  
    
    // Get adopter details
    const adopter = await getAdopterDetails(result.rows[0].ownerid);
    
    // Structure the response dengan memperhatikan case kolom
    const response = {
      animal: {
        id: result.rows[0].id,
        name: result.rows[0].name,
        species: result.rows[0].species,
        habitat: result.rows[0].habitat || "Habitat tidak tersedia",
        imageUrl: result.rows[0].imageurl || "",
        startDate: formatDate(result.rows[0].startdate),
        endDate: formatDate(result.rows[0].enddate),
        ownerId: result.rows[0].ownerid,
        paymentStatus: result.rows[0].paymentstatus,
        status_kesehatan: result.rows[0].status_kesehatan,
        kontribusi_finansial: result.rows[0].kontribusi_finansial
      },
      adopter: adopter
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching animal adoption details:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil detail hewan adopsi"},
      { status: 500 }
    );
  }
}

async function getAdopterDetails(adopterId: string) {
  try {
    // Query adopter details based on type (individu/organisasi)
    const query = `
      SELECT 
        ad.id_adopter as id,
        ad.username_adopter as username,
        p.no_telepon as noTelp,  -- Pastikan kolom ini ada di hasil query
        p.email,
        CASE 
          WHEN i.id_adopter IS NOT NULL THEN 'individu'
          WHEN o.id_adopter IS NOT NULL THEN 'organisasi'
          ELSE NULL
        END as type,
        pg.alamat as address,
        pg.tgl_lahir as birthDate,
        i.nama as name,
        i.nik,
        o.nama_organisasi as organizationName,  -- Pastikan kolom ini ada di hasil query
        o.npp
      FROM adopter ad
      JOIN pengguna p ON ad.username_adopter = p.username
      JOIN pengunjung pg ON p.username = pg.username_P
      LEFT JOIN individu i ON ad.id_adopter = i.id_adopter
      LEFT JOIN organisasi o ON ad.id_adopter = o.id_adopter
      WHERE ad.id_adopter = $1
    `;
    
    const result = await pool.query(query, [adopterId]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching adopter details:", error);
    return null;
  }
}

function formatDate(dateString: string | null) {
  if (!dateString) return null;
  
  const date = new Date(dateString);
  return date.toISOString().split('T')[0]; 
}