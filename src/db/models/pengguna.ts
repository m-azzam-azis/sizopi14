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

  async comparePassword(
    username: string,
    inputPassword: string,
  ): Promise<boolean> {
    try {
      const result = await this.customQuery(
        "SELECT verify_login($1, $2) AS is_valid",
        [username, inputPassword]
      );
      return true;
    } catch (error: any) {
      console.error("Login verification failed:", error.message);
      return false;
    }
  }

  async getRole(username: string) {
    const queries = [
      {
        role: "visitor", // Changed from "pengunjung" to match your UI requirements
        query: "SELECT EXISTS (SELECT 1 FROM PENGUNJUNG WHERE username_P = $1)",
      },
      {
        role: "veterinarian", // Changed from "dokter_hewan" to match your UI requirements
        query:
          "SELECT EXISTS (SELECT 1 FROM DOKTER_HEWAN WHERE username_DH = $1)",
      },
      {
        role: "caretaker", // Changed from "penjaga_hewan" to match your UI requirements
        query:
          "SELECT EXISTS (SELECT 1 FROM PENJAGA_HEWAN WHERE username_JH = $1)",
      },
      {
        role: "trainer", // Changed from "pelatih_hewan" to match your UI requirements
        query:
          "SELECT EXISTS (SELECT 1 FROM PELATIH_HEWAN WHERE username_LH = $1)",
      },
      {
        role: "admin", // Changed from "staf_admin" to match your UI requirements
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

    return "user"; // Default role if no specific role is found
  }
}
