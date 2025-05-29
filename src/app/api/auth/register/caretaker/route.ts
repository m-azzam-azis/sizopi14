import { Pengguna } from "@/db/models/pengguna";
import { PenjagaHewan } from "@/db/models/penjagaHewan";
import { v4 as uuidv4 } from "uuid";

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

    const id_staf = uuidv4();

    const penjagaHewanModel = new PenjagaHewan();
    await penjagaHewanModel.create({
      username_JH: username,
      id_staf,
    });

    return new Response(
      JSON.stringify({
        message: "Success",
        data: {
          ...newUser,
          id_staf,
        },
      }),
      { status: 201 }
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error(error);
    return new Response(
      JSON.stringify({
        message: "Failed",
        error: errorMessage,
      }),
      { status: 500 }
    );
  }
}
