import React from "react";
import RiwayatAdopsiModule from "@/modules/AdopterRiwayatModule/RiwayatModule/index";

export default function AdopterDetailPage({ params }: { params: { id: string } }) {
  const { id } = params; 
  return <RiwayatAdopsiModule adopterId={id} />;
}