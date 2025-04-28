"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import AdopsiIndividuForm from "../components/forms/AdopsiIndividuForm";  
import AdopsiOrganisasiForm from "../components/forms/AdopsiOrganisasiForm";
import AdopsiIndividuFormModal from "../components/modals/AdopsiIndividuFormModal";
import AdopsiOrganisasiFormModal from "../components/modals/AdopsiOrganisasiFormModal";
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
    id: "c9bf9e57-1685-4c89-bafb-ff5af830be8a",
    username: "nsihotang",
    type: "individu",
    address: "Jl. Erlangga No. 73, Tangerang, Kalimantan Selatan 57458",
    birthDate: "2004-05-14",
    nik: "3276012202910002",
    name: "Damar Thamrin",
    noTelp: "083573452405",
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
  {
    id: "6de43d1c-c0c2-4375-8dbf-4e6e1bdfc7b1",
    username: "dwinarno",
    type: "organisasi",
    address: "Gang Wonoayu No. 3, Padang Sidempuan, Jawa Barat 35772",
    birthDate: "1988-05-27",
    npp: "ORG00002",
    organizationName: "Lembaga Dwinarno Mandiri",
    noTelp: "080749318642",
  },
];

export default function AdminAdopsiRegisterModule({ animalId, animalData }: { animalId: string; animalData: any }) {
  const [username, setUsername] = useState("");
  const [adopterType, setAdopterType] = useState("individu");
  const [errorMessage, setErrorMessage] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [showToast, setShowToast] = useState(false); 
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();

  const handleVerifyAccount = () => {
    const adopter = adopters.find(
      (adopter) => adopter.username === username && adopter.type === adopterType
    );

    if (adopter) {
      setIsVerified(true);
      setErrorMessage("");
      setShowForm(true);
    } else {
      setErrorMessage("Akun dengan username ini tidak ditemukan atau tipe adopter tidak sesuai.");
      setIsVerified(false);
    }
  };

  const handleSubmitsForm = (data: { nik: string; nominal: string; adoptionPeriod: string }) => {
    // Simulasi perubahan status isAdopted menjadi true
    animalData.isAdopted = true;
    setShowToast(true);
    setTimeout(() => {
        setShowToast(false);
        router.push("/admin-adopsi");
      }, 3000);
    };

  const handleSubmitForm = (data: { name: string; npp: string; nominal: string; adoptionPeriod: string }) => {
    // Simulasi perubahan status isAdopted menjadi true
    animalData.isAdopted = true;
    setShowToast(true);
    setTimeout(() => {
        setShowToast(false);
        router.push("/admin-adopsi");
      }, 3000);
    };

  const handleCancel = () => {
    setShowForm(false);
  };

  return (
    <div className="container mx-auto py-10 px-4 font-outfit flex flex-col items-center">
      <Card className="shadow-md w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold">Pendataan Adopter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Username calon <span className="italic">adopter</span>:
          </p>
          <Input
            placeholder="Masukkan username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full"
          />
          <p className="text-sm text-muted-foreground text-center">
            Calon adopter akan mengadopsi satwa sebagai:
          </p>
          <RadioGroup
            value={adopterType}
            onValueChange={(value) => setAdopterType(value)}
            className="flex justify-center gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="individu" id="individu" />
              <label htmlFor="individu" className="text-sm">
                Individu
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="organisasi" id="organisasi" />
              <label htmlFor="organisasi" className="text-sm">
                Organisasi
              </label>
            </div>
          </RadioGroup>
          {errorMessage && <p className="text-sm text-red-500 text-center">{errorMessage}</p>}
          <div className="flex justify-center gap-4">
            <Button
              variant="default"
              className="bg-blue-500 text-white hover:bg-blue-600"
              onClick={handleVerifyAccount}
            >
              Verifikasi Akun
            </Button>
            <Button
              variant="outline"
              className="bg-red-500 text-white hover:bg-red-600 hover:text-white"
              onClick={() => router.push("/admin-adopsi")}
            >
              Batal
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      {adopterType === "individu" ? (
        <AdopsiIndividuFormModal isOpen={showForm} onClose={handleCancel} title="">
          <AdopsiIndividuForm
            onSubmit={handleSubmitsForm}
            adopter={adopters.find((a) => a.username === username && a.type === "individu") as { name: string; address: string; noTelp: string }}
            animalData={animalData}
          />
        </AdopsiIndividuFormModal>
      ) : (
        <AdopsiOrganisasiFormModal isOpen={showForm} onClose={handleCancel} title="">
          <AdopsiOrganisasiForm
            onSubmit={handleSubmitForm}
            adopter={adopters.find((a) => a.username === username && a.type === "organisasi") as { address: string; noTelp: string }}
            animalData={animalData}
          />
        </AdopsiOrganisasiFormModal>
      )}

        {showToast && (
            <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-md shadow-lg">
            Adopsi berhasil dilakukan!
            </div>
        )}
    </div>
  );
}