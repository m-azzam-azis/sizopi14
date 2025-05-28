import { NextResponse } from "next/server";
import { Hewan } from "@/db/models/hewan";

export async function GET() {
  try {
    const hewanModel = new Hewan();

    const data = await hewanModel.findAll();

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error("Error fetching animals:", error);
    return NextResponse.json(
      { message: "Failed to fetch animals", error: error.message },
      { status: 500 }
    );
  }
}
