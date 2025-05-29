import { BaseModel } from '../model';
import { CatatanMedisType } from '../types';
import pool from '../db';

export class CatatanMedis extends BaseModel<CatatanMedisType> {
    constructor() {
        super('CATATAN_MEDIS');
    }

    async findByIdHewan(idHewan: string) {
        return this.findBy('id_hewan', idHewan);
    }
    
    // Override create method to capture PostgreSQL notices
    async createWithNotices(data: CatatanMedisType): Promise<{createdRecord: CatatanMedisType, pgNotices: string[]}> {
        try {
            // Use client to capture notices
            const client = await pool.connect();
            const pgNotices: string[] = [];
            
            // Set up notice listener
            client.on('notice', (notice) => {
                console.log("PostgreSQL NOTICE:", notice.message);
            });
            
            try {
                // Start transaction
                await client.query('BEGIN');
                
                const fields = Object.keys(data).join(', ');
                const placeholders = Object.keys(data).map((_, i) => `$${i + 1}`).join(', ');
                const values = Object.values(data);
                
                const query = `
                    INSERT INTO ${this.tableName} (${fields})
                    VALUES (${placeholders})
                    RETURNING *;
                `;
                
                const result = await client.query(query, values);
                await client.query('COMMIT');
                
                return {
                    createdRecord: result.rows[0],
                    pgNotices
                };
            } catch (error) {
                await client.query('ROLLBACK');
                throw error;
            } finally {
                client.release();
            }
        } catch (error) {
            console.error("Failed during creation with notices:", error);
            throw error;
        }
    }    async findAllByNamaDokter(namaDokter: string): Promise<CatatanMedisType[]> {
        const query = `
            SELECT * FROM ${this.tableName}
            WHERE username_dh = $1
        `;
        const result = await this.customQuery(query, [namaDokter]);
        return result || [];
    }
    
    // Update method with notice capture for status changes that trigger notices
    async updateWithNotices(column: string, value: any, data: any): Promise<{ updatedRecord: CatatanMedisType, pgNotices: string[] }> {
        try {
            // Use client to capture notices
            const client = await pool.connect();
            const pgNotices: string[] = [];
            
            // Set up notice listener
            client.on('notice', (msg: any) => {
                console.log("PostgreSQL NOTICE:", msg.message);
                pgNotices.push(msg.message);
            });
            
            try {
                // Start transaction
                await client.query('BEGIN');
                
                // Build the update query
                const setClause = Object.keys(data)
                    .filter(key => key !== column) // Exclude the key we're using as condition
                    .map((key, idx) => `${key} = $${idx + 2}`)
                    .join(', ');
                    
                const values = [value, ...Object.values(data).filter((_, idx) => Object.keys(data)[idx] !== column)];
                
                const query = `
                    UPDATE ${this.tableName} 
                    SET ${setClause} 
                    WHERE ${column} = $1
                    RETURNING *;
                `;
                
                const result = await client.query(query, values);
                await client.query('COMMIT');
                
                return {
                    updatedRecord: result.rows[0],
                    pgNotices
                };
            } catch (error) {
                await client.query('ROLLBACK');
                throw error;
            } finally {
                client.release();
            }
        } catch (error) {
            console.error("Failed during update with notices:", error);
            throw error;
        }
    }
}