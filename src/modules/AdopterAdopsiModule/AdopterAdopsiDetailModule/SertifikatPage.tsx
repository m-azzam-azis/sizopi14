"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getUserData } from "@/hooks/getUserData";
import { toast } from "sonner";

interface Certificate {
  animalId: string;
  animalName: string;
  animalSpecies: string;
  startDate: string;
  endDate: string;
  ownerId: string;
}

interface Adopter {
  id: string;
  username: string;
  type: string;
  name?: string;
  organizationName?: string;
}

export default function SertifikatPage() {
  const router = useRouter();
  const params = useParams();
  const animalId = params.id as string;
  const { userData, isValid } = getUserData();
  
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [adopter, setAdopter] = useState<Adopter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCertificateData = async () => {
      if (!isValid || !userData.username) return;
      
      setLoading(true);
      try {
        const response = await fetch(`/api/adopter-adopsi/certificate/${animalId}?username=${userData.username}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch certificate data");
        }
        
        const data = await response.json();
        setCertificate(data.certificate);
        setAdopter(data.adopter);
      } catch (err) {
        console.error("Error fetching certificate data:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch certificate data");
        toast.error("Failed to load certificate data");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificateData();
  }, [animalId, userData.username, isValid]);

  if (loading) {
    return <p className="text-center">Memuat data sertifikat...</p>;
  }

  if (error || !certificate || !adopter) {
    return <p className="text-center">Data sertifikat tidak ditemukan.</p>;
  }

  const adopterName = adopter.type === "individu" 
    ? adopter.name 
    : adopter.organizationName;

  // Format tanggal untuk tampilan sertifikat
  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return "";
    return dateString;
  };

  return (
    <div className="container mx-auto py-10 px-4 font-serif">
      <div className="relative border-4 border-green-600 rounded-lg shadow-lg p-10 max-w-3xl mx-auto flex flex-col justify-between h-full">
        {/* Header Sertifikat */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-8">SERTIFIKAT ADOPSI SATWA</h1>
          
          <p className="text-lg mt-6">Sertifikat ini diberikan kepada:</p>
          
          <h2 className="text-3xl font-bold text-green-700 my-4">{adopterName}</h2>
          
          <p className="text-lg mt-6">yang telah mengadopsi satwa:</p>
          
          <p className="mt-4">
            <span className="font-bold text-xl">{certificate.animalSpecies}</span>{" "}
            <span className="text-lg">bernama</span>{" "}
            <span className="font-bold text-xl">{certificate.animalName}</span>
          </p>
          
          <p className="mt-6 text-lg">
            di taman safari secara simbolis dari{" "}
            <span className="font-bold">{formatDisplayDate(certificate.startDate)}</span> hingga{" "}
            <span className="font-bold">{formatDisplayDate(certificate.endDate)}</span>.
          </p>
          
          <p className="italic text-gray-600 mt-8 text-base">
            Kami sangat berterima kasih atas kepedulian dan kontribusi Anda terhadap kelestarian
            <br />satwa di taman safari.
          </p>
        </div>

        {/* Tombol Kembali */}
        <div className="mt-12 text-center">
          <button
            className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 font-outfit"
            onClick={() => router.back()}
          >
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
}