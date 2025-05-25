import { BaseModel } from '../model';
import { PakanType } from '../types';
import pool from '../db';

export class Pakan extends BaseModel<PakanType> {
    constructor() {
        super('PAKAN');
    }

    async deleteMultiple(keys: (keyof PakanType)[], values: any[]): Promise<PakanType | null> {
        if (!Array.isArray(keys) || !Array.isArray(values) || keys.length !== values.length) {
            throw new Error('deleteMultiple: keys and values must be arrays of the same length');
        }
        const whereClause = keys.map((k, i) => `${String(k)} = $${i + 1}`).join(' AND ');
        const query = `DELETE FROM ${this.tableName} WHERE ${whereClause} RETURNING *`;
        const result = await pool.query(query, values);
        return result.rows[0] ? (result.rows[0] as PakanType) : null;
    }

    async updateMultiple(keys: (keyof PakanType)[], values: any[], data: Partial<PakanType>): Promise<PakanType | null> {
        if (!Array.isArray(keys) || !Array.isArray(values) || keys.length !== values.length) {
            throw new Error('updateMultiple: keys and values must be arrays of the same length');
        }
        const updates = Object.keys(data)
            .map((key, idx) => `${key} = $${idx + 1}`)
            .join(', ');
        const whereClause = keys.map((k, i) => `${String(k)} = $${i + 1 + Object.keys(data).length}`).join(' AND ');
        const query = `UPDATE ${this.tableName} SET ${updates} WHERE ${whereClause} RETURNING *`;
        const result = await pool.query(query, [...Object.values(data), ...values]);
        return result.rows[0] ? (result.rows[0] as PakanType) : null;
    }

    /**
     * Get all feeding schedules for a specific animal, joined with penjaga hewan name
     * Returns: [{...pakan fields..., nama_penjaga: string}]
     */
    async findWithCaretakerNameByAnimalId(id_hewan: string) {
        const query = `
            SELECT p.*, ph.nama as nama_penjaga
            FROM PAKAN p
            JOIN MEMBERI m ON p.id_hewan = m.id_hewan AND p.jadwal = m.jadwal
            JOIN PENJAGA_HEWAN ph ON m.username_jh = ph.username_jh
            WHERE p.id_hewan = $1
            ORDER BY p.jadwal DESC
        `;
        const result = await pool.query(query, [id_hewan]);
        return result.rows;
    }

    async findWhere(key: keyof PakanType, value: any): Promise<PakanType[]> {
        const query = `SELECT * FROM ${this.tableName} WHERE ${String(key)} = $1`;
        return pool.query(query, [value]).then(result => result.rows as PakanType[]);
    }

}