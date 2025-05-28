import { Hewan } from "@/db/models/hewan";

export async function GET(request: Request) {
  try {
    const hewanModel = new Hewan();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (id) {
      const data = await hewanModel.getById(id);
      return new Response(JSON.stringify(data ? [data] : []), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      const data = await hewanModel.findAll();
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch hewan" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
