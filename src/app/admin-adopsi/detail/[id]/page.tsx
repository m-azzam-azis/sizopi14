import React from "react";
import AdminAdopsiDetailModule from "@/modules/AdminAdopsiModule/AdminAdopsiDetailModule";

export default async function AdminAdopsiDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <AdminAdopsiDetailModule animalId={id} />
    </div>
  );
}
