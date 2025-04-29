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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter, useParams } from "next/navigation";

interface RiwayatAdopsiModuleProps {
  adopterId: string;
}

// Define interfaces for type safety
interface Adopter {
  id: string;
  name: string;
  address: string;
  contact: string;
  totalContribution: number;
}

interface AdoptionRecord {
  id: string;
  animalName: string;
  animalSpecies: string;
  animalHabitat: string;
  startDate: string;
  endDate: string;
  contributionAmount: number;
  status: "Active" | "Expired";
  paymentStatus: "Paid" | "Pending";
}

// Database of all adopters
const allAdopters: Adopter[] = [
  {
    id: "adp-001",
    name: "Prasetya Andriani",
    address: "Jl. Diponegoro No. 45, Surabaya",
    contact: "089635460305",
    totalContribution: 15000000,
  },
  {
    id: "adp-010",
    name: "Agus Januar",
    address: "Jl. Sudirman No. 123, Jakarta",
    contact: "083573452405",
    totalContribution: 3200000,
  },
  {
    id: "adp-011",
    name: "Yayasan Margana Jaya",
    address: "Jl. Merdeka No. 123, Jakarta Pusat",
    contact: "080925544576",
    totalContribution: 25000000,
  },
  {
    id: "adp-012",
    name: "Lembaga Dwinarno Mandiri",
    address: "Jl. Pahlawan No. 55, Bandung",
    contact: "080749318642",
    totalContribution: 22000000,
  },
  {
    id: "adp-013",
    name: "Rika Sinaga Foundation",
    address: "Jl. Gajah Mada No. 72, Medan",
    contact: "087638079651",
    totalContribution: 20500000,
  },
];

// Database of all adoption records
const allAdoptionRecords: Record<string, AdoptionRecord[]> = {
  "adp-001": [
    {
      id: "adr-101",
      animalName: "Nala",
      animalSpecies: "African Lion",
      animalHabitat: "Savanna Enclosure",
      startDate: "2023-05-15",
      endDate: "2024-05-15",
      contributionAmount: 6000000,
      status: "Active",
      paymentStatus: "Paid",
    },
    {
      id: "adr-102",
      animalName: "Pumbaa",
      animalSpecies: "Warthog",
      animalHabitat: "Savanna Enclosure",
      startDate: "2022-10-20",
      endDate: "2023-10-20",
      contributionAmount: 4000000,
      status: "Expired",
      paymentStatus: "Paid",
    },
    {
      id: "adr-103",
      animalName: "Rex",
      animalSpecies: "Anjing",
      animalHabitat: "Pegunungan Alpen",
      startDate: "2023-08-05",
      endDate: "2025-08-05",
      contributionAmount: 5000000,
      status: "Active",
      paymentStatus: "Paid",
    },
  ],
  
  "adp-010": [
    {
      id: "adr-201",
      animalName: "Verstappen", 
      animalSpecies: "Singa",
      animalHabitat: "Belanda",
      startDate: "2023-09-01",
      endDate: "2024-09-01",
      contributionAmount: 3200000,
      status: "Active",
      paymentStatus: "Paid",
    }
  ],
  
  "adp-011": [
    {
      id: "adr-001",
      animalName: "Simba",
      animalSpecies: "African Lion",
      animalHabitat: "Savanna Enclosure",
      startDate: "2022-06-10",
      endDate: "2023-06-10",
      contributionAmount: 5000000,
      status: "Expired",
      paymentStatus: "Paid",
    },
    {
      id: "adr-002",
      animalName: "Zara",
      animalSpecies: "Plains Zebra",
      animalHabitat: "Savanna Enclosure",
      startDate: "2023-03-15",
      endDate: "2025-03-15",
      contributionAmount: 4000000,
      status: "Active",
      paymentStatus: "Paid",
    },
    {
      id: "adr-003",
      animalName: "Rafiki",
      animalSpecies: "Giraffe",
      animalHabitat: "Savanna Enclosure",
      startDate: "2023-01-20",
      endDate: "2025-01-20",
      contributionAmount: 6000000,
      status: "Active",
      paymentStatus: "Paid",
    },
    {
      id: "adr-004",
      animalName: "Frost",
      animalSpecies: "Polar Bear",
      animalHabitat: "Arctic Zone",
      startDate: "2022-05-10",
      endDate: "2023-05-10",
      contributionAmount: 4500000,
      status: "Expired",
      paymentStatus: "Paid",
    },
    {
      id: "adr-005",
      animalName: "Flipper",
      animalSpecies: "Bottlenose Dolphin",
      animalHabitat: "Aquatic Center",
      startDate: "2023-07-01",
      endDate: "2025-07-01",
      contributionAmount: 5500000,
      status: "Active",
      paymentStatus: "Paid",
    },
  ],
  
  "adp-012": [
    {
      id: "adr-301",
      animalName: "Rex",
      animalSpecies: "Anjing",
      animalHabitat: "Pegunungan Alpen",
      startDate: "2023-04-10",
      endDate: "2025-04-10",
      contributionAmount: 7000000,
      status: "Active",
      paymentStatus: "Paid",
    },
    {
      id: "adr-302",
      animalName: "Nala",
      animalSpecies: "African Lion",
      animalHabitat: "Savanna Enclosure",
      startDate: "2022-08-15",
      endDate: "2023-08-15",
      contributionAmount: 8000000,
      status: "Expired",
      paymentStatus: "Paid",
    },
    {
      id: "adr-303",
      animalName: "Frost",
      animalSpecies: "Polar Bear",
      animalHabitat: "Arctic Zone",
      startDate: "2023-02-20",
      endDate: "2024-02-20",
      contributionAmount: 7000000,
      status: "Active",
      paymentStatus: "Paid",
    }
  ],
  
  "adp-013": [
    {
      id: "adr-401",
      animalName: "Verstappen", 
      animalSpecies: "Singa",
      animalHabitat: "Belanda",
      startDate: "2022-11-05",
      endDate: "2023-11-05",
      contributionAmount: 8500000,
      status: "Expired",
      paymentStatus: "Paid",
    },
    {
      id: "adr-402",
      animalName: "Pumbaa",
      animalSpecies: "Warthog",
      animalHabitat: "Savanna Enclosure",
      startDate: "2023-06-15",
      endDate: "2024-06-15",
      contributionAmount: 12000000,
      status: "Active",
      paymentStatus: "Paid",
    }
  ]
};

