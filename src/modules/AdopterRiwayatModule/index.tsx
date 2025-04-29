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
import { Eye, Trash } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

// Define interfaces for type safety
interface Adopter {
  id: string;
  name: string;
  totalContribution: number;
}

interface AdoptionHistory {
  id: string;
  adopterId: string;
  animalName: string;
  animalSpecies: string;
  adoptionDate: string;
  contributionAmount: number;
  expiryDate: string;
  status: "Active" | "Expired" | "Cancelled";
}

const AdopterRiwayatModule = () => {
  const router = useRouter();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [adopterToDelete, setAdopterToDelete] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  // Dummy data for all adopters with requested names
  const [adopters, setAdopters] = useState<Adopter[]>([
    {
      id: "adp-001",
      name: "Prasetya Andriani",
      totalContribution: 15000000,
    },
    {
      id: "adp-002",
      name: "Damar Thamrin",
      totalContribution: 12500000,
    },
    {
      id: "adp-003",
      name: "Gading Nainggolan",
      totalContribution: 10750000,
    },
    {
      id: "adp-004",
      name: "Drajat Rahmi Nainggolan",
      totalContribution: 8800000,
    },
    {
      id: "adp-005",
      name: "Tira Jais Mangunsong",
      totalContribution: 7500000,
    },
    {
      id: "adp-006",
      name: "Praba Wulandari",
      totalContribution: 6200000,
    },
    {
      id: "adp-007",
      name: "Elon Budiman",
      totalContribution: 5500000,
    },
    {
      id: "adp-008",
      name: "Silvia Nurdiyanti",
      totalContribution: 4800000,
    },
    {
      id: "adp-009",
      name: "Pardi Lili Siregar",
      totalContribution: 3900000,
    },
    {
      id: "adp-010",
      name: "Agus Januar",
      totalContribution: 3200000,
    },
    {
      id: "adp-011",
      name: "Yayasan Margana Jaya",
      totalContribution: 25000000,
    },
    {
      id: "adp-012",
      name: "Lembaga Dwinarno Mandiri",
      totalContribution: 22000000,
    },
    {
      id: "adp-013",
      name: "Rika Sinaga Foundation",
      totalContribution: 20500000,
    },
    {
      id: "adp-014",
      name: "Gereja Ghu Tasoit",
      totalContribution: 18000000,
    },
    {
      id: "adp-015",
      name: "Komunitas Galar Peduli",
      totalContribution: 17000000,
    },
    {
      id: "adp-016",
      name: "Yayasan Tirtayasa Amanah",
      totalContribution: 16000000,
    },
    {
      id: "adp-017",
      name: "ULI Petcare Group",
      totalContribution: 15500000,
    },
    {
      id: "adp-018",
      name: "Azalea Foster House",
      totalContribution: 14000000,
    },
    {
      id: "adp-019",
      name: "Ekopertiwi Foundation",
      totalContribution: 120000000,
    },
    {
      id: "adp-020",
      name: "Santoso Animal Shelter",
      totalContribution: 100000000,
    },
  ]);

  // Get top 5 adopters by contribution amount
  const topAdopters = [...adopters]
    .sort((a, b) => b.totalContribution - a.totalContribution)
    .slice(0, 5);

  // Function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Function to show delete confirmation
  const handleDeleteClick = (id: string) => {
    setAdopterToDelete(id);
    setShowDeleteAlert(true);
  };

  // Function to handle actual delete action
  const handleDelete = () => {
    if (adopterToDelete) {
      setAdopters(adopters.filter((adopter) => adopter.id !== adopterToDelete));
      console.log(`Delete adopter with ID: ${adopterToDelete}`);
    }
    setShowDeleteAlert(false);
    setAdopterToDelete(null);

    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Function to view adoption history
  const handleViewHistory = (adopterId: string) => {
    console.log(`View adoption history for adopter with ID: ${adopterId}`);
    router.push(`/adopter/${adopterId}`); 
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-foreground">
            Adopter dengan Total Kontribusi Tertinggi dalam Setahun Terakhir
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-w-xl mx-auto">
            {topAdopters.map((adopter, index) => (
              <div
                key={adopter.id}
                className="flex justify-between items-center p-3 bg-card rounded-md border border-border"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center h-7 w-7 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                    {index + 1}
                  </div>
                  <span className="font-semibold">{adopter.name}</span>
                </div>
                <span className="font-bold text-primary">
                  {formatCurrency(adopter.totalContribution)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-h3 font-bold text-foreground">
            DAFTAR ADOPTER
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Nama Adopter</TableHead>
                  <TableHead>Total Kontribusi</TableHead>
                  <TableHead>Riwayat Adopsi</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adopters.map((adopter) => (
                  <TableRow key={adopter.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            alt={adopter.name}
                          />
                          <AvatarFallback>
                            {adopter.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div>{adopter.name}</div>
                          <div className="text-xs text-muted-foreground">
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(adopter.totalContribution)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleViewHistory(adopter.id)}
                      >
                        <Eye className="mr-2 h-4 w-4" /> Lihat Detail
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeleteClick(adopter.id)}
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data adopter dan seluruh riwayat adopsinya akan dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-white hover:bg-destructive/90 hover:text-white"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
          Aksi berhasil dilakukan!
        </div>
      )}
    </div>
  );
};

export default AdopterRiwayatModule;