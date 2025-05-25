import { Spesialisasi } from "@/db/models/spesialisasi";

export async function GET() {
  try {
    const spesialisasiModel = new Spesialisasi();
    // Get all unique specializations from the database
    const specializations =
      await spesialisasiModel.getAllUniqueSpecializations();

    return new Response(JSON.stringify({ specializations }), {
      status: 200,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
