"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2, Pencil, Trash } from "lucide-react";
import { toast } from "sonner";
import { Habitat } from "@/modules/HabitatModule/interface";
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

const HabitatDetailModule = () => {
  const params = useParams();
  const router = useRouter();
  const [habitat, setHabitat] = useState<Habitat | null>(null);
  const [loading, setLoading] = useState(true);
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
                    {parseFloat(habitat.luas_area.toString()).toLocaleString()}{" "}
                    m²
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
                {/* {habitat.jumlah_hewan !== undefined && (
                  <div>
                    <span className="text-muted-foreground">Jumlah Hewan:</span>
                    <span className="ml-2 font-medium">
                      {habitat.jumlah_hewan} hewan
                    </span>
                  </div>
                )} */}
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
                      parseFloat(habitat.luas_area.toString()) /
                        habitat.kapasitas
                    ).toLocaleString()}{" "}
                    m²
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">
                    Kategori ukuran:
                  </span>
                  <span className="ml-2 font-medium">
                    {parseFloat(habitat.luas_area.toString()) >= 7000
                      ? "Besar"
                      : parseFloat(habitat.luas_area.toString()) >= 4000
                      ? "Sedang"
                      : "Kecil"}
                  </span>
                </div>
                {/* {habitat.jumlah_hewan !== undefined && (
                  <div>
                    <span className="text-muted-foreground">
                      Tingkat hunian:
                    </span>
                    <span className="ml-2 font-medium">
                      {Math.round(
                        (habitat.jumlah_hewan / habitat.kapasitas) * 100
                      )}
                      %
                    </span>
                  </div>
                )} */}
              </div>
            </div>
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
