import { BaseModel } from '../model';
import { HewanType } from '../types';

export class Hewan extends BaseModel<HewanType> {
    constructor() {
        super('HEWAN');
    }

    async getById(id: string): Promise<HewanType | null> {
        const result = await this.findBy('id', id);
        return Array.isArray(result) ? result[0] : result;
    }
}