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

interface Adopter {
  id: string;
  name: string;
  address: string;
  contact: string;
  total_kontribusi: number;
  avatarUrl?: string;
  username_adopter?: string;
  type?: "individu" | "organisasi";
}

const AdopterRiwayatModule = () => {
  const router = useRouter();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [adopterToDelete, setAdopterToDelete] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [adopters, setAdopters] = useState<Adopter[]>([]);
  const [individualAdopters, setIndividualAdopters] = useState<Adopter[]>([]);
  const [organizationAdopters, setOrganizationAdopters] = useState<Adopter[]>([]);
  const [topAdopters, setTopAdopters] = useState<Adopter[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch all adopters
        const response = await fetch("/api/adopter");
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response:", errorText);
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Fetched adopter data:", data);
        
        // Handle empty array properly
        if (Array.isArray(data)) {
          setAdopters(data);
          
          // Separate individual and organization adopters
          const individuals = data.filter(adopter => adopter.type === "individu");
          const organizations = data.filter(adopter => adopter.type === "organisasi");
          
          setIndividualAdopters(individuals);
          setOrganizationAdopters(organizations);
        } else {
          console.error("Expected array but got:", typeof data);
          setAdopters([]);
          setIndividualAdopters([]);
          setOrganizationAdopters([]);
        }
        
        // Fetch top adopters
        try {
          const topResponse = await fetch("/api/adopter/top");
          
          if (topResponse.ok) {
            const topData = await topResponse.json();
            console.log("Fetched top adopters:", topData);
            if (Array.isArray(topData)) {
              setTopAdopters(topData);
            } else {
              setTopAdopters([]);
            }
          } else {
            console.error("Top adopters request failed:", topResponse.status);
            setTopAdopters([]);
          }
        } catch (topError) {
          console.error("Error fetching top adopters:", topError);
          setTopAdopters([]);
        }
      } catch (error) {
        console.error("Error fetching adopters:", error);
        showToastMessage(`Gagal memuat data adopter: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format currency for display
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

  const handleDelete = async () => {
    if (adopterToDelete) {
      try {
        const response = await fetch(`/api/adopter?id=${adopterToDelete}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Update local state to remove the deleted adopter
        setAdopters(adopters.filter((adopter) => adopter.id !== adopterToDelete));
        setIndividualAdopters(individualAdopters.filter(
          (adopter) => adopter.id !== adopterToDelete
        ));
        setOrganizationAdopters(organizationAdopters.filter(
          (adopter) => adopter.id !== adopterToDelete
        ));
        setTopAdopters(topAdopters.filter((adopter) => adopter.id !== adopterToDelete));
        
        showToastMessage("Adopter berhasil dihapus");
      } catch (error) {
        console.error("Error deleting adopter:", error);
        showToastMessage("Gagal menghapus adopter");
      }
    }
    setShowDeleteAlert(false);
    setAdopterToDelete(null);
  };

  // Function to view adoption history
  const handleViewHistory = (adopterId: string) => {
    router.push(`/adopter/${adopterId}`);
  };

  // Function to show toast message
  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const renderAdopterTable = (adopters: Adopter[], title: string) => {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Adopter</TableHead>
                <TableHead>Total Kontribusi</TableHead>
                <TableHead>Riwayat Adopsi</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adopters.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    Tidak ada data adopter
                  </TableCell>
                </TableRow>
              ) : (
                adopters.map((adopter) => (
                  <TableRow key={adopter.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={adopter.avatarUrl}
                            alt={adopter.name}
                          />
                          <AvatarFallback>
                            {adopter.name?.substring(0, 2).toUpperCase() || 'AD'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div>{adopter.name}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(adopter.total_kontribusi)}
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
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    );
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
            {topAdopters.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">Tidak ada data adopter</p>
            ) : (
              topAdopters.map((adopter, index) => (
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
                    {formatCurrency(adopter.yearly_contribution || adopter.total_kontribusi)}
                  </span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          {renderAdopterTable(individualAdopters, "Daftar Adopter Individu")}
          {renderAdopterTable(organizationAdopters, "Daftar Adopter Organisasi")}
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

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default AdopterRiwayatModule;