export type UserRole = 
  | "visitor"
  | "veterinarian"
  | "caretaker" 
  | "admin" 
  | "trainer";

export interface BaseUserData {
  id: string;
  username: string;
  email: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  phoneNumber: string;
  role: UserRole;
}

export interface VisitorData extends BaseUserData {
  address: string;
  birthDate: string;
  visitHistory?: {
    date: string;
    ticketId: string;
  }[];
  tickets?: {
    id: string;
    purchaseDate: string;
    validUntil: string;
    type: string;
    status: "active" | "used" | "expired";
  }[];
}

export interface VeterinarianData extends BaseUserData {
  certificationNumber: string;
  specializations: string[];
  animalsTreated?: number;
}

export interface CaretakerData extends BaseUserData {
  staffId: string;
  animalsFed?: number;
}

export interface AdminData extends BaseUserData {
  staffId: string;
  todayTicketSales?: number;
  todayVisitors?: number;
  weeklyRevenue?: number;
}

export interface TrainerData extends BaseUserData {
  staffId: string;
  todayShows?: { time: string; name: string }[];
  trainedAnimals?: { id: string; name: string; species: string }[];
  lastTrainingStatus?: string;
}