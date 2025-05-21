import { BaseModel } from '../model';
import { HabitatType } from '../types';

export class Habitat extends BaseModel<HabitatType> {
    constructor() {
        super('HABITAT');
    }
}