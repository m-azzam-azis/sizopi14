// Define interfaces for better type safety
export interface Habitat {
  id: string;
  name: string;
  area: number;
  capacity: number;
  status: string;
}

export interface Animal {
  id: string;
  name: string;
  species: string;
  origin: string;
  birthDate: string;
  healthStatus: "Healthy" | "Sick" | "Under Observation" | "Critical";
}
