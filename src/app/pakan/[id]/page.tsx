import React from "react";
import { AnimalFeedingModule } from "@/modules/PemberianPakanModule/AnimalFeedingModule";

const AnimalFeedingPage = ({ params }: { params: { id: string } }) => {
  return <AnimalFeedingModule animalId={params.id} />;
};

export default AnimalFeedingPage;