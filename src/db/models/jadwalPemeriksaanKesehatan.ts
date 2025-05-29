import { BaseModel } from '../model';
import { JadwalPemeriksaanKesehatanType } from '../types';
import pool from "../db";

export class JadwalPemeriksaanKesehatan extends BaseModel<JadwalPemeriksaanKesehatanType> {
    constructor() {
        super('JADWAL_PEMERIKSAAN_KESEHATAN');
    }    // Method to handle composite primary key updates
    async updateCompositeKey(
        id_hewan: string, 
        old_date: string, 
        data: Partial<JadwalPemeriksaanKesehatanType>
    ): Promise<JadwalPemeriksaanKesehatanType | null> {
        try {
            console.log(`Updating jadwal with id_hewan=${id_hewan}, old_date=${old_date}`);
            console.log(`New data:`, data);
            
            const updates = Object.keys(data)
                .map((key, idx) => `${key} = $${idx + 3}`)
                .join(", ");
            const values = [id_hewan, old_date, ...Object.values(data)];

            // Use ::text for string comparison of dates
            const query = `
                UPDATE ${this.tableName}
                SET ${updates}
                WHERE id_hewan = $1 AND tgl_pemeriksaan_selanjutnya::text = $2
                RETURNING *;
            `;
            const result = await pool.query(query, values);
            console.log(`Update result: ${result.rowCount} rows affected`);
            return result.rows[0] ? (result.rows[0] as JadwalPemeriksaanKesehatanType) : null;
        } catch (error) {
            console.error("Failed to update with composite key:", error);
            throw error;
        }
    }
      // Method to delete by composite key
    async deleteCompositeKey(
        id_hewan: string, 
        date: string
    ): Promise<JadwalPemeriksaanKesehatanType | null> {
        try {
            console.log(`Deleting jadwal with id_hewan=${id_hewan}, date=${date}`);
            
            // Use ::text to ensure the date format is compared as string
            // This is critical when the frontend sends YYYY-MM-DD format
            const query = `
                DELETE FROM ${this.tableName}
                WHERE id_hewan = $1 AND tgl_pemeriksaan_selanjutnya::text = $2
                RETURNING *;
            `;
            console.log(`Executing query with parameters: id_hewan=${id_hewan}, date=${date}`);
            const result = await pool.query(query, [id_hewan, date]);
            
            console.log(`Delete result: ${result.rowCount} rows affected`);
            return result.rows[0] ? (result.rows[0] as JadwalPemeriksaanKesehatanType) : null;
        } catch (error) {
            console.error("Failed to delete with composite key:", error);
            throw error;
        }
    }
      // Custom query implementation for a single result
    async query(query: string, values: any[] = []): Promise<any> {
        try {
            const result = await pool.query(query, values);
            return result.rows[0] || null;
        } catch (error) {
            console.error("Query error:", error);
            throw error;
        }
    }
    
    // Find by composite key
    async findByCompositeKey(id_hewan: string, date: string): Promise<JadwalPemeriksaanKesehatanType | null> {
        try {
            console.log(`Searching jadwal with id_hewan=${id_hewan}, date=${date}`);
            
            const query = `
                SELECT * FROM ${this.tableName}
                WHERE id_hewan = $1 AND tgl_pemeriksaan_selanjutnya::text = $2;
            `;
            
            const result = await pool.query(query, [id_hewan, date]);
            return result.rows[0] ? (result.rows[0] as JadwalPemeriksaanKesehatanType) : null;
        } catch (error) {
            console.error("Failed to find with composite key:", error);
            throw error;
        }
    }
      // Override create method to handle composite key constraint checks and capture PostgreSQL notices
    async createWithCompositeCheck(data: JadwalPemeriksaanKesehatanType): Promise<{createdRecord: JadwalPemeriksaanKesehatanType, pgNotices: string[]}> {
        try {
            // Check if record with this composite key exists
            const existing = await this.findByCompositeKey(
                data.id_hewan, 
                data.tgl_pemeriksaan_selanjutnya
            );
            
            if (existing) {
                throw new Error(`Record with id_hewan=${data.id_hewan} and date=${data.tgl_pemeriksaan_selanjutnya} already exists`);
            }
            
            // If not exists, create using client to capture notices
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
            console.error("Failed during composite key check or creation:", error);
            throw error;
        }
    }
}