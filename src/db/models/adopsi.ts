import { BaseModel } from '../model';
import { AdopsiType } from '../types';

export class Adopsi extends BaseModel<AdopsiType> {
    constructor() {
        super('pekerja');
    }
}