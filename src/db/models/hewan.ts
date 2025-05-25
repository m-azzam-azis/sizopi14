import { BaseModel } from '../model';
import { HewanType } from '../types';

export class Hewan extends BaseModel<HewanType> {
    constructor() {
        super('HEWAN');
    }
}