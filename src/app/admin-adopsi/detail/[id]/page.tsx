import React from "react";
import AdminAdopsiDetailModule from "@/modules/AdminAdopsiModule/AdminAdopsiDetailModule";

export default function AdminAdopsiDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  return (
    <div>
      <AdminAdopsiDetailModule animalId={id} />
    </div>
  );
}