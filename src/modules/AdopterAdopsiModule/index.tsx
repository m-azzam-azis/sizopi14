"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, PlusCircle, AlertTriangle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Animal {
  id: string;
  name: string;
  habitat: string;
  species: string;
  condition: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  isAdopted: boolean;
}

export default function AdopterAdopsiModule() {
  const router = useRouter();

  // Sample data for user's adopted animals
  const [adoptedAnimals, setAdoptedAnimals] = useState<Animal[]>([
    {
      id: "ani-101",
      name: "Simba",
      species: "African Lion",
      condition: "Sehat",
      habitat: "Savanna Enclosure",
      imageUrl: "https://images.unsplash.com/photo-1545006398-2cf48043d3f3?q=80&w=400",
      startDate: "2025-01-01",
      endDate: "2025-12-31",
      isAdopted: true,
    },
    {
      id: "ani-102",
      name: "Zara",
      species: "Plains Zebra",
      condition: "Sehat",
      habitat: "Savanna Enclosure",
      imageUrl: "https://images.unsplash.com/photo-1549975248-52273875de73?q=80&w=400",
      startDate: "2025-02-01",
      endDate: "2025-11-30",
      isAdopted: true,
    },
  ]);

  const getConditionBadgeStyle = (condition: string) => {
    switch (condition) {
      case "Sehat":
        return "bg-green-500 hover:bg-green-600 text-white";
      case "Sakit":
        return "bg-red-500 hover:bg-red-600 text-white";
      case "Dalam pemantauan":
        return "bg-amber-500 hover:bg-amber-600 text-white";
      default:
        return "";
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 font-outfit">
      <Card className="mb-8">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary font-outfit">
            Program Adopsi Satwa: Bantu Mereka dengan Cinta
          </CardTitle>
          <div className="flex justify-center mt-4">
            <img
              src="https://cms-artifacts.artlist.io/content/generated-image/image__9/generated-image-94bf53e6-84b8-4e0e-84df-6ede89a96e97.jpg?Expires=2061173726&Key-Pair-Id=K2ZDLYDZI2R1DF&Signature=HCDLrFIR6dxrz0NJon1-8CM-Z-wMbAGVKUbwPja6Rvh8j1kQ5r0uo-SyM3iX8jPSpDVFFWUZylNloednDRuSpk5MVMOiXzxYZcraGX7T9D0zB4CWgbp4RaK0fzWzx8zxeGtDi0ZkAQAAqKC6o5s-TkaOvix4j6hZV-iHs2BL3MTKF16G-L4dA-K5dLPEqQRFb-14rizByqIzvhNB9D~IZqsL8LG~FF6Z8~LbfngviAuW-yRZ1Q2m0wuuQEXzbVSoITRFRo4fdriFQudeDGGavA4wRaYAfEkfY~2CBBQLJElKx7FSYM33uH5krhARFEO7kJC0YKAI7qIUyaRAxFpZ8Q__"
              alt="Lion hugging a cub"
              className="rounded-lg shadow-md w-full max-w-md"
            />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-center">
            Terima kasih telah mewujudkan kepedulian Anda terhadap satwa dengan menjadi adopter simbolis!
          </p>
          <p className="text-center">
            Dapatkan sertifikat digital dan laporan berkala tentang kondisi hewan yang Anda dukung.
          </p>
        </CardContent>
      </Card>

      <h2 className="text-xl font-bold mb-6">Hewan yang Sedang Anda Adopsi</h2>

      <div className="space-y-6">
        {adoptedAnimals.map((animal) => (
          <Card key={animal.id}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
              <Avatar className="h-32 w-32 rounded-md">
                <AvatarImage src={animal.imageUrl} alt={animal.name} />
                <AvatarFallback className="rounded-md">
                  {animal.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
                <div className="space-y-2 flex-1">
                  <h3 className="font-semibold text-lg">{animal.name || "[nama hewan] (kalau ada)"}</h3>
                  <p className="text-muted-foreground">{animal.species}</p>
                  <Badge
                    className={`mt-2 px-3 py-1 text-sm rounded-full ${getConditionBadgeStyle(animal.condition)}`}
                  >
                    {animal.condition}
                  </Badge>
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      className="text-primary border-primary hover:bg-primary/10 text-base font-medium"
                      onClick={() => router.push(`/adopter-adopsi/detail/${animal.id}`)}
                    >
                      <Eye className="mr-2 h-5 w-5" /> Lihat Detail
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}