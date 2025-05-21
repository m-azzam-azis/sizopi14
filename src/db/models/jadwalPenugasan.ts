import { BaseModel } from '../model';
import { JadwalPenugasanType } from '../types';

export class JadwalPenugasan extends BaseModel<JadwalPenugasanType> {
    constructor() {
        super('JADWAL_PENUGASAN');
    }
}