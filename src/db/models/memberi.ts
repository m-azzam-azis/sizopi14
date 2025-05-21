import { BaseModel } from '../model';
import { MemberiType } from '../types';

export class Memberi extends BaseModel<MemberiType> {
    constructor() {
        super('MEMBERI');
    }
}