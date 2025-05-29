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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AtraksiFormModal from "./modals/AtraksiFormModal";
import {
  EditAtraksiFormValues,
  CreateAtraksiFormValues,
} from "./forms/AtraksiForm";
import { toast } from "sonner";
import { getUserData } from "@/hooks/getUserData";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface PelatihHewan {
  id_staf: string;
  nama_belakang: string;
  nama_depan: string;
  username: string;
  username_lh: string;
}

interface Hewan {
  id: string;
  nama: string | null;
  spesies: string;
  url_foto: string;
}

interface AtraksiData {
  id: string;
  nama_atraksi: string;
  lokasi: string;
  kapasitas_max: number;
  jadwal: string | Date;
  hewan_terlibat: Hewan[];
  pelatih: PelatihHewan | null;
}

interface AtraksiApiResponse {
  nama_atraksi: string;
  lokasi: string;
  kapasitas_max: number;
  jadwal: string;
  hewan_terlibat?: Hewan[];
  pelatih?: PelatihHewan;
}

const AtraksiModule = () => {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const { isLoading: authLoading, authState } = getUserData();
  const [atraksiToDelete, setAtraksiToDelete] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentAtraksi, setCurrentAtraksi] = useState<AtraksiData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [atraksiData, setAtraksiData] = useState<AtraksiData[]>([]);
  const [pelatihHewan, setPelatihHewan] = useState<PelatihHewan[]>([]);
  const [hewan, setHewan] = useState<Hewan[]>([]);
  const [rotationMessage, setRotationMessage] = useState<string | null>(null);
  const [showRotationDialog, setShowRotationDialog] = useState(false);

  const fetchAtraksiData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/atraksi");
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();

      const mappedData = data.data.map((atraksi: any) => ({
        ...atraksi,
        id: atraksi.nama_atraksi,
      }));

      setAtraksiData(mappedData);
    } catch (error) {
      console.error("Error fetching atraksi data:", error);
      toast.error("Gagal memuat data atraksi");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPelatihData = async () => {
    try {
      const response = await fetch("/api/trainers");
      if (!response.ok) {
        throw new Error("Failed to fetch trainers");
      }

      const { data } = await response.json();
      setPelatihHewan(data);
    } catch (error) {
      console.error("Error fetching trainers:", error);
      toast.error("Failed to load trainer data");
    }
  };

  const fetchHewanData = async () => {
    try {
      const response = await fetch("/api/animals");
      if (!response.ok) {
        throw new Error("Failed to fetch animals");
      }
      const { data } = await response.json();
      setHewan(data);
    } catch (error) {
      console.error("Error fetching animals:", error);
      toast.error("Failed to load animal data");
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchAtraksiData(),
          fetchPelatihData(),
          fetchHewanData(),
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const handleEditClick = (atraksi: AtraksiData) => {
    setCurrentAtraksi(atraksi);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (nama: string) => {
    setAtraksiToDelete(nama);
    setShowDeleteAlert(true);
  };

  const handleDelete = async () => {
    if (atraksiToDelete) {
      try {
        const response = await fetch(
          `/api/atraksi?nama_atraksi=${encodeURIComponent(atraksiToDelete)}`,
          {
            method: "DELETE",
          }
        );

        console.log(
          `Deleting attraction: ${atraksiToDelete}, Response: ${response.status}`
        );

        if (!response.ok) {
          throw new Error("Failed to delete attraction");
        }

        setAtraksiData(
          atraksiData.filter(
            (atraksi) => atraksi.nama_atraksi !== atraksiToDelete
          )
        );
        toast.success("Atraksi berhasil dihapus");
      } catch (error) {
        console.error("Error deleting attraction:", error);
        toast.error("Gagal menghapus atraksi");
      }

      setShowDeleteAlert(false);
      setAtraksiToDelete(null);
    }
  };

  const handleEditAtraksi = async (data: EditAtraksiFormValues) => {
    if (!currentAtraksi) return;

    try {
      const response = await fetch("/api/atraksi", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama_atraksi: currentAtraksi.nama_atraksi,
          kapasitas_max: data.kapasitas,
          jadwal: data.jadwal,
        }),
      });

      const result = await response.json();
      console.log("Response from API:", result);

      if (!response.ok) {
        throw new Error(result.error || "Failed to update attraction");
      }

      const updatedAtraksiData = atraksiData.map((atraksi) => {
        if (atraksi.nama_atraksi === currentAtraksi.nama_atraksi) {
          return {
            ...atraksi,
            jadwal: data.jadwal,
            kapasitas: data.kapasitas,
          };
        }
        return atraksi;
      });

      setAtraksiData(updatedAtraksiData);
      toast.success("Atraksi berhasil diperbarui");

      if (result.rotationMessage) {
        console.log("Rotation message received:", result.rotationMessage);
        setRotationMessage(result.rotationMessage);
        setShowRotationDialog(true);
      }
    } catch (error) {
      console.error("Error updating attraction:", error);
      toast.error("Gagal memperbarui atraksi");
    }

    setIsEditModalOpen(false);
    setCurrentAtraksi(null);
  };

  const formattedPelatihList = pelatihHewan.map((pelatih) => ({
    id: pelatih.username_lh,
    name: `${pelatih?.nama_depan} ${pelatih?.nama_belakang}`,
  }));

  const formattedHewanList = hewan.map((animal) => ({
    id: animal.id,
    name: animal.nama || "Unnamed",
    spesies: animal.spesies,
  }));

  const handleAddAtraksi = async (data: CreateAtraksiFormValues) => {
    try {
      const response = await fetch("/api/atraksi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama_atraksi: data.nama_atraksi,
          lokasi: data.lokasi,
          kapasitas_max: data.kapasitas,
          jadwal: data.jadwal,
          pelatih_id: data.pelatih_id,
          hewan_ids: data.hewan_ids,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create attraction");
      }

      await fetchAtraksiData();
      toast.success("Atraksi berhasil ditambahkan");
    } catch (error) {
      console.error("Error creating attraction:", error);
      toast.error("Gagal menambahkan atraksi");
    }

    setIsAddModalOpen(false);
  };

  const formatDateTime = (time: string | Date) => {
    if (!time) return "-";

    if (typeof time === "string") {
      if (time.includes(":")) {
        const [hours, minutes] = time.split(":");
        return `${hours}:${minutes}`;
      } else if (time.includes("T")) {
        try {
          const date = new Date(time);
          return date.toLocaleString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          });
        } catch {
          return time;
        }
      }

      return time;
    } else {
      try {
        return time.toLocaleString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        });
      } catch {
        return "Invalid time";
      }
    }
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
          <Button variant="secondary">Atraksi</Button>
        </Link>
        <Link href="/kelola-pengunjung/wahana">
          <Button variant="outline">Wahana</Button>
        </Link>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-h3 font-bold text-foreground">
            DATA ATRAKSI
          </CardTitle>
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => setIsAddModalOpen(true)}
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Atraksi
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <p>Memuat data atraksi...</p>
            </div>
          ) : (
            <div className="rounded-md border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Atraksi</TableHead>
                    <TableHead>Lokasi</TableHead>
                    <TableHead>Kapasitas</TableHead>
                    <TableHead>Jadwal</TableHead>
                    <TableHead>Hewan yang terlibat</TableHead>
                    <TableHead>Pelatih</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {atraksiData.map((atraksi) => (
                    <TableRow key={atraksi.id}>
                      <TableCell className="font-medium">
                        {atraksi.nama_atraksi}
                      </TableCell>
                      <TableCell>{atraksi.lokasi}</TableCell>
                      <TableCell>{atraksi.kapasitas_max} orang</TableCell>
                      <TableCell>{formatDateTime(atraksi.jadwal)}</TableCell>
                      <TableCell>
                        {atraksi.hewan_terlibat.length > 0
                          ? atraksi.hewan_terlibat
                              .map((hewan) => hewan.spesies)
                              .join(", ")
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {atraksi.pelatih
                          ? `${atraksi.pelatih?.nama_depan}`
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEditClick(atraksi)}
                            className="h-8 w-8"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              handleDeleteClick(atraksi.nama_atraksi)
                            }
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AtraksiFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddAtraksi}
        isEditing={false}
        pelatihList={formattedPelatihList}
        hewanList={formattedHewanList}
      />

      {currentAtraksi && (
        <AtraksiFormModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setCurrentAtraksi(null);
          }}
          onSubmit={handleEditAtraksi}
          initialData={{
            jadwal: currentAtraksi.jadwal,
            kapasitas: currentAtraksi.kapasitas_max,
          }}
          isEditing={true}
          nama_atraksi={currentAtraksi.nama_atraksi}
          lokasi={currentAtraksi.lokasi}
          pelatih={
            currentAtraksi.pelatih
              ? `${currentAtraksi.pelatih?.nama_depan} ${currentAtraksi.pelatih?.nama_belakang}`
              : "-"
          }
          hewan_terlibat={
            currentAtraksi.hewan_terlibat.length > 0
              ? currentAtraksi.hewan_terlibat
                  .map((hewan) => hewan.spesies)
                  .join(", ")
              : "-"
          }
        />
      )}

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data atraksi akan dihapus
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

      {/* Rotation Message Dialog */}
      <Dialog
        open={showRotationDialog}
        onOpenChange={(isOpen) => {
          setShowRotationDialog(isOpen);

          if (!isOpen) {
            fetchAtraksiData();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rotasi Pelatih</DialogTitle>
            <DialogDescription className="py-4">
              <div className="text-sm text-blue-600 mb-2">
                {rotationMessage}
              </div>
              <div className="text-xs text-muted-foreground">
                Sesuai kebijakan, pelatih hewan akan dirotasi setelah bertugas
                lebih dari 3 bulan pada atraksi yang sama.
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button
              onClick={() => {
                setShowRotationDialog(false);

                fetchAtraksiData();
              }}
            >
              Tutup
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AtraksiModule;
