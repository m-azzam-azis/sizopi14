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

// Define schema for form validation
const rekamMedisSchema = z.object({
  id_hewan: z.string().min(1, "ID Hewan harus diisi"),
  username_dokter: z.string().min(1, "Username dokter hewan harus diisi"),
  tanggal_pemeriksaan: z.string().min(1, "Tanggal pemeriksaan harus diisi"),
  diagnosis: z.string().min(1, "Diagnosis harus diisi"),
  pengobatan: z.string().min(1, "Pengobatan harus diisi"),
  status_kesehatan: z.enum(["Sehat", "Sakit"]),
  catatan_tindak_lanjut: z.string().optional(),
});

type RekamMedisFormValues = z.infer<typeof rekamMedisSchema>;

// Mock data for demonstration
const mockPets = [
  { id: "H001", name: "Leo" },
  { id: "H002", name: "Bella" },
  { id: "H003", name: "Max" },
  { id: "H004", name: "Luna" },
];

const mockRekamMedis = [
  {
    id: 1,
    id_hewan: "H001",
    nama_hewan: "Leo",
    username_dokter: "dr_ahmad",
    tanggal_pemeriksaan: "2025-04-20",
    diagnosis: "Flu kucing",
    pengobatan: "Antibiotik dan cairan infus",
    status_kesehatan: "Sehat",
    catatan_tindak_lanjut: "Kunjungan ulang dalam 3 hari",
  },
  {
    id: 2,
    id_hewan: "H002",
    nama_hewan: "Bella",
    username_dokter: "dr_linda",
    tanggal_pemeriksaan: "2025-04-15",
    diagnosis: "Infeksi kulit",
    pengobatan: "Salep antiinflamasi",
    status_kesehatan: "Sehat",
    catatan_tindak_lanjut: "Tidak diperlukan tindak lanjut",
  },
  {
    id: 3,
    id_hewan: "H003",
    nama_hewan: "Max",
    username_dokter: "dr_ahmad",
    tanggal_pemeriksaan: "2025-04-22",
    diagnosis: "Cedera kaki",
    pengobatan: "Pemasangan gips, antibiotik",
    status_kesehatan: "Sakit",
    catatan_tindak_lanjut: "Evaluasi dalam 1 minggu",
  },
];

