import { BaseModel } from "../model";
import { StafAdminType } from "../types";
import pool from "../db";

export class StafAdmin extends BaseModel<StafAdminType> {
  constructor() {
    super("STAF_ADMIN");
  }

  async findByUsername(username: string) {
    try {
      const result = await pool.query(
        `SELECT * FROM staf_admin WHERE username_sa = $1`,
        [username]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding admin by username:', error);
      throw error;
    }
  }

  async updateByUsername(username: string, data: Partial<StafAdminType>) {
    return this.update("username_sa", username, data);
  }
}
