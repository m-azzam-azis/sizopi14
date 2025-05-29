import { JadwalPemeriksaanKesehatan } from "@/db/models/jadwalPemeriksaanKesehatan";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const page = parseInt(url.searchParams.get("page") || "1");

    if (isNaN(limit) || isNaN(page) || limit <= 0 || page <= 0) {
      return new Response(
        JSON.stringify({ error: "Invalid pagination parameters" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const jadwalModel = new JadwalPemeriksaanKesehatan();
    const data = await jadwalModel.findAllWithPagination(limit, page);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching jadwal pemeriksaan:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch jadwal pemeriksaan" }),
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
    if (!data || typeof data !== "object") {
      return new Response(JSON.stringify({ error: "Invalid request body" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Validate composite key fields
    if (!data.id_hewan) {
      return new Response(
        JSON.stringify({
          error: "id_hewan is required for the composite key",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (!data.tgl_pemeriksaan_selanjutnya) {
      return new Response(
        JSON.stringify({
          error:
            "tgl_pemeriksaan_selanjutnya is required for the composite key",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Set default frequency to 3 months if not provided
    if (!data.freq_pemeriksaan_rutin) {
      console.log("Setting default frequency to 3 months");
      data.freq_pemeriksaan_rutin = 3;
    }
    console.log("Creating jadwal pemeriksaan with data:", data); // Use the enhanced model method for composite key handling
    try {
      const jadwalModel = new JadwalPemeriksaanKesehatan();

      // This will handle the composite key check and creation in one operation
      const result = await jadwalModel.createWithCompositeCheck(data);

      // Extract success message from PostgreSQL NOTICE if available
      let successMessage = null;
      if (result.pgNotices && result.pgNotices.length > 0) {
        // Extract the notice text - typically in format "NOTICE: SUKSES: Jadwal..."
        const noticeText = result.pgNotices[0];
        successMessage = noticeText.replace(/^NOTICE:\s+/i, "");
      }

      return new Response(
        JSON.stringify({
          data: result.createdRecord,
          message: successMessage,
        }),
        {
          status: 201,
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (dbError) {
      console.error("Database error during creation:", dbError);

      // Check if this is a duplicate record error
      if (
        dbError instanceof Error &&
        dbError.message.includes("already exists")
      ) {
        return new Response(
          JSON.stringify({
            error: "A record with this animal ID and date already exists",
            details: dbError.message,
          }),
          {
            status: 409, // Conflict
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      return new Response(
        JSON.stringify({
          error: "Database error when creating record",
          details: dbError instanceof Error ? dbError.message : String(dbError),
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Error creating jadwal pemeriksaan:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create jadwal pemeriksaan" }),
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
    const id = url.searchParams.get("id");
    const date = url.searchParams.get("date");

    if (!id) {
      return new Response(
        JSON.stringify({ error: "ID parameter is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const jadwalModel = new JadwalPemeriksaanKesehatan();
    let deletedRecord;
    if (date) {
      console.log(`Deleting jadwal with id_hewan=${id} and date=${date}`);

      try {
        // The date coming from frontend is already in YYYY-MM-DD format
        // Use it directly to match the database format
        console.log(`Using date directly: ${date}`);

        // Use our model method with the proper date format
        deletedRecord = await jadwalModel.deleteCompositeKey(id, date);
      } catch (dateError) {
        console.error("Invalid date format:", dateError);
        return new Response(
          JSON.stringify({ error: "Invalid date format", details: date }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    } else {
      // Fallback to old behavior - delete all jadwal for this animal
      deletedRecord = await jadwalModel.delete("id_hewan", id);
    }

    if (!deletedRecord) {
      return new Response(
        JSON.stringify({
          error: "Jadwal pemeriksaan not found",
          details: {
            id_hewan: id,
            date: date,
          },
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        message: "Jadwal pemeriksaan deleted successfully",
        deletedRecord,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error deleting jadwal pemeriksaan:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to delete jadwal pemeriksaan",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    const oldDate = url.searchParams.get("old_date");

    if (!id) {
      return new Response(
        JSON.stringify({ error: "ID parameter is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const data = await request.json();
    if (!data || typeof data !== "object") {
      return new Response(JSON.stringify({ error: "Invalid request body" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const jadwalModel = new JadwalPemeriksaanKesehatan();
    // Use the new method for composite primary key updates
    let updatedRecord;
    if (oldDate) {
      // Update with composite key (id_hewan AND old_date)
      updatedRecord = await jadwalModel.updateCompositeKey(id, oldDate, data);
    } else {
      // Fallback to normal update
      updatedRecord = await jadwalModel.update("id_hewan", id, data);
    }

    if (!updatedRecord) {
      return new Response(
        JSON.stringify({ error: "Jadwal pemeriksaan not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify(updatedRecord), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating jadwal pemeriksaan:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update jadwal pemeriksaan" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
