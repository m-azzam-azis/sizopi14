import { BaseModel } from '../model';
import { FasilitasType } from '../types';

export class Fasilitas extends BaseModel<FasilitasType> {
    constructor() {
        super('FASILITAS');
    }
}