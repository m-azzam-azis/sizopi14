import { DokterHewan } from "@/db/models/dokterHewan";
import { Pengguna } from "@/db/models/pengguna";

export async function GET(request: Request) {
  try {
    // Ambil semua dokter dari tabel DOKTER_HEWAN
    const dokterModel = new DokterHewan();
    const penggunaModel = new Pengguna();
    const dokterList = await dokterModel.findAll();

    // Join ke tabel PENGGUNA untuk ambil nama lengkap
    const dokterWithNama = await Promise.all(
      dokterList.map(async (dokter) => {
        const pengguna = await penggunaModel.findByUsername(dokter.username_DH);
        return {
          username: dokter.username_DH,
          no_str: dokter.no_str,
        };
      })
    );

    return new Response(JSON.stringify(dokterWithNama), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching dokter list:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch dokter list" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}