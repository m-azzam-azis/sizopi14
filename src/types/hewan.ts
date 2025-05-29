export interface Hewan {
  id: string; // Primary key (UUID)
  nama: string;
  spesies: string;
  asal_hewan: string;
  tanggal_lahir: string;
  status_kesehatan: string;
  nama_habitat: string; // Foreign key to habitat.nama
  url_foto: string;
  habitat_nama?: string; // For joined queries
}
