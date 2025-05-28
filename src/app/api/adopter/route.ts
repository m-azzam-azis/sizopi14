import { NextResponse } from "next/server";
import pool from "@/db/db";

// Define interface untuk objek nama
interface NameMap {
  [id: string]: string;
}

export async function GET(request: Request) {
  try {
    // Try to get individual adopter names
    const individualsQuery = `
      SELECT i.id_adopter, i.nama
      FROM individu i
    `;
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
    const orgsQuery = `
      SELECT o.id_adopter, o.nama_organisasi
      FROM organisasi o
    `;
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

    const url = new URL(request.url);
    const id_adopter = url.searchParams.get("id_adopter");
    
    console.log("GET /api/adopter - Started request processing");
    
    if (id_adopter) {
      // Query for specific adopter with real-time total contribution calculation
      const query = `
        SELECT 
          a.id_adopter as id,
          a.username_adopter as username,
          (
            SELECT COALESCE(SUM(ad.kontribusi_finansial), 0)
            FROM adopsi ad
            WHERE ad.id_adopter = a.id_adopter
            AND ad.status_pembayaran = 'Lunas'
          ) as total_contribution,
          (
            SELECT COUNT(*)
            FROM adopsi ad
            WHERE ad.id_adopter = a.id_adopter
          ) as adoption_count,
          (
            SELECT COUNT(*)
            FROM adopsi ad
            WHERE ad.id_adopter = a.id_adopter
            AND (ad.tgl_berhenti_adopsi IS NULL OR ad.tgl_berhenti_adopsi > CURRENT_DATE)
            AND ad.status_pembayaran = 'Lunas'
          ) as active_adoption_count,
          CASE 
            WHEN i.id_adopter IS NOT NULL THEN 'individu'
            WHEN o.id_adopter IS NOT NULL THEN 'organisasi'
            ELSE NULL
          END as type
        FROM adopter a
        LEFT JOIN individu i ON a.id_adopter = i.id_adopter
        LEFT JOIN organisasi o ON a.id_adopter = o.id_adopter
        WHERE a.id_adopter = $1
      `;

      const result = await pool.query(query, [id_adopter]);
      
      if (result.rows.length === 0) {
        return NextResponse.json({ error: "Adopter not found" }, { status: 404 });
      }
      
      const adopter = result.rows[0];
      
      // Add name based on type
      if (adopter.type === 'individu') {
        adopter.name = individualNames[adopter.id] || 'Unknown';
      } else if (adopter.type === 'organisasi') {
        adopter.name = orgNames[adopter.id] || 'Unknown';
      }
      
      // Get adoptions for this adopter
      const adoptionsQuery = `
        SELECT 
          h.id as animal_id,
          h.nama as animal_name,
          h.spesies as animal_species,
          a.tgl_mulai_adopsi as start_date,
          a.tgl_berhenti_adopsi as end_date,
          a.status_pembayaran as payment_status,
          a.kontribusi_finansial as contribution,
          CASE 
            WHEN a.tgl_berhenti_adopsi IS NULL OR a.tgl_berhenti_adopsi > CURRENT_DATE THEN TRUE
            ELSE FALSE
          END as is_active
        FROM adopsi a
        JOIN hewan h ON a.id_hewan = h.id
        WHERE a.id_adopter = $1
        ORDER BY a.tgl_mulai_adopsi DESC
      `;
      
      const adoptionsResult = await pool.query(adoptionsQuery, [id_adopter]);
      
      // Return adopter with adoptions
      return NextResponse.json({
        adopter: adopter,
        adoptions: adoptionsResult.rows
      });
    } else {
      // Query for all adopters with real-time total contribution calculation
      const query = `
        SELECT 
          a.id_adopter as id,
          a.username_adopter as username,
          (
            SELECT COALESCE(SUM(ad.kontribusi_finansial), 0)
            FROM adopsi ad
            WHERE ad.id_adopter = a.id_adopter
            AND ad.status_pembayaran = 'Lunas'
          ) as total_kontribusi,
          (
            SELECT COUNT(*)
            FROM adopsi ad
            WHERE ad.id_adopter = a.id_adopter
          ) as adoption_count,
          (
            SELECT COUNT(*)
            FROM adopsi ad
            WHERE ad.id_adopter = a.id_adopter
            AND (ad.tgl_berhenti_adopsi IS NULL OR ad.tgl_berhenti_adopsi > CURRENT_DATE)
            AND ad.status_pembayaran = 'Lunas'
          ) as active_adoption_count,
          CASE 
            WHEN i.id_adopter IS NOT NULL THEN 'individu'
            WHEN o.id_adopter IS NOT NULL THEN 'organisasi'
            ELSE NULL
          END as type
        FROM adopter a
        LEFT JOIN individu i ON a.id_adopter = i.id_adopter
        LEFT JOIN organisasi o ON a.id_adopter = o.id_adopter
        ORDER BY total_kontribusi DESC
      `;

      const result = await pool.query(query);
      
      // Add names to adopters
      const adopters = result.rows.map(adopter => {
        if (adopter.type === 'individu') {
          return {
            ...adopter,
            name: individualNames[adopter.id] || 'Unknown'
          };
        } else if (adopter.type === 'organisasi') {
          return {
            ...adopter,
            name: orgNames[adopter.id] || 'Unknown'
          };
        }
        return adopter;
      });
      
      console.log("GET /api/adopter - Returning adopters:", adopters.length);
      return NextResponse.json(adopters);
    }
  } catch (error) {
    console.error("Error fetching adopters:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Adopter ID is required" },
        { status: 400 }
      );
    }

    // Cek apakah adopter memiliki adopsi yang masih aktif
    const checkActiveAdoptionsQuery = `
      SELECT COUNT(*) as active_count
      FROM adopsi 
      WHERE id_adopter = $1 
      AND (tgl_berhenti_adopsi IS NULL OR tgl_berhenti_adopsi > CURRENT_DATE)
      AND status_pembayaran = 'Lunas'
    `;
    
    const activeAdoptionsResult = await pool.query(checkActiveAdoptionsQuery, [id]);
    const activeCount = parseInt(activeAdoptionsResult.rows[0].active_count);
    
    if (activeCount > 0) {
      return NextResponse.json(
        { 
          error: "Adopter masih aktif mengadopsi satwa",
          message: `Tidak dapat menghapus adopter yang masih aktif mengadopsi ${activeCount} satwa.`
        },
        { status: 403 }
      );
    }

    // Jika tidak ada adopsi aktif, lanjutkan dengan penghapusan
    // Note: We'll use a transaction to ensure all related records are deleted properly
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // 1. Delete adopsi records (keep the history but remove the FK constraint)
      const deleteAdopsiQuery = `
        DELETE FROM adopsi
        WHERE id_adopter = $1
      `;
      await client.query(deleteAdopsiQuery, [id]);
      
      // 2. Determine if the adopter is an individual or organization
      const typeCheckQuery = `
        SELECT 
          CASE 
            WHEN i.id_adopter IS NOT NULL THEN 'individu'
            WHEN o.id_adopter IS NOT NULL THEN 'organisasi'
            ELSE NULL
          END as type
        FROM adopter a
        LEFT JOIN individu i ON a.id_adopter = i.id_adopter
        LEFT JOIN organisasi o ON a.id_adopter = o.id_adopter
        WHERE a.id_adopter = $1
      `;
      
      const typeResult = await client.query(typeCheckQuery, [id]);
      
      if (typeResult.rows.length > 0 && typeResult.rows[0].type) {
        // 3. Delete either individu or organisasi record
        if (typeResult.rows[0].type === 'individu') {
          await client.query('DELETE FROM individu WHERE id_adopter = $1', [id]);
        } else if (typeResult.rows[0].type === 'organisasi') {
          await client.query('DELETE FROM organisasi WHERE id_adopter = $1', [id]);
        }
      }
      
      // 4. Finally delete the adopter record
      const deleteAdopterQuery = `DELETE FROM adopter WHERE id_adopter = $1`;
      await client.query(deleteAdopterQuery, [id]);
      
      await client.query('COMMIT');
      
      return NextResponse.json(
        { message: "Adopter dan riwayat adopsinya berhasil dihapus" },
        { status: 200 }
      );
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error deleting adopter:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}