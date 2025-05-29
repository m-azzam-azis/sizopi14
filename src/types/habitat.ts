export interface Habitat {
  nama: string; // Primary key
  luas_area: number;
  kapasitas: number;
  status: string;
  jumlah_hewan?: number; // For count queries
}

const test = ["a"];
