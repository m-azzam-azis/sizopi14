import { NextRequest, NextResponse } from "next/server";
import { Hewan } from "@/db/models/hewan";
import { getUserData } from "@/hooks/getUserData";

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
    const { userData, isValid } = getUserData();

    if (
      !isValid ||
      !["dokter_hewan", "penjaga_hewan", "staf_admin"].includes(userData.role)
    ) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

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
    const newAnimal = await hewan.create({
      id: "",
      nama: nama || null,
      spesies,
      asal_hewan,
      tanggal_lahir: tanggal_lahir || null,
      status_kesehatan,
      nama_habitat,
      url_foto,
    });

    return NextResponse.json({
      success: true,
      data: newAnimal,
    });
  } catch (error) {
    console.error("Error creating animal:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create animal" },
      { status: 500 }
    );
  }
}
