"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

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
  type: "individu" | "organisasi";
  name?: string;
  organizationName?: string;
}

const certificates: Certificate[] = [
  {
    animalId: "ani-101",
    animalName: "Simba",
    animalSpecies: "African Lion",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    ownerId: "d290f1ee-6c54-4b01-90e6-d701748f0851" // rajatacalista
  },
  {
    animalId: "ani-102",
    animalName: "Zara",
    animalSpecies: "Plains Zebra",
    startDate: "2025-02-01",
    endDate: "2025-11-30",
    ownerId: "d290f1ee-6c54-4b01-90e6-d701748f0851" // rajatacalista
  },
  {
    animalId: "ani-103",
    animalName: "Luna",
    animalSpecies: "Kucing",
    startDate: "2025-02-01",
    endDate: "2025-11-30",
    ownerId: "11d5b3ec-4513-476e-b5ee-7a9ecb2f13f2" // margana08
  }
];

const adopters: Adopter[] = [
  {
    id: "d290f1ee-6c54-4b01-90e6-d701748f0851",
    username: "rajatacalista",
    type: "individu",
    name: "Prasetya Andriani"
  },
  {
    id: "11d5b3ec-4513-476e-b5ee-7a9ecb2f13f2",
    username: "margana08",
    type: "organisasi",
    organizationName: "Yayasan Margana Jaya"
  }
];

export default function SertifikatPage() {
  const router = useRouter();
  const params = useParams();
  const animalId = params.id as string;
  
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [adopter, setAdopter] = useState<Adopter | null>(null);

  useEffect(() => {
    // Find certificate based on animalId
    const foundCertificate = certificates.find((cert) => cert.animalId === animalId);
    
    if (foundCertificate) {
      setCertificate(foundCertificate);
      
      // Find adopter based on certificate's ownerId
      const foundAdopter = adopters.find((a) => a.id === foundCertificate.ownerId);
      if (foundAdopter) {
        setAdopter(foundAdopter);
      }
    }
  }, [animalId]);

  if (!certificate || !adopter) {
    return <p className="text-center">Data sertifikat tidak ditemukan.</p>;
  }

  const adopterName = adopter.type === "individu" 
    ? adopter.name 
    : adopter.organizationName;

  return (
    <div className="container mx-auto py-10 px-4 font-serif">
      <div className="relative border-4 border-primary rounded-lg shadow-lg p-10 max-w-3xl mx-auto flex flex-col justify-between h-full">
        {/* Header Sertifikat */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black-600">SERTIFIKAT ADOPSI SATWA</h1>
          <p className="text-lg text-gray-700 mt-2">Sertifikat ini diberikan kepada:</p>
          <h2 className="text-2xl font-bold text-primary mt-4">{adopterName}</h2>
        </div>

        {/* Konten Sertifikat */}
        <div className="text-center text-gray-700 leading-relaxed">
          <p className="mb-4">yang telah mengadopsi satwa:</p>
          <p className="mb-4">
            <span className="font-bold">{certificate.animalSpecies}</span> bernama{" "}
            <span className="font-bold">{certificate.animalName || "[nama tidak tersedia]"}</span>
          </p>
          <p className="mb-4">
            di taman safari secara simbolis dari{" "}
            <span className="font-bold">{certificate.startDate}</span> hingga{" "}
            <span className="font-bold">{certificate.endDate}</span>.
          </p>
          <p className="italic text-gray-600">
            Kami sangat berterima kasih atas kepedulian dan kontribusi Anda terhadap kelestarian satwa di taman safari.
          </p>
        </div>

        {/* Tombol Kembali */}
        <div className="mt-8 text-center">
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