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
import WahanaFormModal from "@/components/modals/WahanaFormModal";
import {
  CreateWahanaFormValues,
  EditWahanaFormValues,
} from "@/components/forms/WahanaForm";

interface Fasilitas {
  nama: string;
  jadwal: Date;
  kapasitas_max: number;
}

interface Wahana {
  nama_wahana: string;
  peraturan: string[];
}

interface WahanaData {
  id: string;
  nama_wahana: string;
  kapasitas: number;
  jadwal: Date;
  peraturan: string[];
}

const WahanaModule = () => {
  const router = useRouter();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [wahanaToDelete, setWahanaToDelete] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentWahana, setCurrentWahana] = useState<WahanaData | null>(null);

  const [wahanaData, setWahanaData] = useState<WahanaData[]>([
    {
      id: "whn-001",
      nama_wahana: "Taman Air Mini",
      kapasitas: 100,
      jadwal: new Date("2025-05-15T10:00:00"),
      peraturan: ["Dilarang Berenang", "Dilarang membawa makanan"],
    },
    {
      id: "whn-002",
      nama_wahana: "Roller Coaster Jungle",
      kapasitas: 30,
      jadwal: new Date("2025-05-15T11:30:00"),
      peraturan: [
        "Minimal tinggi 120 cm",
        "Tidak untuk penderita jantung",
        "Dilarang menggunakan ponsel",
      ],
    },
    {
      id: "whn-003",
      nama_wahana: "Kapal Gantung",
      kapasitas: 80,
      jadwal: new Date("2025-05-16T09:00:00"),
      peraturan: [
        "Anak-anak wajib didampingi",
        "Dilarang berdiri selama atraksi berjalan",
      ],
    },
  ]);

  const handleEditClick = (wahana: WahanaData) => {
    setCurrentWahana(wahana);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setWahanaToDelete(id);
    setShowDeleteAlert(true);
  };

  const handleDelete = () => {
    if (wahanaToDelete) {
      setWahanaData(
        wahanaData.filter((wahana) => wahana.id !== wahanaToDelete)
      );
      console.log(`Delete wahana with ID: ${wahanaToDelete}`);
    }
    setShowDeleteAlert(false);
    setWahanaToDelete(null);
  };

  const handleEditWahana = (data: EditWahanaFormValues) => {
    if (currentWahana) {
      const updatedWahanaData = wahanaData.map((wahana) => {
        if (wahana.id === currentWahana.id) {
          return {
            ...wahana,
            jadwal: data.jadwal,
            kapasitas: data.kapasitas,
          };
        }
        return wahana;
      });

      setWahanaData(updatedWahanaData);
      console.log("Updated wahana:", currentWahana.id);
    }
    setIsEditModalOpen(false);
    setCurrentWahana(null);
  };

  const handleAddWahana = (data: CreateWahanaFormValues) => {
    const newId = `whn-00${wahanaData.length + 1}`;

    const newWahana: WahanaData = {
      id: newId,
      nama_wahana: data.nama_wahana,
      kapasitas: data.kapasitas,
      jadwal: data.jadwal,
      peraturan: data.peraturan,
    };

    setWahanaData([...wahanaData, newWahana]);
    console.log("Added new wahana:", newWahana);
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

  const formatRegulations = (peraturan: string[]) => {
    if (peraturan.length === 0) return "-";
    return (
      <ul className="list-inside">
        {peraturan.map((rule, index) => (
          <li key={index} className="text-sm">
            {index + 1}. {rule}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="container mx-auto py-10 px-4">
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
                {wahanaData.map((wahana) => (
                  <TableRow key={wahana.id}>
                    <TableCell className="font-medium">
                      {wahana.nama_wahana}
                    </TableCell>
                    <TableCell>{wahana.kapasitas} orang</TableCell>
                    <TableCell>{formatDateTime(wahana.jadwal)}</TableCell>
                    <TableCell>{formatRegulations(wahana.peraturan)}</TableCell>
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
                          onClick={() => handleDeleteClick(wahana.id)}
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
            kapasitas: currentWahana.kapasitas,
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
