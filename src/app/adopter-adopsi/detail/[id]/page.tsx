import React, { Suspense } from "react";
import AdopterAdopsiDetailModule from "@/modules/AdopterAdopsiModule/AdopterAdopsiDetailModule";

export default async function AdopterAdopsiDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <AdopterAdopsiDetailModule animalId={id} />
      </Suspense>
    </div>
  );
}
