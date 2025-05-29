import React, { Suspense } from "react";
import AdopterAdopsiDetailModule from "@/modules/AdopterAdopsiModule/AdopterAdopsiDetailModule";

export default async function AdopterAdopsiDetailPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <AdopterAdopsiDetailModule animalId={params.id} />
      </Suspense>
    </div>
  );
}