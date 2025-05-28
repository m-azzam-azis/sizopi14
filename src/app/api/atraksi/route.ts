import { Atraksi } from "@/db/models/atraksi";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const atraksiModel = new Atraksi();
    const data = await atraksiModel.getDetailedAtraksiData();

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error("Error fetching attractions:", error);
    return NextResponse.json(
      { message: "Failed to fetch attractions", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      nama_atraksi,
      lokasi,
      kapasitas_max,
      jadwal,
      pelatih_id,
      hewan_ids,
    } = body;

    if (!nama_atraksi || !lokasi || !kapasitas_max || !jadwal) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const atraksiModel = new Atraksi();

    await atraksiModel.customQuery(
      `INSERT INTO FASILITAS(nama, jadwal, kapasitas_max) VALUES($1, $2, $3)`,
      [nama_atraksi, jadwal, kapasitas_max]
    );

    await atraksiModel.customQuery(
      `INSERT INTO ATRAKSI(nama_atraksi, lokasi) VALUES($1, $2)`,
      [nama_atraksi, lokasi]
    );

    if (pelatih_id) {
      await atraksiModel.customQuery(
        `INSERT INTO JADWAL_PENUGASAN(username_lh, tgl_penugasan, nama_atraksi) VALUES($1, $2, $3)`,
        [pelatih_id, new Date(), nama_atraksi]
      );
    }

    if (hewan_ids && hewan_ids.length > 0) {
      for (const id_hewan of hewan_ids) {
        await atraksiModel.customQuery(
          `INSERT INTO BERPARTISIPASI(nama_fasilitas, id_hewan) VALUES($1, $2)`,
          [nama_atraksi, id_hewan]
        );
      }
    }

    return NextResponse.json(
      {
        message: "Attraction created successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating attraction:", error);
    return NextResponse.json(
      { message: "Failed to create attraction", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { nama_atraksi, kapasitas_max, jadwal } = body;

    if (!nama_atraksi || !kapasitas_max || !jadwal) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const atraksiModel = new Atraksi();

    await atraksiModel.customQuery(
      `UPDATE FASILITAS SET jadwal = $1, kapasitas_max = $2 WHERE nama = $3`,
      [jadwal, kapasitas_max, nama_atraksi]
    );

    return NextResponse.json({
      message: "Attraction updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating attraction:", error);
    return NextResponse.json(
      { message: "Failed to update attraction", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const nama_atraksi = searchParams.get("nama_atraksi");

    if (!nama_atraksi) {
      return NextResponse.json(
        { message: "Attraction name is required" },
        { status: 400 }
      );
    }

    const atraksiModel = new Atraksi();

    await atraksiModel.customQuery(
      `DELETE FROM ATRAKSI WHERE nama_atraksi = $1`,
      [nama_atraksi]
    );

    return NextResponse.json({
      message: "Attraction deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting attraction:", error);
    return NextResponse.json(
      { message: "Failed to delete attraction", error: error.message },
      { status: 500 }
    );
  }
}
