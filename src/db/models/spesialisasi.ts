import { BaseModel } from "../model";
import { SpesialisasiType } from "../types";

export class Spesialisasi extends BaseModel<SpesialisasiType> {
  constructor() {
    super("SPESIALISASI");
  }

  async findByUsernameSH(username_SH: string) {
    return this.findBy("username_SH", username_SH);
  }

  async findAllByUsernameSH(username_SH: string): Promise<SpesialisasiType[]> {
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE username_SH = $1
    `;
    const result = await this.customQuery(query, [username_SH]);
    return result || [];
  }

  async getAllUniqueSpecializations() {
    const query =
      "SELECT DISTINCT nama_spesialisasi FROM SPESIALISASI ORDER BY nama_spesialisasi";
    const rows = await this.customQuery(query);
    return rows.map((row) => row.nama_spesialisasi);
  }
}
