import { BaseModel } from "../model";
import { HewanType } from "../types";

export class Hewan extends BaseModel<HewanType> {
  constructor() {
    super("HEWAN");
  }

  async getById(id: string): Promise<HewanType | null> {
    const result = await this.findBy("id", id);
    return Array.isArray(result) ? result[0] : result;
  }

  // Get all animals with their habitat information
  async findAllWithHabitat(): Promise<
    (HewanType & { habitat_status?: string })[]
  > {
    try {
      const query = `
        SELECT 
          h.*,
          hab.status as habitat_status
        FROM HEWAN h
        LEFT JOIN HABITAT hab ON h.nama_habitat = hab.nama
        ORDER BY h.nama
      `;

      const result = await this.query(query);
      return result.rows;
    } catch (error) {
      console.error("Error fetching animals with habitat:", error);
      return [];
    }
  }

  // Find animals by habitat
  async findByHabitat(namaHabitat: string): Promise<HewanType[]> {
    try {
      const result = await this.findBy("nama_habitat", namaHabitat);
      return Array.isArray(result) ? result : result ? [result] : [];
    } catch (error) {
      console.error("Error finding animals by habitat:", error);
      return [];
    }
  }

  // Find animals by species
  async findBySpecies(spesies: string): Promise<HewanType[]> {
    try {
      const result = await this.findBy("spesies", spesies);
      return Array.isArray(result) ? result : result ? [result] : [];
    } catch (error) {
      console.error("Error finding animals by species:", error);
      return [];
    }
  }

  // Update animal by ID
  async updateById(
    id: string,
    data: Partial<HewanType>
  ): Promise<HewanType | null> {
    try {
      const query = `
        UPDATE ${this.tableName} 
        SET ${Object.keys(data)
          .map((key, index) => `${key} = $${index + 2}`)
          .join(", ")}
        WHERE id = $1
        RETURNING *
      `;

      const values = [id, ...Object.values(data)];
      const result = await this.query(query, values);

      return result.rows[0] || null;
    } catch (error) {
      console.error("Error updating animal by ID:", error);
      return null;
    }
  }

  // Delete animal by ID
  async deleteById(id: string): Promise<boolean> {
    try {
      const query = `DELETE FROM ${this.tableName} WHERE id = $1`;
      const result = await this.query(query, [id]);
      return result.rowCount > 0;
    } catch (error) {
      console.error("Error deleting animal by ID:", error);
      return false;
    }
  }

  // Get animals by health status
  async findByHealthStatus(status: string): Promise<HewanType[]> {
    try {
      const result = await this.findBy("status_kesehatan", status);
      return Array.isArray(result) ? result : result ? [result] : [];
    } catch (error) {
      console.error("Error finding animals by health status:", error);
      return [];
    }
  }

  // Check if animal exists
  async exists(id: string): Promise<boolean> {
    try {
      const result = await this.getById(id);
      return result !== null;
    } catch (error) {
      console.error("Error checking animal existence:", error);
      return false;
    }
  }
}
