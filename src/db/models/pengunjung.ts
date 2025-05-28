import { BaseModel } from "../model";
import { PengunjungType } from "../types";

export class Pengunjung extends BaseModel<PengunjungType> {
  constructor() {
    super("PENGUNJUNG");
  }
  async findByUsername(username: string) {
    return this.findBy("username_P", username);
  }

  async updateByUsername(username: string, data: Partial<PengunjungType>) {
    return this.update("username_P", username, data);
  }
}
