import { NextResponse } from "next/server";
import { Wahana } from "@/db/models/wahana";
import { Fasilitas } from "@/db/models/fasilitas";

export async function GET() {
  try {
    const wahanaModel = new Wahana();
    const data = await wahanaModel.getAllWahanaWithDetails();

    const formattedData = data.map((wahana) => ({
      ...wahana,
      peraturan: wahana.peraturan
        ? wahana.peraturan.split(",").map((p) => p.trim())
        : [],
    }));

    return NextResponse.json({ data: formattedData });
  } catch (error: any) {
    console.error("Error fetching wahana data:", error);
    return NextResponse.json(
      { message: "Failed to fetch wahana data", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nama_wahana, peraturan, kapasitas_max, jadwal } = body;

    if (!nama_wahana || !peraturan || !kapasitas_max || !jadwal) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const fasilitasModel = new Fasilitas();
    const existingFasilitas = await fasilitasModel.findBy("nama", nama_wahana);

    if (existingFasilitas) {
      return NextResponse.json(
        { message: "Nama wahana sudah digunakan", error: "Duplicate name" },
        { status: 400 }
      );
    }

    await fasilitasModel.create({
      nama: nama_wahana,
      jadwal: jadwal,
      kapasitas_max: kapasitas_max,
    });

    const wahanaModel = new Wahana();
    const peraturanText = Array.isArray(peraturan)
      ? peraturan.join(", ")
      : peraturan;

    await wahanaModel.create({
      nama_wahana: nama_wahana,
      peraturan: peraturanText,
    });

    return NextResponse.json(
      {
        message: "Wahana created successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating wahana:", error);
    return NextResponse.json(
      { message: "Failed to create wahana", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { nama_wahana, kapasitas_max, jadwal } = body;

    if (!nama_wahana || !kapasitas_max || !jadwal) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const fasilitasModel = new Fasilitas();
    await fasilitasModel.update("nama", nama_wahana, {
      jadwal: jadwal,
      kapasitas_max: kapasitas_max,
    });

    return NextResponse.json({
      message: "Wahana updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating wahana:", error);
    return NextResponse.json(
      { message: "Failed to update wahana", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const nama_wahana = searchParams.get("nama_wahana");

    if (!nama_wahana) {
      return NextResponse.json(
        { message: "Wahana name is required" },
        { status: 400 }
      );
    }

    const fasilitasModel = new Fasilitas();
    await fasilitasModel.delete("nama", nama_wahana);

    return NextResponse.json({
      message: "Wahana deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting wahana:", error);
    return NextResponse.json(
      { message: "Failed to delete wahana", error: error.message },
      { status: 500 }
    );
  }
}
