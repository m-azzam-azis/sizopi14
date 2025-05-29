import { NextRequest, NextResponse } from "next/server";
import { Habitat } from "@/db/models/habitat";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const habitat = new Habitat();
    const habitatData = await habitat.findByName(decodeURIComponent(await id));

    if (!habitatData) {
      return NextResponse.json(
        { success: false, error: "Habitat not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: habitatData,
    });
  } catch (error) {
    console.error("Error fetching habitat:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch habitat" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params;
    const updatedHabitat = await habitat.updateByName(
      decodeURIComponent(await id),
      {
        nama,
        luas_area: parseFloat(luas_area),
        kapasitas: parseInt(kapasitas),
        status: status || "Aktif",
      }
    );

    if (!updatedHabitat) {
      return NextResponse.json(
        { success: false, error: "Habitat not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedHabitat,
    });
  } catch (error: any) {
    console.error("Error updating habitat:", error);

    let errorMessage = "Failed to update habitat";
    if (error.message) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const habitat = new Habitat();
    const deleted = await habitat.deleteByName(decodeURIComponent(await id));

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Habitat not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Habitat deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting habitat:", error);

    let errorMessage = "Failed to delete habitat";
    if (error.message) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
