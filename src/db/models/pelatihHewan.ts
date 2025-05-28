import { BaseModel } from "../model";
import { PelatihHewanType } from "../types";

export class PelatihHewan extends BaseModel<PelatihHewanType> {
  constructor() {
    super("PELATIH_HEWAN");
  }

  async findByUsername(username: string) {
    return this.findBy("username_LH", username);
  }

  async updateByUsername(username: string, data: Partial<PelatihHewanType>) {
    return this.update("username_LH", username, data);
  }
}
