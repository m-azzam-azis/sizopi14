import { Pengguna } from "@/db/models/pengguna";
import { DokterHewan } from "@/db/models/dokterHewan";
import { Spesialisasi } from "@/db/models/spesialisasi";

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
      no_str,
      specializations,
    } = body;

    if (
      !username ||
      !email ||
      !password ||
      !nama_depan ||
      !nama_belakang ||
      !no_telepon ||
      !no_str ||
      !specializations
    ) {
      return new Response(
        JSON.stringify({
          message: "Failed",
          error: "All fields are required",
          body: body,
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

    // Insert ke tabel DOKTER_HEWAN
    const dokterHewanModel = new DokterHewan();
    await dokterHewanModel.create({
      username_DH: username,
      no_str,
    });

    const spesialisasiModel = new Spesialisasi();
    const specsToAdd = Array.isArray(specializations)
      ? specializations
      : [specializations];

    for (const spec of specsToAdd) {
      await spesialisasiModel.create({
        username_SH: username,
        nama_spesialisasi: spec,
      });
    }

    return new Response(
      JSON.stringify({
        message: "Success",
        data: newUser,
      }),
      { status: 201 }
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
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
