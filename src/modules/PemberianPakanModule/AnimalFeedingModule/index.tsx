"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon, 
  Trash2,
  Pencil,
  Plus,
  ArrowLeft,
  Search
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

// Use the same data types as the original module
type PemberianPakan = {
  id: string;
  id_hewan: string;
  jadwal: Date;
  jenis: string;
  jumlah: number;
  status: "pending" | "completed" | "canceled";
};

// Use the same validation schema
const pakanFormSchema = z.object({
  id_hewan: z.string().min(1, "ID Hewan harus diisi"),
  jadwal: z.date({
    required_error: "Jadwal harus diisi",
  }),
  jenis: z.string().min(1, "Jenis pakan harus diisi"),
  jumlah: z.coerce
    .number()
    .min(1, "Jumlah pakan minimal 1")
    .max(10000000, "Jumlah pakan maksimal 10000000"),
  status: z.enum(["pending", "completed", "canceled"]),
});

type PakanFormValues = z.infer<typeof pakanFormSchema>;

export const AnimalFeedingModule = ({ animalId }: { animalId: string }) => {
  const router = useRouter();
  const [pemberianPakan, setPemberianPakan] = useState<PemberianPakan[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<PemberianPakan | null>(null);  const [animal, setAnimal] = useState<any>(null);
  const [jenisPakan, setJenisPakan] = useState<string[]>(["Rumput", "Daging", "Buah-buahan", "Sayuran", "Biji-bijian"]);
  // Fetch animal and pakan data
  const fetchData = async () => {
    try {
      // Fetch animal data
      const animalRes = await fetch(`/api/hewan?id=${animalId}`);
      const animalData = await animalRes.json();
      setAnimal(animalData[0]);

      // Fetch pakan data for the specific animal
      const pakanRes = await fetch(`/api/pakan?id_hewan=${animalId}`);
      const pakanData = await pakanRes.json();
      setPemberianPakan(pakanData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [animalId]);
  // Setup form with react-hook-form and zod validation
  const form = useForm<PakanFormValues>({
    resolver: zodResolver(pakanFormSchema),
    defaultValues: {
      id_hewan: animalId,
      jadwal: new Date(),
      jenis: "",
      jumlah: 1,
      status: "pending",
    },
  });
  // Reset form when dialog is closed
  useEffect(() => {
    if (!isDialogOpen) {
      form.reset({
        id_hewan: animalId,
        jadwal: new Date(),
        jenis: "",
        jumlah: 1,
        status: "pending",
      });
      setEditingItem(null);
    }
  }, [isDialogOpen, form, animalId]);
  // Update form values when editing
  useEffect(() => {
    if (editingItem) {
      form.reset({
        id_hewan: editingItem.id_hewan,
        jadwal: new Date(editingItem.jadwal),
        jenis: editingItem.jenis,
        jumlah: editingItem.jumlah,
        status: editingItem.status,
      });
      setIsDialogOpen(true);
    }
  }, [editingItem, form]);
  // Filter data for this specific animal
  const animalFeedingSchedule = pemberianPakan.filter(item => 
    item.id_hewan === animalId &&
    (search === "" || 
     item.jenis.toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter === null || item.status === statusFilter)
  );// Handle form submission
  const onSubmit = async (data: PakanFormValues) => {
    console.log("Form submitted with data:", data);
    console.log("Form validation state:", form.formState.isValid);
    console.log("Form errors:", form.formState.errors);
    
    try {
      if (editingItem) {
        // Update existing item
        const response = await fetch(`/api/pakan?id_hewan=${editingItem.id_hewan}&jadwal=${editingItem.jadwal}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        
        if (!response.ok) {
          const errorData = await response.text();
          console.error("Error response:", errorData);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        setPemberianPakan(pemberianPakan.map((item) =>
          item.id_hewan === editingItem.id_hewan && String(item.jadwal) === String(editingItem.jadwal)
            ? { ...data, id: item.id, jadwal: data.jadwal }
            : item
        ));
      } else {
        // Create new item
        console.log("Creating new pakan with data:", data);
        const response = await fetch(`/api/pakan`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        
        if (!response.ok) {
          const errorData = await response.text();
          console.error("Error response:", errorData);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const newItem = await response.json();
        console.log("New item created:", newItem);
        setPemberianPakan([...pemberianPakan, newItem]);
      }
      setIsDialogOpen(false);
      fetchData(); // Refresh data
    } catch (error) {
      console.error("Error submitting form:", error);
      // You can add a toast notification here to show the error to the user
    }
  };

  // Delete an item
  const handleDelete = async (id_hewan: string, jadwal: Date) => {
    await fetch(`/api/pakan?id_hewan=${id_hewan}&jadwal=${jadwal.toISOString()}`, {
      method: "DELETE",
    });
    setPemberianPakan(pemberianPakan.filter((item) => !(item.id_hewan === id_hewan && String(item.jadwal) === String(jadwal))));
    fetchData(); // Refresh data
  };
  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Selesai</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Menunggu</Badge>;
      case "canceled":
        return <Badge className="bg-red-500">Dibatalkan</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (!animal) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-8 px-4">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => router.push('/pakan')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Kembali ke Daftar Hewan
      </Button>
      
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="flex-1">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            {animal.nama} 
            <Badge className="ml-2 text-sm">
              {animal.id}
            </Badge>
          </h1>
          <p className="text-muted-foreground italic mb-2">{animal.spesies}</p>
          <div className="grid grid-cols-2 gap-x-12 gap-y-1 mt-4">
            <div>
              <span className="text-sm font-semibold">Asal:</span>
              <span className="ml-2">{animal.asal_hewan}</span>
            </div>
            <div>
              <span className="text-sm font-semibold">Habitat:</span>
              <span className="ml-2">{animal.nama_habitat}</span>
            </div>
            <div>
              <span className="text-sm font-semibold">Tanggal Lahir:</span>
              <span className="ml-2">{format(new Date(animal.tanggal_lahir), "dd/MM/yyyy")}</span>
            </div>
            <div>
              <span className="text-sm font-semibold">Status Kesehatan:</span>
              <Badge className="ml-2" variant={animal.status_kesehatan === "Sehat" ? "outline" : "secondary"}>
                {animal.status_kesehatan}
              </Badge>
            </div>
          </div>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <CardTitle>Jadwal Pemberian Pakan</CardTitle>
            <div className="flex flex-col md:flex-row gap-2 mt-2 md:mt-0 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari jenis pakan..."
                  className="pl-10 w-full md:w-64"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              
              <Select
                value={statusFilter || "all"}
                onValueChange={(value) => setStatusFilter(value === "all" ? null : value)}
                >
                <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="pending">Menunggu</SelectItem>
                    <SelectItem value="completed">Selesai</SelectItem>
                    <SelectItem value="canceled">Dibatalkan</SelectItem>
                </SelectContent>
                </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <p className="text-muted-foreground text-sm">
              Menampilkan {animalFeedingSchedule.length} jadwal pemberian pakan
            </p>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-1" size={16} /> Tambah Jadwal
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingItem ? "Edit Pemberian Pakan" : "Tambah Jadwal Pemberian Pakan"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingItem
                      ? "Ubah detail pemberian pakan yang ada"
                      : `Masukkan detail jadwal pemberian pakan baru untuk ${animal.nama}`}
                  </DialogDescription>
                </DialogHeader>                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {/* ID Hewan is pre-selected and hidden */}
                    <FormField
                      control={form.control}
                      name="id_hewan"
                      render={({ field }) => (
                        <input type="hidden" {...field} />
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="jadwal"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Jadwal</FormLabel>
                          <FormControl>
                            <Input
                              type="datetime-local"
                              value={field.value ? format(field.value, "yyyy-MM-dd'T'HH:mm") : ""}
                              onChange={(e) => {
                                const date = e.target.value ? new Date(e.target.value) : undefined;
                                field.onChange(date);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                      <FormField
                      control={form.control}
                      name="jenis"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jenis Pakan</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih jenis pakan" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {jenisPakan.map((jenis) => (
                                <SelectItem key={jenis} value={jenis}>
                                  {jenis}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />                    <FormField
                      control={form.control}
                      name="jumlah"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jumlah (gram)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              max={100000}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {editingItem && (
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            >
                            <FormControl>
                                <SelectTrigger>
                                <SelectValue placeholder="Pilih status" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="pending">Menunggu</SelectItem>
                                <SelectItem value="completed">Selesai</SelectItem>
                                <SelectItem value="canceled">Dibatalkan</SelectItem>
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    )}
                      <DialogFooter>
                      <Button 
                        type="submit" 
                        className="bg-green-500 text-white hover:bg-green-600"
                        onClick={() => console.log("Submit button clicked")}
                      >
                        {editingItem ? "Simpan Perubahan" : "Tambah Jadwal"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Jadwal</TableHead>
                  <TableHead>Jenis Pakan</TableHead>
                  <TableHead>Jumlah (gram)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {animalFeedingSchedule.length > 0 ? (
                  animalFeedingSchedule.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{format(new Date(item.jadwal), "dd/MM/yyyy HH:mm")}</TableCell>
                      <TableCell>{item.jenis}</TableCell>
                      <TableCell>{item.jumlah}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingItem(item)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-red-500">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Hapus Jadwal Pemberian Pakan</AlertDialogTitle>
                              <AlertDialogDescription>
                                Apakah Anda yakin ingin menghapus jadwal pemberian pakan untuk {animal.nama} pada {format(new Date(item.jadwal), "dd/MM/yyyy HH:mm")}? Tindakan ini tidak dapat dibatalkan.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(item.id_hewan, new Date(item.jadwal))}
                                className="bg-red-500 text-white hover:bg-red-600"
                              >
                                Hapus
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      Tidak ada jadwal pemberian pakan untuk hewan ini.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};