import { BaseModel } from '../model';
import { SpesialisasiType } from '../types';

export class Spesialisasi extends BaseModel<SpesialisasiType> {
    constructor() {
        super('SPESIALISASI');
    }
}