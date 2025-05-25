import { BaseModel } from '../model';
import { CatatanMedisType } from '../types';

export class CatatanMedis extends BaseModel<CatatanMedisType> {
    constructor() {
        super('CATATAN_MEDIS');
    }
}