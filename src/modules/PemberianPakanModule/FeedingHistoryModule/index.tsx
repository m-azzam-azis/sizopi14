"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, Search } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data for demo purposes (same as used in other modules)
const mockPemberianPakan = [
  {
    id: "1",
    id_hewan: "H001",
    jadwal: new Date("2025-04-25T08:00:00"),
    jenis: "Rumput",
    jumlah: 200,
    status: "completed",
    username_jh: "jh_bambang",
  },
  {
    id: "2",
    id_hewan: "H002",
    jadwal: new Date("2025-04-25T09:30:00"),
    jenis: "Daging",
    jumlah: 350,
    status: "pending",
    username_jh: "jh_sarah",
  },
  {
    id: "3",
    id_hewan: "H003",
    jadwal: new Date("2025-04-26T10:00:00"),
    jenis: "Buah-buahan",
    jumlah: 100,
    status: "completed",
    username_jh: "jh_ahmad",
  },
  {
    id: "4",
    id_hewan: "H001",
    jadwal: new Date("2025-04-26T14:00:00"),
    jenis: "Rumput",
    jumlah: 250,
    status: "completed",
    username_jh: "jh_sarah",
  },
  {
    id: "5",
    id_hewan: "H001",
    jadwal: new Date("2025-04-27T08:00:00"),
    jenis: "Rumput",
    jumlah: 200,
    status: "completed",
    username_jh: "jh_bambang",
  },
  {
    id: "6",
    id_hewan: "H002",
    jadwal: new Date("2025-04-26T16:30:00"),
    jenis: "Daging",
    jumlah: 300,
    status: "completed",
    username_jh: "jh_sarah",
  },
];

const penjagaHewan = [
  { username: "jh_bambang", name: "Bambang" },
  { username: "jh_sarah", name: "Sarah" },
  { username: "jh_ahmad", name: "Ahmad" },
];

const hewanExtended = [
  {
    id: "H001",
    name: "Gajah Sumatran",
    species: "Elephas maximus sumatranus",
    origin: "Sumatera",
    birthDate: new Date("2015-06-12"),
    habitat: "Hutan Hujan Tropis",
    healthStatus: "Sehat",
  },
  {
    id: "H002",
    name: "Harimau Benggala",
    species: "Panthera tigris tigris",
    origin: "India",
    birthDate: new Date("2018-03-24"),
    habitat: "Hutan Tropis",
    healthStatus: "Sakit",
  },
  {
    id: "H003", 
    name: "Orangutan",
    species: "Pongo pygmaeus",
    origin: "Kalimantan",
    birthDate: new Date("2017-09-30"),
    habitat: "Hutan Hujan Tropis",
    healthStatus: "Sehat",
  },
  {
    id: "H004",
    name: "Komodo",
    species: "Varanus komodoensis",
    origin: "Pulau Komodo",
    birthDate: new Date("2019-11-05"),
    habitat: "Savana",
    healthStatus: "Sehat",
  },
];

export const FeedingHistoryModule = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [caretakerFilter, setCaretakerFilter] = useState<string | null>(null);

  // Helper to get animal data from ID
  const getAnimalInfo = (id: string) => {
    return hewanExtended.find(h => h.id === id) || {
      id,
      name: "Unknown",
      species: "Unknown",
      origin: "Unknown",
      birthDate: new Date(),
      habitat: "Unknown",
      healthStatus: "Unknown",
    };
  };

  // Helper to get caretaker name from username
  const getCaretakerName = (username: string) => {
    const caretaker = penjagaHewan.find(p => p.username === username);
    return caretaker ? caretaker.name : username;
  };

  // Only show completed feedings in history
  const completedFeedings = mockPemberianPakan.filter(item => 
    item.status === "completed" &&
    (caretakerFilter === null || item.username_jh === caretakerFilter) &&
    (search === "" || 
     item.jenis.toLowerCase().includes(search.toLowerCase()) ||
     getAnimalInfo(item.id_hewan).name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => router.push('/pakan')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Kembali ke Daftar Hewan
      </Button>
      
      <h1 className="text-3xl font-bold mb-6">Riwayat Pemberian Pakan</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filter &amp; Pencarian</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari berdasarkan nama hewan atau jenis pakan..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <Select
              value={caretakerFilter || "all"}
              onValueChange={(value) => setCaretakerFilter(value === "all" ? null : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter Penjaga Hewan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Penjaga</SelectItem>
                {penjagaHewan.map((penjaga) => (
                  <SelectItem key={penjaga.username} value={penjaga.username}>
                    {penjaga.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Hewan</TableHead>
                <TableHead>Spesies</TableHead>
                <TableHead>Asal Hewan</TableHead>
                <TableHead>Habitat</TableHead>
                <TableHead>Jenis Pakan</TableHead>
                <TableHead>Jumlah (gram)</TableHead>
                <TableHead>Jadwal</TableHead>
                <TableHead>Penjaga</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {completedFeedings.length > 0 ? (
                completedFeedings.map((item) => {
                  const animal = getAnimalInfo(item.id_hewan);
                  return (
                    <TableRow key={`history-${item.id}`}>
                      <TableCell>{animal.name}</TableCell>
                      <TableCell>{animal.species}</TableCell>
                      <TableCell>{animal.origin}</TableCell>
                      <TableCell>{animal.habitat}</TableCell>
                      <TableCell>{item.jenis}</TableCell>
                      <TableCell>{item.jumlah}</TableCell>
                      <TableCell>{format(new Date(item.jadwal), "dd/MM/yyyy HH:mm")}</TableCell>
                      <TableCell>{getCaretakerName(item.username_jh)}</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    Tidak ada riwayat pemberian pakan yang ditemukan
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};