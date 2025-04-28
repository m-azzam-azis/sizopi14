export type ReservationStatus = "Terjadwal" | "Dibatalkan";

export interface Pengguna {
  username: string;
  email: string;
  nama_depan: string;
  nama_tengah?: string;
  nama_belakang: string;
  no_telepon: string;
}

export interface Pengunjung {
  username_P: string;
  alamat: string;
  tgl_lahir: Date;
  pengguna: Pengguna;
}

export interface Fasilitas {
  nama: string;
  jadwal: Date;
  kapasitas_max: number;
  kapasitas_tersedia: number;
}

export interface Atraksi {
  nama_atraksi: string;
  lokasi: string;
  fasilitas: Fasilitas;
}

export interface Wahana {
  nama_wahana: string;
  peraturan: string[];
  fasilitas: Fasilitas;
}

export interface ReservasiTiket {
  username_P: string;
  nama_fasilitas: string;
  tanggal_kunjungan: Date;
  jumlah_tiket: number;
  status: ReservationStatus;

  lokasi: string;
  jadwal: string;
  pengunjung?: Pengunjung;
}

export interface ReservasiFormData {
  nama_fasilitas: string;
  nama_atraksi: string;
  lokasi: string;
  jadwal: string;
  tanggal_kunjungan: Date;
  jumlah_tiket: number;
}
