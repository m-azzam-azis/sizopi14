import { BaseModel } from '../model';
import { IndividuType } from '../types';

export class Individu extends BaseModel<IndividuType> {
    constructor() {
        super('INDIVIDU');
    }
}