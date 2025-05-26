import { BaseModel } from '../model';
import { AdopsiType } from '../types';

export class Adopsi extends BaseModel<AdopsiType> {
    constructor() {
        super('ADOPSI');
    }

    async getAdopsiByHewanId(idHewan: string) {
        return this.findBy('id_hewan', idHewan);
    }

    async getAllAdopsi() {
        return this.findAll();
    }
}