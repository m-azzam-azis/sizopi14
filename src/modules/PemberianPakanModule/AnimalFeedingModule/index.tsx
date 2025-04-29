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
  username_jh: string;
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
  username_jh: z.string().min(1, "Penjaga hewan harus diisi"),
});

type PakanFormValues = z.infer<typeof pakanFormSchema>;

// Mock data
const mockPemberianPakan: PemberianPakan[] = [
  {
    id: "1",
    id_hewan: "H001",
    jadwal: new Date("2025-04-25T08:00:00"),
    jenis: "Rumput",
    jumlah: 200,
    status: "completed",
    username_jh: "jh_bambang",
  },
  {
    id: "2",
    id_hewan: "H002",
    jadwal: new Date("2025-04-25T09:30:00"),
    jenis: "Daging",
    jumlah: 350,
    status: "pending",
    username_jh: "jh_sarah",
  },
  {
    id: "3",
    id_hewan: "H003",
    jadwal: new Date("2025-04-26T10:00:00"),
    jenis: "Buah-buahan",
    jumlah: 100,
    status: "canceled",
    username_jh: "jh_ahmad",
  },
  {
    id: "4",
    id_hewan: "H001",
    jadwal: new Date("2025-04-26T14:00:00"),
    jenis: "Rumput",
    jumlah: 250,
    status: "pending",
    username_jh: "jh_sarah",
  },
  {
    id: "5",
    id_hewan: "H001",
    jadwal: new Date("2025-04-27T08:00:00"),
    jenis: "Rumput",
    jumlah: 200,
    status: "pending",
    username_jh: "jh_bambang",
  },
  {
    id: "6",
    id_hewan: "H002",
    jadwal: new Date("2025-04-26T16:30:00"),
    jenis: "Daging",
    jumlah: 300,
    status: "pending",
    username_jh: "jh_sarah",
  },
];

const jenisPakan = [
  "Rumput",
  "Daging",
  "Buah-buahan",
  "Sayuran",
  "Biji-bijian",
];

const penjagaHewan = [
  { username: "jh_bambang", name: "Bambang" },
  { username: "jh_sarah", name: "Sarah" },
  { username: "jh_ahmad", name: "Ahmad" },
];

const hewanExtended = [
  {
    id: "H001",
    name: "Gajah Sumatran",
    species: "Elephas maximus sumatranus",
    origin: "Sumatera",
    birthDate: new Date("2015-06-12"),
    habitat: "Hutan Hujan Tropis",
    healthStatus: "Sehat",
    imageUrl: "https://images.unsplash.com/photo-1557050543-4162f98e2c54?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "H002",
    name: "Harimau Benggala",
    species: "Panthera tigris tigris",
    origin: "India",
    birthDate: new Date("2018-03-24"),
    habitat: "Hutan Tropis",
    healthStatus: "Sakit",
    imageUrl: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "H003", 
    name: "Orangutan",
    species: "Pongo pygmaeus",
    origin: "Kalimantan",
    birthDate: new Date("2017-09-30"),
    habitat: "Hutan Hujan Tropis",
    healthStatus: "Sehat",
    imageUrl: "https://images.unsplash.com/photo-1544715608-1cc9d0a10011?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "H004",
    name: "Komodo",
    species: "Varanus komodoensis",
    origin: "Pulau Komodo",
    birthDate: new Date("2019-11-05"),
    habitat: "Savana",
    healthStatus: "Sehat",
    imageUrl: "https://images.unsplash.com/photo-1585080797525-6830941059c3?q=80&w=1000&auto=format&fit=crop"
  },
];

