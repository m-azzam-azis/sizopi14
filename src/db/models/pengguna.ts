import { BaseModel } from "../model";
import { PenggunaType } from "../types";

export class Pengguna extends BaseModel<PenggunaType> {
  constructor() {
    super("PENGGUNA");
  }

  async findByEmail(email: string) {
    return this.findBy("email", email);
  }

  async findByUsername(username: string) {
    return this.findBy("username", username);
  }

  async getRole(username: string) {
    const queries = [
      {
        role: "visitor",
        query: "SELECT EXISTS (SELECT 1 FROM PENGUNJUNG WHERE username_P = $1)",
      },
      {
        role: "veterinarian",
        query:
          "SELECT EXISTS (SELECT 1 FROM DOKTER_HEWAN WHERE username_DH = $1)",
      },
      {
        role: "caretaker",
        query:
          "SELECT EXISTS (SELECT 1 FROM PENJAGA_HEWAN WHERE username_JH = $1)",
      },
      {
        role: "trainer",
        query:
          "SELECT EXISTS (SELECT 1 FROM PELATIH_HEWAN WHERE username_LH = $1)",
      },
      {
        role: "admin",
        query:
          "SELECT EXISTS (SELECT 1 FROM STAF_ADMIN WHERE username_sa = $1)",
      },
    ];

    for (const { role, query } of queries) {
      const result = await this.customQuery(query, [username]);
      if (result[0]["exists"]) {
        return role;
      }
    }

    return "";
  }
}
