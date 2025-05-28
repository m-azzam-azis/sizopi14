import { BaseModel } from "../model";
import { PelatihHewanType } from "../types";

export class PelatihHewan extends BaseModel<PelatihHewanType> {
  constructor() {
    super("PELATIH_HEWAN");
  }

  async findByUsername(username: string) {
    return this.findBy("username_LH", username);
  }

  async getAllWithUserDetails() {
    const query = `
      SELECT ph.*, p.nama_depan, p.nama_belakang, p.username
      FROM PELATIH_HEWAN ph
      JOIN PENGGUNA p ON ph.username_lh = p.username
    `;

    return this.customQuery(query);
  }

  async updateByUsername(username: string, data: Partial<PelatihHewanType>) {
    return this.update("username_LH", username, data);
  }
}
