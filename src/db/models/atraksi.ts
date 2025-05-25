import { BaseModel } from '../model';
import { AtraksiType } from '../types';

export class Atraksi extends BaseModel<AtraksiType> {
    constructor() {
        super('ATRAKSI');
    }
}