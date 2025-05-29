import { Pakan } from "@/db/models/pakan";
import { Memberi } from "@/db/models/memberi";
import { cookies } from "next/headers";
import { decode } from "jsonwebtoken";

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
    // Check authorization - only caretakers can create feeding schedules
    const cookieStore = await cookies();
    const token = cookieStore.get("token") as string | undefined;

    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const decoded: any = decode(token);
    let username_jh = decoded?.data?.username;
    const role = decoded?.data?.role;

    if (!username_jh || role !== "caretaker") {
      return new Response(
        JSON.stringify({
          error: "Forbidden: Only caretakers can create feeding schedules",
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const data = await request.json();
    // Set status default ke 'tersedia' jika tidak dikirim dari frontend
    if (!data.status) {
      data.status = "tersedia";
    }
    const pakanModel = new Pakan();

    const created = await pakanModel.create(data);

    // Insert into MEMBERI table for relationship
    username_jh = null;
    if (token) {
      const decoded: any = decode(token);
      username_jh = decoded?.data?.username;
    }

    if (username_jh) {
      const memberiModel = new Memberi();
      let jadwalValue: Date;
      if (created.jadwal instanceof Date) {
        jadwalValue = created.jadwal;
      } else if (typeof created.jadwal === "string") {
        jadwalValue = new Date(created.jadwal);
      } else {
        jadwalValue = new Date(); // fallback, should not happen
      }
      const memberiPayload = {
        id_hewan: created.id_hewan,
        jadwal: jadwalValue,
        username_jh,
      };
      console.log("[MEMBERI INSERT] Payload:", memberiPayload);
      try {
        await memberiModel.create(memberiPayload);
        console.log("[MEMBERI INSERT] Success");
      } catch (err) {
        console.error("Failed to insert into MEMBERI:", err);
      }
    }
    return new Response(JSON.stringify(created), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("POST /api/pakan error:", error);
    return new Response(JSON.stringify({ error: "Failed to create pakan" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function PUT(request: Request) {
  try {
    // Check authorization - only caretakers can update feeding schedules
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const decoded: any = decode(token);
    const role = decoded?.data?.role;

    if (role !== "caretaker") {
      return new Response(
        JSON.stringify({
          error: "Forbidden: Only caretakers can update feeding schedules",
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const url = new URL(request.url);
    const id_hewan = url.searchParams.get("id_hewan");
    const jadwal = url.searchParams.get("jadwal");
    if (!id_hewan || !jadwal) {
      return new Response(
        JSON.stringify({ error: "id_hewan and jadwal required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    const data = await request.json();
    const pakanModel = new Pakan();
    const updated = await pakanModel.updateMultiple(
      ["id_hewan", "jadwal"],
      [id_hewan, jadwal],
      data
    );
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
    // Check authorization - only caretakers can delete feeding schedules
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const decoded: any = decode(token);
    const role = decoded?.data?.role;

    if (role !== "caretaker") {
      return new Response(
        JSON.stringify({
          error: "Forbidden: Only caretakers can delete feeding schedules",
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const url = new URL(request.url);
    const id_hewan = url.searchParams.get("id_hewan");
    const jadwal = url.searchParams.get("jadwal");
    if (!id_hewan || !jadwal) {
      return new Response(
        JSON.stringify({ error: "id_hewan and jadwal required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const pakanModel = new Pakan();

    console.log("DELETE request received for: ", { id_hewan, jadwal });
    // Using the new deleteByPrimaryKey method specifically designed for the composite primary key
    const deleted = await pakanModel.deleteByPrimaryKey(id_hewan, jadwal);
    console.log("Delete result: ", deleted);

    if (!deleted) {
      return new Response(
        JSON.stringify({ error: "Record not found or could not be deleted" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

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
