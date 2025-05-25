import { PenjagaHewan } from "@/db/models/penjagaHewan";

export async function GET(request: Request) {
  try {
    const penjagaModel = new PenjagaHewan();
    const data = await penjagaModel.findAll();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch penjaga hewan" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
