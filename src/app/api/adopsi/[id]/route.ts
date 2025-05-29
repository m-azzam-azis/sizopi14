import pool from "@/db/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const animalId = params.id;
    console.log(`Fetching adoption details for animal: ${animalId}`);
    
    if (!animalId) {
      return new Response(JSON.stringify({ error: "Animal ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    // 1. Ambil data dasar hewan sesuai struktur tabel yang diberikan
    const animalQuery = `
      SELECT 
        h.id as id_hewan,
        h.nama as nama_hewan,
        h.spesies,
        h.status_kesehatan,
        h.url_foto,
        h.tanggal_lahir,
        h.asal_hewan,
        h.nama_habitat
      FROM hewan h
      WHERE h.id = $1
    `;
    
    const animalResult = await pool.query(animalQuery, [animalId]);
    
    if (animalResult.rows.length === 0) {
      return new Response(JSON.stringify({ error: "Animal not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    // Data dasar hewan
    const animal = animalResult.rows[0];
    
    try {
      // 2. Ambil semua adopsi untuk hewan ini
      const adoptionsQuery = `
        SELECT 
          a.id_adopter,
          a.kontribusi_finansial,
          a.status_pembayaran,
          TO_CHAR(a.tgl_mulai_adopsi, 'DD-MM-YYYY') as tgl_mulai_adopsi,
          TO_CHAR(a.tgl_berhenti_adopsi, 'DD-MM-YYYY') as tgl_berhenti_adopsi,
          COALESCE(ind.nama, org.nama_organisasi, ad.username_adopter) as nama_adopter,
          CASE 
            WHEN ind.nama IS NOT NULL THEN 'individu' 
            WHEN org.nama_organisasi IS NOT NULL THEN 'organisasi' 
            ELSE 'unknown' 
          END as tipe_adopter,
          CASE WHEN a.tgl_berhenti_adopsi >= CURRENT_DATE THEN true ELSE false END as is_ongoing
        FROM adopsi a
        JOIN adopter ad ON a.id_adopter = ad.id_adopter
        LEFT JOIN individu ind ON ind.id_adopter = a.id_adopter
        LEFT JOIN organisasi org ON org.id_adopter = a.id_adopter
        WHERE a.id_hewan = $1
        ORDER BY a.tgl_mulai_adopsi DESC
      `;
      
      const adoptionsResult = await pool.query(adoptionsQuery, [animalId]);
      
      // 3. Cek apakah hewan ini saat ini sedang diadopsi
      const currentAdoption = adoptionsResult.rows.find(adoption => adoption.is_ongoing);
      const isCurrentlyAdopted = !!currentAdoption;
      
      // 4. Format respons
      const responseData = {
        animal: {
          ...animal,
          isAdopted: isCurrentlyAdopted
        },
        currentAdoption: currentAdoption || null,
        adoptionHistory: adoptionsResult.rows
      };
      
      return new Response(JSON.stringify(responseData), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (adoptionsError) {
      console.error("Error fetching adoptions:", adoptionsError);
      
      // Jika terjadi error saat mengambil adopsi, tetap kembalikan data hewan
      const responseData = {
        animal: {
          ...animal,
          isAdopted: false
        },
        currentAdoption: null,
        adoptionHistory: []
      };
      
      return new Response(JSON.stringify(responseData), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Error fetching animal adoption details:", error);
    return new Response(JSON.stringify({ 
      error: "Failed to fetch animal adoption details",
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      const animalId = params.id;
      console.log(`Updating adoption for animal: ${animalId}`);
      
      if (!animalId) {
        return NextResponse.json(
          { error: "Animal ID tidak boleh kosong" },
          { status: 400 }
        );
      }
  
      const body = await request.json();
      console.log("Request body:", body);
      
      const { id_adopter, status_pembayaran, tgl_berhenti_adopsi, tgl_mulai_adopsi } = body;
      
      if (!id_adopter) {
        return NextResponse.json(
          { error: "ID adopter tidak boleh kosong" },
          { status: 400 }
        );
      }
      
      // Mulai transaksi untuk menangkap notifikasi dari trigger
      const client = await pool.connect();
      const triggerMessages: string[] = [];
      
      try {
        await client.query('BEGIN');
        
        // Pasang listener untuk notifikasi dari database
        client.on('notice', (msg: any) => {
          console.log('Database Notice:', msg.message);
          if (msg.message && msg.message.includes('SUKSES:')) {
            triggerMessages.push(msg.message);
          }
        });
        
        // Periksa terlebih dahulu apakah data adopsi ada
        const checkQuery = `
          SELECT * FROM adopsi
          WHERE id_adopter = $1 AND id_hewan = $2
        `;
        
        const checkResult = await client.query(checkQuery, [id_adopter, animalId]);
        console.log("Check result:", checkResult.rows);
        
        if (checkResult.rowCount === 0) {
          await client.query('ROLLBACK');
          return NextResponse.json(
            { error: "Data adopsi tidak ditemukan" },
            { status: 404 }
          );
        }
        
        // Jika ditemukan, update status pembayaran
        const updateQuery = `
          UPDATE adopsi 
          SET status_pembayaran = $3
          WHERE id_adopter = $1 AND id_hewan = $2
          RETURNING *
        `;
        
        console.log("Update query:", updateQuery);
        
        const result = await client.query(updateQuery, [
          id_adopter, 
          animalId,
          status_pembayaran || 'Tertunda' // Default to 'Tertunda' if not provided
        ]);
        
        console.log("Update result:", result.rows);
        
        if (result.rowCount === 0) {
          await client.query('ROLLBACK');
          return NextResponse.json(
            { error: "Gagal mengupdate data adopsi" },
            { status: 500 }
          );
        }
        
        await client.query('COMMIT');
        
        return NextResponse.json({
          success: true,
          message: "Status pembayaran berhasil diupdate",
          data: result.rows[0],
          triggerMessage: triggerMessages.length > 0 ? triggerMessages[0] : null
        });
        
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
      
    } catch (error) {
      console.error("Error updating adoption:", error);
      return NextResponse.json(
        { error: "Gagal mengupdate data adopsi", details: error instanceof Error ? error.message : String(error) },
        { status: 500 }
      );
    }
  }
  
  

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const animalId = params.id;
    const url = new URL(request.url);
    const adopterId = url.searchParams.get("id_adopter");
    
    if (!adopterId) {
      return new Response(JSON.stringify({ error: "id_adopter is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    // 1. Cek apakah adopsi ada dan sudah berakhir
    const checkQuery = `
      SELECT * 
      FROM adopsi 
      WHERE id_hewan = $1 AND id_adopter = $2
    `;
    
    const checkResult = await pool.query(checkQuery, [animalId, adopterId]);
    
    if (checkResult.rows.length === 0) {
      return new Response(JSON.stringify({ 
        error: "Adoption not found" 
      }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    const adoption = checkResult.rows[0];
    const today = new Date();
    const endDate = new Date(adoption.tgl_berhenti_adopsi);
    
    if (endDate >= today) {
      return new Response(JSON.stringify({ 
        error: "Cannot delete an ongoing adoption" 
      }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    // 2. Jika adopsi sudah berakhir, hapus data
    await pool.query('BEGIN');
    
    try {
      // Hapus adopsi
      const deleteQuery = `
        DELETE FROM adopsi 
        WHERE id_hewan = $1 AND id_adopter = $2
      `;
      
      await pool.query(deleteQuery, [animalId, adopterId]);
      
      // Update total_kontribusi adopter jika status pembayaran Lunas
      if (adoption.status_pembayaran === 'Lunas') {
        const updateQuery = `
          UPDATE adopter
          SET total_kontribusi = total_kontribusi - $1
          WHERE id_adopter = $2
        `;
        
        await pool.query(updateQuery, [adoption.kontribusi_finansial, adopterId]);
      }
      
      await pool.query('COMMIT');
      
      return new Response(JSON.stringify({ 
        success: true,
        message: "Adoption successfully deleted"
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      await pool.query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error("Error deleting adoption:", error);
    return new Response(JSON.stringify({ 
      error: "Failed to delete adoption",
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}