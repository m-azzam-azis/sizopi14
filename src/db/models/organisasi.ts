import { BaseModel } from '../model';
import { OrganisasiType } from '../types';

export class Organisasi extends BaseModel<OrganisasiType> {
    constructor() {
        super('ORGANISASI');
    }
}