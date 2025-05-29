import { v4 as uuidv4 } from "uuid";
import pool from "@/db/db";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { adopterUsername, contributionAmount, extensionMonths } = body;
    
    if (!adopterUsername || !contributionAmount || !extensionMonths) {
      return new Response(
        JSON.stringify({ error: "Data tidak lengkap" }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const checkQuery = `
      SELECT 
        a.id_adopter,
        a.tgl_berhenti_adopsi,
        a.status_pembayaran,
        a.kontribusi_finansial,
        h.nama as nama_hewan,
        h.spesies 
      FROM adopsi a
      JOIN hewan h ON a.id_hewan = h.id
      JOIN adopter ad ON a.id_adopter = ad.id_adopter
      WHERE a.id_hewan = $1
      AND ad.username_adopter = $2
      AND (a.tgl_berhenti_adopsi IS NULL OR a.tgl_berhenti_adopsi > CURRENT_DATE)
    `;
    
    const checkResult = await pool.query(checkQuery, [id, adopterUsername]);
    
    if (checkResult.rows.length === 0) {
      return new Response(
        JSON.stringify({ error: "Data adopsi tidak ditemukan atau tidak aktif" }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    const currentAdoption = checkResult.rows[0];
    const animalName = currentAdoption.nama_hewan;
    
    if (currentAdoption.status_pembayaran.toLowerCase() !== "lunas") {
      return new Response(
        JSON.stringify({ error: "Pembayaran adopsi saat ini belum lunas" }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    const currentEndDate = new Date(currentAdoption.tgl_berhenti_adopsi);
    const newEndDate = new Date(currentEndDate);
    newEndDate.setMonth(newEndDate.getMonth() + parseInt(extensionMonths));
    
    const extensionId = uuidv4();
    
    const updateQuery = `
      UPDATE adopsi
      SET 
        tgl_berhenti_adopsi = $1,
        kontribusi_finansial = kontribusi_finansial + $2,
        status_pembayaran = 'BlmLunas'
      WHERE id_hewan = $3
      RETURNING *
    `;
    
    const updateValues = [
      newEndDate.toISOString().split('T')[0],
      contributionAmount,
      id
    ];
    
    const updateResult = await pool.query(updateQuery, updateValues);
    
    if (updateResult.rowCount === 0) {
      throw new Error("Gagal memperbarui data adopsi");
    }
    
    const totalContribution = updateResult.rows[0].kontribusi_finansial;
    
    return new Response(
      JSON.stringify({
        message: `Perpanjangan adopsi untuk ${animalName} berhasil diajukan`,
        extensionId: extensionId,
        currentEndDate: currentEndDate.toISOString().split('T')[0],
        newEndDate: newEndDate.toISOString().split('T')[0],
        extensionMonths: extensionMonths,
        amount: contributionAmount,
        totalContribution: totalContribution
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    console.error("Error extending adoption:", error);
    return new Response(
      JSON.stringify({ 
        error: "Terjadi kesalahan saat memperpanjang adopsi", 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}