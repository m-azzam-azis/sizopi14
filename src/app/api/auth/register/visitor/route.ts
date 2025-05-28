import { Pengguna } from "@/db/models/pengguna";
import { Pengunjung } from "@/db/models/pengunjung";
import { PenggunaType, PengunjungType } from "@/db/types";

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
      alamat,
      tgl_lahir,
    }: PenggunaType & PengunjungType = body;

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
          error: `All fields are required, missing fields are ${
            !username ? "username, " : ""
          }${!email ? "email, " : ""}${!password ? "password, " : ""}${
            !nama_depan ? "nama_depan, " : ""
          }${!nama_tengah ? "nama_tengah, " : ""}${
            !nama_belakang ? "nama_belakang, " : ""
          }${!no_telepon ? "no_telepon, " : ""}`,
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

    const pengunjungModel = new Pengunjung();
    await pengunjungModel.create({
      username_P: username,
      alamat,
      tgl_lahir,
    });

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
