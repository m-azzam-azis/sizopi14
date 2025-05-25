"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import AdminAdopsiRegisterModule from "@/modules/AdminAdopsiModule/AdminAdopsiRegisterModule";

export default function AdminAdopsiRegisterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params); 
  const searchParams = useSearchParams();

  // ambil data hewan dari query parameter
  const animalData = {
    id,
    name: searchParams.get("name") || "Tidak diketahui",
    species: searchParams.get("species") || "Tidak diketahui",
  };

  return (
    <div>
      <AdminAdopsiRegisterModule animalId={id} animalData={animalData} />
    </div>
  );
}