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
      /**
     * Delete a pakan record by its primary key (id_hewan and jadwal)
     * @param id_hewan The animal ID
     * @param jadwal The feeding schedule timestamp
     * @returns The deleted record or null if not found
     */    async deleteByPrimaryKey(id_hewan: string, jadwal: string): Promise<PakanType | null> {
        try {
            console.log("deleteByPrimaryKey called with:", { id_hewan, jadwal });
            
            // Handle different jadwal formats
            let jadwalDb = jadwal;
            
            // If jadwal is just date (YYYY-MM-DD), we need to match against database timestamps
            if (jadwal.length === 10 && jadwal.match(/^\d{4}-\d{2}-\d{2}$/)) {
                // Use DATE() function to match date part only
                const query = `DELETE FROM ${this.tableName} WHERE id_hewan = $1 AND DATE(jadwal) = $2 RETURNING *`;
                console.log("Using date-only query:", query, [id_hewan, jadwal]);
                const result = await pool.query(query, [id_hewan, jadwal]);
                return result.rows[0] ? (result.rows[0] as PakanType) : null;
            }
            
            // Handle full timestamp formats
            if (jadwalDb.length === 19 && jadwalDb.indexOf('T') === 10) {
                jadwalDb = jadwalDb.replace('T', ' ');
            }
            
            const query = `DELETE FROM ${this.tableName} WHERE id_hewan = $1 AND jadwal = $2::timestamp(0) RETURNING *`;
            console.log("Using timestamp query:", query, [id_hewan, jadwalDb]);
            const result = await pool.query(query, [id_hewan, jadwalDb]);   
            return result.rows[0] ? (result.rows[0] as PakanType) : null;
        } catch (error) {
            console.error("Error in deleteByPrimaryKey:", error);
            throw error;
        }
    }    async updateMultiple(keys: (keyof PakanType)[], values: any[], data: Partial<PakanType>): Promise<PakanType | null> {
        if (!Array.isArray(keys) || !Array.isArray(values) || keys.length !== values.length) {
            throw new Error('updateMultiple: keys and values must be arrays of the same length');
        }
        
        console.log("updateMultiple called with:", { keys, values, data });
        
        // Handle jadwal formatting for WHERE clause
        const processedValues = values.map((value, index) => {
            if (keys[index] === 'jadwal' && typeof value === 'string') {
                // If jadwal is date-only format, we'll use DATE() function in query
                if (value.length === 10 && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
                    return value; // Keep as is, will be handled in query
                }
                // Handle full timestamp formats
                if (value.length === 19 && value.indexOf('T') === 10) {
                    return value.replace('T', ' ');
                }
            }
            return value;
        });
        
        const updates = Object.keys(data)
            .map((key, idx) => `${key} = $${idx + 1}`)
            .join(', ');
            
        // Check if jadwal is in the WHERE clause and is date-only
        const jadwalIndex = keys.indexOf('jadwal');
        let whereClause;
        
        if (jadwalIndex !== -1 && values[jadwalIndex].length === 10) {
            // Use DATE() function for date-only comparison
            whereClause = keys.map((k, i) => {
                if (k === 'jadwal') {
                    return `DATE(${String(k)}) = $${i + 1 + Object.keys(data).length}`;
                }
                return `${String(k)} = $${i + 1 + Object.keys(data).length}`;
            }).join(' AND ');
        } else {
            whereClause = keys.map((k, i) => `${String(k)} = $${i + 1 + Object.keys(data).length}`).join(' AND ');
        }
        
        const query = `UPDATE ${this.tableName} SET ${updates} WHERE ${whereClause} RETURNING *`;
        console.log("Update query:", query, [...Object.values(data), ...processedValues]);
        
        const result = await pool.query(query, [...Object.values(data), ...processedValues]);
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