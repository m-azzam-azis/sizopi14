import { NextRequest, NextResponse } from "next/server";
import pool from "@/db/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    
    const animalQuery = `
      SELECT 
        h.id as id_hewan,
        h.nama as name,
        h.spesies as species,
        h.nama_habitat as habitat,
        h.status_kesehatan as condition,
        h.url_foto as imageUrl,
        a.id_adopter as ownerId,
        a.tgl_mulai_adopsi as startDate
      FROM hewan h
      JOIN adopsi a ON h.id = a.id_hewan
      WHERE h.id = $1
    `;
    
    const animalResult = await pool.query(animalQuery, [id]);
    
    if (animalResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Data hewan tidak ditemukan" },
        { status: 404 }
      );
    }
    
    const animal = animalResult.rows[0];
    
    let adopterName = "Unknown";
    const adopterQuery = `
      SELECT 
        CASE 
          WHEN i.nama IS NOT NULL THEN i.nama
          WHEN o.nama_organisasi IS NOT NULL THEN o.nama_organisasi
          ELSE 'Unknown'
        END as adopter_name
      FROM adopter ad
      LEFT JOIN individu i ON ad.id_adopter = i.id_adopter
      LEFT JOIN organisasi o ON ad.id_adopter = o.id_adopter
      WHERE ad.id_adopter = $1
    `;
    
    const adopterResult = await pool.query(adopterQuery, [animal.ownerid]);
    
    if (adopterResult.rows.length > 0) {
      adopterName = adopterResult.rows[0].adopter_name;
    }
    
    let doctorColumns;
    try {
      const columnQuery = `
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = 'dokter_hewan'
        ORDER BY ordinal_position;
      `;
      doctorColumns = await pool.query(columnQuery);
      console.log("Dokter hewan columns:", doctorColumns.rows.map(r => r.column_name));
    } catch (e) {
      console.error("Error checking dokter_hewan structure:", e);
    }
    
    const medicalQuery = `
      SELECT 
        cm.id_hewan,
        cm.tanggal_pemeriksaan as date,
        cm.username_dh,
        cm.status_kesehatan as healthStatus,
        cm.diagnosis,
        cm.pengobatan as treatment,
        cm.catatan_tindak_lanjut as notes
      FROM catatan_medis cm
      WHERE cm.id_hewan = $1 
      AND cm.tanggal_pemeriksaan >= $2
      ORDER BY cm.tanggal_pemeriksaan DESC
    `;
    
    const medicalResult = await pool.query(medicalQuery, [id, animal.startdate]);
    
    const medicalRecords = [];
    
    for (const record of medicalResult.rows) {
      let doctorName = "Dokter Hewan";
      try {
        const doctorQuery = `
          SELECT username_dh, username_p
          FROM dokter_hewan
          WHERE username_dh = $1
        `;
        
        const doctorResult = await pool.query(doctorQuery, [record.username_dh]);
        
        if (doctorResult.rows.length > 0) {
          const penggunaQuery = `
            SELECT nama
            FROM pengguna
            WHERE username = $1
          `;
          
          const penggunaResult = await pool.query(penggunaQuery, [doctorResult.rows[0].username_p]);
          
          if (penggunaResult.rows.length > 0) {
            doctorName = "Dr. " + penggunaResult.rows[0].nama;
          }
        }
      } catch (e) {
        console.error("Error fetching doctor name:", e);
      }
      
      medicalRecords.push({
        id: `${record.id_hewan}-${record.date}`,
        date: record.date,
        displayDate: formatDate(record.date),
        doctorName: doctorName,
        healthStatus: record.healthstatus,
        diagnosis: record.diagnosis,
        treatment: record.treatment,
        notes: record.notes
      });
    }
    
    const formattedData = {
      ...animal,
      medicalRecords: medicalRecords,
      adopterName: adopterName
    };
    
    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("Error fetching health records:", error);
    return NextResponse.json(
      { 
        error: "Terjadi kesalahan saat mengambil data kondisi hewan", 
      },
      { status: 500 }
    );
  }
}

// Format tanggal untuk tampilan
function formatDate(dateString: string | Date) {
  if (!dateString) return "-";
  
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
}