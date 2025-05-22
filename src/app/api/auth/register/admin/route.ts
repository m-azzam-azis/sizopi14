import { Pengguna } from "@/db/models/pengguna";
import { StafAdmin } from "@/db/models/stafAdmin";
import { v4 as uuidv4 } from "uuid"; // Make sure to add this package with: pnpm add uuid

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      username,
      email,
      password,
      nama_depan,
      nama_tengah,
      nama_belakang,
      no_telepon,
    } = body;

    if (
      !username ||
      !email ||
      !password ||
      !nama_depan ||
      !nama_belakang ||
      !no_telepon
    ) {
      return new Response(
        JSON.stringify({
          message: "Failed",
          error: "All fields are required",
        }),
        { status: 400 }
      );
    }

    const penggunaModel = new Pengguna();
    const existingUser = await penggunaModel.findByEmail(email);

    if (existingUser) {
      return new Response(
        JSON.stringify({
          message: "Failed",
          error: "User already exists",
        }),
        { status: 400 }
      );
    }

    const newUser = await penggunaModel.create({
      username,
      email,
      password,
      nama_depan,
      nama_tengah,
      nama_belakang,
      no_telepon,
    });

    // Generate a random UUID instead of using the one from the request
    const id_staf = uuidv4();

    const stafAdminModel = new StafAdmin();
    await stafAdminModel.create({
      username_sa: username,
      id_staf,
    });

    return new Response(
      JSON.stringify({
        message: "Success",
        data: {
          ...newUser,
          id_staf, // Include the generated UUID in the response
        },
      }),
      { status: 201 }
    );
  } catch (error: any) {
    console.error(error);
    return new Response(
      JSON.stringify({
        message: "Failed",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
