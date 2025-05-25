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
import { Navbar } from "@/components/layout/Navbar";

interface Adopter {
  id: string;
  name: string;
  address: string;
  contact: string;
  totalContribution: number;
  avatarUrl?: string;
}

const AdopterRiwayatModule = () => {
  const router = useRouter();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [adopterToDelete, setAdopterToDelete] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  const [adopters, setAdopters] = useState<Adopter[]>([
    {
      id: "adp-001",
      name: "Prasetya Andriani",
      address: "Jl. Diponegoro No. 45, Surabaya",
      contact: "089635460305",
      totalContribution: 15000000,
      avatarUrl: "https://i.pravatar.cc/150?u=prasetya",
    },
    {
      id: "adp-010",
      name: "Agus Januar",
      address: "Jl. Sudirman No. 123, Jakarta",
      contact: "083573452405",
      totalContribution: 3200000,
      avatarUrl: "https://i.pravatar.cc/150?u=agus",
    },
    {
      id: "adp-011",
      name: "Yayasan Margana Jaya",
      address: "Jl. Merdeka No. 123, Jakarta Pusat",
      contact: "080925544576",
      totalContribution: 25000000,
      avatarUrl: "https://i.pravatar.cc/150?u=margana",
    },
    {
      id: "adp-012",
      name: "Lembaga Dwinarno Mandiri",
      address: "Jl. Pahlawan No. 55, Bandung",
      contact: "080749318642",
      totalContribution: 22000000,
      avatarUrl: "https://i.pravatar.cc/150?u=dwinarno",
    },
    {
      id: "adp-013",
      name: "Rika Sinaga Foundation",
      address: "Jl. Gajah Mada No. 72, Medan",
      contact: "087638079651",
      totalContribution: 20500000,
      avatarUrl: "https://i.pravatar.cc/150?u=rika",
    },
  ]);

  // top 5 adopters 
  const topAdopters = [...adopters]
    .sort((a, b) => b.totalContribution - a.totalContribution)
    .slice(0, 5);

  // format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleDeleteClick = (id: string) => {
    setAdopterToDelete(id);
    setShowDeleteAlert(true);
  };

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
                            src={adopter.avatarUrl}
                            alt={adopter.name}
                          />
                          <AvatarFallback>
                            {adopter.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div>{adopter.name}</div>
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