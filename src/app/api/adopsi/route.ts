import { Adopsi } from "@/db/models/adopsi";
import pool from "@/db/db";
import { NextResponse } from "next/server";

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

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get("status");

    let query = `
      SELECT 
        h.id as id_hewan,
        h.nama as nama_hewan,
        h.spesies,
        h.status_kesehatan,
        h.url_foto,
        CASE 
          WHEN a.id_hewan IS NOT NULL THEN TRUE 
          ELSE FALSE 
        END as is_adopted,
        a.id_adopter,
        a.kontribusi_finansial,
        a.status_pembayaran,
        a.tgl_mulai_adopsi,
        a.tgl_berhenti_adopsi
      FROM hewan h
      LEFT JOIN (
        SELECT * FROM adopsi 
        WHERE (tgl_berhenti_adopsi IS NULL OR tgl_berhenti_adopsi >= CURRENT_DATE)
      ) a ON h.id = a.id_hewan
    `;

    if (status === "adopted") {
      query += ` WHERE a.id_hewan IS NOT NULL`;
    } else if (status === "unadopted") {
      query += ` WHERE a.id_hewan IS NULL`;
    }

    query += ` ORDER BY h.nama`;

    const result = await pool.query(query);

    const animals = result.rows.map((animal) => ({
      ...animal,
      isAdopted: animal.is_adopted,
    }));

    return new Response(JSON.stringify(animals), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching animals:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch animals",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (
      !data.id_adopter ||
      !data.id_hewan ||
      !data.tgl_mulai_adopsi ||
      !data.tgl_berhenti_adopsi ||
      !data.kontribusi_finansial
    ) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields",
          required: [
            "id_adopter",
            "id_hewan",
            "tgl_mulai_adopsi",
            "tgl_berhenti_adopsi",
            "kontribusi_finansial",
          ],
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (!data.status_pembayaran) {
      data.status_pembayaran = "Belum Lunas";
    }

    const adopsiModel = new Adopsi();
    const created = await adopsiModel.create(data);

    if (data.status_pembayaran === "Lunas") {
      await pool.query(
        `
        UPDATE adopter 
        SET total_kontribusi = total_kontribusi + $1 
        WHERE id_adopter = $2
      `,
        [data.kontribusi_finansial, data.id_adopter]
      );
    }

    return new Response(JSON.stringify(created), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating adoption:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to create adoption",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const animalId = id;
    const body = await request.json();
    const {
      id_adopter,
      status_pembayaran,
      tgl_berhenti_adopsi,
      tgl_mulai_adopsi,
    } = body;

    // Verifikasi parameter yang diperlukan
    if (!id_adopter) {
      return new Response(
        JSON.stringify({
          error: "ID adopter tidak boleh kosong",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const client = await pool.connect();
    const triggerMessages: string[] = [];

    try {
      await client.query("BEGIN");

      // Pasang listener untuk notifikasi dari database
      client.on("notice", (msg: any) => {
        console.log("Database Notice:", msg.message);
        if (msg.message && msg.message.includes("SUKSES:")) {
          triggerMessages.push(msg.message);
        }
      });

      // Buat SET clause berdasarkan parameter yang diberikan
      const setClause = [];
      const queryParams = [];
      let paramIndex = 1;

      queryParams.push(id_adopter);
      queryParams.push(animalId);

      if (status_pembayaran) {
        setClause.push(`status_pembayaran = $${paramIndex + 2}`);
        queryParams.push(status_pembayaran);
        paramIndex++;
      }

      if (tgl_berhenti_adopsi) {
        setClause.push(`tgl_berhenti_adopsi = $${paramIndex + 2}`);
        queryParams.push(tgl_berhenti_adopsi);
        paramIndex++;
      }

      if (setClause.length === 0) {
        return new Response(
          JSON.stringify({
            error: "Tidak ada data yang diupdate",
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      // Where clause untuk adopsi
      let whereClause = "id_adopter = $1 AND id_hewan = $2";
      if (tgl_mulai_adopsi) {
        whereClause += ` AND tgl_mulai_adopsi = $${paramIndex + 2}`;
        queryParams.push(tgl_mulai_adopsi);
        paramIndex++;
      }

      // Update adopsi
      const updateQuery = `
          UPDATE adopsi 
          SET ${setClause.join(", ")}
          WHERE ${whereClause}
          RETURNING *
        `;

      console.log("Query:", updateQuery);
      console.log("Params:", queryParams);

      const result = await client.query(updateQuery, queryParams);

      if (result.rowCount === 0) {
        await client.query("ROLLBACK");
        return new Response(
          JSON.stringify({
            error: "Data adopsi tidak ditemukan",
          }),
          {
            status: 404,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      await client.query("COMMIT");

      return new Response(
        JSON.stringify({
          success: true,
          message: status_pembayaran
            ? "Status pembayaran berhasil diupdate"
            : "Data adopsi berhasil diupdate",
          data: result.rows[0],
          triggerMessage:
            triggerMessages.length > 0 ? triggerMessages[0] : null,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error updating adoption:", error);
    return new Response(
      JSON.stringify({
        error: "Gagal mengupdate data adopsi",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id_adopter = url.searchParams.get("id_adopter");
    const id_hewan = url.searchParams.get("id_hewan");

    if (!id_adopter || !id_hewan) {
      return new Response(
        JSON.stringify({ error: "id_adopter and id_hewan required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const checkQuery = `
        SELECT * FROM adopsi 
        WHERE id_adopter = $1 AND id_hewan = $2
        `;
    const checkResult = await pool.query(checkQuery, [id_adopter, id_hewan]);

    if (checkResult.rows.length === 0) {
      return new Response(JSON.stringify({ error: "Adoption not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const adoption = checkResult.rows[0];
    const today = new Date();
    const endDate = new Date(adoption.tgl_berhenti_adopsi);

    if (endDate >= today && adoption.status_pembayaran === "Lunas") {
      return new Response(
        JSON.stringify({
          error: "Cannot delete an ongoing adoption",
          message: "Adopsi masih berlangsung dan sudah dibayar lunas",
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (adoption.status_pembayaran === "Lunas") {
      await pool.query(
        `
        UPDATE adopter 
        SET total_kontribusi = total_kontribusi - $1 
        WHERE id_adopter = $2
      `,
        [adoption.kontribusi_finansial, id_adopter]
      );
    }

    // Hapus variabel adopsiModel yang tidak digunakan
    // const adopsiModel = new Adopsi();
    const deleteQuery = `
      DELETE FROM adopsi 
      WHERE id_adopter = $1 AND id_hewan = $2
    `;

    // Hapus variabel deleted yang tidak digunakan
    await pool.query(deleteQuery, [id_adopter, id_hewan]);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Adoption successfully deleted",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error deleting adoption:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to delete adoption",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
