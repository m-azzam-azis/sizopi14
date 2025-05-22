import { BaseModel } from "../model";
import { SpesialisasiType } from "../types";

export class Spesialisasi extends BaseModel<SpesialisasiType> {
  constructor() {
    super("SPESIALISASI");
  }

  async findByUsernameSH(username_SH: string) {
    return this.findBy("username_SH", username_SH);
  }
}
