import React from "react";
import AdopterAdopsiDetailModule from "@/modules/AdopterAdopsiModule/AdopterAdopsiDetailModule";

export default function AdopterAdopsiDetailPage({ params }: { params: { id: string } }) {
  const { id } = params; 
  return (
    <div>
      <AdopterAdopsiDetailModule animalId={id} />
    </div>
  );
}