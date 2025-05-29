import { NextResponse } from "next/server";
import { PelatihHewan } from "@/db/models/pelatihHewan";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const username = url.searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { message: "Username parameter is required" },
        { status: 400 }
      );
    }

    const pelatihModel = new PelatihHewan();

    const trainerQuery = `
      SELECT 
        ph.id_staf, 
        p.nama_depan, 
        p.nama_belakang
      FROM 
        PELATIH_HEWAN ph
        JOIN PENGGUNA p ON ph.username_lh = p.username
      WHERE 
        ph.username_lh = $1
    `;
    const trainerData = await pelatihModel.customQuery(trainerQuery, [
      username,
    ]);
    const trainer = trainerData[0] || null;

    const today = new Date().toISOString().split("T")[0];
    const assignmentsQuery = `
      SELECT 
        jp.username_lh,
        jp.tgl_penugasan,
        jp.nama_atraksi,
        a.lokasi
      FROM 
        JADWAL_PENUGASAN jp
        JOIN ATRAKSI a ON jp.nama_atraksi = a.nama_atraksi
      WHERE 
        jp.username_lh = $1
        AND DATE(jp.tgl_penugasan) = $2
      ORDER BY 
        jp.tgl_penugasan ASC
    `;
    const assignmentSchedules = await pelatihModel.customQuery(
      assignmentsQuery,
      [username, today]
    );

    const trainedAnimalsQuery = `
      SELECT DISTINCT
        h.id,
        h.nama,
        h.spesies,
        h.status_kesehatan,
        a.nama_atraksi,
        h.url_foto
      FROM 
        JADWAL_PENUGASAN jp
        JOIN BERPARTISIPASI b ON jp.nama_atraksi = b.nama_fasilitas
        JOIN HEWAN h ON b.id_hewan = h.id
        JOIN ATRAKSI a ON jp.nama_atraksi = a.nama_atraksi
      WHERE 
        jp.username_lh = $1
      ORDER BY
        h.nama
    `;
    const trainedAnimals = await pelatihModel.customQuery(trainedAnimalsQuery, [
      username,
    ]);

    const trainingStatusesQuery = `
      WITH RecentAssignments AS (
        SELECT 
          jp.username_lh,
          jp.tgl_penugasan,
          jp.nama_atraksi,
          ROW_NUMBER() OVER (PARTITION BY jp.nama_atraksi ORDER BY jp.tgl_penugasan DESC) as row_num
        FROM 
          JADWAL_PENUGASAN jp
        WHERE 
          jp.username_lh = $1
      ),
      AnimalsInAttractions AS (
        SELECT 
          h.id,
          h.nama,
          ra.nama_atraksi,
          ra.tgl_penugasan
        FROM 
          RecentAssignments ra
          JOIN BERPARTISIPASI b ON ra.nama_atraksi = b.nama_fasilitas
          JOIN HEWAN h ON b.id_hewan = h.id
        WHERE 
          ra.row_num = 1
      )
      SELECT 
        'TS-' || EXTRACT(EPOCH FROM aia.tgl_penugasan)::text as id,
        aia.id as id_hewan,
        aia.nama as animal_name,
        aia.tgl_penugasan::text as date,
        CASE 
          WHEN CURRENT_DATE - aia.tgl_penugasan::date <= 7 THEN 'Dalam Proses'
          ELSE 'Selesai'
        END as status,
        'Latihan untuk pertunjukan di ' || aia.nama_atraksi as notes
      FROM 
        AnimalsInAttractions aia
      ORDER BY 
        aia.tgl_penugasan DESC
      LIMIT 10
    `;

    const trainingStatuses = await pelatihModel.customQuery(
      trainingStatusesQuery,
      [username]
    );

    console.log("Trainer Dashboard Data:", {
      trainer,
      assignmentSchedules,
      trainedAnimals,
      trainingStatuses,
    });

    return NextResponse.json({
      trainer,
      assignmentSchedules,
      trainedAnimals,
      trainingStatuses,
    });
  } catch (error: any) {
    console.error("Error fetching trainer dashboard data:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch trainer dashboard data",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
