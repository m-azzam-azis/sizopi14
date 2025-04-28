"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Image from "next/image";

// Use the existing hewanExtended data
const hewanExtended = [
  {
    id: "H001",
    name: "Gajah Sumatran",
    species: "Elephas maximus sumatranus",
    origin: "Sumatera",
    birthDate: new Date("2015-06-12"),
    habitat: "Hutan Hujan Tropis",
    healthStatus: "Sehat",
    imageUrl: "https://images.unsplash.com/photo-1557050543-4162f98e2c54?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "H002",
    name: "Harimau Benggala",
    species: "Panthera tigris tigris",
    origin: "India",
    birthDate: new Date("2018-03-24"),
    habitat: "Hutan Tropis",
    healthStatus: "Sakit",
    imageUrl: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "H003", 
    name: "Orangutan",
    species: "Pongo pygmaeus",
    origin: "Kalimantan",
    birthDate: new Date("2017-09-30"),
    habitat: "Hutan Hujan Tropis",
    healthStatus: "Sehat",
    imageUrl: "https://images.unsplash.com/photo-1544715608-1cc9d0a10011?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "H004",
    name: "Komodo",
    species: "Varanus komodoensis",
    origin: "Pulau Komodo",
    birthDate: new Date("2019-11-05"),
    habitat: "Savana",
    healthStatus: "Sehat",
    imageUrl: "https://images.unsplash.com/photo-1585080797525-6830941059c3?q=80&w=1000&auto=format&fit=crop"
  },
];

export const AnimalSelectionModule = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter animals based on search
  const filteredAnimals = searchQuery 
    ? hewanExtended.filter(
        animal => 
          animal.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          animal.species.toLowerCase().includes(searchQuery.toLowerCase()) ||
          animal.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : hewanExtended;

  const getHealthStatusColor = (status: string) => {
    switch(status) {
      case "Sehat": return "bg-green-100 text-green-800";
      case "Pemulihan": return "bg-yellow-100 text-yellow-800";
      case "Sakit": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Pemberian Pakan Hewan</h1>
          <p className="text-muted-foreground">Pilih hewan untuk melihat atau mengelola jadwal pemberian pakan</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Cari hewan..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => router.push('/pakan/riwayat')}
          >
            Riwayat Pemberian
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAnimals.map((animal) => (
          <Card key={animal.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="relative h-48 w-full">
              <Image 
                src={animal.imageUrl} 
                alt={animal.name}
                fill
                style={{objectFit: "cover"}}
                priority
              />
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{animal.name}</CardTitle>
                <Badge className={getHealthStatusColor(animal.healthStatus)}>
                  {animal.healthStatus}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground italic">
                {animal.species}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">ID:</span>
                  <span className="text-sm font-medium">{animal.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Asal:</span>
                  <span className="text-sm">{animal.origin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Habitat:</span>
                  <span className="text-sm">{animal.habitat}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-green-500 hover:bg-green-600 text-white"
                onClick={() => router.push(`/pakan/${animal.id}`)}
              >
                Lihat Jadwal Pakan
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};