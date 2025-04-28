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
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import AdminReservasiFormModal from "@/components/modals/AdminReservasiFormModal";
import {
  Pengunjung,
  Pengguna,
  ReservationStatus,
  ReservasiTiket,
} from "@/types/schema";
import ReservasiCancelModal from "@/components/modals/ReservasiCancelModal";

const ReservasiTiketAdmin = () => {
  const { toast } = useToast();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [currentReservasi, setCurrentReservasi] =
    useState<ReservasiTiket | null>(null);
  const [reservations, setReservations] = useState<ReservasiTiket[]>([]);

  useEffect(() => {
    setReservations([
      {
        username_P: "arif123",
        nama_fasilitas: "Pertunjukan Lumba-lumba",
        tanggal_kunjungan: new Date("2025-05-12"),
        jumlah_tiket: 10,
        status: "Terjadwal",
        lokasi: "Area Akuatik",
        jadwal: "10:00",
        pengunjung: {
          username_P: "arif123",
          alamat: "Jl. Merdeka 10",
          tgl_lahir: new Date("1995-06-15"),
          pengguna: {
            username: "arif123",
            email: "arif@example.com",
            nama_depan: "Arif",
            nama_belakang: "Santoso",
            no_telepon: "08123456789",
          },
        },
      },
      {
        username_P: "winnie22",
        nama_fasilitas: "Feeding time harimau",
        tanggal_kunjungan: new Date("2025-05-11"),
        jumlah_tiket: 3,
        status: "Dibatalkan",
        lokasi: "Zona Hutan",
        jadwal: "14:00",
        pengunjung: {
          username_P: "winnie22",
          alamat: "Jl. Mawar 5",
          tgl_lahir: new Date("1998-03-22"),
          pengguna: {
            username: "winnie22",
            email: "winnie@example.com",
            nama_depan: "Winnie",
            nama_belakang: "Wijaya",
            no_telepon: "08234567890",
          },
        },
      },
    ]);
  }, []);

  const handleEditReservation = (reservation: ReservasiTiket) => {
    setCurrentReservasi(reservation);
    setIsEditModalOpen(true);
  };

  const handleUpdateReservation = (data: {
    jumlah_tiket: number;
    tanggal_kunjungan: Date;
    status: ReservationStatus;
  }) => {
    if (!currentReservasi) return;

    const updatedReservations = reservations.map((res) => {
      if (
        res.username_P === currentReservasi.username_P &&
        res.nama_fasilitas === currentReservasi.nama_fasilitas &&
        res.tanggal_kunjungan.getTime() ===
          currentReservasi.tanggal_kunjungan.getTime()
      ) {
        return {
          ...res,
          tanggal_kunjungan: data.tanggal_kunjungan,
          jumlah_tiket: data.jumlah_tiket,
          status: data.status,
        };
      }
      return res;
    });

    setReservations(updatedReservations);
    setIsEditModalOpen(false);
    setCurrentReservasi(null);

    toast({
      title: "Reservasi diperbarui",
      description: "Reservasi tiket berhasil diperbarui.",
    });
  };

  const handleShowCancelConfirm = (reservation: ReservasiTiket) => {
    setCurrentReservasi(reservation);
    setIsCancelModalOpen(true);
  };

  const handleCancelReservation = () => {
    if (!currentReservasi) return;

    const updatedReservations = reservations.map((res) => {
      if (
        res.username_P === currentReservasi.username_P &&
        res.nama_fasilitas === currentReservasi.nama_fasilitas &&
        res.tanggal_kunjungan.getTime() ===
          currentReservasi.tanggal_kunjungan.getTime()
      ) {
        return {
          ...res,
          status: "Dibatalkan" as ReservationStatus,
        };
      }
      return res;
    });

    setReservations(updatedReservations);
    setIsCancelModalOpen(false);
    setCurrentReservasi(null);

    toast({
      title: "Reservasi dibatalkan",
      description: "Reservasi tiket berhasil dibatalkan.",
    });
  };

  const formatDate = (date: Date) => {
    return format(date, "dd-MM-yyyy");
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-h3 font-bold text-foreground">
            DATA RESERVASI
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username pengunjung</TableHead>
                  <TableHead>Nama Atraksi</TableHead>
                  <TableHead>Tanggal reservasi</TableHead>
                  <TableHead>Jumlah tiket</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservations.map((reservation, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {reservation.pengunjung?.pengguna?.username || "N/A"}
                    </TableCell>
                    <TableCell>{reservation.nama_fasilitas}</TableCell>
                    <TableCell>
                      {formatDate(reservation.tanggal_kunjungan)}
                    </TableCell>
                    <TableCell>{reservation.jumlah_tiket}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          reservation.status === "Terjadwal"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }
                      >
                        {reservation.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditReservation(reservation)}
                          className="h-8"
                        >
                          <Pencil className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShowCancelConfirm(reservation)}
                          className="h-8 text-destructive hover:bg-destructive/10"
                          disabled={reservation.status === "Dibatalkan"}
                        >
                          <Trash className="h-4 w-4 mr-1" /> Batalkan
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {reservations.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      Tidak ada data reservasi yang ditemukan.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {currentReservasi && (
        <AdminReservasiFormModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setCurrentReservasi(null);
          }}
          onSubmit={handleUpdateReservation}
          initialData={currentReservasi}
        />
      )}

      <ReservasiCancelModal
        isOpen={isCancelModalOpen}
        onClose={() => {
          setIsCancelModalOpen(false);
          setCurrentReservasi(null);
        }}
        onConfirm={handleCancelReservation}
      />
    </div>
  );
};

export default ReservasiTiketAdmin;
