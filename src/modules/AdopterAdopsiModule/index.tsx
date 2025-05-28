"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserData } from "@/hooks/getUserData";
import { toast } from "sonner";

interface Animal {
  id_hewan: string;
  nama_hewan: string;
  spesies: string;
  status_kesehatan: string;
  url_foto: string;
  status_pembayaran: string;
  kontribusi_finansial: number;
  tgl_mulai_adopsi: string;
  tgl_berhenti_adopsi: string | null;
}

interface Adopter {
  id_adopter: string;
  username_adopter: string;
  total_kontribusi: number;
  name: string;
  type: "individu" | "organisasi";
  contact: string;
  email: string;
  address: string;
}

export default function AdopterAdopsiModule() {
  const router = useRouter();
  const { userData, isValid, isLoading } = getUserData();
  const [adopter, setAdopter] = useState<Adopter | null>(null);
  const [adoptedAnimals, setAdoptedAnimals] = useState<Animal[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      if (!isValid || !userData.username) {
        setIsLoaded(true);
        return;
      }

      try {
        console.log("Mengambil data adopsi untuk:", userData.username);
        const response = await fetch(`/api/adopter-adopsi?username=${userData.username}`);
        
        if (!isMounted) return;
        
        if (response.ok) {
          const data = await response.json();
          console.log("Data adopsi diterima:", data);
          
          if (data.adopter) {
            setAdopter(data.adopter);
            
            // Filter hanya adopsi yang aktif (tanggal akhir > hari ini atau null)
            const activeAdoptions = (data.adoptions || []).filter((animal: Animal) => {
              const endDate = animal.tgl_berhenti_adopsi ? new Date(animal.tgl_berhenti_adopsi) : null;
              const today = new Date();
              return !endDate || endDate > today;
            });
            
            setAdoptedAnimals(activeAdoptions);
            setError(null);
          } else {
            console.error("Data adopter tidak lengkap:", data);
            setError("Data adopter tidak ditemukan");
          }
        } else {
        }
      } catch (err) {
      } finally {
        if (isMounted) {
          setIsLoaded(true);
        }
      }
    };

    fetchData();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [isValid, userData.username]);

  const handleDetailClick = (id: string) => {
    router.push(`/adopter-adopsi/detail/${id}`);
  };

  const getConditionBadgeStyle = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "sehat":
        return "bg-green-500 hover:bg-green-600 text-white";
      case "sakit":
        return "bg-red-500 hover:bg-red-600 text-white";
      case "dalam pemantauan":
      case "dalam pengawasan":
        return "bg-amber-500 hover:bg-amber-600 text-white";
      default:
        return "bg-red-500 hover:bg-blue-600 text-white";
    }
  };

  // Show loading state
  if (isLoading || !isLoaded) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <p>Memuat data...</p>
      </div>
    );
  }

  // Show login prompt if user is not logged in
  if (!isValid) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <p>Anda harus login terlebih dahulu untuk mengakses halaman ini.</p>
        <Button 
          className="mt-4"
          onClick={() => router.push('/login')}
        >
          Login
        </Button>
      </div>
    );
  }

  // Show error message if any
  if (error) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <p className="text-red-500">{error}</p>
        <Button 
          className="mt-4"
          onClick={() => router.push('/')}
        >
          Kembali ke Beranda
        </Button>
      </div>
    );
  }

  // Show message if user is not an adopter
  if (!adopter) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <p>Anda tidak terdaftar sebagai adopter. Silakan mendaftar sebagai adopter terlebih dahulu.</p>
        <Button 
          className="mt-4"
          onClick={() => router.push('/')}
        >
          Kembali ke Beranda
        </Button>
      </div>
    );
  }

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

      <h2 className="text-xl font-bold mb-6">
        {adopter.type === "individu" 
          ? "Hewan yang Sedang Anda Adopsi"
          : `Hewan yang Sedang Diadopsi oleh ${adopter.name}`
        }
      </h2>

      {adoptedAnimals.length > 0 ? (
        <div className="space-y-6">
          {adoptedAnimals.map((animal) => (
            <Card key={animal.id_hewan}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <Avatar className="h-32 w-32 rounded-md">
                    <AvatarImage src={animal.url_foto || ""} alt={animal.nama_hewan} />
                    <AvatarFallback className="rounded-md">
                      {animal.nama_hewan?.substring(0, 2).toUpperCase() || "HW"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2 flex-1">
                    <h3 className="font-semibold text-lg">{animal.nama_hewan || "[nama hewan tidak tersedia]"}</h3>
                    <p className="text-muted-foreground">{animal.spesies}</p>
                    <Badge
                      className={`mt-2 px-3 py-1 text-sm rounded-full ${getConditionBadgeStyle(animal.status_kesehatan)}`}
                    >
                      {animal.status_kesehatan}
                    </Badge>
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        className="text-primary border-primary hover:bg-primary/10 text-base font-medium"
                        onClick={() => handleDetailClick(animal.id_hewan)}
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
      ) : (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Tidak ada hewan yang sedang diadopsi.</p>
        </div>
      )}
    </div>
  );
}