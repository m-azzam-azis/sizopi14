import React from "react";
import { AnimalFeedingModule } from "@/modules/PemberianPakanModule/AnimalFeedingModule";

export default async function AnimalFeedingPage({ params }: { params: { id: string } }) {
  const { id } = params;
  return <AnimalFeedingModule animalId={id} />;
}