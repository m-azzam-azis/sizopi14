import { BaseModel } from "../model";
import { HewanType } from "../types";

export class Hewan extends BaseModel<HewanType> {
  constructor() {
    super("HEWAN");
  }

  // find all animals - use built-in findAll()
  async findAll(): Promise<HewanType[]> {
    return super.findAll();
  }

  // Get by ID - use built-in findBy()
  async getById(id: string): Promise<HewanType | null> {
    return this.findBy("id", id);
  }

  // Get all animals with their habitat information - use customQuery() for JOIN
  async findAllWithHabitat(): Promise<
    (HewanType & { habitat_nama?: string; habitat_status?: string })[]
  > {
    try {
      const query = `
        SELECT h.*, hab.nama as habitat_nama, hab.status as habitat_status
        FROM hewan h
        LEFT JOIN habitat hab ON h.nama_habitat = hab.nama
        ORDER BY h.nama
      `;

      return await this.customQuery(query);
    } catch (error) {
      console.error("Error fetching animals with habitat:", error);
      return [];
    }
  }

  // Find animals by habitat - use built-in findMany()
  async findByHabitat(namaHabitat: string): Promise<HewanType[]> {
    return this.findMany("nama_habitat", namaHabitat);
  }

  // Find animals by species - use built-in findMany()
  async findBySpecies(spesies: string): Promise<HewanType[]> {
    return this.findMany("spesies", spesies);
  }

  // Update animal by ID - use built-in update()
  async updateById(
    id: string,
    data: Partial<HewanType>
  ): Promise<HewanType | null> {
    return this.update("id", id, data);
  }

  // Delete animal by ID - use built-in delete()
  async deleteById(id: string): Promise<boolean> {
    const result = await this.delete("id", id);
    return result !== null;
  }

  // Get animals by health status - use built-in findMany()
  async findByHealthStatus(status: string): Promise<HewanType[]> {
    return this.findMany("status_kesehatan", status);
  }

  // Check if animal exists
  async exists(id: string): Promise<boolean> {
    const result = await this.getById(id);
    return result !== null;
  }
}
