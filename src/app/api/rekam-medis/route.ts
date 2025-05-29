import { CatatanMedis } from "@/db/models/catatanMedis";
import pool from "@/db/db";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const page = parseInt(url.searchParams.get("page") || "1");

    if (isNaN(limit) || isNaN(page) || limit <= 0 || page <= 0) {
      return new Response(JSON.stringify({ error: "Invalid pagination parameters" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const catatanMedisModel = new CatatanMedis();
    const data = await catatanMedisModel.findAllWithPagination(limit, page);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching medical records:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch medical records" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
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

    const catatanMedisModel = new CatatanMedis();
    // Use the enhanced method to capture PostgreSQL notices
    const result = await catatanMedisModel.createWithNotices(data);
    
    // Extract success message from PostgreSQL NOTICE if available
    let successMessage = null;
    if (result.pgNotices && result.pgNotices.length > 0) {
      // Extract the notice text - typically in format "NOTICE: SUKSES: Jadwal..."
      const noticeText = result.pgNotices[0];
      successMessage = noticeText.replace(/^NOTICE:\s+/i, '');
    }
    
    return new Response(JSON.stringify({
      data: result.createdRecord,
      message: successMessage
    }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating medical record:", error);
    return new Response(JSON.stringify({ error: "Failed to create medical record" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function DELETE(request: Request) {
    try {
        const url = new URL(request.url);
        const id = url.searchParams.get("id");
    
        if (!id) {
        return new Response(JSON.stringify({ error: "ID parameter is required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
        }
    
        const catatanMedisModel = new CatatanMedis();
        const deletedRecord = await catatanMedisModel.delete("id_hewan", id);
    
        if (!deletedRecord) {
        return new Response(JSON.stringify({ error: "Record not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
        });
        }
    
        return new Response(JSON.stringify({ message: "Record deleted successfully" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error deleting medical record:", error);
        return new Response(JSON.stringify({ error: "Failed to delete medical record" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
        });
    }
    }

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    if (!data || typeof data !== "object" || !data.id_hewan) {
      return new Response(JSON.stringify({ error: "Invalid request body" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Add updateWithNotices method to CatatanMedis model
    const catatanMedisModel = new CatatanMedis();
    
    // Check if we need to use the special update method with notices
    // Only use it if the status is being changed to "Sedang Sakit"
    let result;
    if (data.status_kesehatan === "Sedang Sakit") {
      // Use the enhanced method to capture PostgreSQL notices
      result = await catatanMedisModel.updateWithNotices("id_hewan", data.id_hewan, data);
    } else {
      // Use normal update if not setting status to "Sedang Sakit"
      const updatedRecord = await catatanMedisModel.update("id_hewan", data.id_hewan, data);
      result = { updatedRecord, pgNotices: [] };
    }

    if (!result.updatedRecord) {
      return new Response(JSON.stringify({ error: "Record not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    // Extract success message from PostgreSQL NOTICE if available
    let successMessage = null;
    if (result.pgNotices && result.pgNotices.length > 0) {
      // Extract the notice text - typically in format "NOTICE: SUKSES: Jadwal..."
      const noticeText = result.pgNotices[0];
      successMessage = noticeText.replace(/^NOTICE:\s+/i, '');
    }

    return new Response(JSON.stringify({
      data: result.updatedRecord,
      message: successMessage
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating medical record:", error);
    return new Response(JSON.stringify({ error: "Failed to update medical record" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function UPDATE(request: Request) {
  try {
    const data = await request.json();
    if (!data || typeof data !== "object" || !data.id_hewan) {
      return new Response(JSON.stringify({ error: "Invalid request body" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const catatanMedisModel = new CatatanMedis();
    const updatedRecord = await catatanMedisModel.update("id_hewan", data.id_hewan, data);

    if (!updatedRecord) {
      return new Response(JSON.stringify({ error: "Record not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(updatedRecord), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating medical record:", error);
    return new Response(JSON.stringify({ error: "Failed to update medical record" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}