import { Pakan } from "@/db/models/pakan";

export async function GET(request: Request) {
  try {
    const pakanModel = new Pakan();
    const url = new URL(request.url);
    const id_hewan = url.searchParams.get("id_hewan");
    
    if (id_hewan) {
      // Filter by specific animal
      const data = await pakanModel.findWhere("id_hewan", id_hewan);
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      // Get all pakan records
      const data = await pakanModel.findAll();
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch pakan" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const pakanModel = new Pakan();
    const created = await pakanModel.create(data);
    return new Response(JSON.stringify(created), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to create pakan" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const id_hewan = url.searchParams.get("id_hewan");
    const jadwal = url.searchParams.get("jadwal");
    if (!id_hewan || !jadwal) {
      return new Response(JSON.stringify({ error: "id_hewan and jadwal required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    const data = await request.json();
    const pakanModel = new Pakan();
    const updated = await pakanModel.updateMultiple(["id_hewan", "jadwal"], [id_hewan, jadwal], data);
    return new Response(JSON.stringify(updated), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to update pakan" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id_hewan = url.searchParams.get("id_hewan");
    const jadwal = url.searchParams.get("jadwal");
    if (!id_hewan || !jadwal) {
      return new Response(JSON.stringify({ error: "id_hewan and jadwal required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    const pakanModel = new Pakan();
    const deleted = await pakanModel.deleteMultiple(["id_hewan", "jadwal"], [id_hewan, jadwal]);
    return new Response(JSON.stringify(deleted), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to delete pakan" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
