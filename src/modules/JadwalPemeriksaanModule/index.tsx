"use client";

import React, { useState, useEffect } from "react";
import { z } from "zod";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Plus, Search, Pencil, Trash2, X } from "lucide-react";

// UI Components
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
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

// Define types for the data
type JadwalPemeriksaan = {
  id: string;
  id_hewan: string;
  tanggal_pemeriksaan: Date;
  frekuensi_pemeriksaan: number; // in days
  created_at: Date;
};

// Mock data for animals
const hewan = [
  { id: "H001", name: "Gajah Sumatran" },
  { id: "H002", name: "Harimau Benggala" },
  { id: "H003", name: "Orangutan" },
  { id: "H004", name: "Komodo" },
];

// Mock data for demo purposes
const mockJadwalPemeriksaan: JadwalPemeriksaan[] = [
  {
    id: "1",
    id_hewan: "H001",
    tanggal_pemeriksaan: new Date("2025-05-10"),
    frekuensi_pemeriksaan: 30, // every 30 days
    created_at: new Date("2025-04-10"),
  },
  {
    id: "2",
    id_hewan: "H002",
    tanggal_pemeriksaan: new Date("2025-05-15"),
    frekuensi_pemeriksaan: 14, // every 14 days
    created_at: new Date("2025-05-01"),
  },
  {
    id: "3",
    id_hewan: "H003",
    tanggal_pemeriksaan: new Date("2025-05-05"),
    frekuensi_pemeriksaan: 7, // every 7 days
    created_at: new Date("2025-04-28"),
  },
];

// Validation schema for the form
const pemeriksaanFormSchema = z.object({
  id_hewan: z.string().min(1, "ID Hewan harus diisi"),
  tanggal_pemeriksaan: z.date({
    required_error: "Tanggal pemeriksaan harus diisi",
  }),
  frekuensi_pemeriksaan: z.coerce
    .number()
    .min(1, "Frekuensi minimal 1 hari")
    .max(365, "Frekuensi maksimal 365 hari"),
});

type PemeriksaanFormValues = z.infer<typeof pemeriksaanFormSchema>;

export const JadwalPemeriksaanModule: React.FC = () => {
  const [jadwalPemeriksaan, setJadwalPemeriksaan] = useState<JadwalPemeriksaan[]>(mockJadwalPemeriksaan);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState<Date | null>(null);
  const [editingItem, setEditingItem] = useState<JadwalPemeriksaan | null>(null);

  // Setup form with react-hook-form and zod validation
  const form = useForm<PemeriksaanFormValues>({
    resolver: zodResolver(pemeriksaanFormSchema),
    defaultValues: {
      id_hewan: "",
      tanggal_pemeriksaan: new Date(),
      frekuensi_pemeriksaan: 30,
    },
  });

  // Reset form when dialog is closed
  useEffect(() => {
    if (!isDialogOpen) {
      form.reset();
      setEditingItem(null);
    }
  }, [isDialogOpen, form]);

  // Update form values when editing
  useEffect(() => {
    if (editingItem) {
      form.reset({
        id_hewan: editingItem.id_hewan,
        tanggal_pemeriksaan: new Date(editingItem.tanggal_pemeriksaan),
        frekuensi_pemeriksaan: editingItem.frekuensi_pemeriksaan,
      });
      setIsDialogOpen(true);
    }
  }, [editingItem, form]);

  // Handle form submission
  const onSubmit = (data: PemeriksaanFormValues) => {
    if (editingItem) {
      // Update existing item
      setJadwalPemeriksaan(
        jadwalPemeriksaan.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                ...data,
              }
            : item
        )
      );
    } else {
      // Create new item
      const newItem: JadwalPemeriksaan = {
        id: `${jadwalPemeriksaan.length + 1}`,
        ...data,
        created_at: new Date(),
      };
      setJadwalPemeriksaan([...jadwalPemeriksaan, newItem]);
    }
    setIsDialogOpen(false);
  };

  // Delete an item
  const handleDelete = (id: string) => {
    setJadwalPemeriksaan(jadwalPemeriksaan.filter((item) => item.id !== id));
  };

  // Filter data based on search and filters
  const filteredData = jadwalPemeriksaan.filter((item) => {
    const animal = hewan.find((h) => h.id === item.id_hewan);
    const animalName = animal ? animal.name : "";
    
    const matchesSearch =
      search === "" ||
      item.id_hewan.toLowerCase().includes(search.toLowerCase()) ||
      animalName.toLowerCase().includes(search.toLowerCase());
    
    const matchesDate =
      dateFilter === null ||
      format(item.tanggal_pemeriksaan, "yyyy-MM-dd") === format(dateFilter, "yyyy-MM-dd");
    
    return matchesSearch && matchesDate;
  });

  // Helper to get animal name from ID
  const getAnimalName = (id: string) => {
    const animal = hewan.find((h) => h.id === id);
    return animal ? animal.name : id;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Jadwal Pemeriksaan Kesehatan</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filter &amp; Pencarian</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari ID hewan, nama hewan..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`justify-start text-left font-normal ${
                    dateFilter ? "" : "text-muted-foreground"
                  }`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFilter ? format(dateFilter, "PPP") : "Filter Tanggal Pemeriksaan"}
                  {dateFilter && (
                    <X
                      className="ml-auto h-4 w-4 opacity-50 hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDateFilter(null);
                      }}
                    />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateFilter || undefined}
                  onSelect={(day) => setDateFilter(day || null)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Daftar Jadwal Pemeriksaan</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-white">
              <Plus className="mr-1" size={16} /> Tambah Jadwal Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Edit Jadwal Pemeriksaan" : "Tambah Jadwal Pemeriksaan"}
              </DialogTitle>
              <DialogDescription>
                {editingItem
                  ? "Ubah detail jadwal pemeriksaan yang ada"
                  : "Masukkan detail jadwal pemeriksaan kesehatan baru"}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="id_hewan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hewan</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih hewan" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {hewan.map((animal) => (
                            <SelectItem key={animal.id} value={animal.id}>
                              {animal.id} - {animal.name}
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
                  name="tanggal_pemeriksaan"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Tanggal Pemeriksaan</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={`w-full justify-start text-left font-normal`}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? format(field.value, "PPP") : "Pilih tanggal"}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              if (date) {
                                field.onChange(date);
                              }
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="frekuensi_pemeriksaan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frekuensi Pemeriksaan (hari)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={365}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="submit" className="bg-primary text-white">
                    {editingItem ? "Simpan Perubahan" : "Tambah Jadwal"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Hewan</TableHead>
                <TableHead>Nama Hewan</TableHead>
                <TableHead>Tanggal Pemeriksaan</TableHead>
                <TableHead>Frekuensi (hari)</TableHead>
                <TableHead>Tanggal Dibuat</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id_hewan}</TableCell>
                    <TableCell>{getAnimalName(item.id_hewan)}</TableCell>
                    <TableCell>{format(new Date(item.tanggal_pemeriksaan), "dd/MM/yyyy")}</TableCell>
                    <TableCell>{item.frekuensi_pemeriksaan} hari</TableCell>
                    <TableCell>{format(new Date(item.created_at), "dd/MM/yyyy")}</TableCell>
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
                            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
                            <AlertDialogDescription>
                              Apakah Anda yakin ingin menghapus jadwal pemeriksaan untuk {getAnimalName(item.id_hewan)}? Tindakan ini tidak dapat dibatalkan.
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
                  <TableCell colSpan={6} className="text-center py-4">
                    Tidak ada jadwal pemeriksaan yang ditemukan
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default JadwalPemeriksaanModule;