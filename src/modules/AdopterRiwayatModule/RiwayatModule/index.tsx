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

  useEffect(() => {
    const fetchAdopterDetail = async () => {
      setIsLoading(true);
      try {
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

    fetchAdopterDetail();
  }, [adopterId]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleDelete = async (id_hewan: string) => {
    try {
      const response = await fetch(`/api/adopsi/${id_hewan}?id_adopter=${adopterId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Update local state to remove the deleted adoption
      setAdoptions(adoptions.filter((adoption) => adoption.id_hewan !== id_hewan));
      
      showToastMessage("Data adopsi berhasil dihapus");
    } catch (error) {
      console.error("Error deleting adoption:", error);
      showToastMessage("Gagal menghapus data adopsi");
    }
  };

  // Function to check if an adoption is ongoing
  const isAdoptionOngoing = (adoption: Adoption) => {
    const today = new Date();
    const endDate = new Date(adoption.tgl_berhenti_adopsi);
    return endDate >= today;
  };

  // Function to show toast message
  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !adopter) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="bg-white p-8 rounded-lg border">
          <p className="text-red-500 mb-4">{error || "Data tidak ditemukan"}</p>
          <Link href="/adopter" className="inline-flex items-center gap-2 text-blue-500 px-4 py-2 rounded-md border border-blue-500 hover:bg-blue-50 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="bg-white p-8 rounded-lg border shadow-sm">
        {/* Back button */}
        <div className="mb-8">
          <Link 
            href="/adopter" 
            className="inline-flex items-center gap-2 text-blue-500 px-4 py-2 rounded-md border border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Kembali
          </Link>
        </div>

        {/* Main Title */}
        <h2 className="text-2xl font-bold text-center mb-8">Riwayat Adopsi</h2>

        {/* Adopter information */}
        <div className="mb-8 p-6 border rounded-lg bg-gray-50">
          <div className="mb-2">
            <span className="font-bold">Nama Adopter:</span> {adopter.name}
          </div>
          <div className="mb-2">
            <span className="font-bold">Alamat Adopter:</span> {adopter.address || "[alamat]"}
          </div>
          <div className="mb-2">
            <span className="font-bold">Kontak Adopter:</span> {adopter.contact || "[no telepon]"}
          </div>
        </div>

        {/* Adoption history table */}
        <div className="overflow-x-auto">
          <Table className="w-full border-collapse border border-slate-300">
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="border border-slate-300 text-center font-bold p-3">Nama Hewan</TableHead>
                <TableHead className="border border-slate-300 text-center font-bold p-3">Jenis Hewan</TableHead>
                <TableHead className="border border-slate-300 text-center font-bold p-3">Tanggal Mulai Adopsi</TableHead>
                <TableHead className="border border-slate-300 text-center font-bold p-3">Tanggal Akhir Adopsi</TableHead>
                <TableHead className="border border-slate-300 text-center font-bold p-3">Nominal Kontribusi</TableHead>
                <TableHead className="border border-slate-300 text-center font-bold p-3">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adoptions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="border border-slate-300 text-center p-4">
                    Tidak ada riwayat adopsi
                  </TableCell>
                </TableRow>
              ) : (
                adoptions.map((adoption) => {
                  const ongoing = isAdoptionOngoing(adoption);
                  
                  return (
                    <TableRow key={adoption.id_hewan} className="hover:bg-gray-50">
                      <TableCell className="border border-slate-300 p-3">
                        {adoption.nama_hewan}
                      </TableCell>
                      <TableCell className="border border-slate-300 p-3 text-center">
                        {adoption.spesies}
                      </TableCell>
                      <TableCell className="border border-slate-300 p-3 text-center">
                        {adoption.tgl_mulai_adopsi}
                      </TableCell>
                      <TableCell className="border border-slate-300 p-3 text-center">
                        {adoption.tgl_berhenti_adopsi}
                      </TableCell>
                      <TableCell className="border border-slate-300 p-3 text-center font-medium">
                        {formatCurrency(adoption.kontribusi_finansial).replace("Rp", "Rp")}
                      </TableCell>
                      <TableCell className="border border-slate-300 p-3 text-center">
                        {ongoing ? (
                          <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full border border-green-500 font-medium">
                            Sedang Berlangsung
                          </span>
                        ) : (
                          <button
                            onClick={() => handleDelete(adoption.id_hewan)}
                            className="inline-block px-3 py-1 bg-red-50 text-red-600 rounded-full border border-red-500 hover:bg-red-100 transition-colors"
                          >
                            Hapus
                          </button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center">
          <div className="mr-2">✓</div> 
          {toastMessage}
        </div>
      )}
    </div>
  );
}