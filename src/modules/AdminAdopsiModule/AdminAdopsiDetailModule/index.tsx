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
import { X } from "lucide-react";

interface AnimalAdoption {
  animal: {
    id_hewan: string;
    nama_hewan: string;
    spesies: string;
  };
  currentAdoption: {
    id_adopter: string;
    nama_adopter: string;
    kontribusi_finansial: number;
    status_pembayaran: string;
    tgl_mulai_adopsi: string;
    tgl_berhenti_adopsi: string;
  } | null;
}

export default function AdminAdopsiDetailModule({ animalId }: { animalId: string }) {
  const router = useRouter();
  const [animalData, setAnimalData] = useState<AnimalAdoption | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<string>("tertunda");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  useEffect(() => {
    fetchAnimalData();
  }, [animalId]);

  const fetchAnimalData = async () => {
    setIsLoading(true);
    try {
      console.log(`Fetching data for animal ID: ${animalId}`);
      const response = await fetch(`/api/adopsi/${animalId}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Error: ${response.status} - ${errorData.message || "Unknown error"}`);
      }
      
      const data = await response.json();
      console.log("Animal data received:", data);
      
      setAnimalData(data);
      
      if (data.currentAdoption) {
        const statusFromApi = data.currentAdoption.status_pembayaran.toLowerCase();
        setPaymentStatus(statusFromApi === "lunas" ? "lunas" : "tertunda");
      }
    } catch (err) {
      console.error("Error fetching animal data:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Gagal memuat data hewan");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const showToastMessage = (message: string, type: "success" | "error" = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleSaveStatus = async () => {
    if (!animalData?.currentAdoption) return;
    
    try {
      console.log("Saving payment status:", paymentStatus);
      
      const formattedStatus = paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1);
      console.log("Formatted status:", formattedStatus);
      
      const response = await fetch(`/api/adopsi`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_adopter: animalData.currentAdoption.id_adopter,
          id_hewan: animalData.animal.id_hewan,
          status_pembayaran: formattedStatus
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Error: ${response.status} - ${errorData.message || "Unknown error"}`);
      }
      
      showToastMessage("Status pembayaran berhasil diperbarui", "success");
      
      fetchAnimalData();
      
    } catch (err) {
      console.error("Error saving payment status:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      showToastMessage(`Gagal memperbarui status: ${errorMessage}`, "error");
    }
  };

  const handleStopAdoption = async () => {
    if (!animalData?.currentAdoption) return;
    
    try {
      // pake tanggal kemarin buat mastiin adopsi dianggap udah selesai
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      console.log("Stopping adoption with end date:", yesterdayStr);
      
      const response = await fetch(`/api/adopsi`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_adopter: animalData.currentAdoption.id_adopter,
          id_hewan: animalData.animal.id_hewan,
          tgl_berhenti_adopsi: yesterdayStr
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Error: ${response.status} - ${errorData.message || "Unknown error"}`);
      }
      
      showToastMessage("Adopsi berhasil dihentikan", "success");
      
      setIsDialogOpen(false);
      
      setTimeout(() => {
        router.push(`/admin-adopsi?t=${Date.now()}`);
      }, 1500);
    } catch (err) {
      console.error("Error stopping adoption:", err);
      showToastMessage("Gagal menghentikan adopsi", "error");
      setIsDialogOpen(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4 flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !animalData) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <p className="text-red-500">{error || "Data tidak ditemukan"}</p>
        <Button 
          variant="default" 
          className="mt-4"
          onClick={() => router.push("/admin-adopsi")}
        >
          Kembali
        </Button>
      </div>
    );
  }

  const { animal, currentAdoption } = animalData;

  return (
    <div className="container mx-auto py-10 px-4 font-outfit flex flex-col items-center">
      <Card className="shadow-md w-full max-w-lg">
        <CardHeader className="relative">
          <CardTitle className="text-center text-xl font-bold">Detail Adopsi Hewan</CardTitle>
          <Button
            variant="ghost"
            className="absolute top-2 right-2 text-muted-foreground hover:text-red-500"
            onClick={() => router.push("/admin-adopsi")}
          >
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>
              <span className="font-bold">Nama Hewan:</span> {animal.nama_hewan || "(kalau ada)"}
            </p>
            <p>
              <span className="font-bold">Jenis Hewan:</span> {animal.spesies || "[jenis]"}
            </p>
            {currentAdoption ? (
              <>
                <p>
                  <span className="font-bold">Adopter Saat Ini:</span> {currentAdoption.nama_adopter || "[nama adopter]"}
                </p>
                <p>
                  <span className="font-bold">Tanggal Mulai Adopsi:</span> {currentAdoption.tgl_mulai_adopsi || "[tanggal awal]"}
                </p>
                <p>
                  <span className="font-bold">Tanggal Akhir Adopsi:</span> {currentAdoption.tgl_berhenti_adopsi || "[tanggal akhir]"}
                </p>
                <p>
                  <span className="font-bold">Nominal Kontribusi:</span> {formatCurrency(currentAdoption.kontribusi_finansial) || "[nominal]"}
                </p>

                <div className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <p className="font-bold">Status Pembayaran:</p>
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
                  
                  {/* Tombol ditempatkan secara berdampingan */}
                  <div className="flex justify-center gap-4 mt-6">
                    <Button
                      variant="destructive"
                      className="bg-red-500 hover:bg-red-600 text-white"
                      onClick={() => setIsDialogOpen(true)}
                    >
                      Hentikan Adopsi
                    </Button>
                    <Button 
                      variant="default"
                      className="bg-green-500 text-white hover:bg-green-600"
                      onClick={handleSaveStatus}
                    >
                      Simpan Status
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-amber-500 font-medium">Hewan ini sedang tidak diadopsi</p>
            )}
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
            <AlertDialogCancel>
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
        <div className={`fixed bottom-4 right-4 ${toastType === "success" ? "bg-green-500" : "bg-red-500"} text-white px-4 py-2 rounded shadow-lg`}>
          {toastMessage}
        </div>
      )}
    </div>
  );
}