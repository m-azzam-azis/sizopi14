import { NextRequest, NextResponse } from "next/server";
import pool from "@/db/db";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const currentDate = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD
    
    // 1. Get the current adoption data first to check if it exists
    const checkQuery = `
      SELECT a.*, h.nama, h.spesies
      FROM adopsi a
      JOIN hewan h ON a.id_hewan = h.id
      WHERE a.id_hewan = $1
      AND (a.tgl_berhenti_adopsi IS NULL OR a.tgl_berhenti_adopsi > CURRENT_DATE)
    `;
    
    const checkResult = await pool.query(checkQuery, [id]);
    
    if (checkResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Data hewan adopsi tidak ditemukan atau adopsi sudah berakhir" },
        { status: 404 }
      );
    }
    
    const adoptionData = checkResult.rows[0];
    const animalName = adoptionData.nama;
    
    // 2. Update the adopsi record to set end date to today
    const updateQuery = `
      UPDATE adopsi
      SET tgl_berhenti_adopsi = $1
      WHERE id_hewan = $2
      AND (tgl_berhenti_adopsi IS NULL OR tgl_berhenti_adopsi > CURRENT_DATE)
      RETURNING *
    `;
    
    const result = await pool.query(updateQuery, [currentDate, id]);
    
    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "Gagal menghentikan adopsi" },
        { status: 500 }
      );
    }
    
    // 3. Update the hewan table to set it as available again
    const updateHewanQuery = `
      UPDATE hewan
      SET status = 'tersedia'
      WHERE id = $1
    `;
    
    try {
      await pool.query(updateHewanQuery, [id]);
    } catch (error) {
      console.error("Error updating hewan status:", error);
      // Non-critical error, we'll continue even if this fails
    }
    
    return NextResponse.json({
      message: `Adopsi ${animalName} berhasil dihentikan`,
      stopDate: currentDate,
      animalId: id
    });
  } catch (error) {
    console.error("Error stopping adoption:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat menghentikan adopsi" },
      { status: 500 }
    );
  }
}