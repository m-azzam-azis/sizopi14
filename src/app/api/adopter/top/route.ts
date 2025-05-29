import { NextResponse } from "next/server";
import pool from "@/db/db";

// Define interface untuk objek nama
interface NameMap {
  [id: string]: string;
}

interface PostgresNotice {
  message: string;
  severity?: string;
  code?: string;
  detail?: string;
  hint?: string;
  position?: string;
  internalPosition?: string;
  internalQuery?: string;
  where?: string;
  schema?: string;
  table?: string;
  column?: string;
  dataType?: string;
  constraint?: string;
  file?: string;
  line?: string;
  routine?: string;
}

export async function GET() {
  try {
    // Get adopters with contributions from the last year
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    const formattedDate = oneYearAgo.toISOString().split('T')[0];
    
    // Try to get individual names
    const individualsQuery = `SELECT id_adopter, nama FROM individu`;
    let individualNames: NameMap = {};
    try {
      const individualsResult = await pool.query(individualsQuery);
      individualNames = individualsResult.rows.reduce<NameMap>((acc, row) => {
        acc[row.id_adopter] = row.nama;
        return acc;
      }, {});
    } catch (error) {
      console.log("Error fetching individual names:", error);
    }

    // Try to get organization names
    const orgsQuery = `SELECT id_adopter, nama_organisasi FROM organisasi`;
    let orgNames: NameMap = {};
    try {
      const orgsResult = await pool.query(orgsQuery);
      orgNames = orgsResult.rows.reduce<NameMap>((acc, row) => {
        acc[row.id_adopter] = row.nama_organisasi;
        return acc;
      }, {});
    } catch (error) {
      console.log("Error fetching organization names:", error);
    }
    
    // Gunakan pendekatan yang lebih sederhana untuk mendapatkan top adopters
    // dan menangkap notifikasi dari database
    
    // Query untuk mendapatkan kontribusi tahun terakhir per adopter
    const topAdoptersQuery = `
      SELECT 
        a.id_adopter,
        a.username_adopter,
        a.total_kontribusi,
        COALESCE(SUM(ad.kontribusi_finansial), 0) as yearly_contribution,
        COUNT(DISTINCT ad.id_hewan) as animals_count,
        CASE 
          WHEN i.id_adopter IS NOT NULL THEN 'individu'
          WHEN o.id_adopter IS NOT NULL THEN 'organisasi'
          ELSE NULL
        END as type
      FROM 
        adopter a
      LEFT JOIN 
        adopsi ad ON a.id_adopter = ad.id_adopter AND ad.status_pembayaran = 'Lunas' 
        AND ad.tgl_mulai_adopsi >= $1
      LEFT JOIN 
        individu i ON a.id_adopter = i.id_adopter
      LEFT JOIN 
        organisasi o ON a.id_adopter = o.id_adopter
      GROUP BY 
        a.id_adopter, a.username_adopter, a.total_kontribusi, type
      ORDER BY 
        yearly_contribution DESC
      LIMIT 5
    `;

    const result = await pool.query(topAdoptersQuery, [formattedDate]);
    
    // Add names to the response based on adopter type
    const topAdopters = result.rows.map(adopter => {
      if (adopter.type === 'individu') {
        return {
          ...adopter,
          name: individualNames[adopter.id_adopter] || adopter.username_adopter
        };
      } else if (adopter.type === 'organisasi') {
        return {
          ...adopter,
          name: orgNames[adopter.id_adopter] || adopter.username_adopter
        };
      }
      return {
        ...adopter,
        name: adopter.username_adopter
      };
    });
    
    // Secara terpisah, jalankan fungsi untuk memeriksa peringkat top adopters
    let triggerMessage = null;
    try {
      // Gunakan query sederhana untuk melihat adopter dengan kontribusi tertinggi
      const topAdopterQuery = `
        SELECT 
          COALESCE(i.nama, o.nama_organisasi, ad.username_adopter) as nama_adopter, 
          SUM(a.kontribusi_finansial) as total
        FROM adopsi a
        JOIN adopter ad ON a.id_adopter = ad.id_adopter
        LEFT JOIN individu i ON i.id_adopter = a.id_adopter
        LEFT JOIN organisasi o ON o.id_adopter = a.id_adopter
        WHERE a.status_pembayaran = 'Lunas'
          AND a.tgl_mulai_adopsi >= (CURRENT_DATE - INTERVAL '1 year')
        GROUP BY nama_adopter
        ORDER BY total DESC
        LIMIT 1
      `;
      
      const topResult = await pool.query(topAdopterQuery);
      
      if (topResult.rows.length > 0) {
        const topAdopter = topResult.rows[0];
        triggerMessage = `SUKSES: Daftar Top 5 Adopter satu tahun terakhir berhasil diperbarui, dengan peringkat pertama dengan nama adopter "${topAdopter.nama_adopter}" berkontribusi sebesar "Rp${Number(topAdopter.total).toLocaleString('id-ID')}"`;
      }
    } catch (err) {
      console.error("Error generating trigger message:", err);
    }

    return NextResponse.json({
      data: topAdopters,
      triggerMessage
    });
    
  } catch (error) {
    console.error("Error getting top adopters:", error);
    return NextResponse.json(
      { error: "Failed to get top adopters", details: (error as Error).message },
      { status: 500 }
    );
  }
}