const RiwayatAdopsiModule: React.FC<RiwayatAdopsiModuleProps> = ({ adopterId }) => {
  const router = useRouter();
  
  const [adopter, setAdopter] = useState<Adopter | null>(null);
  const [adoptionRecords, setAdoptionRecords] = useState<AdoptionRecord[]>([]);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      // Find adopter by ID
      const foundAdopter = allAdopters.find(a => a.id === adopterId);
      
      // Find adoption records for this adopter
      const adopterRecords = allAdoptionRecords[adopterId] || [];
      
      if (foundAdopter) {
        setAdopter(foundAdopter);
        setAdoptionRecords(adopterRecords);
      }
      
      setIsLoading(false);
    }, 500);
  }, [adopterId]);

  // Function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };
  
  // Function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDeleteClick = (id: string) => {
    // Check if the record is eligible for deletion (expired)
    const record = adoptionRecords.find((r) => r.id === id);
    if (record && record.status === "Expired") {
      setRecordToDelete(id);
      setShowDeleteAlert(true);
    }
  };

  const handleDelete = () => {
    if (recordToDelete) {
      setAdoptionRecords(adoptionRecords.filter((record) => record.id !== recordToDelete));
      console.log(`Delete adoption record with ID: ${recordToDelete}`);
    }
    setShowDeleteAlert(false);
    setRecordToDelete(null);
  
    // Tampilkan toast
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Function to determine if a record can be deleted
  const canDelete = (status: string) => {
    return status === "Expired";
  };

  if (isLoading) {
    return <div className="container mx-auto py-10 px-4">Memuat data...</div>;
  }

  if (!adopter) {
    return <div className="container mx-auto py-10 px-4">Data adopter tidak ditemukan</div>;
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex items-center mb-6">
        <Button
          variant="outline"
          size="sm"
          className="mr-4"
          onClick={() => router.push('/adopter')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Kembali
        </Button>
        <h1 className="text-2xl font-bold">Riwayat Adopsi</h1>
      </div>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Nama Adopter:</p>
                <p className="font-semibold">{adopter.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Alamat Adopter:</p>
                <p className="font-semibold">{adopter.address}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Kontak Adopter:</p>
                <p className="font-semibold">{adopter.contact}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Data Adopsi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Hewan</TableHead>
                  <TableHead>Jenis Hewan</TableHead>
                  <TableHead>Habitat</TableHead>
                  <TableHead>Tanggal Mulai</TableHead>
                  <TableHead>Tanggal Akhir</TableHead>
                  <TableHead>Nominal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adoptionRecords.length > 0 ? (
                  adoptionRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.animalName}</TableCell>
                      <TableCell>{record.animalSpecies}</TableCell>
                      <TableCell>{record.animalHabitat}</TableCell>
                      <TableCell>{formatDate(record.startDate)}</TableCell>
                      <TableCell>{formatDate(record.endDate)}</TableCell>
                      <TableCell>{formatCurrency(record.contributionAmount)}</TableCell>
                      <TableCell>
                        {record.status === "Active" ? (
                          <Badge className="bg-green-500">Aktif</Badge>
                        ) : (
                          <Badge className="bg-gray-500">Berakhir</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {record.status === "Active" ? (
                          <Badge className="bg-green-500">Sedang Berlangsung</Badge>
                        ) : (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteClick(record.id)}
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                            disabled={!canDelete(record.status)}
                            title={canDelete(record.status) ? "Hapus" : "Tidak dapat dihapus karena masih berlangsung"}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">
                      Tidak ada data adopsi untuk adopter ini.
                    </TableCell>
                  </TableRow>
                )}
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
              Tindakan ini tidak dapat dibatalkan. Data riwayat adopsi ini akan dihapus secara permanen.
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

export default RiwayatAdopsiModule;