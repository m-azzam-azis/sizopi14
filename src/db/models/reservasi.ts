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

  async getVisitorReservations(username: string) {
    const query = `
      SELECT 
        r.username_P, 
        r.nama_fasilitas,
        r.tanggal_kunjungan,
        r.jumlah_tiket,
        r.status,
        CASE 
          WHEN w.nama_wahana IS NOT NULL THEN 'Wahana'
          WHEN a.nama_atraksi IS NOT NULL THEN 'Atraksi'
          ELSE 'Lainnya'
        END AS jenis_reservasi,
        COALESCE(a.lokasi, '') AS lokasi,
        COALESCE(w.peraturan, '') AS peraturan,
        f.jadwal
      FROM RESERVASI r
      LEFT JOIN WAHANA w ON r.nama_fasilitas = w.nama_wahana
      LEFT JOIN ATRAKSI a ON r.nama_fasilitas = a.nama_atraksi
      JOIN FASILITAS f ON r.nama_fasilitas = f.nama
      WHERE r.username_P = $1
      ORDER BY r.tanggal_kunjungan DESC
    `;

    return await this.customQuery(query, [username]);
  }

  async getAvailableAttractions(date: Date = new Date()) {
    const formattedDate = date.toISOString().split("T")[0];

    const query = `
      SELECT 
        a.nama_atraksi,
        a.lokasi,
        f.jadwal,
        f.kapasitas_max,
        COALESCE(SUM(r.jumlah_tiket) FILTER (WHERE r.status = 'Aktif' AND r.tanggal_kunjungan::date = $1::date), 0) AS tiket_terjual,
        f.kapasitas_max - COALESCE(SUM(r.jumlah_tiket) FILTER (WHERE r.status = 'Aktif' AND r.tanggal_kunjungan::date = $1::date), 0) AS kapasitas_tersedia,
        'Atraksi' AS jenis_reservasi
      FROM ATRAKSI a
      JOIN FASILITAS f ON a.nama_atraksi = f.nama
      LEFT JOIN RESERVASI r ON a.nama_atraksi = r.nama_fasilitas 
      GROUP BY a.nama_atraksi, a.lokasi, f.jadwal, f.kapasitas_max
      ORDER BY a.nama_atraksi
    `;

    return await this.customQuery(query, [formattedDate]);
  }

  async getAvailableRides(date: Date = new Date()) {
    const formattedDate = date.toISOString().split("T")[0];

    const query = `
    SELECT 
      w.nama_wahana,
      w.peraturan,
      f.jadwal,
      f.kapasitas_max,
      COALESCE(SUM(r.jumlah_tiket) FILTER (WHERE r.status = 'Aktif' AND r.tanggal_kunjungan::date = $1::date), 0) AS tiket_terjual,
      f.kapasitas_max - COALESCE(SUM(r.jumlah_tiket) FILTER (WHERE r.status = 'Aktif' AND r.tanggal_kunjungan::date = $1::date), 0) AS kapasitas_tersedia,
      'Wahana' AS jenis_reservasi
    FROM WAHANA w
    JOIN FASILITAS f ON w.nama_wahana = f.nama
    LEFT JOIN RESERVASI r ON w.nama_wahana = r.nama_fasilitas 
    GROUP BY w.nama_wahana, w.peraturan, f.jadwal, f.kapasitas_max
    ORDER BY w.nama_wahana
  `;

    return await this.customQuery(query, [formattedDate]);
  }

  async getAttractionDetails(nama_atraksi: string, date: Date = new Date()) {
    const formattedDate = date.toISOString().split("T")[0];

    const query = `
    SELECT 
      a.nama_atraksi,
      a.lokasi,
      f.jadwal,
      f.kapasitas_max,
      COALESCE(SUM(r.jumlah_tiket) FILTER (WHERE r.status = 'Aktif' AND r.tanggal_kunjungan::date = $2::date), 0) AS tiket_terjual,
      f.kapasitas_max - COALESCE(SUM(r.jumlah_tiket) FILTER (WHERE r.status = 'Aktif' AND r.tanggal_kunjungan::date = $2::date), 0) AS kapasitas_tersedia
    FROM ATRAKSI a
    JOIN FASILITAS f ON a.nama_atraksi = f.nama
    LEFT JOIN RESERVASI r ON a.nama_atraksi = r.nama_fasilitas 
    WHERE a.nama_atraksi = $1
    GROUP BY a.nama_atraksi, a.lokasi, f.jadwal, f.kapasitas_max
  `;

    const results = await this.customQuery(query, [
      nama_atraksi,
      formattedDate,
    ]);
    return results.length > 0 ? results[0] : null;
  }

  async getRideDetails(nama_wahana: string, date: Date = new Date()) {
    const formattedDate = date.toISOString().split("T")[0];

    const query = `
    SELECT 
      w.nama_wahana,
      w.peraturan,
      f.jadwal,
      f.kapasitas_max,
      COALESCE(SUM(r.jumlah_tiket) FILTER (WHERE r.status = 'Aktif' AND r.tanggal_kunjungan::date = $2::date), 0) AS tiket_terjual,
      f.kapasitas_max - COALESCE(SUM(r.jumlah_tiket) FILTER (WHERE r.status = 'Aktif' AND r.tanggal_kunjungan::date = $2::date), 0) AS kapasitas_tersedia
    FROM WAHANA w
    JOIN FASILITAS f ON w.nama_wahana = f.nama
    LEFT JOIN RESERVASI r ON w.nama_wahana = r.nama_fasilitas 
    WHERE w.nama_wahana = $1
    GROUP BY w.nama_wahana, w.peraturan, f.jadwal, f.kapasitas_max
  `;

    const results = await this.customQuery(query, [nama_wahana, formattedDate]);
    return results.length > 0 ? results[0] : null;
  }

  async createReservation(data: {
    username_P: string;
    nama_fasilitas: string;
    tanggal_kunjungan: Date;
    jumlah_tiket: number;
  }) {
    const query = `
      INSERT INTO RESERVASI (username_P, nama_fasilitas, tanggal_kunjungan, jumlah_tiket, status)
      VALUES ($1, $2, $3, $4, 'Aktif')
      RETURNING *
    `;

    const values = [
      data.username_P,
      data.nama_fasilitas,
      data.tanggal_kunjungan,
      data.jumlah_tiket,
    ];

    const result = await this.customQuery(query, values);
    return result[0];
  }

  async updateReservation(data: {
    username_P: string;
    nama_fasilitas: string;
    tanggal_kunjungan: Date;
    jumlah_tiket: number;
    new_tanggal_kunjungan?: Date;
    new_jumlah_tiket?: number;
    new_status?: string;
  }) {
    try {
      const updateFields = [];
      const values = [
        data.username_P,
        data.nama_fasilitas,
        data.tanggal_kunjungan,
      ];
      let paramIndex = 4;

      if (data.new_tanggal_kunjungan) {
        updateFields.push(`tanggal_kunjungan = $${paramIndex}`);
        values.push(data.new_tanggal_kunjungan);
        paramIndex++;
      }

      if (data.new_jumlah_tiket) {
        updateFields.push(`jumlah_tiket = $${paramIndex}`);
        values.push(data.new_jumlah_tiket.toString());
        paramIndex++;
      }

      if (data.new_status) {
        updateFields.push(`status = $${paramIndex}`);
        values.push(data.new_status);
        paramIndex++;
      }

      if (updateFields.length === 0) {
        return null;
      }

      const query = `
        UPDATE RESERVASI
        SET ${updateFields.join(", ")}
        WHERE username_P = $1 
          AND nama_fasilitas = $2 
          AND tanggal_kunjungan = $3
        RETURNING *
      `;

      const result = await this.customQuery(query, values);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error("Database error in updateReservation:", error);
      throw error;
    }
  }

  async cancelReservation(
    username_P: string,
    nama_fasilitas: string,
    tanggal_kunjungan: Date
  ) {
    const query = `
      UPDATE RESERVASI
      SET status = 'Batal'
      WHERE username_P = $1 
        AND nama_fasilitas = $2 
        AND tanggal_kunjungan = $3
      RETURNING *
    `;

    const result = await this.customQuery(query, [
      username_P,
      nama_fasilitas,
      tanggal_kunjungan,
    ]);
    return result.length > 0 ? result[0] : null;
  }

  async checkCapacity(
    nama_fasilitas: string,
    tanggal_kunjungan: Date,
    jumlah_tiket: number
  ) {
    const formattedDate = tanggal_kunjungan.toISOString().split("T")[0];

    const query = `
      SELECT 
        f.kapasitas_max,
        COALESCE(SUM(r.jumlah_tiket) FILTER (WHERE r.status = 'Aktif' AND r.tanggal_kunjungan::date = $2::date), 0) AS tiket_terjual,
        f.kapasitas_max - COALESCE(SUM(r.jumlah_tiket) FILTER (WHERE r.status = 'Aktif' AND r.tanggal_kunjungan::date = $2::date), 0) AS kapasitas_tersedia
      FROM FASILITAS f
      LEFT JOIN RESERVASI r ON f.nama = r.nama_fasilitas 
      WHERE f.nama = $1
      GROUP BY f.kapasitas_max
    `;

    const result = await this.customQuery(query, [
      nama_fasilitas,
      formattedDate,
    ]);

    if (result.length === 0) {
      return { enough: false, message: "Fasilitas tidak ditemukan" };
    }

    const { kapasitas_tersedia } = result[0];

    return {
      enough: kapasitas_tersedia >= jumlah_tiket,
      message:
        kapasitas_tersedia >= jumlah_tiket
          ? "Kapasitas mencukupi"
          : `Kapasitas tidak mencukupi. Hanya tersisa ${kapasitas_tersedia} tiket.`,
      kapasitas_tersedia: parseInt(kapasitas_tersedia),
    };
  }
}
