"use client";

import { useParams } from "next/navigation";
import RiwayatAdopsiModule from "@/modules/AdopterRiwayatModule/RiwayatModule/index";

export default function AdopterDetailPage() {
  const params = useParams();

  const adopterId = params.id as string;
  return <RiwayatAdopsiModule adopterId={adopterId} />;
}