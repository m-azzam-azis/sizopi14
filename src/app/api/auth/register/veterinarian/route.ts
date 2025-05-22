import { Pengguna } from "@/db/models/pengguna";
import { DokterHewan } from "@/db/models/dokterHewan";
import { PenggunaType, DokterHewanType } from "@/db/types";

export async function POST(req: Request) {
  try {
    const body: PenggunaType & DokterHewanType = await req.json();
    const {
      username,
      email,
      password,
      nama_depan,
      nama_tengah,
      nama_belakang,
      no_telepon,
      no_str,
    } = body;

    if (
      !username ||
      !email ||
      !password ||
      !nama_depan ||
      !nama_tengah ||
      !nama_belakang ||
      !no_telepon ||
      !no_str
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

    const dokterHewanModel = new DokterHewan();
    await dokterHewanModel.create({
      username_DH: username,
      no_str,
    });

    return new Response(
      JSON.stringify({
        message: "Success",
        data: newUser,
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
