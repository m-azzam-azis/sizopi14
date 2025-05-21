import { BaseModel } from '../model';
import { PakanType } from '../types';

export class Pakan extends BaseModel<PakanType> {
    constructor() {
        super('PAKAN');
    }
}