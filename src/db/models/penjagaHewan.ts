import { BaseModel } from "../model";
import { PenjagaHewanType } from "../types";

export class PenjagaHewan extends BaseModel<PenjagaHewanType> {
  constructor() {
    super("PENJAGA_HEWAN");
  }

  async findByUsername(username: string) {
    return this.findBy("username_JH", username);
  }
}
