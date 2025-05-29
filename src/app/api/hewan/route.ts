import { NextRequest, NextResponse } from "next/server";
import { Hewan } from "@/db/models/hewan";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  try {
    const hewan = new Hewan();
    const animals = await hewan.findAllWithHabitat();

    return NextResponse.json({
      success: true,
      data: animals,
    });
  } catch (error) {
    console.error("Error fetching animals:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch animals" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      nama,
      spesies,
      asal_hewan,
      tanggal_lahir,
      status_kesehatan,
      nama_habitat,
      url_foto,
    } = body;

    if (
      !spesies ||
      !asal_hewan ||
      !status_kesehatan ||
      !nama_habitat ||
      !url_foto
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const hewan = new Hewan();
    const newHewan = await hewan.create({
      id: uuidv4(), // Generate a new UUID
      nama: nama || null,
      spesies,
      asal_hewan,
      tanggal_lahir: tanggal_lahir
        ? new Date(tanggal_lahir).toISOString()
        : null,
      status_kesehatan,
      nama_habitat,
      url_foto,
    });

    return NextResponse.json({
      success: true,
      data: newHewan,
    });
  } catch (error: any) {
    console.error("Error creating animal:", error);

    // Pass the detailed error message
    let errorMessage = "Failed to create animal";
    if (error.message) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
