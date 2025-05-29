import KondisiPage from "@/modules/AdopterAdopsiModule/AdopterAdopsiDetailModule/KondisiPage";
import { Suspense } from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function KondisiPageRoute({ params }: PageProps) {
  const { id } = await params;

  return (
    <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
      <KondisiPage animalId={id} />
    </Suspense>
  );
}
