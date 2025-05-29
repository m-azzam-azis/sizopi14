import { BaseModel } from "../model";
import { WahanaType } from "../types";

interface WahanaWithDetailsType extends WahanaType {
  kapasitas_max: number;
  jadwal: Date;
}

export class Wahana extends BaseModel<WahanaType> {
  constructor() {
    super("WAHANA");
  }

  async getAllWahanaWithDetails(): Promise<WahanaWithDetailsType[]> {
    const query = `
      SELECT 
        w.nama_wahana,
        w.peraturan,
        f.kapasitas_max,
        f.jadwal
      FROM
        ${this.tableName} w
      JOIN 
        FASILITAS f ON w.nama_wahana = f.nama
      ORDER BY 
        w.nama_wahana ASC
    `;

    const result = await this.customQuery(query);
    return result || [];
  }
}
