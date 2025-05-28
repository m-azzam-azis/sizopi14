import { BaseModel } from "../model";
import { StafAdminType } from "../types";

export class StafAdmin extends BaseModel<StafAdminType> {
  constructor() {
    super("STAF_ADMIN");
  }

  async findByUsername(username: string) {
    return this.findBy("username_sa", username);
  }

  async updateByUsername(username: string, data: Partial<StafAdminType>) {
    return this.update("username_sa", username, data);
  }
}
