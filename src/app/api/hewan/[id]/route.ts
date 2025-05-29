import { NextRequest, NextResponse } from "next/server";
import { Hewan } from "@/db/models/hewan";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params;
    const updatedHewan = await hewan.updateById(await id, {
      nama,
      spesies,
      asal_hewan,
      tanggal_lahir: tanggal_lahir || null,
      status_kesehatan,
      nama_habitat,
      url_foto,
    });

    if (!updatedHewan) {
      return NextResponse.json(
        { success: false, error: "Animal not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedHewan,
    });
  } catch (error: any) {
    console.error("Error updating animal:", error);

    let errorMessage = "Failed to update animal";
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
    const hewan = new Hewan();
    const deleted = await hewan.deleteById(await id);

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
  } catch (error: any) {
    console.error("Error deleting animal:", error);

    let errorMessage = "Failed to delete animal";
    if (error.message) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
