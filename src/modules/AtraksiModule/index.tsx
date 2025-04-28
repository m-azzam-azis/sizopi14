"use client";

import React, { useState } from "react";
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
import { PlusCircle, Pencil, Trash } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AtraksiFormModal from "./modals/AtraksiFormModal";
import {
  AtraksiFormValues,
  EditAtraksiFormValues,
} from "./forms/AtraksiForm";

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
  username_lh: string;
  id_staf: string;
  pengguna?: Pengguna;
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
  const [atraksiToDelete, setAtraksiToDelete] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentAtraksi, setCurrentAtraksi] = useState<AtraksiData | null>(
    null
  );

  const pelatihHewan: PelatihHewan[] = [
    {
      username_lh: "trainer1",
      id_staf: "staff-001",
      pengguna: {
        username: "trainer1",
        nama_depan: "Budi",
        nama_belakang: "Santoso",
      },
    },
    {
      username_lh: "trainer2",
      id_staf: "staff-002",
      pengguna: {
        username: "trainer2",
        nama_depan: "Siti",
        nama_belakang: "Nurbaya",
      },
    },
    {
      username_lh: "trainer3",
      id_staf: "staff-003",
      pengguna: {
        username: "trainer3",
        nama_depan: "Rudi",
        nama_belakang: "Hartono",
      },
    },
  ];

  const hewan: Hewan[] = [
    {
      id: "ani-101",
      nama: "Simba",
      spesies: "African Lion",
      url_foto:
        "https://images.unsplash.com/photo-1545006398-2cf48043d3f3?q=80&w=400",
    },
    {
      id: "ani-102",
      nama: "Zara",
      spesies: "Plains Zebra",
      url_foto:
        "https://images.unsplash.com/photo-1549975248-52273875de73?q=80&w=400",
    },
    {
      id: "ani-103",
      nama: "Rafiki",
      spesies: "Giraffe",
      url_foto:
        "https://images.unsplash.com/photo-1534567059665-cbcfe2e19af4?q=80&w=400",
    },
    {
      id: "ani-106",
      nama: "Flipper",
      spesies: "Bottlenose Dolphin",
      url_foto:
        "https://images.unsplash.com/photo-1607153333879-c174d265f1d2?q=80&w=400",
    },
    {
      id: "ani-107",
      nama: "Frost",
      spesies: "Polar Bear",
      url_foto:
        "https://images.unsplash.com/photo-1461770354136-8f58567b617a?q=80&w=400",
    },
  ];

  const [atraksiData, setAtraksiData] = useState<AtraksiData[]>([
    {
      id: "atr-001",
      nama_atraksi: "Dolphin Show",
      lokasi: "Aquatic Center",
      kapasitas: 200,
      jadwal: new Date("2025-05-15T10:00:00"),
      hewan_terlibat: [hewan[3]],
      pelatih: pelatihHewan[0],
    },
    {
      id: "atr-002",
      nama_atraksi: "Lion Feeding",
      lokasi: "Savanna Enclosure",
      kapasitas: 100,
      jadwal: new Date("2025-05-15T14:00:00"),
      hewan_terlibat: [hewan[0]],
      pelatih: pelatihHewan[1],
    },
    {
      id: "atr-003",
      nama_atraksi: "Safari Adventure",
      lokasi: "Savanna Enclosure",
      kapasitas: 150,
      jadwal: new Date("2025-05-16T11:00:00"),
      hewan_terlibat: [hewan[0], hewan[1], hewan[2]],
      pelatih: pelatihHewan[2],
    },
    {
      id: "atr-004",
      nama_atraksi: "Arctic Experience",
      lokasi: "Arctic Zone",
      kapasitas: 80,
      jadwal: new Date("2025-05-17T13:30:00"),
      hewan_terlibat: [hewan[4]],
      pelatih: pelatihHewan[0],
    },
  ]);

  const handleEditClick = (atraksi: AtraksiData) => {
    setCurrentAtraksi(atraksi);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setAtraksiToDelete(id);
    setShowDeleteAlert(true);
  };

  const handleDelete = () => {
    if (atraksiToDelete) {
      setAtraksiData(
        atraksiData.filter((atraksi) => atraksi.id !== atraksiToDelete)
      );
      console.log(`Delete atraksi with ID: ${atraksiToDelete}`);
    }
    setShowDeleteAlert(false);
    setAtraksiToDelete(null);
  };

  const handleEditAtraksi = (data: EditAtraksiFormValues) => {
    if (currentAtraksi) {
      const updatedAtraksiData = atraksiData.map((atraksi) => {
        if (atraksi.id === currentAtraksi.id) {
          return {
            ...atraksi,
            jadwal: data.jadwal,
            kapasitas: data.kapasitas,
          };
        }
        return atraksi;
      });

      setAtraksiData(updatedAtraksiData);
      console.log("Updated atraksi:", currentAtraksi.id);
    }
  };

  const formattedPelatihList = pelatihHewan.map((pelatih) => ({
    id: pelatih.username_lh,
    name: `${pelatih.pengguna?.nama_depan} ${pelatih.pengguna?.nama_belakang}`,
  }));

  const formattedHewanList = hewan.map((animal) => ({
    id: animal.id,
    name: animal.nama || "Unnamed",
    spesies: animal.spesies,
  }));

  const handleAddAtraksi = (data: any) => {
    const newId = `atr-00${atraksiData.length + 1}`;

    const selectedHewan = hewan.filter((animal) =>
      data.hewan_ids.includes(animal.id)
    );

    const selectedPelatih = pelatihHewan.find(
      (pelatih) => pelatih.username_lh === data.pelatih_id
    );

    const newAtraksi: AtraksiData = {
      id: newId,
      nama_atraksi: data.nama_atraksi,
      lokasi: data.lokasi,
      kapasitas: data.kapasitas,
      jadwal: data.jadwal,
      hewan_terlibat: selectedHewan,
      pelatih: selectedPelatih || null,
    };

    setAtraksiData([...atraksiData, newAtraksi]);
    console.log("Added new attraction:", newAtraksi);
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
                        ? `${atraksi.pelatih.pengguna?.nama_depan}`
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
              ? `${currentAtraksi.pelatih.pengguna?.nama_depan} ${currentAtraksi.pelatih.pengguna?.nama_belakang}`
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
