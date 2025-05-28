import pool from "@/db/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const adopterId = params.id;
    console.log(`Fetching details for adopter: ${adopterId}`);
    
    // 1. Ambil data dasar adopter
    const adopterQuery = `
      SELECT 
        a.id_adopter as id,
        a.username_adopter,
        a.total_kontribusi
      FROM adopter a
      WHERE a.id_adopter = $1
    `;
    
    const adopterResult = await pool.query(adopterQuery, [adopterId]);
    
    if (adopterResult.rows.length === 0) {
      return new Response(JSON.stringify({ error: "Adopter not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    // Data dasar adopter
    const adopter = adopterResult.rows[0];
    
    // 2. Cek apakah adopter adalah individu atau organisasi dan ambil nama
    let name = adopter.username_adopter;
    let type = null;
    
    // Cek di tabel individu
    const individualQuery = `
      SELECT nama
      FROM individu
      WHERE id_adopter = $1
    `;
    
    const individualResult = await pool.query(individualQuery, [adopterId]);
    
    if (individualResult.rows.length > 0) {
      name = individualResult.rows[0].nama || name;
      type = "individu";
    } else {
      // Cek di tabel organisasi
      const orgQuery = `
        SELECT nama_organisasi
        FROM organisasi
        WHERE id_adopter = $1
      `;
      
      const orgResult = await pool.query(orgQuery, [adopterId]);
      
      if (orgResult.rows.length > 0) {
        name = orgResult.rows[0].nama_organisasi || name;
        type = "organisasi";
      }
    }
    
    // 3. Ambil alamat dari tabel PENGUNJUNG
    // username_adopter pada tabel ADOPTER adalah FK ke PENGUNJUNG.username_P
    let address = "[alamat]";
    
    try {
      const addressQuery = `
        SELECT p.alamat
        FROM pengunjung p
        WHERE p.username_P = $1
      `;
      
      const addressResult = await pool.query(addressQuery, [adopter.username_adopter]);
      
      if (addressResult.rows.length > 0 && addressResult.rows[0].alamat) {
        address = addressResult.rows[0].alamat;
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
    
    // 4. Ambil nomor telepon dari tabel PENGGUNA
    let contact = "[no telepon]";
    
    try {
      const contactQuery = `
        SELECT p.no_telepon
        FROM pengguna p
        JOIN pengunjung pg ON pg.username_P = p.username
        WHERE pg.username_P = $1
      `;
      
      const contactResult = await pool.query(contactQuery, [adopter.username_adopter]);
      
      if (contactResult.rows.length > 0 && contactResult.rows[0].no_telepon) {
        contact = contactResult.rows[0].no_telepon;
      }
    } catch (error) {
      console.error("Error fetching contact:", error);
    }
    
    // 5. PERBAIKAN: Ambil semua adopsi dengan status pembayaran lunas, termasuk yang sudah berakhir
    const adoptionsQuery = `
      SELECT 
        a.id_hewan,
        h.nama as nama_hewan,
        h.spesies,
        a.status_pembayaran,
        a.kontribusi_finansial,
        TO_CHAR(a.tgl_mulai_adopsi, 'YYYY-MM-DD') as tgl_mulai_adopsi,
        TO_CHAR(a.tgl_berhenti_adopsi, 'YYYY-MM-DD') as tgl_berhenti_adopsi,
        CASE WHEN a.tgl_berhenti_adopsi >= CURRENT_DATE THEN true ELSE false END as is_ongoing
      FROM adopsi a
      JOIN hewan h ON a.id_hewan = h.id
      WHERE a.id_adopter = $1 AND a.status_pembayaran = 'Lunas'
      ORDER BY is_ongoing DESC, a.tgl_mulai_adopsi DESC
    `;
    
    const adoptionsResult = await pool.query(adoptionsQuery, [adopterId]);
    console.log(`Found ${adoptionsResult.rows.length} adoptions for adopter ${adopterId}`);
    
    // 6. Persiapkan data respons
    const responseData = {
      adopter: {
        ...adopter,
        name,
        type,
        address,
        contact
      },
      adoptions: adoptionsResult.rows
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