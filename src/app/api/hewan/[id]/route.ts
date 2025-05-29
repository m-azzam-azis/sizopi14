import { NextRequest, NextResponse } from "next/server";
import { Hewan } from "@/db/models/hewan";
import { getUserData } from "@/hooks/getUserData";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const hewan = new Hewan();
    const animalData = await hewan.getById(params.id);

    if (!animalData) {
      return NextResponse.json(
        { success: false, error: "Animal not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: animalData,
    });
  } catch (error) {
    console.error("Error fetching animal:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch animal" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const hewan = new Hewan();
    const updatedAnimal = await hewan.updateById(params.id, {
      nama,
      spesies,
      asal_hewan,
      tanggal_lahir,
      status_kesehatan,
      nama_habitat,
      url_foto,
    });

    if (!updatedAnimal) {
      return NextResponse.json(
        { success: false, error: "Animal not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedAnimal,
    });
  } catch (error) {
    console.error("Error updating animal:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update animal" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const hewan = new Hewan();
    const deleted = await hewan.deleteById(params.id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Animal not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Animal deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting animal:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete animal" },
      { status: 500 }
    );
  }
}
