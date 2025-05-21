import { BaseModel } from '../model';
import { PelatihHewanType } from '../types';

export class PelatihHewan extends BaseModel<PelatihHewanType> {
    constructor() {
        super('PELATIH_HEWAN');
    }
}