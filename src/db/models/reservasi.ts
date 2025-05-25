import { BaseModel } from '../model';
import { ReservasiType } from '../types';

export class Reservasi extends BaseModel<ReservasiType> {
    constructor() {
        super('RESERVASI');
    }
}