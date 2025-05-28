import { Pakan } from "@/db/models/pakan";
import { Memberi } from "@/db/models/memberi";
import { cookies } from "next/headers";
import { decode } from "jsonwebtoken";

export async function GET(request: Request) {
  try {
    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    // Decode token to get username
    const decoded: any = decode(token);
    const username_jh = decoded?.data?.username;
    console.log("[FEEDING HISTORY] User login username_jh:", username_jh); // Log user login
    if (!username_jh) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    // Query all feeding history for this caretaker (username_jh)
    // JOIN ke HEWAN dan HABITAT untuk info lengkap
    const query = `
      SELECT p.id_hewan, h.nama AS nama_hewan, h.spesies, h.asal_hewan, hb.nama AS habitat, p.jadwal, p.jenis, p.jumlah, p.status, m.username_jh
      FROM PAKAN p
      JOIN MEMBERI m ON p.id_hewan = m.id_hewan AND p.jadwal = m.jadwal
      JOIN HEWAN h ON p.id_hewan = h.id
      LEFT JOIN HABITAT hb ON h.nama_habitat = hb.nama
      WHERE m.username_jh = $1 AND p.status = 'tersedia'
      ORDER BY p.jadwal DESC
    `;
    const pakanModel = new Pakan();
    const result = await pakanModel.customQuery(query, [username_jh]);
    console.log("[FEEDING HISTORY] Query result:", result); // Log hasil query
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch feeding history" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
