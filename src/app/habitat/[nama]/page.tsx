"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Habitat } from "@/modules/HabitatModule/interface";

const HabitatDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [habitat, setHabitat] = useState<Habitat | null>(null);
  const [loading, setLoading] = useState(true);

  const nama = params.nama as string;

  useEffect(() => {
    const fetchHabitat = async () => {
      if (!nama) return;

      try {
        setLoading(true);
        const response = await fetch(
          `/api/habitat/${encodeURIComponent(nama)}`
        );
        const result = await response.json();

        if (result.success) {
          setHabitat(result.data);
        } else {
          toast.error("Habitat not found");
          router.push("/habitat");
        }
      } catch (error) {
        console.error("Error fetching habitat:", error);
        toast.error("Error fetching habitat details");
        router.push("/habitat");
      } finally {
        setLoading(false);
      }
    };

    fetchHabitat();
  }, [nama, router]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Aktif":
        return (
          <Badge className="bg-success text-success-foreground">Aktif</Badge>
        );
      case "Penuh":
        return (
          <Badge className="bg-warning text-warning-foreground">Penuh</Badge>
        );
      case "Renovasi":
        return <Badge variant="destructive">Renovasi</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto pb-20 px-4">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading habitat details...</span>
        </div>
      </div>
    );
  }

  if (!habitat) {
    return (
      <div className="container mx-auto pb-20 px-4">
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-destructive">
            Habitat Not Found
          </h1>
          <p className="text-muted-foreground mt-2">
            The habitat you're looking for doesn't exist.
          </p>
          <Button onClick={() => router.push("/habitat")} className="mt-4">
            Back to Habitat List
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto pb-20 px-4">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => router.push("/habitat")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Habitat List
        </Button>
        <h1 className="text-4xl font-bold">Detail Habitat</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">{habitat.nama}</CardTitle>
            {getStatusBadge(habitat.status)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Informasi Habitat</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-muted-foreground">Nama:</span>
                  <span className="ml-2 font-medium">{habitat.nama}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Luas Area:</span>
                  <span className="ml-2 font-medium">
                    {habitat.luas_area.toLocaleString()} m²
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">
                    Kapasitas Maksimal:
                  </span>
                  <span className="ml-2 font-medium">
                    {habitat.kapasitas} hewan
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <span className="ml-2">{getStatusBadge(habitat.status)}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Statistik</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-muted-foreground">
                    Rata-rata luas per hewan:
                  </span>
                  <span className="ml-2 font-medium">
                    {Math.round(
                      habitat.luas_area / habitat.kapasitas
                    ).toLocaleString()}{" "}
                    m²
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">
                    Kategori ukuran:
                  </span>
                  <span className="ml-2 font-medium">
                    {habitat.luas_area >= 7000
                      ? "Besar"
                      : habitat.luas_area >= 4000
                      ? "Sedang"
                      : "Kecil"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HabitatDetailPage;
