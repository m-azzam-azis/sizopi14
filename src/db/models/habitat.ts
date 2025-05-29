import { BaseModel } from "../model";
import { HabitatType } from "../types";

export class Habitat extends BaseModel<HabitatType> {
  constructor() {
    super("HABITAT");
  }

  // find all habitat - use built-in findAll()
  async findAll(): Promise<HabitatType[]> {
    return super.findAll();
  }

  // Find habitat by name (primary key) - use built-in findBy()
  async findByName(nama: string): Promise<HabitatType | null> {
    return this.findBy("nama", nama);
  }

  // Update habitat by name - use built-in update()
  async updateByName(
    nama: string,
    data: Partial<HabitatType>
  ): Promise<HabitatType | null> {
    return this.update("nama", nama, data);
  }

  // Delete habitat by name - use built-in delete()
  async deleteByName(nama: string): Promise<boolean> {
    const result = await this.delete("nama", nama);
    return result !== null;
  }

  // Get habitats with animal count - use customQuery() for GROUP BY
  async findAllWithAnimalCount(): Promise<
    (HabitatType & { jumlah_hewan?: number })[]
  > {
    try {
      const query = `
        SELECT h.*, COUNT(he.id) as jumlah_hewan
        FROM habitat h
        LEFT JOIN hewan he ON h.nama = he.nama_habitat
        GROUP BY h.nama, h.luas_area, h.kapasitas, h.status
        ORDER BY h.nama
      `;

      const result = await this.customQuery(query);

      return result.map((row: HabitatType & { jumlah_hewan: string }) => ({
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
    const result = await this.findByName(nama);
    return result !== null;
  }
}
