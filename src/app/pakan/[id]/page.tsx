import React from "react";
import { AnimalFeedingModule } from "@/modules/PemberianPakanModule/AnimalFeedingModule";

export default async function AnimalFeedingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AnimalFeedingModule animalId={id} />;
}
