export interface Hewan {
  id: string;
  nama: string;
  spesies: string;
  asal_hewan: string;
  tanggal_lahir: string | null;
  status_kesehatan: string;
  nama_habitat: string;
  url_foto: string;
}

export interface HewanWithHabitat extends Hewan {
  habitat_status?: string;
}