export const RekamMedisModule = () => {
  // State management
  const [rekamMedisList, setRekamMedisList] = useState(mockRekamMedis);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<any>(null);

  // Form for adding new rekam medis
  const addForm = useForm<RekamMedisFormValues>({
    resolver: zodResolver(rekamMedisSchema),
    defaultValues: {
      id_hewan: "",
      username_dokter: "",
      tanggal_pemeriksaan: new Date().toISOString().split("T")[0],
      diagnosis: "",
      pengobatan: "",
      status_kesehatan: "Sehat",
      catatan_tindak_lanjut: "",
    },
  });

  // Form for editing rekam medis
  const editForm = useForm<RekamMedisFormValues>({
    resolver: zodResolver(rekamMedisSchema),
    defaultValues: {
      id_hewan: "",
      username_dokter: "",
      tanggal_pemeriksaan: "",
      diagnosis: "",
      pengobatan: "",
      status_kesehatan: "Sehat",
      catatan_tindak_lanjut: "",
    },
  });

  // Set form values when editing
  useEffect(() => {
    if (currentRecord && isEditDialogOpen) {
      editForm.reset({
        id_hewan: currentRecord.id_hewan,
        username_dokter: currentRecord.username_dokter,
        tanggal_pemeriksaan: currentRecord.tanggal_pemeriksaan,
        diagnosis: currentRecord.diagnosis,
        pengobatan: currentRecord.pengobatan,
        status_kesehatan: currentRecord.status_kesehatan,
        catatan_tindak_lanjut: currentRecord.catatan_tindak_lanjut || "",
      });
    }
  }, [currentRecord, isEditDialogOpen]);

  // Filter rekam medis based on search query
  const filteredRekamMedis = rekamMedisList.filter(
    (record) =>
      record.nama_hewan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.id_hewan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.username_dokter
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      record.diagnosis.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRekamMedis.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredRekamMedis.length / itemsPerPage);

  // Handle add new rekam medis
  const handleAddRekamMedis = (values: RekamMedisFormValues) => {
    const newId =
      rekamMedisList.length > 0
        ? Math.max(...rekamMedisList.map((r) => r.id)) + 1
        : 1;
    const pet = mockPets.find((p) => p.id === values.id_hewan);

    const newRekamMedis = {
      id: newId,
      id_hewan: values.id_hewan,
      nama_hewan: pet ? pet.name : "Unknown",
      username_dokter: values.username_dokter,
      tanggal_pemeriksaan: values.tanggal_pemeriksaan,
      diagnosis: values.diagnosis,
      pengobatan: values.pengobatan,
      status_kesehatan: values.status_kesehatan,
      catatan_tindak_lanjut: values.catatan_tindak_lanjut || "",
    };

    setRekamMedisList([...rekamMedisList, newRekamMedis]);
    setIsAddDialogOpen(false);
    addForm.reset();
  };

  // Handle edit rekam medis
  const handleEditRekamMedis = (values: RekamMedisFormValues) => {
    if (!currentRecord) return;

    // Hanya update field yang boleh diubah
    const updatedRecord = {
      ...currentRecord,
      status_kesehatan: values.status_kesehatan,
      diagnosis: values.diagnosis,
      pengobatan: values.pengobatan,
    };

    setRekamMedisList(
      rekamMedisList.map((record) =>
        record.id === currentRecord.id ? updatedRecord : record
      )
    );

    setIsEditDialogOpen(false);
    setCurrentRecord(null);
  };

  // Handle delete rekam medis
  const handleDeleteRekamMedis = () => {
    if (!currentRecord) return;

    setRekamMedisList(
      rekamMedisList.filter((record) => record.id !== currentRecord.id)
    );
    setIsDeleteDialogOpen(false);
    setCurrentRecord(null);
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
                                {mockPets.map((pet) => (
                                  <SelectItem key={pet.id} value={pet.id}>
                                    {pet.id} - {pet.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={addForm.control}
                        name="username_dokter"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username Dokter</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Masukkan username dokter"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
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
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Sehat">Sehat</SelectItem>
                                <SelectItem value="Sakit">Sakit</SelectItem>
                                <SelectItem value="Dalam Perawatan">
                                  Dalam Perawatan
                                </SelectItem>
                                <SelectItem value="Kritis">Kritis</SelectItem>
                                <SelectItem value="Sembuh">Sembuh</SelectItem>
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
                  <TableHead className="w-12">ID</TableHead>
                  <TableHead>ID Hewan</TableHead>
                  <TableHead>Nama Hewan</TableHead>
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
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.id}</TableCell>
                      <TableCell>{record.id_hewan}</TableCell>
                      <TableCell>{record.nama_hewan}</TableCell>
                      <TableCell>{record.username_dokter}</TableCell>
                      <TableCell>{record.tanggal_pemeriksaan}</TableCell>
                      <TableCell>
                        <Badge
                          className={getStatusColor(record.status_kesehatan)}
                        >
                          {record.status_kesehatan}
                        </Badge>
                      </TableCell>
                      <TableCell>{record.pengobatan}</TableCell>
                      <TableCell>
                        {record.catatan_tindak_lanjut || "-"}
                      </TableCell>
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
                                  Rekam medis untuk {record.nama_hewan} (
                                  {record.id_hewan})
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-muted-foreground">
                                      ID Hewan
                                    </Label>
                                    <p className="font-medium">
                                      {record.id_hewan}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-muted-foreground">
                                      Nama Hewan
                                    </Label>
                                    <p className="font-medium">
                                      {record.nama_hewan}
                                    </p>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-muted-foreground">
                                      Dokter
                                    </Label>
                                    <p className="font-medium">
                                      {record.username_dokter}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-muted-foreground">
                                      Tanggal Pemeriksaan
                                    </Label>
                                    <p className="font-medium">
                                      {record.tanggal_pemeriksaan}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-muted-foreground">
                                    Status Kesehatan
                                  </Label>
                                  <p>
                                    <Badge
                                      className={getStatusColor(
                                        record.status_kesehatan
                                      )}
                                    >
                                      {record.status_kesehatan}
                                    </Badge>
                                  </p>
                                </div>
                                <div>
                                  <Label className="text-muted-foreground">
                                    Diagnosis
                                  </Label>
                                  <p className="font-medium">
                                    {record.diagnosis}
                                  </p>
                                </div>
                                <div>
                                  <Label className="text-muted-foreground">
                                    Pengobatan
                                  </Label>
                                  <p className="font-medium">
                                    {record.pengobatan}
                                  </p>
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

                          {record.status_kesehatan === "Sakit" && (
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
                        <SelectItem value="Sehat">Sehat</SelectItem>
                        <SelectItem value="Sakit">Sakit</SelectItem>
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
