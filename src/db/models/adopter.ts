import { BaseModel } from '../model';
import { AdopterType } from '../types';
import pool from '../db';

export class Adopter extends BaseModel<AdopterType> {
    constructor() {
        super('ADOPTER');
    }

    async getTopAdopters(limit: number = 5) {
        const query = `
            SELECT 
                ad.id_adopter,
                ad.username_adopter,
                ad.total_kontribusi,
                CASE 
                    WHEN i.nama IS NOT NULL THEN i.nama
                    WHEN o.nama_organisasi IS NOT NULL THEN o.nama_organisasi
                    ELSE 'Unknown'
                END as name
            FROM adopter ad
            LEFT JOIN individu i ON ad.id_adopter = i.id_adopter
            LEFT JOIN organisasi o ON ad.id_adopter = o.id_adopter
            ORDER BY ad.total_kontribusi DESC
            LIMIT $1
        `;

        const result = await pool.query(query, [limit]);
        return result.rows;
    }

    async getAdopterWithDetails(id: string) {
        const query = `
            SELECT 
                ad.id_adopter, 
                ad.username_adopter, 
                ad.total_kontribusi,
                p.email,
                p.no_telepon,
                CASE 
                    WHEN i.nama IS NOT NULL THEN i.nama
                    WHEN o.nama_organisasi IS NOT NULL THEN o.nama_organisasi
                    ELSE 'Unknown'
                END as name,
                CASE 
                    WHEN i.id_adopter IS NOT NULL THEN 'individu'
                    WHEN o.id_adopter IS NOT NULL THEN 'organisasi'
                    ELSE NULL
                END as type,
                pg.alamat as address -- Menggunakan alamat dari tabel PENGUNJUNG
            FROM adopter ad
            JOIN pengguna p ON ad.username_adopter = p.username
            JOIN pengunjung pg ON p.username = pg.username_P -- JOIN dengan tabel PENGUNJUNG
            LEFT JOIN individu i ON ad.id_adopter = i.id_adopter
            LEFT JOIN organisasi o ON ad.id_adopter = o.id_adopter
            WHERE ad.id_adopter = $1
        `;
    
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    async getAdopterAdoptions(id: string) {
        const query = `
            SELECT 
                a.id_hewan,
                h.nama as nama_hewan,
                h.spesies,
                h.status_kesehatan,
                h.url_foto,
                a.status_pembayaran,
                a.kontribusi_finansial,
                a.tgl_mulai_adopsi,
                a.tgl_berhenti_adopsi
            FROM adopsi a
            JOIN hewan h ON a.id_hewan = h.id
            WHERE a.id_adopter = $1
            ORDER BY a.tgl_mulai_adopsi DESC
        `;

        const result = await pool.query(query, [id]);
        return result.rows;
    }
}