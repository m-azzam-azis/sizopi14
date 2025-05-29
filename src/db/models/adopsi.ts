import { BaseModel } from '../model';
import { AdopsiType } from '../types';
import pool from '../db';

export class Adopsi extends BaseModel<AdopsiType> {
    constructor() {
        super('ADOPSI'); // Periksa apakah ini menggunakan huruf kapital di database
    }

    async getAdopsiByHewanId(idHewan: string) {
        return this.findBy('id_hewan', idHewan);
    }

    async getAllAdopsi() {
        return this.findAll();
    }
    
    // Metode createAdopsi yang disederhanakan
    async createAdopsi(data: {
        id_adopter: string;
        id_hewan: string;
        kontribusi_finansial: number;
        status_pembayaran: string;
        tgl_mulai_adopsi: Date;
        tgl_berhenti_adopsi: Date;
    }) {
        try {
            // Buat query sederhana tanpa kolom created_at/updated_at
            const query = `
                INSERT INTO adopsi (
                    id_adopter, 
                    id_hewan,
                    kontribusi_finansial,
                    status_pembayaran,
                    tgl_mulai_adopsi,
                    tgl_berhenti_adopsi
                ) VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *
            `;
            
            const values = [
                data.id_adopter,
                data.id_hewan,
                data.kontribusi_finansial,
                data.status_pembayaran,
                data.tgl_mulai_adopsi,
                data.tgl_berhenti_adopsi
            ];
            
            // Eksekusi query
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error("Error creating adoption:", error);
            throw error;
        }
    }
}