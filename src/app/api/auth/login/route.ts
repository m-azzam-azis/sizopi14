import { Pengguna } from "@/db/models/pengguna";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { LoginInterface } from "./interface";
import { Pengunjung } from "@/db/models/pengunjung";
import { DokterHewan } from "@/db/models/dokterHewan";
import { PenjagaHewan } from "@/db/models/penjagaHewan";
import { PelatihHewan } from "@/db/models/pelatihHewan";
import { StafAdmin } from "@/db/models/stafAdmin";
import { Spesialisasi } from "@/db/models/spesialisasi";
import { SpesialisasiType } from "@/db/types";

const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key";

export async function POST(req: Request) {
  const cookieStore = await cookies();

  const { email, password }: LoginInterface = await req.json();

  if (!email || !password) {
    return new Response(
      JSON.stringify({
        message: "Failed",
        error: "All fields are required",
      }),
      { status: 400 }
    );
  }

  try {
    const penggunaModel = new Pengguna();
    const pengguna = await penggunaModel.findByEmail(email);

    if (!pengguna) {
      return new Response(
        JSON.stringify({
          message: "Failed",
          error: "Pengguna not found",
        }),
        { status: 404 }
      );
    }

    const role = await penggunaModel.getRole(pengguna.username);

    const isPasswordCorrect = await penggunaModel.comparePassword(
      pengguna.username,
      password
    );

    if (!isPasswordCorrect) {
      return new Response(
        JSON.stringify({
          message: "Failed",
          error: "Invalid username or password",
        }),
        { status: 401 }
      );
    }

    const pengunjungModel = new Pengunjung();
    let pengunjung;
    if (role == "visitor") {
      pengunjung = await pengunjungModel.findByUsername(pengguna.username);
    }

    const dokterHewanModel = new DokterHewan();
    let dokterHewan;
    let specializationNames;
    if (role == "veterinarian") {
      dokterHewan = await dokterHewanModel.findByUsername(pengguna.username);
      if (dokterHewan) {
        const spesialisasiModel = new Spesialisasi();

        const specializations = await spesialisasiModel.findAllByUsernameSH(
          pengguna.username
        );

        specializationNames =
          specializations && specializations.length > 0
            ? specializations.map(
                (spec: SpesialisasiType) => spec.nama_spesialisasi
              )
            : [];
      }
    }

    const penjagaHewanModel = new PenjagaHewan();
    let penjagaHewan;
    if (role == "caretaker") {
      penjagaHewan = await penjagaHewanModel.findByUsername(pengguna.username);
    }

    const pelatihHewanModel = new PelatihHewan();
    let pelatihHewan;
    if (role == "trainer") {
      pelatihHewan = await pelatihHewanModel.findByUsername(pengguna.username);
    }

    const staffAdminModel = new StafAdmin();
    let staffAdmin;
    if (role == "admin") {
      staffAdmin = await staffAdminModel.findByUsername(pengguna.username);
    }

    const token = jwt.sign(
      {
        data: {
          username: pengguna.username,
          email: pengguna.email,
          nama_depan: pengguna.nama_depan,
          nama_tengah: pengguna.nama_tengah,
          nama_belakang: pengguna.nama_belakang,
          no_telepon: pengguna.no_telepon,
          role: role,
          alamat: pengunjung ? pengunjung.alamat : null,
          tgl_lahir: pengunjung ? pengunjung.tgl_lahir : null,
          id_staf_JH: penjagaHewan ? penjagaHewan.id_staf : null,
          id_staf_LH: pelatihHewan ? pelatihHewan.id_staf : null,
          no_str: dokterHewan ? dokterHewan.no_str : null,
          nama_spesialisasi: specializationNames,
          id_staf_sa: staffAdmin ? staffAdmin.id_staf : null,
        },
      },
      SECRET_KEY,
      { expiresIn: "365d" }
    );

    cookieStore.set("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    return new Response(
      JSON.stringify({
        message: "Success",
        role: role,
        token,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
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
