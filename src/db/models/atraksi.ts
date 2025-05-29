import { BaseModel } from "../model";
import { AtraksiType } from "../types";

interface HewanInAtraksi {
  id: string;
  nama: string;
  spesies: string;
}

interface PelatihAtraksi {
  username_lh: string;
  nama_depan: string;
  nama_belakang: string;
}

interface AtraksiWithDetailsType extends AtraksiType {
  kapasitas_max: number;
  jadwal: Date;
  hewan_terlibat: HewanInAtraksi[];
  pelatih: PelatihAtraksi | null;
}

export class Atraksi extends BaseModel<AtraksiType> {
  constructor() {
    super("ATRAKSI");
  }

  async getAllAtraksi(): Promise<AtraksiType[]> {
    const query = `SELECT * FROM ${this.tableName}`;
    const result = await this.customQuery(query);
    return result || [];
  }

  async getAllAtraksiWithFasilitas(): Promise<
    (AtraksiType & { kapasitas_max: number; jadwal: Date })[]
  > {
    const query = `
      SELECT a.*, f.kapasitas_max, f.jadwal 
      FROM ${this.tableName} a
      JOIN FASILITAS f ON a.nama = f.nama
    `;
    const result = await this.customQuery(query);
    return result || [];
  }

  async getDetailedAtraksiData(): Promise<AtraksiWithDetailsType[]> {
    const query = `
      SELECT 
        a.nama_atraksi,
        a.lokasi,
        f.kapasitas_max,
        f.jadwal,
        h.id as hewan_id,
        h.nama as hewan_nama,
        h.spesies as hewan_spesies,
        p.username as pelatih_username,
        p.nama_depan as pelatih_nama_depan,
        p.nama_belakang as pelatih_nama_belakang
      FROM 
        ${this.tableName} a
        JOIN FASILITAS f ON a.nama_atraksi = f.nama
        LEFT JOIN BERPARTISIPASI b ON a.nama_atraksi = b.nama_fasilitas
        LEFT JOIN HEWAN h ON b.id_hewan = h.id
        LEFT JOIN (
          SELECT DISTINCT ON (nama_atraksi) 
            nama_atraksi, 
            username_lh, 
            tgl_penugasan
          FROM JADWAL_PENUGASAN
          ORDER BY nama_atraksi, tgl_penugasan DESC
        ) jp ON a.nama_atraksi = jp.nama_atraksi
        LEFT JOIN PENGGUNA p ON jp.username_lh = p.username
      ORDER BY 
        a.nama_atraksi ASC
    `;

    const rows = await this.customQuery(query);

    const atraksiMap = new Map<string, AtraksiWithDetailsType>();

    rows.forEach((row) => {
      if (!atraksiMap.has(row.nama_atraksi)) {
        atraksiMap.set(row.nama_atraksi, {
          nama_atraksi: row.nama_atraksi,
          lokasi: row.lokasi,
          kapasitas_max: row.kapasitas_max,
          jadwal: row.jadwal,
          hewan_terlibat: [],
          pelatih: row.pelatih_username
            ? {
                username_lh: row.pelatih_username,
                nama_depan: row.pelatih_nama_depan,
                nama_belakang: row.pelatih_nama_belakang,
              }
            : null,
        });
      }

      const atraksi = atraksiMap.get(row.nama_atraksi)!;
      if (
        row.hewan_id &&
        !atraksi.hewan_terlibat.some((h) => h.id === row.hewan_id)
      ) {
        atraksi.hewan_terlibat.push({
          id: row.hewan_id,
          nama: row.hewan_nama,
          spesies: row.hewan_spesies,
        });
      }
    });

    return Array.from(atraksiMap.values());
  }
}
