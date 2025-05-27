import { BaseModel } from "../model";
import { ReservasiType } from "../types";

export class Reservasi extends BaseModel<ReservasiType> {
  constructor() {
    super("RESERVASI");
  }

  async getAllAttractionReservationsForAdmin() {
    const query = `
      SELECT 
        r.username_P, 
        r.nama_fasilitas AS nama_atraksi, 
        r.tanggal_kunjungan, 
        r.jumlah_tiket, 
        a.lokasi, 
        CASE 
          WHEN r.status = 'Aktif' THEN 'Terjadwal'
          WHEN r.status = 'Batal' THEN 'Dibatalkan'
          ELSE r.status
        END AS status
      FROM RESERVASI r
      JOIN ATRAKSI a ON r.nama_fasilitas = a.nama_atraksi
      ORDER BY r.tanggal_kunjungan DESC
    `;

    return await this.customQuery(query);
  }

  async getAllRideReservationsForAdmin() {
    const query = `
      SELECT 
        r.username_P, 
        r.nama_fasilitas AS nama_wahana, 
        r.tanggal_kunjungan, 
        r.jumlah_tiket, 
        w.peraturan, 
        CASE 
          WHEN r.status = 'Aktif' THEN 'Terjadwal'
          WHEN r.status = 'Batal' THEN 'Dibatalkan'
          ELSE r.status
        END AS status
      FROM RESERVASI r
      JOIN WAHANA w ON r.nama_fasilitas = w.nama_wahana
      ORDER BY r.tanggal_kunjungan DESC
    `;

    return await this.customQuery(query);
  }
}
