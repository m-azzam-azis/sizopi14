import { BaseModel } from '../model';
import { PenjagaHewanType } from '../types';

export class PenjagaHewan extends BaseModel<PenjagaHewanType> {
    constructor() {
        super('PENJAGA_HEWAN');
    }
}