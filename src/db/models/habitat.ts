import { BaseModel } from "../model";
import { HabitatType } from "../types";

export class Habitat extends BaseModel<HabitatType> {
  constructor() {
    super("HABITAT");
  }

  // Find habitat by name (primary key)
  async findByName(nama: string): Promise<HabitatType | null> {
    try {
      const result = await this.findBy("nama", nama);
      return Array.isArray(result) ? result[0] : result;
    } catch (error) {
      console.error("Error finding habitat by name:", error);
      return null;
    }
  }

  // Update habitat by name
  async updateByName(
    nama: string,
    data: Partial<HabitatType>
  ): Promise<HabitatType | null> {
    try {
      const query = `
        UPDATE ${this.tableName} 
        SET ${Object.keys(data)
          .map((key, index) => `${key} = $${index + 2}`)
          .join(", ")}
        WHERE nama = $1
        RETURNING *
      `;

      const values = [nama, ...Object.values(data)];
      const result = await this.query(query, values);

      return result.rows[0] || null;
    } catch (error) {
      console.error("Error updating habitat by name:", error);
      return null;
    }
  }

  // Delete habitat by name
  async deleteByName(nama: string): Promise<boolean> {
    try {
      const query = `DELETE FROM ${this.tableName} WHERE nama = $1`;
      const result = await this.query(query, [nama]);
      return result.rowCount > 0;
    } catch (error) {
      console.error("Error deleting habitat by name:", error);
      return false;
    }
  }

  // Get habitats with animal count
  async findAllWithAnimalCount(): Promise<
    (HabitatType & { jumlah_hewan?: number })[]
  > {
    try {
      const query = `
        SELECT 
          h.*,
          COUNT(he.id) as jumlah_hewan
        FROM HABITAT h
        LEFT JOIN HEWAN he ON h.nama = he.nama_habitat
        GROUP BY h.nama, h.luas_area, h.kapasitas, h.status
        ORDER BY h.nama
      `;

      const result = await this.query(query);
      return result.rows.map((row: { jumlah_hewan: string }) => ({
        ...row,
        jumlah_hewan: parseInt(row.jumlah_hewan) || 0,
      }));
    } catch (error) {
      console.error("Error fetching habitats with animal count:", error);
      return [];
    }
  }

  // Check if habitat exists
  async exists(nama: string): Promise<boolean> {
    try {
      const result = await this.findByName(nama);
      return result !== null;
    } catch (error) {
      console.error("Error checking habitat existence:", error);
      return false;
    }
  }
}
