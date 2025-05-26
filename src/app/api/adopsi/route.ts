import { Hewan } from "@/db/models/hewan";
import { Adopsi } from "@/db/models/adopsi";
import pool from "@/db/db";
import { AnimalDisplayType } from "@/db/types";

export async function GET(request: Request) {
  try {
    const query = `
      SELECT 
        h.id as id_hewan,
        h.nama as nama_hewan,
        h.spesies,
        h.status_kesehatan,
        h.url_foto,
        a.id_adopter,
        a.kontribusi_finansial,
        a.status_pembayaran,
        a.tgl_mulai_adopsi,
        a.tgl_berhenti_adopsi
      FROM hewan h
      LEFT JOIN adopsi a ON h.id = a.id_hewan
      ORDER BY h.nama
    `;

    const result = await pool.query(query);
    console.log("Database query result:", result.rows); // Debug log
    const animals: AnimalDisplayType[] = result.rows;

    return new Response(JSON.stringify(animals), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching animals:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch animals" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const adopsiModel = new Adopsi();
    const created = await adopsiModel.create(data);
    
    return new Response(JSON.stringify(created), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating adoption:", error);
    return new Response(JSON.stringify({ error: "Failed to create adoption" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const id_adopter = url.searchParams.get("id_adopter");
    const id_hewan = url.searchParams.get("id_hewan");
    
    if (!id_adopter || !id_hewan) {
      return new Response(JSON.stringify({ error: "id_adopter and id_hewan required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    const data = await request.json();
    const adopsiModel = new Adopsi();
    const updated = await adopsiModel.updateMultiple(
      ["id_adopter", "id_hewan"],
      [id_adopter, id_hewan],
      data
    );
    
    return new Response(JSON.stringify(updated), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating adoption:", error);
    return new Response(JSON.stringify({ error: "Failed to update adoption" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id_adopter = url.searchParams.get("id_adopter");
    const id_hewan = url.searchParams.get("id_hewan");
    
    if (!id_adopter || !id_hewan) {
      return new Response(JSON.stringify({ error: "id_adopter and id_hewan required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    const adopsiModel = new Adopsi();
    const deleted = await adopsiModel.deleteMultiple(
      ["id_adopter", "id_hewan"],
      [id_adopter, id_hewan]
    );
    
    return new Response(JSON.stringify(deleted), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error deleting adoption:", error);
    return new Response(JSON.stringify({ error: "Failed to delete adoption" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}