import { BaseModel } from "../model";
import { DokterHewanType } from "../types";

export class DokterHewan extends BaseModel<DokterHewanType> {
  constructor() {
    super("DOKTER_HEWAN");
  }

  async findByUsername(username: string) {
    return this.findBy("username_DH", username);
  }

  async updateByUsername(username: string, data: Partial<DokterHewanType>) {
    return this.update("username_DH", username, data);
  }
}
