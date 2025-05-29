import { Pengguna } from "@/db/models/pengguna";
import { Pengunjung } from "@/db/models/pengunjung";
import { DokterHewan } from "@/db/models/dokterHewan";
import { PenjagaHewan } from "@/db/models/penjagaHewan";
import { PelatihHewan } from "@/db/models/pelatihHewan";
import { StafAdmin } from "@/db/models/stafAdmin";
import { Spesialisasi } from "@/db/models/spesialisasi";
import { cookies } from "next/headers";
import { decode } from "jsonwebtoken";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const decoded: any = decode(token);
    const username = decoded?.data?.username;
    const role = decoded?.data?.role;

    if (!username || !role) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const penggunaModel = new Pengguna();
    const user = await penggunaModel.findByUsername(username);

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const profileData: any = {
      username: user.username,
      email: user.email,
      nama_depan: user.nama_depan,
      nama_tengah: user.nama_tengah,
      nama_belakang: user.nama_belakang,
      no_telepon: user.no_telepon,
      role: role,
    };

    // Get role-specific data
    switch (role) {
      case "visitor":
        const pengunjungModel = new Pengunjung();
        const pengunjung = await pengunjungModel.findByUsername(username);
        if (pengunjung) {
          profileData.alamat = pengunjung.alamat;
          profileData.tgl_lahir = pengunjung.tgl_lahir;
        }
        break;

      case "veterinarian":
        const dokterHewanModel = new DokterHewan();
        const dokterHewan = await dokterHewanModel.findByUsername(username);
        if (dokterHewan) {
          profileData.no_str = dokterHewan.no_str;

          // Get specializations
          const spesialisasiModel = new Spesialisasi();
          const specializations = await spesialisasiModel.findAllByUsernameSH(
            username
          );
          profileData.nama_spesialisasi =
            specializations?.map((spec) => spec.nama_spesialisasi) || [];
        }
        break;

      case "caretaker":
        const penjagaHewanModel = new PenjagaHewan();
        const penjagaHewan = await penjagaHewanModel.findByUsername(username);
        if (penjagaHewan) {
          profileData.id_staf = penjagaHewan.id_staf;
        }
        break;

      case "trainer":
        const pelatihHewanModel = new PelatihHewan();
        const pelatihHewan = await pelatihHewanModel.findByUsername(username);
        if (pelatihHewan) {
          profileData.id_staf = pelatihHewan.id_staf;
        }
        break;

      case "admin":
        const stafAdminModel = new StafAdmin();
        const stafAdmin = await stafAdminModel.findByUsername(username);
        if (stafAdmin) {
          profileData.id_staf = stafAdmin.id_staf;
        }
        break;
    }

    return new Response(JSON.stringify(profileData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("GET /api/profile error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch profile" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const decoded: any = decode(token);
    const username = decoded?.data?.username;
    const role = decoded?.data?.role;

    if (!username || !role) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await request.json();

    const penggunaModel = new Pengguna();

    // Update base user data
    const baseUserData: any = {};
    if (data.nama_depan) baseUserData.nama_depan = data.nama_depan;
    if (data.nama_tengah !== undefined)
      baseUserData.nama_tengah = data.nama_tengah;
    if (data.nama_belakang) baseUserData.nama_belakang = data.nama_belakang;
    if (data.no_telepon) baseUserData.no_telepon = data.no_telepon;
    if (data.email) baseUserData.email = data.email;

    if (Object.keys(baseUserData).length > 0) {
      await penggunaModel.updateByUsername(username, baseUserData);
    }

    // Update role-specific data
    switch (role) {
      case "visitor":
        if (data.alamat || data.tgl_lahir) {
          const pengunjungModel = new Pengunjung();
          const updateData: any = {};
          if (data.alamat) updateData.alamat = data.alamat;
          if (data.tgl_lahir) updateData.tgl_lahir = data.tgl_lahir;

          await pengunjungModel.updateByUsername(username, updateData);
        }
        break;
      case "veterinarian":
        if (data.no_str) {
          const dokterHewanModel = new DokterHewan();
          await dokterHewanModel.updateByUsername(username, {
            no_str: data.no_str,
          });
        }
        // Note: Specializations updates would be handled separately if needed
        break;

      // Staff roles (caretaker, trainer, admin) might need to update their staff IDs in some cases
      case "caretaker":
        if (data.id_staf) {
          const penjagaHewanModel = new PenjagaHewan();
          await penjagaHewanModel.updateByUsername(username, {
            id_staf: data.id_staf,
          });
        }
        break;

      case "trainer":
        if (data.id_staf) {
          const pelatihHewanModel = new PelatihHewan();
          await pelatihHewanModel.updateByUsername(username, {
            id_staf: data.id_staf,
          });
        }
        break;

      case "admin":
        if (data.id_staf) {
          const stafAdminModel = new StafAdmin();
          await stafAdminModel.updateByUsername(username, {
            id_staf: data.id_staf,
          });
        }
        break;
    }

    return new Response(
      JSON.stringify({ message: "Profile updated successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("PUT /api/profile error:", error);
    return new Response(JSON.stringify({ error: "Failed to update profile" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
