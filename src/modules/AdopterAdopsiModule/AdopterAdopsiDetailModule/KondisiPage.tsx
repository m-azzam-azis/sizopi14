"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { getUserData } from "@/hooks/getUserData";
import { toast } from "sonner";

interface MedicalRecord {
  id: string;
  date: string;
  displayDate?: string;
  doctorName: string;
  healthStatus: string;
  diagnosis: string;
  treatment: string;
  notes: string;
}

interface Animal {
  id_hewan: string;
  name: string;
  species: string;
  habitat: string;
  condition: string;
  imageUrl: string;
  medicalRecords: MedicalRecord[];
  adopterName?: string;
}

export default function KondisiPage({ animalId }: { animalId: string }) {
  const router = useRouter();
  const { userData, isValid } = getUserData();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHealthRecords = async () => {
      if (!isValid || !userData.username) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        console.log(`Fetching health records for animal ID: ${animalId}`);
        const response = await fetch(`/api/adopter-adopsi/health/${animalId}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch health records");
        }
        
        const data = await response.json();
        console.log("Health records data:", data);
        setAnimal(data);
      } catch (err) {
        console.error("Error fetching health records:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch health records");
        toast.error("Gagal memuat rekam medis hewan");
      } finally {
        setLoading(false);
      }
    };

    fetchHealthRecords();
  }, [animalId, userData.username, isValid]);

  const getStatusBadgeStyle = (status: string) => {
    switch (status?.toLowerCase() || '') {
      case "sehat":
        return "bg-green-500";
      case "sakit":
        return "bg-red-500";
      case "dalam pemantauan":
        return "bg-orange-400";
      default:
        return "bg-red-500";
    }
  };

  if (loading) {
    return <p className="text-center p-8">Memuat data...</p>;
  }

  if (error || !animal) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500 mb-4">{error || "Data hewan tidak ditemukan."}</p>
        <Button onClick={() => router.back()}>Kembali</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 bg-primary-500 min-h-screen font-outfit"> 
      <Button 
        variant="ghost" 
        className="mb-4 flex items-center gap-2"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4" /> Kembali
      </Button>

      <Card className="mb-6 border-green-600 border">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold">Laporan Kondisi Satwa</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Avatar className="h-32 w-32 mb-4 bg-green-100">
            {animal.imageUrl ? (
              <AvatarImage src={animal.imageUrl} alt={animal.name} />
            ) : (
              <AvatarFallback className="bg-green-100 text-green-800">
                {animal.name?.substring(0, 2).toUpperCase() || "AN"}
              </AvatarFallback>
            )}
          </Avatar>

          <div className="text-center mb-6">
            <p className="mb-1"><span className="font-semibold">Nama:</span> {animal.name}</p>
            <p className="mb-1"><span className="font-semibold">Jenis:</span> {animal.species}</p>
            <p className="mb-1"><span className="font-semibold">Habitat:</span> {animal.habitat}</p>
            <p className="mt-4">
              <Badge className={`px-3 py-1 rounded-md ${getStatusBadgeStyle(animal.condition)} text-white`}>
                Kondisi Saat Ini: {animal.condition}
              </Badge>
            </p>
            <p className="mt-4"><span className="font-semibold">Diadopsi oleh:</span> {animal.adopterName}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-green-600 border">
        <CardHeader className="bg-white">
          <CardTitle className="text-xl font-bold">Rekam Medis Satwa</CardTitle>
        </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="overflow-x-auto rounded-lg">
              <div className="p-2 mb-4">
                <table className="w-full border-collapse rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border p-3 px-4 text-left font-semibold">Tanggal Pemeriksaan</th>
                      <th className="border p-3 px-4 text-left font-semibold">Nama Dokter</th>
                      <th className="border p-3 px-4 text-left font-semibold">Status Kesehatan</th>
                      <th className="border p-3 px-4 text-left font-semibold">Diagnosa</th>
                      <th className="border p-3 px-4 text-left font-semibold">Pengobatan</th>
                      <th className="border p-3 px-4 text-left font-semibold">Catatan Tindak Lanjut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {animal.medicalRecords && animal.medicalRecords.length > 0 ? (
                      animal.medicalRecords.map((record) => (
                        <tr key={record.id} className="hover:bg-gray-50">
                          <td className="border p-3 px-4">{record.displayDate || formatDate(record.date)}</td>
                          <td className="border p-3 px-4">{record.doctorName}</td>
                          <td className="border p-3 px-4 text-center">
                            <Badge className={`inline-flex px-3 py-1 rounded-full ${
                              getStatusBadgeStyle(record.healthStatus)
                            } text-white`}>
                              {record.healthStatus}
                            </Badge>
                          </td>
                          <td className="border p-3 px-4">{record.diagnosis}</td>
                          <td className="border p-3 px-4">{record.treatment}</td>
                          <td className="border p-3 px-4">{record.notes}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="border p-6 text-center text-gray-500">
                          Belum ada rekam medis untuk satwa ini setelah tanggal adopsi.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
      </Card>
    </div>
  );
}

// Format tanggal untuk tampilan
function formatDate(dateString: string) {
  if (!dateString) return "-";
  
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
}