// Define interfaces for better type safety
export interface Habitat {
  nama: string;
  luas_area: number;
  kapasitas: number;
  status: "Aktif" | "Renovasi" | "Penuh";
}

export interface HabitatWithAnimals extends Habitat {
  jumlah_hewan?: number;
}
