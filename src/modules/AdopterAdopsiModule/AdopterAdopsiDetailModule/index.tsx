"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription } from "@/components/ui/alert-dialog";
import { X } from "lucide-react";
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
  paymentStatus: "Paid" | "Pending"; // Add payment status field
}

const animals: Animal[] = [
  {
    id: "ani-101",
    name: "Simba",
    species: "African Lion",
    habitat: "Savanna Enclosure",
    imageUrl: "https://images.unsplash.com/photo-1545006398-2cf48043d3f3?q=80&w=400",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    ownerId: "d290f1ee-6c54-4b01-90e6-d701748f0851", // rajatacalista
    paymentStatus: "Paid"
  },
  {
    id: "ani-102",
    name: "Zara",
    species: "Plains Zebra",
    habitat: "Savanna Enclosure",
    imageUrl: "https://images.unsplash.com/photo-1549975248-52273875de73?q=80&w=400",
    startDate: "2025-02-01",
    endDate: "2025-11-30",
    ownerId: "d290f1ee-6c54-4b01-90e6-d701748f0851", // rajatacalista
    paymentStatus: "Pending" // Let's make one with Pending for testing
  },
  {
    id: "ani-103",
    name: "Luna",
    species: "Kucing",
    habitat: "Sabana Afrika",
    imageUrl: "https://example.com/luna.jpg",
    startDate: "2025-02-01",
    endDate: "2025-11-30",
    ownerId: "11d5b3ec-4513-476e-b5ee-7a9ecb2f13f2", // margana08
    paymentStatus: "Paid"
  }
];

const adopters = [
  {
    id: "d290f1ee-6c54-4b01-90e6-d701748f0851",
    username: "rajatacalista",
    type: "individu",
    address: "Jalan Pasteur No. 949, Ambon, Jawa Tengah 90622",
    birthDate: "1997-04-24",
    nik: "3175091201010001",
    name: "Prasetya Andriani",
    noTelp: "089635460305",
  },
  {
    id: "11d5b3ec-4513-476e-b5ee-7a9ecb2f13f2",
    username: "margana08",
    type: "organisasi",
    address: "Gg. Ir. H. Djuanda No. 06, Banjarbaru, LA 79983",
    birthDate: "1975-03-22",
    npp: "ORG00001",
    organizationName: "Yayasan Margana Jaya",
    noTelp: "080925544576",
  },
];

export default function AdopterAdopsiDetailModule({ animalId }: { animalId: string }) {
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);
  const [showPaymentAlert, setShowPaymentAlert] = useState(false); // Add alert for payment status
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(""); // Dynamic toast message
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAdopter, setSelectedAdopter] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Cari data hewan berdasarkan ID
  const animal = animals.find((a) => a.id === animalId);

  useEffect(() => {
    if (animal) {
      const owner = adopters.find(a => a.id === animal.ownerId);
      if (owner) {
        setCurrentUser(owner);
      }
    }
  }, [animal]);

  if (!animal) {
    return <p className="text-center">Data hewan tidak ditemukan.</p>;
  }

  if (!currentUser) {
    return <p className="text-center">Loading user data...</p>;
  }

  const handleStopAdoption = () => {
    setShowAlert(false);
    setToastMessage("Anda telah berhenti mengadopsi satwa ini!");
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      router.push("/adopter-adopsi"); 
    }, 3000);
  };

  const handleExtendAdoption = () => {
    // Check payment status first
    if (animal.paymentStatus === "Pending") {
      setShowPaymentAlert(true);
      return;
    }
    
    // If paid, proceed with extension
    setSelectedAdopter({...currentUser, animal});
    setIsModalOpen(true);
  };

  const handlePayNow = () => {
    setShowPaymentAlert(false);
    setToastMessage("Redirecting to payment page...");
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      // In real app, redirect to payment page
      // For demo, just close the dialog
    }, 3000);
  };

  const handleSuccess = (data: { nominal: string; adoptionPeriod: string }) => {
    setIsModalOpen(false);
    setToastMessage(`Perpanjangan periode adopsi berhasil selama ${data.adoptionPeriod} bulan dengan kontribusi Rp ${parseInt(data.nominal).toLocaleString('id-ID')}`);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      router.push("/adopter-adopsi");
    }, 3000);
  };

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
        <CardContent className="space-y-4 text-center">
          {/* Gambar Hewan */}
          <Avatar className="h-32 w-32 mx-auto">
            <AvatarImage src={animal.imageUrl} alt={animal.name} />
            <AvatarFallback>{animal.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>

          {/* Informasi Hewan */}
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Nama hewan:</span> {animal.name || "[nama tidak tersedia]"}
            </p>
            <p>
              <span className="font-semibold">Jenis hewan:</span> {animal.species}
            </p>
            <p>
              <span className="font-semibold">Habitat:</span> {animal.habitat}
            </p>
            <p>
              <span className="font-semibold">Tanggal Mulai Adopsi:</span> {animal.startDate}
            </p>
            <p>
              <span className="font-semibold">Tanggal Akhir Adopsi:</span> {animal.endDate}
            </p>
          </div>

          {/* Aksi */}
          <div className="flex justify-center gap-4 mt-4">
            <Button
              className="bg-primary text-white px-4 py-2 rounded-md cursor-pointer hover:bg-primary/100"
              onClick={() => router.push(`/adopter-adopsi/kondisi/${animalId}`)}
            >
              Pantau Kondisi Hewan
            </Button>
            <Badge
              className="bg-primary text-white px-4 py-2 rounded-md cursor-pointer hover:bg-primary/100"
              onClick={() => router.push(`/adopter-adopsi/sertifikat/${animal.id}`)}
            >
              Lihat Sertifikat Adopsi
            </Badge>
          </div>
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              className="bg-red-500 text-white hover:bg-red-600 hover:text-white"
              onClick={() => setShowAlert(true)}
            >
              Berhenti Adopsi
            </Button>
            <Button
              variant="outline"
              className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
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

      {/* Modal for extending adoption period */}
      {isModalOpen && selectedAdopter && (
        <>
          {selectedAdopter.type === "individu" ? (
            <AdopterIndividuFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
              <AdopterIndividuForm
                adopter={selectedAdopter}
                animal={selectedAdopter.animal} 
                onSubmit={handleSuccess}
              />
            </AdopterIndividuFormModal>
          ) : (
            <AdopterOrganisasiFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
              <AdopterOrganisasiForm
                adopter={selectedAdopter}
                animal={selectedAdopter.animal} 
                onSubmit={handleSuccess}
              />
            </AdopterOrganisasiFormModal>
          )}
        </>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
          {toastMessage}
        </div>
      )}
      
    </div>
  );
}