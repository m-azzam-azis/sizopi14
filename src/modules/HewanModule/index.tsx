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
import { HewanWithHabitat } from "./interface";
import { getUserData } from "@/hooks/getUserData";
import Image from "next/image";

const HewanModule = () => {
  const router = useRouter();
  const { userData, isValid } = getUserData();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [hewanToDelete, setHewanToDelete] = useState<string | null>(null);
  const [hewanList, setHewanList] = useState<HewanWithHabitat[]>([]);
  const [loading, setLoading] = useState(true);

  // Check if user has permission to manage animals
  const canManageAnimals =
    isValid &&
    (userData.role === "veterinarian" ||
      userData.role === "caretaker" ||
      userData.role === "admin");

  // Fetch animals from API
  const fetchHewan = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/hewan");
      const result = await response.json();

      if (result.success) {
        setHewanList(result.data);
      } else {
        toast.error("Failed to fetch animals");
      }
    } catch (error) {
      console.error("Error fetching animals:", error);
      toast.error("Error fetching animals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHewan();
  }, []);

  // Function to handle view details
  const handleViewDetails = (id: string) => {
    router.push(`/hewan/${id}`);
  };

  // Function to handle edit click
  const handleEditClick = (id: string) => {
    if (!canManageAnimals) {
      toast.error("You don't have permission to edit animals");
      return;
    }
    router.push(`/hewan/${id}/edit`);
  };

  // Function to show delete confirmation
  const handleDeleteClick = (id: string) => {
    if (!canManageAnimals) {
      toast.error("You don't have permission to delete animals");
      return;
    }
    setHewanToDelete(id);
    setShowDeleteAlert(true);
  };

  // Function to handle actual delete action
  const handleDelete = async () => {
    if (!hewanToDelete) return;

    try {
      const response = await fetch(`/api/hewan/${hewanToDelete}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Animal deleted successfully");
        await fetchHewan(); // Refresh the list
      } else {
        toast.error(result.error || "Failed to delete animal");
      }
    } catch (error) {
      console.error("Error deleting animal:", error);
      toast.error("Error deleting animal");
    } finally {
      setShowDeleteAlert(false);
      setHewanToDelete(null);
    }
  };

  // Function to get health status badge color
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

  // Function to format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Tidak diketahui";
    return new Date(dateString).toLocaleDateString("id-ID");
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
      <h1 className="mb-10 text-4xl font-bold">Kelola Hewan</h1>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold text-foreground">
            Daftar Hewan
          </CardTitle>
          {canManageAnimals && (
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => router.push("/hewan/add")}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Tambah Hewan
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading animals...</span>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Foto</TableHead>
                    <TableHead className="w-[150px]">Nama</TableHead>
                    <TableHead>Spesies</TableHead>
                    <TableHead>Asal</TableHead>
                    <TableHead>Tanggal Lahir</TableHead>
                    <TableHead>Status Kesehatan</TableHead>
                    <TableHead>Habitat</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hewanList.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-8 text-muted-foreground"
                      >
                        Tidak ada hewan yang ditemukan
                      </TableCell>
                    </TableRow>
                  ) : (
                    hewanList.map((hewan) => (
                      <TableRow key={hewan.id}>
                        <TableCell>
                          <div className="relative w-12 h-12 rounded-full overflow-hidden">
                            <Image
                              src={hewan.url_foto || "/placeholder-animal.jpg"}
                              alt={hewan.nama || "Animal"}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {hewan.nama || "Tanpa Nama"}
                        </TableCell>
                        <TableCell>{hewan.spesies}</TableCell>
                        <TableCell>{hewan.asal_hewan}</TableCell>
                        <TableCell>{formatDate(hewan.tanggal_lahir)}</TableCell>
                        <TableCell>
                          {getHealthStatusBadge(hewan.status_kesehatan)}
                        </TableCell>
                        <TableCell>{hewan.nama_habitat}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleViewDetails(hewan.id)}
                              className="h-8 w-8"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {canManageAnimals && (
                              <>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleEditClick(hewan.id)}
                                  className="h-8 w-8"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleDeleteClick(hewan.id)}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data satwa akan dihapus
              secara permanen.
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

export default HewanModule;
