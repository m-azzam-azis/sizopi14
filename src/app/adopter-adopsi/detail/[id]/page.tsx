import AdopterAdopsiDetailModule from "@/modules/AdopterAdopsiModule/AdopterAdopsiDetailModule";
import { Suspense } from "react";

interface PageProps {
  params: { id: string };
}

export default async function AdopterAdopsiDetailPage({ params }: PageProps) {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <AdopterAdopsiDetailModule animalId={params.id} />
      </Suspense>
    </div>
  );
}