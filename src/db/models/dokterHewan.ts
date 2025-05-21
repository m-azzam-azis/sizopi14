import { BaseModel } from '../model';
import { DokterHewanType } from '../types';

export class DokterHewan extends BaseModel<DokterHewanType> {
    constructor() {
        super('DOKTER_HEWAN');
    }
}