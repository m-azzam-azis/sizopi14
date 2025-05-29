"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Plus,
  Search,
  Edit,
  Trash2,
  FileText,
  Calendar,
  CheckCircle,
  AlertCircle,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getUserData } from "@/hooks/getUserData";

// Perbaiki schema form validation dan field form agar sesuai backend
const rekamMedisSchema = z.object({
  id_hewan: z.string().min(1, "ID Hewan harus diisi"),
  username_dh: z.string().min(1, "Username dokter hewan harus diisi"),
  tanggal_pemeriksaan: z.string().min(1, "Tanggal pemeriksaan harus diisi"),
  diagnosis: z.string().min(1, "Diagnosis harus diisi"),
  pengobatan: z.string().min(1, "Pengobatan harus diisi"),
  status_kesehatan: z.enum(["Sembuh", "Sedang Sakit"]),
  catatan_tindak_lanjut: z.string().optional(),
});

type RekamMedisFormValues = z.infer<typeof rekamMedisSchema>;

export const RekamMedisModule = () => {
  // State management
  const [rekamMedisList, setRekamMedisList] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const [dokterList, setDokterList] = useState<any[]>([]);
  const [hewanList, setHewanList] = useState<any[]>([]);

  // Form for adding new rekam medis
  const addForm = useForm<RekamMedisFormValues>({
    resolver: zodResolver(rekamMedisSchema),
    defaultValues: {
      id_hewan: "",
      username_dh: "", // set dokter otomatis dari user login
      tanggal_pemeriksaan: new Date().toISOString().split("T")[0],
      diagnosis: "",
      pengobatan: "",
      status_kesehatan: "Sembuh",
      catatan_tindak_lanjut: "",
    },
  });

  // Form for editing rekam medis
  const editForm = useForm<RekamMedisFormValues>({
    resolver: zodResolver(rekamMedisSchema),
    defaultValues: {
      id_hewan: "",
      username_dh: "",
      tanggal_pemeriksaan: "",
      diagnosis: "",
      pengobatan: "",
      status_kesehatan: "Sembuh",
      catatan_tindak_lanjut: "",
    },
  });

  // Set form values when editing
  useEffect(() => {
    if (currentRecord && isEditDialogOpen) {
      editForm.reset({
        id_hewan: currentRecord.id_hewan,
        username_dh: currentRecord.username_dh,
        tanggal_pemeriksaan: currentRecord.tanggal_pemeriksaan,
        diagnosis: currentRecord.diagnosis,
        pengobatan: currentRecord.pengobatan,
        status_kesehatan: currentRecord.status_kesehatan,
        catatan_tindak_lanjut: currentRecord.catatan_tindak_lanjut || "",
      });
    }
  }, [currentRecord, isEditDialogOpen]);

  const { userData, isValid, isLoading } = getUserData();

  // Set username_dh setiap kali dialog tambah dibuka
  useEffect(() => {
    if (isAddDialogOpen && userData?.username) {
      addForm.setValue("username_dh", userData.username);
    }
    // Optional: reset form jika dialog ditutup
    if (!isAddDialogOpen) {
      addForm.reset({
        id_hewan: "",
        username_dh: "",
        tanggal_pemeriksaan: new Date().toISOString().split("T")[0],
        diagnosis: "",
        pengobatan: "",
        status_kesehatan: "Sembuh",
        catatan_tindak_lanjut: "",
      });
    }
  }, [isAddDialogOpen, userData?.username]);

  // Filter rekam medis based on search query
  const filteredRekamMedis = rekamMedisList.filter(
    (record) =>
      (record.id_hewan && record.id_hewan.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (record.username_dh && record.username_dh.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (record.diagnosis && record.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRekamMedis.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredRekamMedis.length / itemsPerPage);

  // Fetch rekam medis dari backend
  const fetchRekamMedis = async () => {
    try {
      const res = await fetch("/api/rekam-medis?limit=20&page=1");
      if (!res.ok) throw new Error("Gagal mengambil data");
      const data = await res.json();
      setRekamMedisList(data);
    } catch (err) {
      // Optional: tampilkan toast error
    }
  };

  // Fetch dokter list dari API dokter_hewan
  const fetchDokterList = async () => {
    try {
      const res = await fetch("/api/dokter");
      if (!res.ok) throw new Error("Gagal mengambil data dokter");
      const data = await res.json();
      // Jika API mengembalikan array dokter, gunakan langsung
      // Jika API mengembalikan objek user tunggal, bungkus dalam array
      setDokterList(Array.isArray(data) ? data : [data]);
    } catch (err) {
      setDokterList([]);
    }
  };

  // Fetch hewan list for select
  const fetchHewanList = async () => {
    try {
      const res = await fetch("/api/hewan");
      if (!res.ok) throw new Error("Gagal mengambil data hewan");
      const data = await res.json();
      setHewanList(data);
    } catch (err) {
      setHewanList([]);
    }
  };

  useEffect(() => {
    fetchRekamMedis();
    fetchDokterList();
    fetchHewanList();
  }, []);

  // Ganti dokterList dengan array satu elemen dari userData jika role veterinarian
  const filteredDokterList = userData.role === "veterinarian"
    ? [{
        username: userData.username,
        nama_depan: userData.nama_depan,
        nama_belakang: userData.nama_belakang,
      }]
    : dokterList;

  // Handle add new rekam medis (POST)
  const handleAddRekamMedis = async (values: RekamMedisFormValues) => {
    if (userData.role !== "veterinarian") return;
    try {
      const res = await fetch("/api/rekam-medis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, username_dh: userData.username }), // paksa username_dh dari user login
      });
      if (!res.ok) throw new Error("Gagal menambah data");
      setIsAddDialogOpen(false);
      addForm.reset();
      fetchRekamMedis();
    } catch (err) {
      // Optional: tampilkan toast error
      console.error("Error adding rekam medis:", err);
    }
  };

  // Handle edit rekam medis (PUT)
  const handleEditRekamMedis = async (values: RekamMedisFormValues) => {
    if (userData.role !== "veterinarian") return;
    if (!currentRecord) return;
    try {
      const res = await fetch("/api/rekam-medis", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...currentRecord, ...values }),
      });
      if (!res.ok) throw new Error("Gagal mengupdate data");
      setIsEditDialogOpen(false);
      setCurrentRecord(null);
      fetchRekamMedis();
    } catch (err) {
      // Optional: tampilkan toast error
    }
  };

  // Handle delete rekam medis (DELETE)
  const handleDeleteRekamMedis = async () => {
    if (userData.role !== "veterinarian") return;
    if (!currentRecord) return;
    try {
      const res = await fetch(
        `/api/rekam-medis?id=${currentRecord.id_hewan || currentRecord.id}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Gagal menghapus data");
      setIsDeleteDialogOpen(false);
      setCurrentRecord(null);
      fetchRekamMedis();
    } catch (err) {
      // Optional: tampilkan toast error
    }
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Sehat":
        return "bg-green-100 text-green-800";
      case "Sakit":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  return (
    <div className="container mx-auto py-10 px-4 mt-7">
      <Card className="border-0 shadow-md">
        <CardHeader className="bg-primary/5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">Rekam Medis Hewan</CardTitle>
              <CardDescription>
                Kelola catatan rekam medis hewan di klinik
              </CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus size={16} />
                  <span>Tambah Rekam Medis</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>Tambah Rekam Medis Baru</DialogTitle>
                  <DialogDescription>
                    Masukkan informasi rekam medis hewan di bawah ini
                  </DialogDescription>
                </DialogHeader>
                <Form {...addForm}>
                  <form
                    onSubmit={addForm.handleSubmit(handleAddRekamMedis)}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={addForm.control}
                        name="id_hewan"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hewan</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih hewan" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {hewanList.map((hewan) => (
                                  <SelectItem key={hewan.id} value={hewan.id}>
                                    {hewan.nama} ({hewan.spesies})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div>
                        <label className="block text-sm font-medium mb-1">Dokter Hewan</label>
                        <Input
                          value={userData.username}
                          readOnly
                          disabled
                          className="bg-gray-100 cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={addForm.control}
                        name="tanggal_pemeriksaan"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tanggal Pemeriksaan</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={addForm.control}
                        name="status_kesehatan"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status Kesehatan</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Sembuh">Sembuh</SelectItem>
                                <SelectItem value="Sedang Sakit">Sedang Sakit</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={addForm.control}
                      name="diagnosis"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Diagnosis</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Masukkan diagnosis"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={addForm.control}
                      name="pengobatan"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pengobatan</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Masukkan pengobatan yang diberikan"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={addForm.control}
                      name="catatan_tindak_lanjut"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Catatan Tindak Lanjut</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Masukkan catatan tindak lanjut (opsional)"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsAddDialogOpen(false)}
                      >
                        Batal
                      </Button>
                      <Button type="submit">Simpan</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Cari rekam medis..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  
                  <TableHead>Dokter</TableHead>
                  <TableHead>Tanggal Pemeriksaan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Pengobatan</TableHead>
                  <TableHead>Catatan Tindak Lanjut</TableHead>
                  <TableHead>Diagnosis</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length > 0 ? (
                  currentItems.map((record) => (
                    <TableRow key={record.id_hewan}>
                      <TableCell>{record.username_dh}</TableCell>
                      <TableCell>{ 
                        record.tanggal_pemeriksaan
                          ? new Date(record.tanggal_pemeriksaan).toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric" })
                          : "-"
                      }</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            record.status_kesehatan === "Sembuh"
                              ? "bg-green-100 text-green-800"
                              : record.status_kesehatan === "Sedang Sakit"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {record.status_kesehatan}
                        </Badge>
                      </TableCell>
                      <TableCell>{record.pengobatan}</TableCell>
                      <TableCell>{record.catatan_tindak_lanjut || "-"}</TableCell>
                      <TableCell>{record.diagnosis}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <span className="sr-only">View</span>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[550px]">
                              <DialogHeader>
                                <DialogTitle>Detail Rekam Medis</DialogTitle>
                                <DialogDescription>
                                  Rekam medis untuk ID Hewan {record.id_hewan}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-muted-foreground">
                                      ID Hewan
                                    </Label>
                                    <p className="font-medium">{record.id_hewan}</p>
                                  </div>
                                  <div>
                                    <Label className="text-muted-foreground">
                                      Dokter
                                    </Label>
                                    <p className="font-medium">{record.username_dh}</p>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-muted-foreground">
                                      Tanggal Pemeriksaan
                                    </Label>
                                    <p className="font-medium">
                                      {record.tanggal_pemeriksaan}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-muted-foreground">
                                      Status Kesehatan
                                    </Label>
                                    <p>
                                      <Badge
                                        className={
                                          record.status_kesehatan === "Sembuh"
                                            ? "bg-green-100 text-green-800"
                                            : record.status_kesehatan === "Sedang Sakit"
                                            ? "bg-red-100 text-red-800"
                                            : "bg-gray-100 text-gray-800"
                                        }
                                      >
                                        {record.status_kesehatan}
                                      </Badge>
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-muted-foreground">
                                    Diagnosis
                                  </Label>
                                  <p className="font-medium">{record.diagnosis}</p>
                                </div>
                                <div>
                                  <Label className="text-muted-foreground">
                                    Pengobatan
                                  </Label>
                                  <p className="font-medium">{record.pengobatan}</p>
                                </div>
                                {record.catatan_tindak_lanjut && (
                                  <div>
                                    <Label className="text-muted-foreground">
                                      Catatan Tindak Lanjut
                                    </Label>
                                    <p className="font-medium">
                                      {record.catatan_tindak_lanjut}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                          {record.status_kesehatan === "Sedang Sakit" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => {
                                setCurrentRecord(record);
                                setIsEditDialogOpen(true);
                              }}
                            >
                              <span className="sr-only">Edit</span>
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                            onClick={() => {
                              setCurrentRecord(record);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <span className="sr-only">Delete</span>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Tidak ada data rekam medis yang ditemukan.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {filteredRekamMedis.length > itemsPerPage && (
            <div className="flex justify-center mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Rekam Medis</DialogTitle>
            <DialogDescription>
              Edit informasi rekam medis untuk {currentRecord?.nama_hewan || ""}
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form
              onSubmit={editForm.handleSubmit(handleEditRekamMedis)}
              className="space-y-4"
            >
              <FormField
                control={editForm.control}
                name="status_kesehatan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status Kesehatan</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Sembuh">Sembuh</SelectItem>
                        <SelectItem value="Sedang Sakit">Sedang Sakit</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="diagnosis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Diagnosis</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Masukkan diagnosis"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="pengobatan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pengobatan</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Masukkan pengobatan yang diberikan"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Batal
                </Button>
                <Button type="submit">Simpan Perubahan</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Hapus Rekam Medis</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus rekam medis ini? Tindakan ini
              tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 bg-red-50 p-3 rounded-md">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-sm text-red-600">
              Rekam medis untuk {currentRecord?.nama_hewan || ""} pada tanggal{" "}
              {currentRecord?.tanggal_pemeriksaan || ""} akan dihapus.
            </p>
          </div>
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteRekamMedis}
            >
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
