"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import AdopsiIndividuForm from "../components/forms/AdopsiIndividuForm";  
import AdopsiOrganisasiForm from "../components/forms/AdopsiOrganisasiForm";
import AdopsiIndividuFormModal from "../components/modals/AdopsiIndividuFormModal";
import AdopsiOrganisasiFormModal from "../components/modals/AdopsiOrganisasiFormModal";
import { getUserData } from "@/hooks/getUserData";

export default function AdminAdopsiRegisterModule({ animalId, animalData }: { animalId: string; animalData: any }) {
  const [username, setUsername] = useState("");
  const [adopterType, setAdopterType] = useState("individu");
  const [errorMessage, setErrorMessage] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [showForm, setShowForm] = useState(false);
  const [adopter, setAdopter] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  
  // Get user data and check role
  const { userData, isValid, isLoading: authLoading } = getUserData();

  useEffect(() => {
    // Check if user is admin
    if (!authLoading && isValid && userData.role !== "admin") {
      // If not admin, redirect to home page
      router.push("/");
    }
  }, [userData, isValid, authLoading, router]);

  const handleVerifyAccount = async () => {
    if (!username.trim()) {
      setErrorMessage("Username tidak boleh kosong");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(`/api/adopsi/verify-adopter?username=${username}&type=${adopterType}`);
      const data = await response.json();

      if (response.ok && data.found) {
        setAdopter(data.adopter);
        setIsVerified(true);
        setShowForm(true);
      } else {
        setErrorMessage("Akun dengan username ini tidak ditemukan atau tipe adopter tidak sesuai.");
        setIsVerified(false);
      }
    } catch (error) {
      console.error("Error verifying account:", error);
      setErrorMessage("Terjadi kesalahan saat memverifikasi akun.");
      setIsVerified(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitIndividuForm = async (data: { nik: string; nominal: string; adoptionPeriod: string }) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/adopsi/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_adopter: adopter.id_adopter,
          id_hewan: animalId,
          kontribusi_finansial: data.nominal,
          adoption_period: data.adoptionPeriod,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setToastMessage("Adopsi berhasil dilakukan!");
        setToastType("success");
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
          router.push("/admin-adopsi");
        }, 3000);
      } else {
        setToastMessage(result.error || "Gagal melakukan adopsi");
        setToastType("error");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setToastMessage("Terjadi kesalahan saat mengirim form");
      setToastType("error");
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitOrganisasiForm = async (data: { name: string; npp: string; nominal: string; adoptionPeriod: string }) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/adopsi/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_adopter: adopter.id_adopter,
          id_hewan: animalId,
          kontribusi_finansial: data.nominal,
          adoption_period: data.adoptionPeriod,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setToastMessage("Adopsi berhasil dilakukan!");
        setToastType("success");
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
          router.push("/admin-adopsi");
        }, 3000);
      } else {
        setToastMessage(result.error || "Gagal melakukan adopsi");
        setToastType("error");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setToastMessage("Terjadi kesalahan saat mengirim form");
      setToastType("error");
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  // If still loading authentication, show loading
  if (authLoading) {
    return (
      <div className="container mx-auto py-10 px-4 flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is not admin, don't render content (redirect will be handled in useEffect)
  if (!isValid || userData.role !== "admin") {
    return null;
  }

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
            disabled={isLoading}
          />
          <p className="text-sm text-muted-foreground text-center">
            Calon adopter akan mengadopsi satwa sebagai:
          </p>
          <RadioGroup
            value={adopterType}
            onValueChange={(value) => setAdopterType(value)}
            className="flex justify-center gap-4"
            disabled={isLoading}
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
              disabled={isLoading}
            >
              {isLoading ? "Memverifikasi..." : "Verifikasi Akun"}
            </Button>
            <Button
              variant="outline"
              className="bg-red-500 text-white hover:bg-red-600 hover:text-white"
              onClick={() => router.push("/admin-adopsi")}
              disabled={isLoading}
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
            onSubmit={handleSubmitIndividuForm}
            adopter={adopter || { name: "", address: "", noTelp: "" }}
            animalData={animalData}
          />
        </AdopsiIndividuFormModal>
      ) : (
        <AdopsiOrganisasiFormModal isOpen={showForm} onClose={handleCancel} title="">
          <AdopsiOrganisasiForm
            onSubmit={handleSubmitOrganisasiForm}
            adopter={adopter || { address: "", noTelp: "" }}
            animalData={animalData}
          />
        </AdopsiOrganisasiFormModal>
      )}

      {showToast && (
        <div className={`fixed bottom-4 right-4 ${toastType === "success" ? "bg-green-500" : "bg-red-500"} text-white p-4 rounded-md shadow-lg`}>
          {toastMessage}
        </div>
      )}
    </div>
  );
}