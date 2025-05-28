import { JadwalPemeriksaanKesehatan } from "@/db/models/jadwalPemeriksaanKesehatan";

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

    const jadwalModel = new JadwalPemeriksaanKesehatan();
    const data = await jadwalModel.findAllWithPagination(limit, page);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching jadwal pemeriksaan:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch jadwal pemeriksaan" }), {
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

    const jadwalModel = new JadwalPemeriksaanKesehatan();
    const createdRecord = await jadwalModel.create(data);

    return new Response(JSON.stringify(createdRecord), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating jadwal pemeriksaan:", error);
    return new Response(JSON.stringify({ error: "Failed to create jadwal pemeriksaan" }), {
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

    const jadwalModel = new JadwalPemeriksaanKesehatan();
    const deletedRecord = await jadwalModel.delete("id_hewan", id);

    if (!deletedRecord) {
      return new Response(JSON.stringify({ error: "Jadwal pemeriksaan not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ message: "Jadwal pemeriksaan deleted successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error deleting jadwal pemeriksaan:", error);
    return new Response(JSON.stringify({ error: "Failed to delete jadwal pemeriksaan" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function UPDATE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response(JSON.stringify({ error: "ID parameter is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await request.json();
    if (!data || typeof data !== "object") {
      return new Response(JSON.stringify({ error: "Invalid request body" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const jadwalModel = new JadwalPemeriksaanKesehatan();
    const updatedRecord = await jadwalModel.update("id_hewan", id, data);

    if (!updatedRecord) {
      return new Response(JSON.stringify({ error: "Jadwal pemeriksaan not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(updatedRecord), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating jadwal pemeriksaan:", error);
    return new Response(JSON.stringify({ error: "Failed to update jadwal pemeriksaan" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}