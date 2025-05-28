import { BaseModel } from '../model';
import { CatatanMedisType } from '../types';

export class CatatanMedis extends BaseModel<CatatanMedisType> {
    constructor() {
        super('CATATAN_MEDIS');
    }

    async findByIdHewan(idHewan: string) {
        return this.findBy('id_hewan', idHewan);
    }

    async findAllByNamaDokter(namaDokter: string): Promise<CatatanMedisType[]> {
        const query = `
            SELECT * FROM ${this.tableName}
            WHERE username_dh = $1
        `;
        const result = await this.customQuery(query, [namaDokter]);
        return result || [];
    }
}