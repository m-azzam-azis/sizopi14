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
import { PlusCircle, Pencil, Trash, Loader2 } from "lucide-react";
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
import WahanaFormModal from "./modals/WahanaFormModal";
import {
  CreateWahanaFormValues,
  EditWahanaFormValues,
} from "./forms/WahanaForm";
import { toast } from "sonner";
import { getUserData } from "@/hooks/getUserData";
import Link from "next/link";

interface WahanaData {
  id?: string;
  nama_wahana: string;
  kapasitas_max: number;
  jadwal: string | Date;
  peraturan: string[];
}

const WahanaModule = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const {
    userData,
    isValid,
    isLoading: authLoading,
    authState,
  } = getUserData();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [wahanaToDelete, setWahanaToDelete] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentWahana, setCurrentWahana] = useState<WahanaData | null>(null);
  const [wahanaData, setWahanaData] = useState<WahanaData[]>([]);

  const fetchWahanaData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/wahana");
      if (!response.ok) {
        throw new Error("Failed to fetch wahana data");
      }

      const { data } = await response.json();

      const formattedData = data.map((wahana: any) => ({
        id: `whn-${wahana.nama_wahana}`,
        nama_wahana: wahana.nama_wahana,
        kapasitas_max: wahana.kapasitas_max,
        jadwal: wahana.jadwal,
        peraturan: Array.isArray(wahana.peraturan)
          ? wahana.peraturan
          : [wahana.peraturan],
      }));

      setWahanaData(formattedData);
    } catch (error) {
      console.error("Error fetching wahana data:", error);
      toast.error("Failed to load wahana data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWahanaData();
  }, []);

  const handleEditClick = (wahana: WahanaData) => {
    setCurrentWahana(wahana);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (wahana: WahanaData) => {
    setWahanaToDelete(wahana.nama_wahana);
    setShowDeleteAlert(true);
  };

  const handleDelete = async () => {
    if (wahanaToDelete) {
      try {
        const response = await fetch(
          `/api/wahana?nama_wahana=${encodeURIComponent(wahanaToDelete)}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete wahana");
        }

        setWahanaData(
          wahanaData.filter((w) => w.nama_wahana !== wahanaToDelete)
        );
        toast.success("Wahana berhasil dihapus");
      } catch (error) {
        console.error("Error deleting wahana:", error);
        toast.error("Gagal menghapus wahana");
      }

      setShowDeleteAlert(false);
      setWahanaToDelete(null);
    }
  };

  const handleEditWahana = async (data: EditWahanaFormValues) => {
    if (!currentWahana) return;

    try {
      const response = await fetch("/api/wahana", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama_wahana: currentWahana.nama_wahana,
          kapasitas_max: data.kapasitas,
          jadwal: data.jadwal,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update wahana");
      }

      const updatedWahanaData = wahanaData.map((wahana) => {
        if (wahana.nama_wahana === currentWahana.nama_wahana) {
          return {
            ...wahana,
            jadwal: data.jadwal,
            kapasitas_max: data.kapasitas,
          };
        }
        return wahana;
      });

      setWahanaData(updatedWahanaData);
      toast.success("Wahana berhasil diperbarui");
    } catch (error) {
      console.error("Error updating wahana:", error);
      toast.error("Gagal memperbarui wahana");
    }

    setIsEditModalOpen(false);
    setCurrentWahana(null);
  };

  const handleAddWahana = async (data: CreateWahanaFormValues) => {
    try {
      const response = await fetch("/api/wahana", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama_wahana: data.nama_wahana,
          kapasitas_max: data.kapasitas,
          jadwal: data.jadwal,
          peraturan: data.peraturan,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.error === "Duplicate name") {
          toast.error(
            "Nama wahana sudah digunakan. Silakan gunakan nama lain."
          );
        } else {
          toast.error("Gagal menambahkan wahana");
        }
        throw new Error(result.message);
      }

      await fetchWahanaData();
      toast.success("Wahana berhasil ditambahkan");
    } catch (error) {
      console.error("Error creating wahana:", error);
    }

    setIsAddModalOpen(false);
  };

  const formatDateTime = (time: string | Date) => {
    if (typeof time === "string") {
      const [hours, minutes] = time.split(":");
      return `${hours}:${minutes}`;
    } else {
      return time.toLocaleString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const formatRegulations = (peraturan: string[]) => {
    if (!peraturan || peraturan.length === 0) return "-";

    return (
      <ul className="list-disc list-inside">
        {peraturan.map((rule, index) => (
          <li key={index} className="text-sm">
            {rule}
          </li>
        ))}
      </ul>
    );
  };

  if (
    authLoading ||
    authState === "initializing" ||
    authState === "loading" ||
    authState === "unauthenticated"
  ) {
    return (
      <div className="flex h-screen w-full justify-center items-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium">Memverifikasi akses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-center items-center gap-5 p-4">
        <Link href="/kelola-pengunjung/">
          <Button variant="outline">Reservasi</Button>
        </Link>
        <Link href="/kelola-pengunjung/atraksi">
          <Button variant="outline">Atraksi</Button>
        </Link>
        <Link href="/kelola-pengunjung/wahana">
          <Button variant="secondary">Wahana</Button>
        </Link>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-h3 font-bold text-foreground">
            DATA WAHANA
          </CardTitle>
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => setIsAddModalOpen(true)}
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Wahana
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <p>Memuat data wahana...</p>
            </div>
          ) : (
            <div className="rounded-md border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Wahana</TableHead>
                    <TableHead>Kapasitas</TableHead>
                    <TableHead>Jadwal</TableHead>
                    <TableHead>Peraturan</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wahanaData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        Tidak ada data wahana
                      </TableCell>
                    </TableRow>
                  ) : (
                    wahanaData.map((wahana) => (
                      <TableRow key={wahana.id || wahana.nama_wahana}>
                        <TableCell className="font-medium">
                          {wahana.nama_wahana}
                        </TableCell>
                        <TableCell>{wahana.kapasitas_max} orang</TableCell>
                        <TableCell>{formatDateTime(wahana.jadwal)}</TableCell>
                        <TableCell>
                          {formatRegulations(wahana.peraturan)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEditClick(wahana)}
                              className="h-8 w-8"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDeleteClick(wahana)}
                              className="h-8 w-8 text-destructive hover:bg-destructive/10"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <WahanaFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddWahana}
        isEditing={false}
      />

      {currentWahana && (
        <WahanaFormModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setCurrentWahana(null);
          }}
          onSubmit={handleEditWahana}
          initialData={{
            jadwal: currentWahana.jadwal,
            kapasitas: currentWahana.kapasitas_max,
          }}
          isEditing={true}
          nama_wahana={currentWahana.nama_wahana}
        />
      )}

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data wahana akan dihapus
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

export default WahanaModule;
