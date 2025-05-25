import { CatatanMedis } from "@/db/models/catatanMedis";

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
    const createdRecord = await catatanMedisModel.create(data);

    return new Response(JSON.stringify(createdRecord), {
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