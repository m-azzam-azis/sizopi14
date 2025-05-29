import KondisiPage from "@/modules/AdopterAdopsiModule/AdopterAdopsiDetailModule/KondisiPage";
import { Suspense } from "react";

interface PageProps {
  params: { id: string };
}

export default async function KondisiPageRoute({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
      <KondisiPage animalId={params.id} />
    </Suspense>
  );
}