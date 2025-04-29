import KondisiPage from "@/modules/AdopterAdopsiModule/AdopterAdopsiDetailModule/KondisiPage";

export default function KondisiPageContainer({ params }: { params: { id: string } }) {
  return <KondisiPage animalId={params.id} />;
}