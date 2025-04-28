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
  species: string;
  condition: string;
  imageUrl: string;
  isAdopted: boolean;
}

export default function AdminAdopsiModule() {
  const router = useRouter();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnimals = async () => {
      setIsLoading(true);
      try {
        const data = [
          {
            id: "ani-101",
            name: "Simba",
            species: "African Lion",
            condition: "Sehat",
            imageUrl: "https://images.unsplash.com/photo-1545006398-2cf48043d3f3?q=80&w=400",
            isAdopted: true,
          },
          {
            id: "ani-102",
            name: "Zara",
            species: "Plains Zebra",
            condition: "Sehat",
            imageUrl: "https://images.unsplash.com/photo-1549975248-52273875de73?q=80&w=400",
            isAdopted: true,
          },
          {
            id: "ani-103",
            name: "Rafiki",
            species: "Giraffe",
            condition: "Dalam pemantauan",
            imageUrl: "https://images.unsplash.com/photo-1534567059665-cbcfe2e19af4?q=80&w=400",
            isAdopted: true,
          },
          {
            id: "ani-104",
            name: "Nala",
            species: "African Lion",
            condition: "Sakit",
            imageUrl: "https://images.unsplash.com/photo-1534628526458-a8de087b1123?q=80&w=400",
            isAdopted: false,
          },
        ];
        
        setTimeout(() => {
          setAnimals(data);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching animals:", error);
        setIsLoading(false);
      }
    };

    fetchAnimals();
  }, []);

  const handleViewDetail = (animalId: string) => {
    router.push(`/admin-adopsi/detail/${animalId}`); 
  };

  const handleRegisterAdmin = (animalId: string) => {
    const animalData = animals.find((animal) => animal.id === animalId);
    if (animalData) {
      router.push(`/admin-adopsi/register/${animalId}?name=${animalData.name}&species=${animalData.species}`);
    }
  };
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

  // Function to get icon based on condition
  const getConditionIcon = (condition: string) => {
    if (condition === "Dalam pemantauan") {
      return <AlertTriangle className="mr-1 h-3 w-3" />;
    }
    return null;
  };

  return (
    <div className="container mx-auto py-10 px-4 font-outfit">
      <div className="text-center mb-6">
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
      </div>

      <h2 className="text-2xl font-semibold mb-4 font-outfit text-foreground">Pantau Status Adopsi Hewan</h2>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid gap-4">
          {animals.map((animal) => (
            <Card key={animal.id} className="overflow-hidden border-border shadow-sm relative">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Avatar Image */}
                <Avatar className="h-32 w-32 rounded-md">
                  <AvatarImage src={animal.imageUrl} alt={animal.name} />
                  <AvatarFallback className="rounded-md">
                    {animal.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
          
                {/* Animal Details */}
                <div className="flex flex-col justify-center">
                  <p className="font-medium text-xl font-outfit">{animal.name || "[Tanpa nama]"}</p>
                  <p className="text-base text-muted-foreground">{animal.species}</p>
                  <Badge
                    className={`mt-2 px-3 py-1 text-sm rounded-full ${getConditionBadgeStyle(animal.condition)}`}
                  >
                    {animal.condition}
                  </Badge>
                </div>
              </div>
          
              {/* Badge and Buttons */}
              <div className="absolute top-12 right-6 flex flex-col items-end gap-4">
                {/* Badge */}
                <Badge
                  variant={animal.isAdopted ? "default" : "outline"}
                  className="text-sm px-3 py-1"
                >
                  {animal.isAdopted ? "Diadopsi" : "Tidak Diadopsi"}
                </Badge>

                {/* Buttons */}
                {animal.isAdopted ? (
                  <Button
                    variant="outline"
                    className="text-primary border-primary hover:bg-primary/10 text-base font-medium"
                    onClick={() => handleViewDetail(animal.id)}
                  >
                    <Eye className="mr-2 h-5 w-5" /> Lihat Detail
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 text-base font-medium"
                    onClick={() => handleRegisterAdmin(animal.id)}
                  >
                    <PlusCircle className="mr-2 h-5 w-5" /> Daftarkan Adopter
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
          ))}
        </div>
      )}
    </div>
  );
}