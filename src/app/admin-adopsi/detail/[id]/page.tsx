import React from "react";
import AdminAdopsiDetailModule from "@/modules/AdminAdopsiModule/AdminAdopsiDetailModule";

export default function AdminAdopsiDetailPage({ params }: { params: { id: string } }) {
  const { id } = params; // Ambil parameter id dari URL

  return (
    <div>
      {/* Teruskan parameter id ke AdminAdopsiDetailModule */}
      <AdminAdopsiDetailModule animalId={id} />
    </div>
  );
}