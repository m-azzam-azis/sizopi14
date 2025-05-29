"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2, Pencil, Trash, Eye } from "lucide-react";
import { toast } from "sonner";
import { Habitat } from "@/modules/HabitatModule/interface";
import { HewanWithHabitat } from "@/modules/HewanModule/interface";
import HabitatFormModal from "@/modules/HabitatModule/components/modals/HabitatFormModal";
import { HabitatFormValues } from "@/modules/HabitatModule/components/forms/HabitatForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";

const HabitatDetailModule = () => {
  const params = useParams();
  const router = useRouter();
  const [habitat, setHabitat] = useState<Habitat | null>(null);
  const [animals, setAnimals] = useState<HewanWithHabitat[]>([]);
  const [loading, setLoading] = useState(true);
  const [animalsLoading, setAnimalsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const id = params.id as string;

  useEffect(() => {
    const fetchHabitat = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/habitat/${encodeURIComponent(id)}`);
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
  }, [id, router]);

  useEffect(() => {
    const fetchAnimals = async () => {
      if (!id) return;

      try {
        setAnimalsLoading(true);
        const response = await fetch("/api/hewan");
        const result = await response.json();

        if (result.success) {
          // Filter animals by habitat name
          const habitatAnimals = result.data.filter(
            (animal: HewanWithHabitat) =>
              animal.nama_habitat === decodeURIComponent(id)
          );
          setAnimals(habitatAnimals);
        } else {
          console.error("Failed to fetch animals");
        }
      } catch (error) {
        console.error("Error fetching animals:", error);
      } finally {
        setAnimalsLoading(false);
      }
    };

    if (habitat) {
      fetchAnimals();
    }
  }, [id, habitat]);

  const handleEditSubmit = async (data: HabitatFormValues) => {
    try {
      const response = await fetch(`/api/habitat/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama: data.name,
          luas_area: parseFloat(data.area),
          kapasitas: parseInt(data.capacity),
          status: data.environmentStatus,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Habitat updated successfully");
        setHabitat(result.data);
        setIsEditModalOpen(false);
      } else {
        toast.error("Error updating habitat", {
          description: result.error || "Failed to update habitat",
        });
      }
    } catch (error) {
      console.error("Error updating habitat:", error);
      toast.error("Network Error", {
        description: "Unable to update habitat",
      });
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/habitat/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Habitat deleted successfully");
        router.push("/habitat");
      } else {
        toast.error("Error deleting habitat", {
          description: result.error || "Failed to delete habitat",
        });
      }
    } catch (error) {
      console.error("Error deleting habitat:", error);
      toast.error("Network Error", {
        description: "Unable to delete habitat",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Aktif":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Aktif
          </Badge>
        );
      case "Penuh":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Penuh
          </Badge>
        );
      case "Renovasi":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            Renovasi
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getHealthStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "sehat":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Sehat
          </Badge>
        );
      case "sedang sakit":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Sedang Sakit
          </Badge>
        );
      case "sakit":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            Sakit
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Tidak diketahui";
    return new Date(dateString).toLocaleDateString("id-ID");
  };

  const handleViewAnimal = (animalId: string) => {
    router.push(`/hewan/${animalId}`);
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

      {/* Habitat Information Card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CardTitle className="text-2xl">{habitat.nama}</CardTitle>
              {getStatusBadge(habitat.status)}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsEditModalOpen(true)}
                className="h-8 w-8"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsDeleteDialogOpen(true)}
                className="h-8 w-8 text-destructive hover:bg-destructive/10"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Informasi Habitat</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-muted-foreground">Luas Area:</span>
                  <p className="font-medium text-lg">
                    {parseFloat(habitat.luas_area.toString()).toLocaleString()}{" "}
                    m²
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <div className="mt-1">{getStatusBadge(habitat.status)}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Kapasitas:</span>
                  <p className="font-medium text-lg">
                    {habitat.kapasitas} hewan
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Statistik</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-muted-foreground">
                    Jumlah Hewan Saat Ini:
                  </span>
                  <p className="font-medium text-lg">{animals.length} hewan</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Tingkat Hunian:</span>
                  <p className="font-medium text-lg">
                    {Math.round((animals.length / habitat.kapasitas) * 100)}%
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">
                    Rata-rata Luas per Hewan:
                  </span>
                  <p className="font-medium text-lg">
                    {animals.length > 0
                      ? Math.round(
                          parseFloat(habitat.luas_area.toString()) /
                            animals.length
                        ).toLocaleString()
                      : parseFloat(
                          habitat.luas_area.toString()
                        ).toLocaleString()}{" "}
                    m²
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Status Kapasitas</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-muted-foreground">
                    Kategori Ukuran:
                  </span>
                  <p className="font-medium text-lg">
                    {parseFloat(habitat.luas_area.toString()) >= 7000
                      ? "Besar"
                      : parseFloat(habitat.luas_area.toString()) >= 4000
                      ? "Sedang"
                      : "Kecil"}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Sisa Kapasitas:</span>
                  <p className="font-medium text-lg">
                    {habitat.kapasitas - animals.length} hewan
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Animals in Habitat Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Daftar Hewan dalam Habitat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border">
            {animalsLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Loading animals...</span>
              </div>
            ) : animals.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                Tidak ada hewan di habitat ini
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Foto</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Spesies</TableHead>
                    <TableHead>Asal</TableHead>
                    <TableHead>Tanggal Lahir</TableHead>
                    <TableHead>Status Kesehatan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {animals.map((animal) => (
                    <TableRow key={animal.id}>
                      <TableCell>
                        <div className="relative w-12 h-12 rounded-full overflow-hidden">
                          <Image
                            src={animal.url_foto || "/placeholder-animal.jpg"}
                            alt={animal.nama || "Animal"}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {animal.nama || "Tanpa Nama"}
                      </TableCell>
                      <TableCell>{animal.spesies}</TableCell>
                      <TableCell>{animal.asal_hewan}</TableCell>
                      <TableCell>{formatDate(animal.tanggal_lahir)}</TableCell>
                      <TableCell>
                        {getHealthStatusBadge(animal.status_kesehatan)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>

      <HabitatFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        initialData={{
          name: habitat.nama,
          area: parseFloat(habitat.luas_area.toString()),
          capacity: habitat.kapasitas,
          environmentStatus: habitat.status,
        }}
        isEditing={true}
      />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Habitat</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this habitat? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default HabitatDetailModule;
