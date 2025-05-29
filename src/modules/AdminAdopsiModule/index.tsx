"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, PlusCircle, AlertTriangle, Filter } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AnimalDisplayType } from "@/db/types";
import { getUserData } from "@/hooks/getUserData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AnimalDisplay extends AnimalDisplayType {
  isAdopted: boolean;
}

export default function AdminAdopsiModule() {
  const router = useRouter();
  const [animals, setAnimals] = useState<AnimalDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  // Dapatkan data user dan cek role
  const { userData, isValid, isLoading: authLoading } = getUserData();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Cek apakah user adalah admin
    if (!authLoading && isValid && userData.role !== "admin") {
      // Jika bukan admin, redirect ke halaman utama
      router.push("/");
    }
  }, [userData, isValid, authLoading, router]);

  useEffect(() => {
    // Hanya ambil data jika user valid dan loading auth selesai
    if (mounted && isValid && !authLoading) {
      // Parse query params untuk memeriksa apakah perlu refresh
      const url = new URL(window.location.href);
      const hasRefreshParam = url.searchParams.has("t");

      if (hasRefreshParam) {
        router.replace("/admin-adopsi");
      }

      fetchAnimals();
    }
  }, [statusFilter, isValid, authLoading, router]);

  const fetchAnimals = async () => {
    setIsLoading(true);
    try {
      // Tambahkan parameter timestamp untuk mencegah caching
      const response = await fetch(
        `/api/adopsi?status=${statusFilter}&t=${Date.now()}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched animals data:", data);

      setAnimals(data);

      // Calculate stats but don't store in state since it's not used in the UI
      // const adoptedCount = data.filter((animal: AnimalDisplay) => animal.isAdopted).length;
      // const unadoptedCount = data.filter((animal: AnimalDisplay) => !animal.isAdopted).length;
    } catch (error) {
      console.error("Error fetching animals:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh function if needed elsewhere in the component
  const refreshData = () => {
    fetchAnimals();
  };

  // Jika masih loading autentikasi, tampilkan loading
  if (authLoading) {
    return (
      <div className="container mx-auto py-10 px-4 flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Jika user bukan admin, jangan render konten (redirect akan dihandle useEffect)
  if (!isValid || userData.role !== "admin") {
    return null;
  }

  // Kode lainnya tetap sama
  const handleViewDetail = (animalId: string) => {
    router.push(`/admin-adopsi/detail/${animalId}`);
  };

  const handleRegisterAdmin = (animalId: string) => {
    const animalData = animals.find((animal) => animal.id_hewan === animalId);
    if (animalData) {
      router.push(
        `/admin-adopsi/register/${animalId}?name=${animalData.nama_hewan}&species=${animalData.spesies}`
      );
    }
  };

  const getConditionBadgeStyle = (condition: string) => {
    switch (condition) {
      case "Sehat":
        return "bg-green-500 hover:bg-green-600 text-white";
      case "Sedang Sakit":
        return "bg-red-500 hover:bg-red-600 text-white";
      case "Dalam pemantauan":
        return "bg-amber-500 hover:bg-amber-600 text-white";
      default:
        return "";
    }
  };

  const getConditionIcon = (condition: string) => {
    if (condition === "Dalam pemantauan") {
      return <AlertTriangle className="mr-1 h-3 w-3" />;
    }
    return null;
  };

  // Optional: Stats Display if you want to use them
  const adoptedCount = animals.filter((animal) => animal.isAdopted).length;
  const unadoptedCount = animals.filter((animal) => !animal.isAdopted).length;

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

      {/* Header with filtering */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold font-outfit text-foreground">
            Pantau Status Adopsi Hewan
          </h2>
          {/* Optional: Display stats in UI */}
          <div className="text-sm text-muted-foreground mt-1">
            <span className="font-medium">{adoptedCount}</span> diadopsi &bull;{" "}
            <span className="font-medium">{unadoptedCount}</span> belum diadopsi
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Hewan</SelectItem>
              <SelectItem value="adopted">Diadopsi</SelectItem>
              <SelectItem value="unadopted">Tidak Diadopsi</SelectItem>
            </SelectContent>
          </Select>

          {/* Optional: Add a refresh button */}
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            className="ml-2"
          >
            Refresh
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : animals.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              Tidak ada hewan yang ditemukan dengan filter ini.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {animals.map((animal) => (
            <Card
              key={animal.id_hewan}
              className="overflow-hidden border-border shadow-sm relative"
            >
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Avatar Image */}
                  <Avatar className="h-32 w-32 rounded-md">
                    <AvatarImage
                      src={animal.url_foto}
                      alt={animal.nama_hewan}
                    />
                    <AvatarFallback className="rounded-md">
                      {animal.nama_hewan?.substring(0, 2).toUpperCase() || "AN"}
                    </AvatarFallback>
                  </Avatar>

                  {/* Animal Details */}
                  <div className="flex flex-col justify-center">
                    <p className="font-medium text-xl font-outfit">
                      {animal.nama_hewan || "[Tanpa nama]"}
                    </p>
                    <p className="text-base text-muted-foreground">
                      {animal.spesies}
                    </p>
                    <Badge
                      className={`mt-2 px-3 py-1 text-sm rounded-full ${getConditionBadgeStyle(
                        animal.status_kesehatan
                      )}`}
                    >
                      {getConditionIcon(animal.status_kesehatan)}
                      {animal.status_kesehatan}
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
                      onClick={() => handleViewDetail(animal.id_hewan)}
                    >
                      <Eye className="mr-2 h-5 w-5" /> Lihat Detail
                    </Button>
                  ) : (
                    <Button
                      variant="default"
                      className="bg-primary text-primary-foreground hover:bg-primary/90 text-base font-medium"
                      onClick={() => handleRegisterAdmin(animal.id_hewan)}
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