export const AnimalFeedingModule = ({ animalId }: { animalId: string }) => {
  const router = useRouter();
  const [pemberianPakan, setPemberianPakan] = useState<PemberianPakan[]>(mockPemberianPakan);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<PemberianPakan | null>(null);
  
  // Find the animal data
  const animal = hewanExtended.find(h => h.id === animalId) || {
    id: animalId,
    name: "Unknown Animal",
    species: "Unknown",
    origin: "Unknown",
    birthDate: new Date(),
    habitat: "Unknown",
    healthStatus: "Unknown",
    imageUrl: ""
  };

  // Filter data for this specific animal
  const animalFeedingSchedule = pemberianPakan.filter(item => 
    item.id_hewan === animalId &&
    (search === "" || 
     item.jenis.toLowerCase().includes(search.toLowerCase()) ||
     item.username_jh.toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter === null || item.status === statusFilter)
  );

  // Setup form with react-hook-form and zod validation
  const form = useForm<PakanFormValues>({
    resolver: zodResolver(pakanFormSchema),
    defaultValues: {
      id_hewan: animalId,
      jadwal: new Date(),
      jenis: "",
      jumlah: 1,
      status: "pending",
      username_jh: "",
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
        username_jh: "",
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
        username_jh: editingItem.username_jh,
      });
      setIsDialogOpen(true);
    }
  }, [editingItem, form]);

  // Handle form submission
  const onSubmit = (data: PakanFormValues) => {
    if (editingItem) {
      // Update existing item
      setPemberianPakan(
        pemberianPakan.map((item) =>
          item.id === editingItem.id ? { ...data, id: item.id } as PemberianPakan : item
        )
      );
    } else {
      // Create new item
      const newItem: PemberianPakan = {
        id: `${pemberianPakan.length + 1}`,
        ...data,
      };
      setPemberianPakan([...pemberianPakan, newItem]);
    }
    setIsDialogOpen(false);
  };

  // Delete an item
  const handleDelete = (id: string) => {
    setPemberianPakan(pemberianPakan.filter((item) => item.id !== id));
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

  // Helper to get caretaker name from username
  const getCaretakerName = (username: string) => {
    const caretaker = penjagaHewan.find(p => p.username === username);
    return caretaker ? caretaker.name : username;
  };

  const getStatusKesehatanColor = (status: string) => {
    
    switch(status) {
      case "Sehat": return "bg-green-100 text-green-800";
      case "Pemulihan": return "bg-yellow-100 text-yellow-800";
      case "Sakit": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  }

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
        <div className="relative h-40 w-40 rounded-lg overflow-hidden shadow-md">
          {animal.imageUrl && (
            <img
              src={animal.imageUrl}
              alt={animal.name}
              className="object-cover w-full h-full"
            />
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            {animal.name} 
            <Badge className="ml-2 text-sm">
              {animal.id}
            </Badge>
          </h1>
          <p className="text-muted-foreground italic mb-2">{animal.species}</p>
          
          <div className="grid grid-cols-2 gap-x-12 gap-y-1 mt-4">
            <div>
              <span className="text-sm font-semibold">Asal:</span>
              <span className="ml-2">{animal.origin}</span>
            </div>
            <div>
              <span className="text-sm font-semibold">Habitat:</span>
              <span className="ml-2">{animal.habitat}</span>
            </div>
            <div>
              <span className="text-sm font-semibold">Tanggal Lahir:</span>
              <span className="ml-2">{format(animal.birthDate, "dd/MM/yyyy")}</span>
            </div>
            <div>
              <span className="text-sm font-semibold">Status Kesehatan:</span>
              <Badge className="ml-2" variant={animal.healthStatus === "Sehat" ? "outline" : "secondary"}>
                {animal.healthStatus}
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
                  placeholder="Cari jenis pakan, penjaga..."
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
                      : `Masukkan detail jadwal pemberian pakan baru untuk ${animal.name}`}
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {/* ID Hewan is pre-selected and hidden */}
                    <input type="hidden" {...form.register("id_hewan")} />
                    
                    <FormField
                      control={form.control}
                      name="jadwal"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Jadwal</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={`w-full pl-3 text-left font-normal ${
                                    !field.value ? "text-muted-foreground" : ""
                                  }`}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP HH:mm")
                                  ) : (
                                    <span>Pilih tanggal dan waktu</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(date) => {
                                  if (date) {
                                    const currentValue = field.value;
                                    date.setHours(
                                      currentValue.getHours(),
                                      currentValue.getMinutes()
                                    );
                                    field.onChange(date);
                                  }
                                }}
                                initialFocus
                              />
                              <div className="p-3 border-t border-border">
                                <Input
                                  type="time"
                                  onChange={(e) => {
                                    const [hours, minutes] = e.target.value
                                      .split(":")
                                      .map(Number);
                                    const date = new Date(field.value);
                                    date.setHours(hours, minutes);
                                    field.onChange(date);
                                  }}
                                  defaultValue={format(field.value, "HH:mm")}
                                />
                              </div>
                            </PopoverContent>
                          </Popover>
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
                            onValueChange={field.onChange as unknown as (value: string) => void}
                            defaultValue={field.value}
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
                    />
                    
                    <FormField
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
                    
                    <FormField
                      control={form.control}
                      name="username_jh"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Penjaga Hewan</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih penjaga hewan" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {penjagaHewan.map((penjaga) => (
                                <SelectItem
                                  key={penjaga.username}
                                  value={penjaga.username}
                                >
                                  {penjaga.name} ({penjaga.username})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter>
                      <Button type="submit">
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
                  <TableHead>Penjaga Hewan</TableHead>
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
                      <TableCell>{getCaretakerName(item.username_jh)}</TableCell>
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
                                Apakah Anda yakin ingin menghapus jadwal pemberian pakan untuk {animal.name} pada {format(new Date(item.jadwal), "dd/MM/yyyy HH:mm")}? Tindakan ini tidak dapat dibatalkan.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(item.id)}
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
                    <TableCell colSpan={6} className="text-center py-8">
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