import { NextRequest, NextResponse } from "next/server";
import { Habitat } from "@/db/models/habitat";
import { getUserData } from "@/hooks/getUserData";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const habitat = new Habitat();
    const habitatData = await habitat.findByName(decodeURIComponent(params.id));

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
  { params }: { params: { id: string } }
) {
  try {
    const { userData, isValid } = getUserData();

    if (!isValid || !["penjaga_hewan", "staf_admin"].includes(userData.role)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { nama, luas_area, kapasitas, status } = body;

    const habitat = new Habitat();
    const updatedHabitat = await habitat.updateByName(
      decodeURIComponent(params.id),
      {
        nama,
        luas_area: parseFloat(luas_area),
        kapasitas: parseInt(kapasitas),
        status,
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
  } catch (error) {
    console.error("Error updating habitat:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update habitat" },
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

    if (!isValid || !["penjaga_hewan", "staf_admin"].includes(userData.role)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const habitat = new Habitat();
    const deleted = await habitat.deleteByName(decodeURIComponent(params.id));

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
  } catch (error) {
    console.error("Error deleting habitat:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete habitat" },
      { status: 500 }
    );
  }
}
