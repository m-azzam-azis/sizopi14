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
import AtraksiFormModal from "./modals/AtraksiFormModal";
import { AtraksiFormValues, EditAtraksiFormValues } from "./forms/AtraksiForm";
import { toast } from "sonner";
import { getUserData } from "@/hooks/getUserData";

interface Fasilitas {
  nama: string;
  jadwal: Date;
  kapasitas_max: number;
}

interface Atraksi {
  nama_atraksi: string;
  lokasi: string;
}

interface Pengguna {
  username: string;
  nama_depan: string;
  nama_belakang: string;
}

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
  kapasitas: number;
  jadwal: Date;
  hewan_terlibat: Hewan[];
  pelatih: PelatihHewan | null;
}

const AtraksiModule = () => {
  const router = useRouter();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const { userData, isValid, isLoading: authLoading } = getUserData();
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

  const fetchAtraksiData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/atraksi");
      if (!response.ok) {
        throw new Error("Failed to fetch attractions");
      }
      const { data } = await response.json();

      const formattedData = data.map((atraksi: any) => ({
        id: `atr-${atraksi.nama_atraksi}`,
        nama_atraksi: atraksi.nama_atraksi,
        lokasi: atraksi.lokasi,
        kapasitas: atraksi.kapasitas_max,
        jadwal: new Date(atraksi.jadwal),
        hewan_terlibat: atraksi.hewan_terlibat || [],
        pelatih: atraksi.pelatih
          ? {
              id_staf: "",
              nama_belakang: atraksi.pelatih.nama_belakang,
              nama_depan: atraksi.pelatih.nama_depan,
              username: atraksi.pelatih.username_lh,
              username_lh: atraksi.pelatih.username_lh,
            }
          : null,
      }));

      setAtraksiData(formattedData);
    } catch (error) {
      console.error("Error fetching attractions:", error);
      toast.error("Failed to load attractions data");
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

  const handleDeleteClick = (id: string) => {
    const attraction = atraksiData.find((a) => a.id === id);
    if (attraction) {
      setAtraksiToDelete(attraction.nama_atraksi);
      setShowDeleteAlert(true);
    }
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

      if (!response.ok) {
        throw new Error("Failed to update attraction");
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

  const handleAddAtraksi = async (data: any) => {
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

  const formatDateTime = (date: Date) => {
    return date.toLocaleString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (authLoading) {
    return (
      <div className="flex h-screen w-full justify-center items-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium">Memverifikasi akses...</p>
        </div>
      </div>
    );
  }

  if (!isValid || userData.role !== "admin") {
    return router.push("/");
  }

  return (
    <div className="container mx-auto py-10 px-4">
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
                      <TableCell>{atraksi.kapasitas} orang</TableCell>
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
                            onClick={() => handleDeleteClick(atraksi.id)}
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
            kapasitas: currentAtraksi.kapasitas,
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
    </div>
  );
};

export default AtraksiModule;
