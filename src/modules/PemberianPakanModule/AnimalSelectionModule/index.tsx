"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

// HewanType interface for type safety
interface HewanType {
  id: string;
  nama: string;
  spesies: string;
  asal_hewan: string;
  tanggal_lahir: string | Date;
  status_kesehatan: string;
  nama_habitat: string;
  // url_foto: string; // not used in UI
}

export const AnimalSelectionModule = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [animals, setAnimals] = useState<HewanType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/hewan")
      .then((res) => res.json())
      .then((data) => {
        setAnimals(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredAnimals = searchQuery
    ? animals.filter(
        (animal) =>
          animal.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
          animal.spesies.toLowerCase().includes(searchQuery.toLowerCase()) ||
          animal.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : animals;

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case "Sehat":
        return "bg-green-100 text-green-800";
      case "Pemulihan":
        return "bg-yellow-100 text-yellow-800";
      case "Sakit":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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
          <Button variant="outline" onClick={() => router.push("/pakan/riwayat")}>Riwayat Pemberian</Button>
        </div>
      </div>
      {loading ? (
        <div className="text-center py-12">Memuat data hewan...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAnimals.map((animal) => (
            <Card key={animal.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{animal.nama}</CardTitle>
                  <Badge className={getHealthStatusColor(animal.status_kesehatan)}>
                    {animal.status_kesehatan}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground italic">{animal.spesies}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">ID:</span>
                    <span className="text-sm font-medium">{animal.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Asal:</span>
                    <span className="text-sm">{animal.asal_hewan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Tanggal Lahir:</span>
                    <span className="text-sm">{new Date(animal.tanggal_lahir).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Habitat:</span>
                    <span className="text-sm">{animal.nama_habitat}</span>
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
      )}
    </div>
  );
};