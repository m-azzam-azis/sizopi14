"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Trash } from "lucide-react";
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
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserData } from "@/hooks/getUserData";

interface AdopterDetail {
  id: string;
  name: string;
  type: string;
  address: string;
  contact: string;
  total_kontribusi: number;
}

interface Adoption {
  id_hewan: string;
  nama_hewan: string;
  spesies: string;
  status_kesehatan: string;
  status_pembayaran: string;
  kontribusi_finansial: number;
  tgl_mulai_adopsi: string;
  tgl_berhenti_adopsi: string;
}

interface AdopterDetailProps {
  adopterId: string;
}

export default function AdopterDetailModule({ adopterId }: AdopterDetailProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [adopter, setAdopter] = useState<AdopterDetail | null>(null);
  const [adoptions, setAdoptions] = useState<Adoption[]>([]);
  const [error, setError] = useState("");
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [adoptionToDelete, setAdoptionToDelete] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  
  // Get user data and check role
  const { userData, isValid, isLoading: authLoading } = getUserData();

  useEffect(() => {
    // Check if user is admin
    if (!authLoading && isValid && userData.role !== "admin") {
      // If not admin, redirect to home page
      router.push("/");
    }
  }, [userData, isValid, authLoading, router]);

  useEffect(() => {
    // Only fetch data if user is valid and auth loading is finished
    if (isValid && !authLoading) {
      fetchAdopterDetail();
    }
  }, [adopterId, isValid, authLoading]);

  const fetchAdopterDetail = async () => {
    setIsLoading(true);
    try {
      // Fetch the adopter details and adoptions in a single request
      const response = await fetch(`/api/adopter/${adopterId}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Fetched adopter data:", data);
      
      if (data.adopter) {
        setAdopter(data.adopter);
        
        // Filter adoptions to only show those that are paid in full (status_pembayaran = "Lunas")
        const paidAdoptions = (data.adoptions || []).filter(
          (adoption: Adoption) => adoption.status_pembayaran === "Lunas"
        );
        
        setAdoptions(paidAdoptions);
      } else {
        setError("Data adopter tidak ditemukan");
      }
    } catch (error) {
      console.error("Error fetching adopter details:", error);
      setError("Gagal memuat data adopter");
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleDeleteClick = (id_hewan: string) => {
    setAdoptionToDelete(id_hewan);
    setShowDeleteAlert(true);
  };

  const handleDelete = async () => {
    if (adoptionToDelete) {
      try {
        const response = await fetch(`/api/adopsi/${adoptionToDelete}?id_adopter=${adopterId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Update local state to remove the deleted adoption
        setAdoptions(adoptions.filter((adoption) => adoption.id_hewan !== adoptionToDelete));
        
        showToastMessage("Data adopsi berhasil dihapus");
      } catch (error) {
        console.error("Error deleting adoption:", error);
        showToastMessage("Gagal menghapus data adopsi");
      }
    }
    setShowDeleteAlert(false);
    setAdoptionToDelete(null);
  };

  const isAdoptionOngoing = (adoption: Adoption) => {
    if (!adoption.tgl_berhenti_adopsi) {
      return true; // Jika tidak ada tanggal akhir, adopsi masih berlangsung
    }
    
    const today = new Date();
    const endDate = new Date(adoption.tgl_berhenti_adopsi);
    return endDate > today;
  };

  // Function to show toast message
  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // If still loading authentication or data, show loading
  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto py-10 px-4 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is not admin, don't render content (redirect will be handled in useEffect)
  if (!isValid || userData.role !== "admin") {
    return null;
  }

  if (error || !adopter) {
    return (
      <div className="container mx-auto py-10 px-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive mb-4">{error || "Data tidak ditemukan"}</p>
            <Link
              href="/adopter" 
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      {/* Main Card */}
      <Card>
        <CardHeader className="pb-0">
          {/* Back button */}
          <div className="mb-4">
            <Button variant="ghost" asChild className="pl-0 hover:bg-transparent">
              <Link href="/adopter" className="inline-flex items-center gap-2 text-primary">
                <ArrowLeft className="h-4 w-4" /> Kembali
              </Link>
            </Button>
          </div>

          {/* Main Title */}
          <CardTitle className="text-2xl font-bold text-center">Riwayat Adopsi</CardTitle>
        </CardHeader>

        <CardContent className="pt-6">
          {/* Adopter information */}
          <Card className="mb-6 bg-secondary/20">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div>
                  <span className="font-bold">Nama Adopter:</span> {adopter.name}
                </div>
                <div>
                  <span className="font-bold">Alamat Adopter:</span> {adopter.address || "[alamat]"}
                </div>
                <div>
                  <span className="font-bold">Kontak Adopter:</span> {adopter.contact || "[no telepon]"}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Adoption history table */}
          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Hewan</TableHead>
                  <TableHead className="text-center">Jenis Hewan</TableHead>
                  <TableHead className="text-center">Tanggal Mulai Adopsi</TableHead>
                  <TableHead className="text-center">Tanggal Akhir Adopsi</TableHead>
                  <TableHead className="text-center">Nominal Kontribusi</TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adoptions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      Tidak ada riwayat adopsi
                    </TableCell>
                  </TableRow>
                ) : (
                  adoptions.map((adoption) => {
                    const ongoing = isAdoptionOngoing(adoption);
                    
                    return (
                      <TableRow key={adoption.id_hewan}>
                        <TableCell>
                          {adoption.nama_hewan}
                        </TableCell>
                        <TableCell className="text-center">
                          {adoption.spesies}
                        </TableCell>
                        <TableCell className="text-center">
                          {adoption.tgl_mulai_adopsi}
                        </TableCell>
                        <TableCell className="text-center">
                          {adoption.tgl_berhenti_adopsi}
                        </TableCell>
                        <TableCell className="text-center font-medium">
                          {formatCurrency(adoption.kontribusi_finansial)}
                        </TableCell>
                        <TableCell className="text-center">
                          {ongoing ? (
                            <span className="inline-block px-3 py-1 bg-primary text-white rounded-full font-medium">
                              Sedang Berlangsung
                            </span>
                          ) : (
                            <Button
                              onClick={() => handleDeleteClick(adoption.id_hewan)}
                              variant="outline"
                              size="sm"
                              className="text-destructive hover:bg-destructive/10 border-destructive/50"
                            >
                              <Trash className="h-4 w-4 mr-1" /> Hapus
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data adopsi ini akan dihapus secara permanen.
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

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-6 py-3 rounded-lg shadow-lg flex items-center">
          <div className="mr-2">✓</div> 
          {toastMessage}
        </div>
      )}
    </div>
  );
}