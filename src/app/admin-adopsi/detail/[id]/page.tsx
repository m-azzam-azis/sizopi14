import React from "react";
import AdminAdopsiDetailModule from "@/modules/AdminAdopsiModule/AdminAdopsiDetailModule";

export default async function AdminAdopsiDetailPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  return (
    <div>
      <AdminAdopsiDetailModule animalId={params.id} />
    </div>
  );
}