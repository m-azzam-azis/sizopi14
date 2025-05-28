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
import { Eye, Pencil, Trash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import ReservasiTiketFormModal from "../../modals/ReservasiTiketFormModal";
import ReservasiTiketDetailModal from "../../modals/ReservasiTiketDetailModal";
import ReservasiTiketCancelModal from "../../modals/ReservasiTiketCancelModal";
import { useToast } from "@/hooks/use-toast";

interface Fasilitas {
  nama: string;
  jadwal: Date;
  kapasitas_max: number;
  kapasitas_tersedia: number;
}

interface Atraksi {
  nama_atraksi: string;
  lokasi: string;
  fasilitas: Fasilitas;
}

interface ReservasiTiket {
  username_P: string;
  nama_fasilitas: string;
  tanggal_kunjungan: Date;
  jumlah_tiket: number;
  status: "Terjadwal" | "Dibatalkan";

  lokasi: string;
  jadwal: string;
}

const ReservasiTiketDashboardModule = () => {
  const { toast } = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [currentReservasi, setCurrentReservasi] =
    useState<ReservasiTiket | null>(null);
  const [reservations, setReservations] = useState<ReservasiTiket[]>([]);
  const username_P = "user_pengunjung";

  const [atraksiList, setAtraksiList] = useState<Atraksi[]>([
    {
      nama_atraksi: "Pertunjukan Lumba-lumba",
      lokasi: "Area Akuatik",
      fasilitas: {
        nama: "Pertunjukan Lumba-lumba",
        jadwal: new Date("2025-05-12T10:00:00"),
        kapasitas_max: 200,
        kapasitas_tersedia: 150,
      },
    },
    {
      nama_atraksi: "Lion Feeding",
      lokasi: "Savanna Enclosure",
      fasilitas: {
        nama: "Lion Feeding",
        jadwal: new Date("2025-05-15T14:00:00"),
        kapasitas_max: 100,
        kapasitas_tersedia: 80,
      },
    },
    {
      nama_atraksi: "Safari Adventure",
      lokasi: "Savanna Enclosure",
      fasilitas: {
        nama: "Safari Adventure",
        jadwal: new Date("2025-05-16T11:00:00"),
        kapasitas_max: 150,
        kapasitas_tersedia: 75,
      },
    },
    {
      nama_atraksi: "Arctic Experience",
      lokasi: "Arctic Zone",
      fasilitas: {
        nama: "Arctic Experience",
        jadwal: new Date("2025-05-17T13:30:00"),
        kapasitas_max: 80,
        kapasitas_tersedia: 0,
      },
    },
  ]);

  useEffect(() => {
    setReservations([
      {
        username_P: username_P,
        nama_fasilitas: "Pertunjukan Lumba-lumba",
        tanggal_kunjungan: new Date("2025-05-12"),
        jumlah_tiket: 10,
        status: "Terjadwal",
        lokasi: "Area Akuatik",
        jadwal: "10:00",
      },
      {
        username_P: username_P,
        nama_fasilitas: "Lion Feeding",
        tanggal_kunjungan: new Date("2025-05-15"),
        jumlah_tiket: 5,
        status: "Terjadwal",
        lokasi: "Savanna Enclosure",
        jadwal: "14:00",
      },
    ]);
  }, [username_P]);

  const handleCreateReservation = (data: {
    nama_fasilitas: string;
    nama_atraksi: string;
    lokasi: string;
    jadwal: string;
    tanggal_kunjungan: Date;
    jumlah_tiket: number;
  }) => {
    const atraksi = atraksiList.find(
      (a) => a.nama_atraksi === data.nama_fasilitas
    );
    if (!atraksi) {
      toast({
        title: "Error",
        description: "Atraksi tidak ditemukan.",
        variant: "error",
      });
      return;
    }

    if (atraksi.fasilitas.kapasitas_tersedia < data.jumlah_tiket) {
      toast({
        title: "Kapasitas tidak cukup",
        description: `Hanya tersisa ${atraksi.fasilitas.kapasitas_tersedia} tiket untuk atraksi ini.`,
        variant: "error",
      });
      return;
    }

    const newReservation: ReservasiTiket = {
      username_P: username_P,
      nama_fasilitas: data.nama_fasilitas,
      tanggal_kunjungan: data.tanggal_kunjungan,
      jumlah_tiket: data.jumlah_tiket,
      status: "Terjadwal" as const,
      lokasi: data.lokasi,
      jadwal: data.jadwal,
    };

    const updatedAtraksiList = atraksiList.map((atraksi) => {
      if (atraksi.nama_atraksi === data.nama_fasilitas) {
        return {
          ...atraksi,
          fasilitas: {
            ...atraksi.fasilitas,
            kapasitas_tersedia:
              atraksi.fasilitas.kapasitas_tersedia - data.jumlah_tiket,
          },
        };
      }
      return atraksi;
    });

    setAtraksiList(updatedAtraksiList);
    setReservations([...reservations, newReservation]);
    setIsAddModalOpen(false);

    toast({
      title: "Reservasi berhasil",
      description: "Tiket anda telah berhasil dipesan.",
    });
  };

  const handleUpdateReservation = (data: {
    nama_fasilitas: string;
    nama_atraksi: string;
    lokasi: string;
    jadwal: string;
    tanggal_kunjungan: Date;
    jumlah_tiket: number;
  }) => {
    if (!currentReservasi) return;

    const atraksi = atraksiList.find(
      (a) => a.nama_atraksi === data.nama_fasilitas
    );
    if (!atraksi) {
      toast({
        title: "Error",
        description: "Atraksi tidak ditemukan.",
        variant: "error",
      });
      return;
    }

    const ticketDifference = data.jumlah_tiket - currentReservasi.jumlah_tiket;

    if (
      ticketDifference > 0 &&
      atraksi.fasilitas.kapasitas_tersedia < ticketDifference
    ) {
      toast({
        title: "Kapasitas tidak cukup",
        description: `Hanya tersisa ${atraksi.fasilitas.kapasitas_tersedia} tiket untuk atraksi ini.`,
        variant: "error",
      });
      return;
    }

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
        };
      }
      return res;
    });

    const updatedAtraksiList = atraksiList.map((atraksi) => {
      if (atraksi.nama_atraksi === data.nama_fasilitas) {
        return {
          ...atraksi,
          fasilitas: {
            ...atraksi.fasilitas,
            kapasitas_tersedia:
              atraksi.fasilitas.kapasitas_tersedia - ticketDifference,
          },
        };
      }
      return atraksi;
    });

    setAtraksiList(updatedAtraksiList);
    setReservations(updatedReservations);
    setIsEditModalOpen(false);
    setCurrentReservasi(null);

    toast({
      title: "Update berhasil",
      description: "Reservasi tiket anda telah berhasil diperbarui.",
    });
  };

  type ReservationStatus = "Terjadwal" | "Dibatalkan";

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

    const updatedAtraksiList = atraksiList.map((atraksi) => {
      if (atraksi.nama_atraksi === currentReservasi.nama_fasilitas) {
        return {
          ...atraksi,
          fasilitas: {
            ...atraksi.fasilitas,
            kapasitas_tersedia:
              atraksi.fasilitas.kapasitas_tersedia +
              currentReservasi.jumlah_tiket,
          },
        };
      }
      return atraksi;
    });

    setAtraksiList(updatedAtraksiList);
    setReservations(updatedReservations);
    setIsCancelModalOpen(false);
    setCurrentReservasi(null);

    toast({
      title: "Reservasi dibatalkan",
      description: "Reservasi tiket anda telah berhasil dibatalkan.",
    });
  };

  const handleViewDetails = (reservation: ReservasiTiket) => {
    setCurrentReservasi(reservation);
    setIsDetailModalOpen(true);
  };

  const handleEditReservation = (reservation: ReservasiTiket) => {
    setCurrentReservasi(reservation);
    setIsEditModalOpen(true);
  };

  const handleShowCancelConfirm = (reservation: ReservasiTiket) => {
    setCurrentReservasi(reservation);
    setIsCancelModalOpen(true);
  };

  const formatDate = (date: Date) => {
    return format(date, "dd MMMM yyyy");
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-h3 font-bold text-foreground">
            RESERVASI TIKET
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Atraksi</TableHead>
                  <TableHead>Lokasi</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Jam</TableHead>
                  <TableHead>Jumlah Tiket</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservations.map((reservation, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {reservation.nama_fasilitas}
                    </TableCell>
                    <TableCell>{reservation.lokasi}</TableCell>
                    <TableCell>
                      {formatDate(reservation.tanggal_kunjungan)}
                    </TableCell>
                    <TableCell>{reservation.jadwal}</TableCell>
                    <TableCell>{reservation.jumlah_tiket} tiket</TableCell>
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
                          size="icon"
                          onClick={() => handleViewDetails(reservation)}
                          className="h-8 w-8"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {reservations.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      Anda belum memiliki reservasi tiket. Klik "Buat Reservasi"
                      untuk membuat reservasi.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <ReservasiTiketFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateReservation}
        atraksiList={atraksiList}
        isEditing={false}
      />

      {currentReservasi && (
        <>
          <ReservasiTiketFormModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setCurrentReservasi(null);
            }}
            onSubmit={handleUpdateReservation}
            atraksiList={atraksiList}
            isEditing={true}
            initialData={{
              nama_fasilitas: currentReservasi.nama_fasilitas,
              nama_atraksi: currentReservasi.nama_fasilitas,
              lokasi: currentReservasi.lokasi,
              jadwal: currentReservasi.jadwal,
              tanggal_kunjungan: currentReservasi.tanggal_kunjungan,
              jumlah_tiket: currentReservasi.jumlah_tiket,
            }}
          />

          <ReservasiTiketDetailModal
            isOpen={isDetailModalOpen}
            onClose={() => {
              setIsDetailModalOpen(false);
              setCurrentReservasi(null);
            }}
            reservation={currentReservasi}
            onEdit={() => {
              setIsDetailModalOpen(false);
              setIsEditModalOpen(true);
            }}
            onCancel={() => {
              setIsDetailModalOpen(false);
              setIsCancelModalOpen(true);
            }}
          />

          <ReservasiTiketCancelModal
            isOpen={isCancelModalOpen}
            onClose={() => {
              setIsCancelModalOpen(false);
              setCurrentReservasi(null);
            }}
            onConfirm={handleCancelReservation}
          />
        </>
      )}
    </div>
  );
};

export default ReservasiTiketDashboardModule;
