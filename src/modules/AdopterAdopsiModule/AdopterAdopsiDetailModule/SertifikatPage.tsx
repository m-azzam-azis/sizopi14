"use client";

import { useRouter, useParams } from "next/navigation";

const animals = [
  {
    id: "ani-101",
    adopterName: "Prasetya Andriani",
    animalName: "Simba",
    animalSpecies: "African Lion",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
  },
  {
    id: "ani-102",
    adopterName: "Prasetya Andriani",
    animalName: "Zara",
    animalSpecies: "Plains Zebra",
    startDate: "2025-02-01",
    endDate: "2025-11-30",
  },
];

export default function SertifikatPage() {
  const router = useRouter();
  const params = useParams();
  const animalId = params.id;

  // Cari data hewan berdasarkan ID
  const animal = animals.find((a) => a.id === animalId);

  if (!animal) {
    return <p className="text-center">Data sertifikat tidak ditemukan.</p>;
  }

  return (
    <div className="container mx-auto py-10 px-4 font-serif">
  <div className="relative border-4 border-primary rounded-lg shadow-lg p-10 max-w-3xl mx-auto flex flex-col justify-between h-full">
    {/* Header Sertifikat */}
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-black-600">SERTIFIKAT ADOPSI SATWA</h1>
      <p className="text-lg text-gray-700 mt-2">Sertifikat ini diberikan kepada:</p>
      <h2 className="text-2xl font-bold text-primary mt-4">{animal.adopterName}</h2>
    </div>

    {/* Konten Sertifikat */}
    <div className="text-center text-gray-700 leading-relaxed">
      <p className="mb-4">yang telah mengadopsi satwa:</p>
      <p className="mb-4">
        <span className="font-bold">{animal.animalSpecies}</span> bernama{" "}
        <span className="font-bold">{animal.animalName || "[nama tidak tersedia]"}</span>
      </p>
      <p className="mb-4">
        di taman safari secara simbolis dari{" "}
        <span className="font-bold">{animal.startDate}</span> hingga{" "}
        <span className="font-bold">{animal.endDate}</span>.
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