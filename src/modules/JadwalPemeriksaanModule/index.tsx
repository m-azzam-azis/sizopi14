"use client";

import React, { useState, useEffect } from "react";
import { z } from "zod";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Plus, Search, Pencil, Trash2, X } from "lucide-react";

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

// Validation schema for the form
const pemeriksaanFormSchema = z.object({
  id_hewan: z.string().min(1, "ID Hewan harus diisi"),
  tanggal_pemeriksaan: z.date({
    required_error: "Tanggal pemeriksaan harus diisi",
  }),
  frekuensi_pemeriksaan: z.coerce
    .number()
    .min(1, "Frekuensi minimal 1 bulan")
    .max(12, "Frekuensi maksimal 12 bulan"),
});

type PemeriksaanFormValues = z.infer<typeof pemeriksaanFormSchema>;

export const JadwalPemeriksaanModule: React.FC = () => {
  const [hewan, setHewan] = useState<{ id: string; nama: string }[]>([]);
  const [jadwalPemeriksaan, setJadwalPemeriksaan] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState<Date | null>(null);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch hewan dari API
  useEffect(() => {
    fetch("/api/hewan")
      .then((res) => res.json())
      .then((data) => {
        const mapped = data.map((h: any) => ({ id: h.id, nama: h.nama }));
        setHewan(mapped);
        if (mapped.length > 0) {
          setSearch(mapped[0].id);
        }
      });
  }, []);

  // Keep search in sync with hewan list (handles dynamic changes)
  useEffect(() => {
    if (hewan.length > 0 && !hewan.some((h) => h.id === search)) {
      setSearch(hewan[0].id);
    }
    if (hewan.length === 0 && search !== "") {
      setSearch("");
    }
  }, [hewan]);

  // Fetch jadwal pemeriksaan dari API
  const fetchJadwal = async () => {
    setLoading(true);
    const res = await fetch("/api/jadwal-pemeriksaan?limit=100&page=1");
    const data = await res.json();
    setJadwalPemeriksaan(data);
    setLoading(false);
  };
  useEffect(() => {
    fetchJadwal();
  }, []);

  // Setup form
  const form = useForm<PemeriksaanFormValues>({
    resolver: zodResolver(pemeriksaanFormSchema),
    defaultValues: {
      id_hewan: "",
      tanggal_pemeriksaan: undefined, // User harus pilih manual
      frekuensi_pemeriksaan: 1,
    },
  });

  // Reset form when dialog is closed
  useEffect(() => {
    if (!isDialogOpen) {
      form.reset({
        id_hewan: "",
        tanggal_pemeriksaan: undefined,
        frekuensi_pemeriksaan: 1,
      });
      setEditingItem(null);
    }
  }, [isDialogOpen, form]);

  // Update form values when editing
  useEffect(() => {
    if (editingItem) {
      form.reset({
        id_hewan: editingItem.id_hewan,
        tanggal_pemeriksaan: new Date(editingItem.tgl_pemeriksaan_selanjutnya),
        frekuensi_pemeriksaan: editingItem.freq_pemeriksaan_rutin,
      });
      setIsDialogOpen(true);
    }
  }, [editingItem, form]);

  // Pastikan id_hewan selalu di-set ke search saat tambah dialog dibuka
  useEffect(() => {
    if (isDialogOpen && !editingItem) {
      form.setValue("id_hewan", search, { shouldValidate: true });
    }
  }, [isDialogOpen, editingItem, search, form]);

  // Handle form submission (Create & Update)
  const onSubmit = async (data: PemeriksaanFormValues) => {
    const tgl_pemeriksaan_selanjutnya = data.tanggal_pemeriksaan instanceof Date
      ? data.tanggal_pemeriksaan.toISOString()
      : data.tanggal_pemeriksaan;
    if (editingItem) {
      // Update
      await fetch(`/api/jadwal-pemeriksaan?id=${editingItem.id_hewan}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_hewan: data.id_hewan,
          tgl_pemeriksaan_selanjutnya,
          freq_pemeriksaan_rutin: data.frekuensi_pemeriksaan,
        }),
      });
    } else {
      // Create
      await fetch("/api/jadwal-pemeriksaan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_hewan: data.id_hewan,
          tgl_pemeriksaan_selanjutnya,
          freq_pemeriksaan_rutin: data.frekuensi_pemeriksaan,
        }),
      });
    }
    setIsDialogOpen(false);
    fetchJadwal();
  };

  // Delete an item
  const handleDelete = async (id_hewan: string) => {
    await fetch(`/api/jadwal-pemeriksaan?id=${id_hewan}`, { method: "DELETE" });
    fetchJadwal();
  };

  // Filter data based on search and filters
  const filteredData = jadwalPemeriksaan.filter((item) => {
    const animal = hewan.find((h) => h.id === item.id_hewan);
    const animalName = animal ? animal.nama : "";
    const matchesSearch =
      search === "" ||
      item.id_hewan.toLowerCase().includes(search.toLowerCase()) ||
      animalName.toLowerCase().includes(search.toLowerCase());
    const matchesDate =
      dateFilter === null ||
      format(new Date(item.tgl_pemeriksaan_selanjutnya), "yyyy-MM-dd") ===
        format(dateFilter, "yyyy-MM-dd");
    return matchesSearch && matchesDate;
  });

  // Helper to get animal name from ID
  const getAnimalName = (id: string) => {
    const animal = hewan.find((h) => h.id === id);
    return animal ? animal.nama : id;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Jadwal Pemeriksaan Kesehatan</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filter Jadwal Pemeriksaan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Filter Hewan</label>
              <Select
                value={search}
                onValueChange={setSearch}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih hewan" />
                </SelectTrigger>
                <SelectContent>
                  {hewan.map((h) => (
                    <SelectItem key={h.id} value={h.id}>
                      {h.nama} ({h.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`justify-start text-left font-normal ${dateFilter ? "" : "text-muted-foreground"}`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFilter
                    ? format(dateFilter, "PPP")
                    : "Filter Tanggal Pemeriksaan"}
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
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>
                {editingItem
                  ? "Edit Jadwal Pemeriksaan"
                  : "Tambah Jadwal Pemeriksaan"}
              </DialogTitle>
              <DialogDescription>
                {editingItem
                  ? "Ubah detail jadwal pemeriksaan yang ada"
                  : "Masukkan detail jadwal pemeriksaan kesehatan baru"}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* id_hewan di-set otomatis via effect, tidak perlu input hidden */}
                <FormField
                  control={form.control}
                  name="tanggal_pemeriksaan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tanggal Pemeriksaan Selanjutnya</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
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
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Batal
                  </Button>
                  <Button type="submit" className="bg-primary text-white">
                    Simpan
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
                <TableHead>Tanggal Pemeriksaan Selanjutnya</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <TableRow key={item.id_hewan}>
                    <TableCell>
                      {format(new Date(item.tgl_pemeriksaan_selanjutnya), "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-primary text-primary font-semibold rounded-md px-3 py-1 hover:bg-primary/10 transition"
                        onClick={() => setEditingItem(item)}
                      >
                        <Pencil className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-500 text-red-600 font-semibold rounded-md px-3 py-1 hover:bg-red-50 hover:text-red-700 transition"
                          >
                            <Trash2 className="h-4 w-4 mr-1" /> Hapus
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Konfirmasi Hapus
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Apakah Anda yakin ingin menghapus jadwal pemeriksaan ini? Tindakan ini tidak dapat dibatalkan.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(item.id_hewan)}
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
                  <TableCell colSpan={2} className="text-center py-4">
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
