import { BaseModel } from "../model";
import { PenggunaType } from "../types";
import pool from "../db";

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

  async updateByUsername(username: string, data: Partial<PenggunaType>) {
    return this.update("username", username, data);
  }

  async comparePassword(
    username: string,
    inputPassword: string,
  ): Promise<boolean> {
    try {
      // Gunakan hasil query yang diterima
      const result = await this.customQuery(
        "SELECT verify_login($1, $2) AS is_valid",
        [username, inputPassword]
      );

      // Gunakan result untuk menentukan hasilnya berdasarkan respons verify_login
      return result[0]?.is_valid === true;
    } catch (error: unknown) { 
      if (error instanceof Error) {
        console.error("Login verification failed:", error.message);
      } else {
        console.error("Login verification failed:", error);
      }
      return false;
    }
  }

  async getRole(username: string) {
    try {
      // Periksa apakah pengguna adalah admin
      const adminResult = await pool.query(
        `SELECT 1 FROM staf_admin WHERE username_sa = $1`,
        [username]
      );
      if (adminResult.rows.length > 0) {
        return 'admin';
      }
      
      // Periksa apakah pengguna adalah dokter hewan
      const vetResult = await pool.query(
        `SELECT 1 FROM dokter_hewan WHERE username_dokter = $1`,
        [username]
      );
      if (vetResult.rows.length > 0) {
        return 'veterinarian';
      }
      
      // Periksa apakah pengguna adalah pelatih
      const trainerResult = await pool.query(
        `SELECT 1 FROM pelatih WHERE username_pelatih = $1`,
        [username]
      );
      if (trainerResult.rows.length > 0) {
        return 'trainer';
      }
      
      // Periksa apakah pengguna adalah penjaga
      const caretakerResult = await pool.query(
        `SELECT 1 FROM penjaga WHERE username_penjaga = $1`,
        [username]
      );
      if (caretakerResult.rows.length > 0) {
        return 'caretaker';
      }
      
      // Default: pengunjung
      return 'visitor';
    } catch (error) {
      console.error('Error getting user role:', error);
      throw error;
    }
  }
}