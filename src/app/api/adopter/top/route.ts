import { NextResponse } from "next/server";
import pool from "@/db/db";

// Define interface untuk objek nama
interface NameMap {
  [id: string]: string;
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
    
    // Query untuk mendapatkan kontribusi tahun terakhir per adopter
    // Hanya adopsi dengan status pembayaran 'Lunas' yang dihitung
    const topAdoptersQuery = `
      SELECT 
        a.id_adopter,
        a.username_adopter,
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
        a.id_adopter, a.username_adopter, type
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
          name: individualNames[adopter.id_adopter] || 'Unknown'
        };
      } else if (adopter.type === 'organisasi') {
        return {
          ...adopter,
          name: orgNames[adopter.id_adopter] || 'Unknown'
        };
      }
      return adopter;
    });

    return NextResponse.json(topAdopters);
    
  } catch (error) {
    console.error("Error getting top adopters:", error);
    return NextResponse.json(
      { error: "Failed to get top adopters" },
      { status: 500 }
    );
  }
}