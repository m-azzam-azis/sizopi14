"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface MedicalRecord {
  id: string;
  date: string;
  doctorName: string;
  healthStatus: string;
  diagnosis: string;
  treatment: string;
  notes: string;
}

interface Animal {
  id: string;
  name: string;
  species: string;
  habitat: string;
  condition: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  isAdopted: boolean;
  medicalRecords: MedicalRecord[];
}

// Sample data that connects with the data in AdopterAdopsiModule and AdopterAdopsiDetailModule
const animals: Animal[] = [
  {
    id: "ani-101",
    name: "Simba",
    species: "African Lion",
    condition: "Sehat",
    habitat: "Savanna Enclosure",
    imageUrl: "https://images.unsplash.com/photo-1545006398-2cf48043d3f3?q=80&w=400",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    isAdopted: true,
    medicalRecords: [
      {
        id: "med-101-1",
        date: "2025-04-01",
        doctorName: "Dr. Siti Aminah",
        healthStatus: "Sakit",
        diagnosis: "Infeksi saluran pernapasan",
        treatment: "Antibiotik selama 7 hari",
        notes: "Evaluasi kondisi perbaikan ventilasi kandang."
      },
      {
        id: "med-101-2",
        date: "2025-04-08",
        doctorName: "Dr. Siti Aminah",
        healthStatus: "Dalam pemantauan",
        diagnosis: "Masa pemulihan dari infeksi pernapasan",
        treatment: "Vitamin dan suplemen",
        notes: "Kondisi membaik, nafsu makan kembali normal."
      },
      {
        id: "med-101-3",
        date: "2025-04-15",
        doctorName: "Dr. Ahmad Fauzi",
        healthStatus: "Sehat",
        diagnosis: "Pemeriksaan rutin",
        treatment: "Tidak ada",
        notes: "Pulih sepenuhnya dari infeksi saluran pernapasan."
      }
    ]
  },
  {
    id: "ani-102",
    name: "Zara",
    species: "Plains Zebra",
    condition: "Sehat",
    habitat: "Savanna Enclosure",
    imageUrl: "https://images.unsplash.com/photo-1549975248-52273875de73?q=80&w=400",
    startDate: "2025-02-01",
    endDate: "2025-11-30",
    isAdopted: true,
    medicalRecords: [
      {
        id: "med-102-1",
        date: "2025-03-15",
        doctorName: "Dr. Ahmad Fauzi",
        healthStatus: "Sehat",
        diagnosis: "Pemeriksaan rutin",
        treatment: "Vitamin dan mineral",
        notes: "Kondisi fisik dan mental optimal."
      },
      {
        id: "med-102-2",
        date: "2025-03-30",
        doctorName: "Dr. Maya Putri",
        healthStatus: "Dalam pemantauan",
        diagnosis: "Luka kecil pada kaki depan",
        treatment: "Pembersihan luka dan antiseptik",
        notes: "Periksa ulang dalam 3 hari, hindari benda tajam di kandang."
      },
      {
        id: "med-102-3",
        date: "2025-04-02",
        doctorName: "Dr. Maya Putri",
        healthStatus: "Sehat",
        diagnosis: "Luka sembuh dengan baik",
        treatment: "Tidak ada",
        notes: "Luka sudah menutup sempurna, tidak ada tanda infeksi."
      }
    ]
  }
];

export default function KondisiPage({ animalId }: { animalId: string }) {
  const router = useRouter();
  const [animal, setAnimal] = useState<Animal | null>(null);

  useEffect(() => {
    // Find the animal data based on the animalId
    const foundAnimal = animals.find(a => a.id === animalId);
    if (foundAnimal) {
      setAnimal(foundAnimal);
    }
  }, [animalId]);

  if (!animal) {
    return <p className="text-center p-8">Data hewan tidak ditemukan.</p>;
  }

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "Sehat":
        return "bg-green-500 hover:bg-green-600 text-white";
      case "Sakit":
        return "bg-red-500 hover:bg-red-600 text-white";
      case "Dalam pemantauan":
        return "bg-amber-500 hover:bg-amber-600 text-white";
      default:
        return "bg-gray-500 hover:bg-gray-600 text-white";
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 font-outfit">
      <Button 
        variant="ghost" 
        className="mb-4 flex items-center gap-2"
        onClick={() => router.push(`/adopter-adopsi/detail/${animalId}`)}
      >
        <ArrowLeft className="h-4 w-4" /> Kembali
      </Button>

      <Card className="mb-6">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold">Laporan Kondisi Satwa</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Avatar className="h-32 w-32 mb-4">
            <AvatarImage src={animal.imageUrl} alt={animal.name} />
            <AvatarFallback>{animal.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>

          <div className="text-center mb-6">
            <p><span className="font-semibold">Nama:</span> {animal.name}</p>
            <p><span className="font-semibold">Jenis:</span> {animal.species}</p>
            <p><span className="font-semibold">Habitat:</span> {animal.habitat}</p>
            <p className="mt-2">
              <Badge className={`px-3 py-1 ${getStatusBadgeStyle(animal.condition)}`}>
                Kondisi Saat Ini: {animal.condition}
              </Badge>
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Rekam Medis Satwa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Tanggal Pemeriksaan</th>
                  <th className="border p-2 text-left">Nama Dokter</th>
                  <th className="border p-2 text-left">Status Kesehatan</th>
                  <th className="border p-2 text-left">Diagnosa</th>
                  <th className="border p-2 text-left">Pengobatan</th>
                  <th className="border p-2 text-left">Catatan Tindak Lanjut</th>
                </tr>
              </thead>
              <tbody>
                {animal.medicalRecords.length > 0 ? (
                  animal.medicalRecords.map((record) => (
                    <tr key={record.id}>
                      <td className="border p-2">{record.date}</td>
                      <td className="border p-2">{record.doctorName}</td>
                      <td className="border p-2">
                        <Badge className={`${getStatusBadgeStyle(record.healthStatus)}`}>
                          {record.healthStatus}
                        </Badge>
                      </td>
                      <td className="border p-2">{record.diagnosis}</td>
                      <td className="border p-2">{record.treatment}</td>
                      <td className="border p-2">{record.notes}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="border p-4 text-center">
                      Belum ada rekam medis untuk satwa ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}