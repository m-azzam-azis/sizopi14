"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Eye, Pencil, Trash, Loader2 } from "lucide-react";
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
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import HabitatFormModal from "@/modules/HabitatModule/components/modals/HabitatFormModal";
import { HabitatFormValues } from "@/modules/HabitatModule/components/forms/HabitatForm";
import { HabitatWithAnimals } from "./interface";
import { getUserData } from "@/hooks/getUserData";

const HabitatModule = () => {
  const router = useRouter();
  const { userData, isValid } = getUserData();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [habitatToDelete, setHabitatToDelete] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentHabitat, setCurrentHabitat] =
    useState<HabitatWithAnimals | null>(null);
  const [habitats, setHabitats] = useState<HabitatWithAnimals[]>([]);
  const [loading, setLoading] = useState(true);

  // Check if user has permission to manage habitats
  const canManageHabitats =
    isValid && (userData.role === "caretaker" || userData.role === "admin");

  // Fetch habitats from API
  const fetchHabitats = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/habitat");
      const result = await response.json();

      if (result.success) {
        setHabitats(result.data);
      } else {
        toast.error("Failed to fetch habitats");
      }
    } catch (error) {
      console.error("Error fetching habitats:", error);
      toast.error("Error fetching habitats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabitats();
  }, []);

  // Function to handle view details
  const handleViewDetails = (nama: string) => {
    router.push(`/habitat/${encodeURIComponent(nama)}`);
  };

  // Function to handle edit click
  const handleEditClick = (habitat: HabitatWithAnimals) => {
    if (!canManageHabitats) {
      toast.error("You don't have permission to edit habitats");
      return;
    }
    setCurrentHabitat(habitat);
    setIsEditModalOpen(true);
  };

  // Function to show delete confirmation
  const handleDeleteClick = (nama: string) => {
    if (!canManageHabitats) {
      toast.error("You don't have permission to delete habitats");
      return;
    }
    setHabitatToDelete(nama);
    setShowDeleteAlert(true);
  };

  // Function to handle actual delete action
  const handleDelete = async () => {
    if (!habitatToDelete) return;

    try {
      const response = await fetch(
        `/api/habitat/${encodeURIComponent(habitatToDelete)}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (result.success) {
        toast.success("Habitat deleted successfully");
        await fetchHabitats(); // Refresh the list
      } else {
        toast.error(result.error || "Failed to delete habitat");
      }
    } catch (error) {
      console.error("Error deleting habitat:", error);
      toast.error("Error deleting habitat");
    } finally {
      setShowDeleteAlert(false);
      setHabitatToDelete(null);
    }
  };

  // Function to handle adding a new habitat
  const handleAddHabitat = async (data: HabitatFormValues) => {
    try {
      const response = await fetch("/api/habitat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama: data.name,
          luas_area: data.area,
          kapasitas: data.capacity,
          status: data.environmentStatus,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Habitat added successfully");
        setIsAddModalOpen(false);
        await fetchHabitats(); // Refresh the list
      } else {
        toast.error(result.error || "Failed to add habitat");
      }
    } catch (error) {
      console.error("Error adding habitat:", error);
      toast.error("Error adding habitat");
    }
  };

  // Function to handle editing a habitat
  const handleEditHabitat = async (data: HabitatFormValues) => {
    if (!currentHabitat) return;

    try {
      const response = await fetch(
        `/api/habitat/${encodeURIComponent(currentHabitat.nama)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nama: data.name,
            luas_area: data.area,
            kapasitas: data.capacity,
            status: data.environmentStatus,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        toast.success("Habitat updated successfully");
        setIsEditModalOpen(false);
        setCurrentHabitat(null);
        await fetchHabitats(); // Refresh the list
      } else {
        toast.error(result.error || "Failed to update habitat");
      }
    } catch (error) {
      console.error("Error updating habitat:", error);
      toast.error("Error updating habitat");
    }
  };

  // Function to get status badge color
  const getStatusBadge = (status: HabitatWithAnimals["status"]) => {
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

  if (!isValid) {
    return (
      <div className="container mx-auto pb-20 px-4">
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
          <p className="text-muted-foreground mt-2">
            You need to be logged in to view this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto pb-20 px-4">
      <h1 className="mb-10 text-4xl font-bold">Manajemen Habitat</h1>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold text-foreground">
            Daftar Habitat
          </CardTitle>
          {canManageHabitats && (
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => setIsAddModalOpen(true)}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Tambah Habitat
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading habitats...</span>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Nama</TableHead>
                    <TableHead className="text-right">Luas Area (m²)</TableHead>
                    <TableHead className="text-right">Kapasitas</TableHead>
                    <TableHead className="text-right">Jumlah Hewan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {habitats.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-muted-foreground"
                      >
                        Tidak ada habitat yang ditemukan
                      </TableCell>
                    </TableRow>
                  ) : (
                    habitats.map((habitat) => (
                      <TableRow key={habitat.nama}>
                        <TableCell className="font-medium">
                          {habitat.nama}
                        </TableCell>
                        <TableCell className="text-right">
                          {habitat.luas_area.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {habitat.kapasitas}
                        </TableCell>
                        <TableCell className="text-right">
                          {habitat.jumlah_hewan || 0}
                        </TableCell>
                        <TableCell>{getStatusBadge(habitat.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleViewDetails(habitat.nama)}
                              className="h-8 w-8"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {canManageHabitats && (
                              <>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleEditClick(habitat)}
                                  className="h-8 w-8"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() =>
                                    handleDeleteClick(habitat.nama)
                                  }
                                  className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Habitat Modal */}
      {canManageHabitats && (
        <HabitatFormModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddHabitat}
          isEditing={false}
        />
      )}

      {/* Edit Habitat Modal */}
      {currentHabitat && canManageHabitats && (
        <HabitatFormModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setCurrentHabitat(null);
          }}
          onSubmit={handleEditHabitat}
          initialData={{
            name: currentHabitat.nama,
            area: currentHabitat.luas_area,
            capacity: currentHabitat.kapasitas,
            environmentStatus: currentHabitat.status,
          }}
          isEditing={true}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data habitat dan semua hewan
              yang terkait akan dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default HabitatModule;
