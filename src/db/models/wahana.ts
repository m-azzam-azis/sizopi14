import { BaseModel } from '../model';
import { WahanaType } from '../types';

export class Wahana extends BaseModel<WahanaType> {
    constructor() {
        super('WAHANA');
    }
}