import { BaseModel } from '../model';
import { JadwalPemeriksaanKesehatanType } from '../types';

export class JadwalPemeriksaanKesehatan extends BaseModel<JadwalPemeriksaanKesehatanType> {
    constructor() {
        super('JADWAL_PEMERIKSAAN_KESEHATAN');
    }
}