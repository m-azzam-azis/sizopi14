import { Habitat } from "./interface";
import { Animal } from "./interface";
// Dummy data for animals in this habitat
export const animals: Animal[] = [
  {
    id: "ani-101",
    name: "Simba",
    species: "African Lion",
    origin: "Wildlife Conservation Center",
    birthDate: "2018-06-15",
    healthStatus: "Healthy",
  },
  {
    id: "ani-102",
    name: "Zara",
    species: "Plains Zebra",
    origin: "Born in captivity",
    birthDate: "2020-04-22",
    healthStatus: "Healthy",
  },
  {
    id: "ani-103",
    name: "Rafiki",
    species: "Giraffe",
    origin: "Animal Sanctuary",
    birthDate: "2019-08-10",
    healthStatus: "Under Observation",
  },
  {
    id: "ani-104",
    name: "Pumbaa",
    species: "Warthog",
    origin: "Wildlife Reserve",
    birthDate: "2021-02-28",
    healthStatus: "Sick",
  },
  {
    id: "ani-105",
    name: "Nala",
    species: "African Lion",
    origin: "Wildlife Conservation Center",
    birthDate: "2017-11-05",
    healthStatus: "Healthy",
  },
];

export const habitats_dummy: Habitat[] = [
  {
    id: "hab-001",
    name: "Savanna Enclosure",
    area: 5000,
    capacity: 15,
    status: "Suhu: 28°C, Kelembapan: 60%, Vegetasi savana",
  },
  {
    id: "hab-002",
    name: "Tropical Rainforest",
    area: 8000,
    capacity: 25,
    status: "Suhu: 30°C, Kelembapan: 85%, Vegetasi lebat",
  },
  {
    id: "hab-003",
    name: "Arctic Zone",
    area: 4000,
    capacity: 10,
    status: "Suhu: -5°C, Kelembapan: 40%, Es dan salju",
  },
  {
    id: "hab-004",
    name: "Desert Exhibit",
    area: 3500,
    capacity: 12,
    status: "Suhu: 35°C, Kelembapan: 20%, Pasir dan kaktus",
  },
  {
    id: "hab-005",
    name: "Aquatic Center",
    area: 6000,
    capacity: 30,
    status: "Suhu air: 25°C, pH: 7.5, Terumbu karang",
  },
];
