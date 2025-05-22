import { Pengguna } from "@/db/models/pengguna";
import { PelatihHewan } from "@/db/models/pelatihHewan";
import { PenggunaType, PelatihHewanType } from "@/db/types";

export async function POST(req: Request) {
  try {
    const body: PenggunaType & PelatihHewanType = await req.json();
    const {
      username,
      email,
      password,
      nama_depan,
      nama_tengah,
      nama_belakang,
      no_telepon,
      id_staf,
    } = body;

    if (
      !username ||
      !email ||
      !password ||
      !nama_depan ||
      !nama_tengah ||
      !nama_belakang ||
      !no_telepon ||
      !id_staf
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

    const pelatihHewanModel = new PelatihHewan();
    await pelatihHewanModel.create({
      username_LH: username,
      id_staf,
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
