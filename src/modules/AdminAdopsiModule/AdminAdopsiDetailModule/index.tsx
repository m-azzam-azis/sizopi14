"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { X, Trash } from "lucide-react";

const animals = [
  {
    id: "ani-101",
    name: "Simba",
    species: "African Lion",
    adopter: "Prasetya Andriani",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    contribution: "Rp 1.500.000",
    isAdopted: true,
  },
  {
    id: "ani-102",
    name: "Zara",
    species: "Plains Zebra",
    adopter: "Prasetya Andriani",
    startDate: "2025-02-01",
    endDate: "2025-11-30",
    contribution: "Rp 1.200.000",
    isAdopted: true,
  },
  {
    id: "ani-103",
    name: "Rafiki",
    species: "Giraffe",
    adopter: "Margana Jaya",
    startDate: "2025-03-01",
    endDate: "2025-10-31",
    contribution: "Rp 1.800.000",
    isAdopted: true,
  },
];

export default function AdminAdopsiDetailModule({ animalId }: { animalId: string }) {
  const router = useRouter();
  const [animal, setAnimal] = useState<any>(null);
  const [paymentStatus, setPaymentStatus] = useState("tertunda");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showToast, setShowToast] = useState(false); // State untuk toast

  useEffect(() => {
    // Cari data hewan berdasarkan animalId
    const selectedAnimal = animals.find((a) => a.id === animalId);
    setAnimal(selectedAnimal);
  }, [animalId]);

  const handleSaveStatus = () => {
    console.log("Status pembayaran disimpan:", paymentStatus);

    // Simulasi penyimpanan status pembayaran
    setShowToast(true); // Tampilkan toast
    setTimeout(() => {
      setShowToast(false);
      router.push("/admin-adopsi"); // Arahkan kembali ke AdminAdopsiModule
    }, 3000);
  };

  const handleStopAdoption = () => {
    console.log("Adopsi dihentikan");

    // Simulasi perubahan isAdopted menjadi false
    if (animal) {
      animal.isAdopted = false;
    }

    setShowToast(true); // Tampilkan toast
    setTimeout(() => {
      setShowToast(false);
      router.push("/admin-adopsi"); // Arahkan kembali ke AdminAdopsiModule
    }, 3000);
  };

  if (!animal) {
    return <p className="text-center">Data hewan tidak ditemukan.</p>;
  }

  return (
    <div className="container mx-auto py-10 px-4 font-outfit flex flex-col items-center">
      <Card className="shadow-md w-full max-w-lg">
        <CardHeader className="relative">
          <CardTitle className="text-center text-xl font-bold">Detail Adopsi Hewan</CardTitle>
          <Button
            variant="ghost"
            className="absolute top-2 right-2 text-muted-foreground hover:text-red-500"
            onClick={() => router.push("/admin-adopsi")} // Navigasi ke halaman daftar adopsi
          >
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Nama Hewan:</span> {animal.name}
            </p>
            <p>
              <span className="font-semibold">Jenis Hewan:</span> {animal.species}
            </p>
            <p>
              <span className="font-semibold">Adopter Saat Ini:</span> {animal.adopter}
            </p>
            <p>
              <span className="font-semibold">Tanggal Mulai Adopsi:</span> {animal.startDate}
            </p>
            <p>
              <span className="font-semibold">Tanggal Akhir Adopsi:</span> {animal.endDate}
            </p>
            <p>
              <span className="font-semibold">Nominal Kontribusi:</span> {animal.contribution}
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <span className="font-semibold">Status Pembayaran:</span>
            <Select
              value={paymentStatus}
              onValueChange={(value) => setPaymentStatus(value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tertunda">Tertunda</SelectItem>
                <SelectItem value="lunas">Lunas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-center gap-4 mt-4">
            <Button
              variant="default"
              className="bg-red-500 text-white hover:bg-red-600 text-sm flex items-center gap-2"
              onClick={() => setIsDialogOpen(true)}
            >
              <Trash className="h-4 w-4" />
              Hentikan Adopsi
            </Button>
            <Button
              variant="default"
              className="bg-green-500 text-white hover:bg-green-600 text-sm"
              onClick={handleSaveStatus}
            >
              Simpan Status
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alert Dialog */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin ingin menghentikan adopsi ini?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-gray-500 hover:text-gray-700">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 text-white hover:bg-red-600"
              onClick={handleStopAdoption}
            >
              Iya
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
          Aksi berhasil dilakukan!
        </div>
      )}
    </div>
  );
}