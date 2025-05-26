import pool from "@/db/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const adopterId = params.id;
    console.log(`Fetching details for adopter: ${adopterId}`);
    
    // First, let's check what columns exist in the individu and organisasi tables
    // to avoid the "column does not exist" error
    
    // 1. Start with just the basic adopter info which we know exists
    const adopterQuery = `
      SELECT 
        ad.id_adopter as id,
        ad.username_adopter,
        ad.total_kontribusi
      FROM adopter ad
      WHERE ad.id_adopter = $1
    `;
    
    const adopterResult = await pool.query(adopterQuery, [adopterId]);
    
    if (adopterResult.rows.length === 0) {
      return new Response(JSON.stringify({ error: "Adopter not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    // Basic adopter info
    const adopter = adopterResult.rows[0];
    
    // 2. Check columns in individu table 
    let individualColumns;
    try {
      const columnsQuery = `
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'individu'
      `;
      const columnsResult = await pool.query(columnsQuery);
      individualColumns = columnsResult.rows.map(row => row.column_name);
      console.log("Individu columns:", individualColumns);
    } catch (error) {
      console.error("Error checking individu columns:", error);
      individualColumns = [];
    }
    
    // 3. Check columns in organisasi table
    let organisasiColumns;
    try {
      const columnsQuery = `
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'organisasi'
      `;
      const columnsResult = await pool.query(columnsQuery);
      organisasiColumns = columnsResult.rows.map(row => row.column_name);
      console.log("Organisasi columns:", organisasiColumns);
    } catch (error) {
      console.error("Error checking organisasi columns:", error);
      organisasiColumns = [];
    }
    
    // 4. Check if pengguna table exists and its columns
    let penggunaColumns;
    try {
      const columnsQuery = `
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'pengguna'
      `;
      const columnsResult = await pool.query(columnsQuery);
      penggunaColumns = columnsResult.rows.map(row => row.column_name);
      console.log("Pengguna columns:", penggunaColumns);
    } catch (error) {
      console.error("Error checking pengguna columns:", error);
      penggunaColumns = [];
    }
    
    // 5. Now, build dynamic queries based on available columns
    let name = adopter.username_adopter;
    let type = "unknown";
    let address = "";
    let contact = "";
    
    // Try to get individual details with dynamic column selection
    if (individualColumns.includes('id_adopter') && individualColumns.includes('nama')) {
      // Build a safe query with only columns that exist
      let individualQueryStr = `
        SELECT nama
        FROM individu
        WHERE id_adopter = $1
      `;
      
      const individualResult = await pool.query(individualQueryStr, [adopterId]);
      
      if (individualResult.rows.length > 0) {
        name = individualResult.rows[0].nama;
        type = "individu";
      }
    }
    
    // If not found as individual, try organization
    if (type === "unknown" && 
        organisasiColumns.includes('id_adopter') && 
        organisasiColumns.includes('nama_organisasi')) {
      
      let orgQueryStr = `
        SELECT nama_organisasi
        FROM organisasi
        WHERE id_adopter = $1
      `;
      
      const orgResult = await pool.query(orgQueryStr, [adopterId]);
      
      if (orgResult.rows.length > 0) {
        name = orgResult.rows[0].nama_organisasi;
        type = "organisasi";
      }
    }
    
    // Try to get contact info if pengguna table exists with proper columns
    if (penggunaColumns.includes('username') && penggunaColumns.includes('no_telp')) {
      const contactQuery = `
        SELECT no_telp
        FROM pengguna
        WHERE username = (SELECT username_adopter FROM adopter WHERE id_adopter = $1)
      `;
      
      try {
        const contactResult = await pool.query(contactQuery, [adopterId]);
        if (contactResult.rows.length > 0) {
          contact = contactResult.rows[0].no_telp || "";
        }
      } catch (error) {
        console.error("Error fetching contact:", error);
      }
    }
    
    // Try to get adoption history
    const adoptionsQuery = `
      SELECT 
        a.id_hewan,
        h.nama as nama_hewan,
        h.spesies,
        a.status_pembayaran,
        a.kontribusi_finansial,
        TO_CHAR(a.tgl_mulai_adopsi, 'YYYY-MM-DD') as tgl_mulai_adopsi,
        TO_CHAR(a.tgl_berhenti_adopsi, 'YYYY-MM-DD') as tgl_berhenti_adopsi
      FROM adopsi a
      JOIN hewan h ON a.id_hewan = h.id
      WHERE a.id_adopter = $1
      ORDER BY a.tgl_mulai_adopsi DESC
    `;
    
    let adoptions = [];
    try {
      const adoptionsResult = await pool.query(adoptionsQuery, [adopterId]);
      adoptions = adoptionsResult.rows;
    } catch (error) {
      console.error("Error fetching adoptions:", error);
    }
    
    // Return formatted data
    const responseData = {
      adopter: {
        ...adopter,
        name,
        type,
        address, // Empty string since we couldn't find alamat column
        contact
      },
      adoptions
    };
    
    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching adopter details:", error);
    return new Response(JSON.stringify({ 
      error: "Failed to fetch adopter details",
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}