export interface AdopsiType {
  id_adopsi: string; // Tambahkan id_adopsi sebagai primary key
  id_adopter: string;
  id_hewan: string;
  status_pembayaran: string;
  tgl_mulai_adopsi: Date;
  tgl_berhenti_adopsi: Date;
  kontribusi_finansial: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface AdopterType {
  username_adopter: string;
  id_adopter: string;
  total_kontribusi: number;
}

export interface AtraksiType {
  nama_atraksi: string;
  lokasi: string;
}

export interface BerpartisipasiType {
  nama_fasilitas: string;
  id_hewan: string;
}

export interface CatatanMedisType {
  id_hewan: string;
  username_dh: string;
  tanggal_pemeriksaan: Date;
  diagnosis: string;
  pengobatan: string;
  status_kesehatan: string;
  catatan_tindak_lanjut: string;
}

export interface DokterHewanType {
  username_DH: string;
  no_str: string;
}

export interface FasilitasType {
  nama: string;
  jadwal: string; // Changed from Date to string
  kapasitas_max: number;
}

export interface HabitatType {
  nama: string;
  luas_area: number;
  kapasitas: number;
  status: string;
}

export interface HewanType {
  id: string;
  nama: string;
  spesies: string;
  asal_hewan: string;
  tanggal_lahir: string | null;
  status_kesehatan: string;
  nama_habitat: string;
  url_foto: string;
}

export interface IndividuType {
  nik: string;
  nama: string;
  id_adopter: string;
}

export interface JadwalPemeriksaanKesehatanType {
  id_hewan: string;
  tgl_pemeriksaan_selanjutnya: Date;
  freq_pemeriksaan_rutin: number;
}

export interface JadwalPenugasanType {
  username_lh: string;
  tgl_penugasan: Date;
  nama_atraksi: string;
}

export interface MemberiType {
  id_hewan: string;
  jadwal: Date;
  username_jh: string;
}

export interface OrganisasiType {
  npp: string;
  nama_organisasi: string;
  id_adopter: string;
}

export interface PakanType {
  id_hewan: string;
  jadwal: Date;
  jenis: string;
  jumlah: number;
  status: string;
}

export interface PelatihHewanType {
  username_LH: string;
  id_staf: string;
}

export interface PenggunaType {
  username: string;
  email: string;
  password: string;
  nama_depan: string;
  nama_tengah: string;
  nama_belakang: string;
  no_telepon: string;
}

export interface PengunjungType {
  username_P: string;
  alamat: string;
  tgl_lahir: Date;
}

export interface PenjagaHewanType {
  username_JH: string;
  id_staf: string;
}

export interface ReservasiType {
  username_P: string;
  nama_fasilitas: string;
  tanggal_kunjungan: string;
  jumlah_tiket: number;
  status: string;
}

export interface SpesialisasiType {
  username_SH: string;
  nama_spesialisasi: string;
}

export interface StafAdminType {
  username_sa: string;
  id_staf: string;
}

export interface WahanaType {
  nama_wahana: string;
  peraturan: string;
}

export interface AnimalDisplayType {
  id_hewan: string;
  nama_hewan: string;
  spesies: string;
  status_kesehatan: string;
  url_foto: string;
  id_adopsi?: string;
  nama_adopter?: string;
  kontribusi_finansial?: number;
  status_pembayaran?: string;
  tgl_mulai_adopsi?: Date;
  tgl_berhenti_adopsi?: Date;
}
