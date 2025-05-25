import { BaseModel } from '../model';
import { AdopterType } from '../types';

export class Adopter extends BaseModel<AdopterType> {
    constructor() {
        super('ADOPTER');
    }
}