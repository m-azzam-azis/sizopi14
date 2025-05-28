"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription } from "@/components/ui/alert-dialog";
import { X } from "lucide-react";
import { getUserData } from "@/hooks/getUserData";
import { toast } from "sonner";
import AdopterIndividuFormModal from "../components/modals/AdopterIndividuFormModal";
import AdopterOrganisasiFormModal from "../components/modals/AdopterOrganisasiFormModal";
import AdopterIndividuForm from "../components/forms/AdopterIndividuForm";
import AdopterOrganisasiForm from "../components/forms/AdopterOrganisasiForm";

interface Animal {
  id: string;
  name: string;
  species: string;
  habitat: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  ownerId: string;
  paymentStatus: string;
  status_kesehatan: string;
  kontribusi_finansial: number;
}

interface Adopter {
  id: string;
  username: string;
  type: "individu" | "organisasi";
  address: string;
  birthDate: string;
  nik?: string;
  npp?: string;
  name?: string;
  organizationName?: string;
  noTelp: string;
  email: string;
  nama_organisasi?: string;
  notelp?: string;
  no_telp?: string;
  no_telepon?: string;
  [key: string]: any;
}

export default function AdopterAdopsiDetailModule({ animalId }: { animalId: string }) {
  const router = useRouter();
  const { userData, isValid, isLoading } = getUserData();
  const [showAlert, setShowAlert] = useState(false);
  const [showPaymentAlert, setShowPaymentAlert] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [adopter, setAdopter] = useState<Adopter | null>(null);
  const [showExtendModal, setShowExtendModal] = useState(false);

  // Fetch animal and adopter details
  useEffect(() => {
    const fetchData = async () => {
      if (!isValid || !animalId) {
        setLoading(false);
        return;
      }

      try {
        console.log(`Fetching data for animal ID: ${animalId}`);
        const response = await fetch(`/api/adopter-adopsi/${animalId}`);
        
        console.log(`API response status: ${response.status}`);
        
        if (!response.ok) {
          let errorMessage = "Error fetching animal details";
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
          } catch (e) {
            console.error("Error parsing error response:", e);
          }
          throw new Error(errorMessage);
        }
        
        const data = await response.json();
        console.log("Received data:", data);
        
        setAnimal(data.animal);
        setAdopter(data.adopter);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "Terjadi kesalahan saat mengambil data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [animalId, isValid]);

  // Check if current user can access this animal's details
  useEffect(() => {
    if (!loading && adopter && isValid && userData.username) {
      if (adopter.username !== userData.username) {
        toast.error("Anda tidak memiliki akses ke data hewan ini");
        router.push("/adopter-adopsi");
      }
    }
  }, [loading, adopter, isValid, userData.username, router]);

  // Perbarui fungsi handleStopAdoption
  const handleStopAdoption = async () => {
    setShowAlert(false);
  
    try {
      // API call untuk berhenti adopsi
      const response = await fetch(`/api/adopter-adopsi/${animalId}/stop`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal berhenti mengadopsi");
      }
      
      const result = await response.json();
      
      // Tampilkan toast success
      toast.success(result.message || "Anda telah berhenti mengadopsi satwa ini!");
      
      // Arahkan kembali ke halaman utama adopsi setelah berhasil
      setTimeout(() => {
        router.push("/adopter-adopsi"); 
      }, 1500);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal berhenti mengadopsi. Silakan coba lagi.");
    }
  };

  const handleExtendAdoption = () => {
    if (animal && (animal.paymentStatus.toLowerCase() === "pending" || 
        animal.paymentStatus.toLowerCase() === "belum lunas")) {
      setShowPaymentAlert(true);
      return;
    }
    
    setShowExtendModal(true);
  };

  const handleExtendSubmit = async (data: { nominal: string; adoptionPeriod: string }) => {
    try {
      // Siapkan data untuk dikirim ke API
      const extendData = {
        animalId: animalId,
        adopterUsername: userData.username,
        contributionAmount: parseInt(data.nominal),
        extensionMonths: parseInt(data.adoptionPeriod)
      };
  
      // Kirim request ke API
      const response = await fetch(`/api/adopter-adopsi/${animalId}/extend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(extendData)
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal memperpanjang adopsi");
      }
  
      const result = await response.json();
      
      // Tutup modal perpanjangan
      setShowExtendModal(false);
      
      // Tampilkan toast success
      toast.success(result.message || "Perpanjangan adopsi berhasil diajukan!");
      
      // Arahkan ke halaman pembayaran
      setTimeout(() => {
        router.push(`/adopter-adopsi/payment/${result.paymentId}`);
      }, 1500);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal memperpanjang adopsi. Silakan coba lagi.");
    }
  };

  const handlePayNow = () => {
    setShowPaymentAlert(false);
    setToastMessage("Redirecting to payment page...");
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      // In real app, redirect to payment page
    }, 3000);
  };

  const renderExtendForm = () => {
    if (!animal || !adopter) return null;
  
    
    const possiblePhoneFields = ["noTelp", "notelp", "no_telp", "no_telepon"];
    let phoneFound = false;
    
    possiblePhoneFields.forEach(field => {
      if (field in adopter) {
        phoneFound = true;
      }
    });
    
    if (!phoneFound) {
      console.log("No phone field found in adopter data!");
    }
    
    // Data hewan untuk form
    const animalData = {
      id: animal.id,
      name: animal.name,
      species: animal.species
    };
  
    // Temukan nomor telepon dari berbagai kemungkinan field name
    let phoneNumber = "Tidak tersedia";
    for (const field of possiblePhoneFields) {
      if (adopter[field]) {
        phoneNumber = adopter[field];
        break;
      }
    }
  
    if (adopter.type === 'individu') {
      const adopterData = {
        name: adopter.name || '',
        nik: adopter.nik || '',
        address: adopter.address || '',
        noTelp: phoneNumber // Gunakan nilai yang sudah ditemukan
      };
  
      // Log data yang akan diberikan ke form
      console.log("Data for Individu form:", adopterData);
  
      return (
        <AdopterIndividuFormModal isOpen={showExtendModal} onClose={() => setShowExtendModal(false)}>
          <div className="py-1">
            <AdopterIndividuForm 
              adopter={adopterData}
              animal={animalData}
              onSubmit={handleExtendSubmit}
            />
          </div>
        </AdopterIndividuFormModal>
      );
    } else {
      const adopterData = {
        organizationName: adopter.organizationName || adopter.nama_organisasi || '',
        npp: adopter.npp || '',
        address: adopter.address || '',
        noTelp: phoneNumber
      };
  
      // Log data yang akan diberikan ke form
      console.log("Data for Organisasi form:", adopterData);
  
      return (
        <AdopterOrganisasiFormModal isOpen={showExtendModal} onClose={() => setShowExtendModal(false)}>
          <div className="py-1">
            <AdopterOrganisasiForm 
              adopter={adopterData}
              animal={animalData}
              onSubmit={handleExtendSubmit}
            />
          </div>
        </AdopterOrganisasiFormModal>
      );
    }
  };

  // Loading state
  if (loading || isLoading) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <p>Memuat data...</p>
      </div>
    );
  }

  // Error state
  if (error || !animal || !adopter) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <p className="text-red-500">
          {error || "Data hewan tidak ditemukan."}
        </p>
        <Button 
          className="mt-4"
          onClick={() => router.push("/adopter-adopsi")}
        >
          Kembali
        </Button>
      </div>
    );
  }

  // If not logged in
  if (!isValid) {
    router.push("/login");
    return null;
  }

  return (
    <div className="container mx-auto py-10 px-4 font-outfit">
      
      <Card className="shadow-md w-full max-w-lg mx-auto">
        <CardHeader className="relative">
          <CardTitle className="text-xl font-bold text-center">Informasi Hewan Adopsi</CardTitle>
          <Button
            variant="ghost"
            className="absolute top-6 right-6 text-red-500 hover:bg-red-100 p-2 rounded-full"
            onClick={() => router.push("/adopter-adopsi")}
          >
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
          <CardContent className="space-y-6 text-center">
            {/* Gambar Hewan - Circle avatar dengan inisial */}
            <Avatar className="h-36 w-36 mx-auto bg-green-100 text-black">
              <AvatarImage src={animal.imageUrl} alt={animal.name} />
              <AvatarFallback className="text-lg">
                {animal.name?.substring(0, 2).toUpperCase() || "HW"}
              </AvatarFallback>
            </Avatar>

            {/* Informasi Hewan - Teks rata tengah sesuai gambar */}
            <div className="space-y-3 mt-4">
              <p className="font-medium text-lg">
                <span className="font-semibold">Nama hewan:</span> {animal.name || "[nama tidak tersedia]"}
              </p>
              <p className="font-medium text-lg">
                <span className="font-semibold">Jenis hewan:</span> {animal.species}
              </p>
              <p className="font-medium text-lg">
                <span className="font-semibold">Habitat:</span> {animal.habitat || "Tidak tersedia"}
              </p>
              <p className="font-medium text-lg">
                <span className="font-semibold">Tanggal Mulai Adopsi:</span> {animal.startDate}
              </p>
              <p className="font-medium text-lg">
                <span className="font-semibold">Tanggal Akhir Adopsi:</span> {animal.endDate || "Tidak ada batas waktu"}
              </p>
              <p className="font-medium text-lg">
                <span className="font-semibold">Adopter:</span> {adopter.type === 'individu' ? adopter.name : adopter.organizationName}
              </p>
            </div>

            {/* Aksi - Tombol hijau dan merah sesuai gambar */}
            <div className="flex justify-center gap-4 mt-6">
              <Button
                className="bg-green-800 text-white hover:bg-green-900 py-2 px-4"
                onClick={() => router.push(`/adopter-adopsi/kondisi/${animalId}`)}
              >
                Pantau Kondisi Hewan
              </Button>
              <Button
                className="bg-green-800 text-white hover:bg-green-900 py-2 px-4"
                onClick={() => router.push(`/adopter-adopsi/sertifikat/${animal.id}`)}
              >
                Lihat Sertifikat Adopsi
              </Button>
            </div>
            
            <div className="flex justify-center gap-4 mt-2">
              <Button
                className="bg-red-500 text-white hover:bg-red-600 py-2 px-4"
                onClick={() => setShowAlert(true)}
              >
                Berhenti Adopsi
              </Button>
              <Button
                className="bg-blue-500 text-white hover:bg-blue-600 py-2 px-4"
                onClick={handleExtendAdoption}
              >
                Perpanjang Periode Adopsi
              </Button>
            </div>
          </CardContent>
      </Card>

      {/* Alert Dialog for stopping adoption */}
      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin ingin berhenti mengadopsi satwa ini?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 text-white hover:bg-red-600"
              onClick={handleStopAdoption}
            >
              Iya
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Alert Dialog for unpaid payments */}
      <AlertDialog open={showPaymentAlert} onOpenChange={setShowPaymentAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Pembayaran Belum Lunas</AlertDialogTitle>
            <AlertDialogDescription>
              Anda belum melunasi pembayaran untuk periode adopsi saat ini. 
              Perpanjangan periode adopsi hanya dapat dilakukan setelah pembayaran untuk periode saat ini telah lunas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Tutup</AlertDialogCancel>
            <AlertDialogAction
              className="bg-primary text-white hover:bg-primary/90"
              onClick={handlePayNow}
            >
              Bayar Sekarang
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
          {toastMessage}
        </div>
      )}
      
      {/* Modal Perpanjangan */}
      {renderExtendForm()}
      
    </div>
  );
}