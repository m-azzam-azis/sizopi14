import { BaseModel } from '../model';
import { PengunjungType } from '../types';

export class Pengunjung extends BaseModel<PengunjungType> {
    constructor() {
        super('PENGUNJUNG');
    }
}