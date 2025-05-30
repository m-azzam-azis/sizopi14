"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Trash2,
  Pencil,
  Plus,
  Search,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Badge } from "@/components/ui/badge";

// Validation schema for the form
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

export const PemberianPakanModule: React.FC = () => {
  const [pemberianPakan, setPemberianPakan] = useState<any[]>([]);
  const [hewan, setHewan] = useState<any[]>([]);
  const [penjagaHewan, setPenjagaHewan] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<Date | null>(null);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [caretakerFilter, setCaretakerFilter] = useState<string | null>(null);

  // Fetch data dari API
  useEffect(() => {
    fetch("/api/pakan")
      .then((res) => res.json())
      .then(setPemberianPakan);
    fetch("/api/hewan")
      .then((res) => res.json())
      .then(setHewan);
    fetch("/api/penjaga-hewan")
      .then((res) => res.json())
      .then(setPenjagaHewan);
  }, []);

  // Setup form
  const form = useForm<PakanFormValues>({
    resolver: zodResolver(pakanFormSchema),
    defaultValues: {
      id_hewan: "",
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
      form.reset();
      setEditingItem(null);
    }
  }, [isDialogOpen, form]);

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

  // CRUD
  const fetchPakan = async () => {
    const res = await fetch("/api/pakan");
    setPemberianPakan(await res.json());
  };

  const onSubmit = async (data: PakanFormValues) => {
    if (editingItem) {
      await fetch(`/api/pakan?id_hewan=${editingItem.id_hewan}&jadwal=${editingItem.jadwal}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
    } else {
      await fetch("/api/pakan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }
    setIsDialogOpen(false);
    fetchPakan();
  };

  const handleDelete = async (id_hewan: string, jadwal: string) => {
    await fetch(`/api/pakan?id_hewan=${id_hewan}&jadwal=${jadwal}`, { method: "DELETE" });
    fetchPakan();
  };

  // Filter data
  const filteredData = pemberianPakan.filter((item) => {
    const matchesSearch =
      search === "" ||
      item.id_hewan.toLowerCase().includes(search.toLowerCase()) ||
      item.jenis.toLowerCase().includes(search.toLowerCase()) ||
      item.username_jh.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === null || item.status === statusFilter;
    const matchesDate =
      dateFilter === null ||
      format(new Date(item.jadwal), "yyyy-MM-dd") === format(dateFilter, "yyyy-MM-dd");
    return matchesSearch && matchesStatus && matchesDate;
  });

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

  // Helper get nama hewan
  const getAnimalName = (id: string) => {
    const animal = hewan.find((h: any) => h.id === id);
    return animal ? animal.nama : id;
  };
  // Helper get nama penjaga
  const getCaretakerName = (username: string) => {
    const caretaker = penjagaHewan.find((p: any) => p.username_JH === username);
    return caretaker ? caretaker.username_JH : username;
  };

  const completedFeedings = pemberianPakan.filter(
    (item) =>
      item.status === "completed" &&
      (caretakerFilter === null || item.username_jh === caretakerFilter)
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Pemberian Pakan</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filter &amp; Pencarian</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari ID hewan, jenis pakan, penjaga..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <Select
              value={statusFilter || ""}
              onValueChange={(value) => setStatusFilter(value || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`justify-start text-left font-normal ${
                    dateFilter ? "" : "text-muted-foreground"
                  }`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFilter ? format(dateFilter, "PPP") : "Filter Tanggal"}
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
        <h2 className="text-xl font-semibold">Daftar Pemberian Pakan</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-white">
              <Plus className="mr-1" size={16} /> Tambah Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingItem
                  ? "Edit Pemberian Pakan"
                  : "Tambah Pemberian Pakan"}
              </DialogTitle>
              <DialogDescription>
                {editingItem
                  ? "Ubah detail pemberian pakan yang ada"
                  : "Masukkan detail pemberian pakan baru"}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="id_hewan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID Hewan</FormLabel>
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
                          {hewan.map((h) => (
                            <SelectItem key={h.id} value={h.id}>
                              {h.id} - {h.nama}
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
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih jenis pakan" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {hewan.map((jenis) => (
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
                        <Input type="number" min={1} max={100000} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={
                          field.onChange as (value: string) => void
                        }
                        defaultValue={field.value}
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
                              {penjaga.username_JH} ({penjaga.username})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button variant={"default"} className="bg-primary text-white">
                    {editingItem ? "Simpan Perubahan" : "Tambah Pakan"}
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
                <TableHead>Jadwal</TableHead>
                <TableHead>Jenis Pakan</TableHead>
                <TableHead>Jumlah (gram)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Penjaga Hewan</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <TableRow key={item.id_hewan + item.jadwal}>
                    <TableCell>{item.id_hewan}</TableCell>
                    <TableCell>{getAnimalName(item.id_hewan)}</TableCell>
                    <TableCell>{format(new Date(item.jadwal), "dd/MM/yyyy HH:mm")}</TableCell>
                    <TableCell>{item.jenis}</TableCell>
                    <TableCell>{item.jumlah}</TableCell>
                    <TableCell>{item.status}</TableCell>
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
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Hapus Data Pemberian Pakan
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Apakah Anda yakin ingin menghapus data pemberian
                              pakan untuk hewan {item.id_hewan} pada{" "}
                              {format(
                                new Date(item.jadwal),
                                "dd/MM/yyyy HH:mm"
                              )}
                              ? Tindakan ini tidak dapat dibatalkan.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(item.id_hewan, item.jadwal)}
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
                  <TableCell colSpan={8} className="text-center py-4">
                    Tidak ada data pemberian pakan yang ditemukan
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

export default PemberianPakanModule;
