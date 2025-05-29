import { NextRequest, NextResponse } from "next/server";
import { Habitat } from "@/db/models/habitat";

export async function GET() {
  try {
    const habitat = new Habitat();
    const habitats = await habitat.findAllWithAnimalCount();

    return NextResponse.json({
      success: true,
      data: habitats,
    });
  } catch (error) {
    console.error("Error fetching habitats:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch habitats" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nama, luas_area, kapasitas, status } = body;

    if (!nama || !luas_area || !kapasitas) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const habitat = new Habitat();

    // Check if habitat already exists
    const existingHabitat = await habitat.findByName(nama);
    if (existingHabitat) {
      return NextResponse.json(
        { success: false, error: "Habitat with this name already exists" },
        { status: 400 }
      );
    }

    const newHabitat = await habitat.create({
      nama: nama,
      luas_area: parseFloat(luas_area),
      kapasitas: parseInt(kapasitas),
      status: status || "Aktif",
    });

    return NextResponse.json({
      success: true,
      data: newHabitat,
    });
  } catch (error) {
    console.error("Error creating habitat:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create habitat" },
      { status: 500 }
    );
  }
}
