import { BaseModel } from '../model';
import { BerpartisipasiType } from '../types';

export class Berpartisipasi extends BaseModel<BerpartisipasiType> {
    constructor() {
        super('BERPARTISIPASI');
    }
}