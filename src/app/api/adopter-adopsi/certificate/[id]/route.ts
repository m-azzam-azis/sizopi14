import { NextRequest, NextResponse } from "next/server";
import pool from "@/db/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { error: "Username tidak diberikan" },
        { status: 400 }
      );
    }

    // Query untuk mengambil data sertifikat
    // Memastikan nama hewan (h.nama) dan jenis hewan (h.spesies) diambil dari tabel hewan
    const query = `
      SELECT 
        h.id as animalId,
        h.nama as animalName,        -- Nama hewan dari tabel hewan
        h.spesies as animalSpecies,  -- Jenis/spesies hewan dari tabel hewan
        a.tgl_mulai_adopsi as startDate,
        a.tgl_berhenti_adopsi as endDate,
        a.id_adopter as ownerId
      FROM hewan h
      JOIN adopsi a ON h.id = a.id_hewan
      JOIN adopter ad ON a.id_adopter = ad.id_adopter
      WHERE h.id = $1 AND ad.username_adopter = $2
    `;

    const result = await pool.query(query, [id, username]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Data sertifikat tidak ditemukan" },
        { status: 404 }
      );
    }

    console.log("Data hewan yang diambil:", result.rows[0]);

    // Format tanggal
    const certificate = {
      ...result.rows[0],
      animalName: result.rows[0].animalname,
      animalSpecies: result.rows[0].animalspecies,
      startDate: formatDate(result.rows[0].startdate),
      endDate: formatDate(result.rows[0].enddate),
    };

    // Ambil data adopter
    const adopter = await getAdopterDetails(certificate.ownerid);

    if (!adopter) {
      return NextResponse.json(
        { error: "Data adopter tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      certificate,
      adopter,
    });
  } catch (error) {
    console.error("Error fetching certificate data:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil data sertifikat" },
      { status: 500 }
    );
  }
}

async function getAdopterDetails(adopterId: string) {
  try {
    const query = `
      SELECT 
        ad.id_adopter as id,
        ad.username_adopter as username,
        CASE 
          WHEN i.id_adopter IS NOT NULL THEN 'individu'
          WHEN o.id_adopter IS NOT NULL THEN 'organisasi'
          ELSE NULL
        END as type,
        i.nama as name,
        o.nama_organisasi as organizationName
      FROM adopter ad
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
  if (!dateString) return "-";

  const date = new Date(dateString);

  return date.toISOString().split("T")[0];
}
