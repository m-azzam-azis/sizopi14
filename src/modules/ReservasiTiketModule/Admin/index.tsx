"use client";

import React, { useState, useEffect, useCallback } from "react";
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
import { Loader2, Pencil, Trash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import AdminAtraksiReservasiFormModal from "../modals/AdminAtraksiReservasiFormModal";
import AdminWahanaReservasiFormModal from "../modals/AdminWahanaReservasiFormModal";
import {
  ReservationStatus,
  ReservasiTiketAtraksi,
  ReservasiTiketWahana,
} from "@/types/schema";
import ReservasiCancelModal from "../modals/ReservasiCancelModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { getUserData } from "@/hooks/getUserData";

const ReservasiTiketAdmin = () => {
  const { toast } = useToast();
  const {
    userData,
    isValid,
    isLoading: authLoading,
    authState,
  } = getUserData();

  const userRole = userData?.role;

  const [isAtraksiEditModalOpen, setIsAtraksiEditModalOpen] = useState(false);
  const [atraksiReservations, setAtraksiReservations] = useState<
    ReservasiTiketAtraksi[]
  >([]);
  const [currentAtraksiReservation, setCurrentAtraksiReservation] =
    useState<ReservasiTiketAtraksi | null>(null);
  const [isAtraksiLoading, setIsAtraksiLoading] = useState(true);

  const [isWahanaEditModalOpen, setIsWahanaEditModalOpen] = useState(false);
  const [wahanaReservations, setWahanaReservations] = useState<
    ReservasiTiketWahana[]
  >([]);
  const [currentWahanaReservation, setCurrentWahanaReservation] =
    useState<ReservasiTiketWahana | null>(null);
  const [isWahanaLoading, setIsWahanaLoading] = useState(true);

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelType, setCancelType] = useState<"attraction" | "ride">(
    "attraction"
  );
  const [itemToCancel, setItemToCancel] = useState<
    ReservasiTiketAtraksi | ReservasiTiketWahana | null
  >(null);

  const fetchAttractionReservations = useCallback(async () => {
    setIsAtraksiLoading(true);
    try {
      const response = await fetch("/api/reservasi?type=attraction");
      if (!response.ok) {
        throw new Error("Failed to fetch attraction reservations");
      }

      const { data } = await response.json();

      const formattedData = data.map(
        (item: {
          username_p: string;
          nama_atraksi: string;
          tanggal_kunjungan: string;
          jumlah_tiket: number;
          lokasi: string;
          status: string;
        }) => ({
          username_P: item.username_p,
          nama_fasilitas: item.nama_atraksi,
          tanggal_kunjungan: new Date(item.tanggal_kunjungan),
          jumlah_tiket: item.jumlah_tiket,
          lokasi: item.lokasi,
          status: item.status as ReservationStatus,
          jenis_reservasi: "Atraksi" as const,
          jadwal: "",
        })
      );

      setAtraksiReservations(formattedData);
    } catch (error) {
      console.error("Error fetching attraction reservations:", error);
      toast({
        title: "Error",
        description: "Failed to load attraction reservations",
        variant: "destructive",
      });
    } finally {
      setIsAtraksiLoading(false);
    }
  }, [toast]);

  const fetchRideReservations = useCallback(async () => {
    setIsWahanaLoading(true);
    try {
      const response = await fetch("/api/reservasi?type=ride");
      if (!response.ok) {
        throw new Error("Failed to fetch ride reservations");
      }

      const { data } = await response.json();

      const formattedData = data.map(
        (item: {
          username_p: string;
          nama_wahana: string;
          tanggal_kunjungan: string;
          jumlah_tiket: number;
          peraturan: string | null;
          status: string;
        }) => ({
          username_P: item.username_p,
          nama_fasilitas: item.nama_wahana,
          tanggal_kunjungan: new Date(item.tanggal_kunjungan),
          jumlah_tiket: item.jumlah_tiket,
          peraturan: item.peraturan
            ? item.peraturan.split(",").map((p: string) => p.trim())
            : [],
          status: item.status as ReservationStatus,
          jenis_reservasi: "Wahana" as const,
          jadwal: "",
        })
      );

      setWahanaReservations(formattedData);
    } catch (error) {
      console.error("Error fetching ride reservations:", error);
      toast({
        title: "Error",
        description: "Failed to load ride reservations",
        variant: "destructive",
      });
    } finally {
      setIsWahanaLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!authLoading && isValid && userRole === "admin") {
      if (atraksiReservations.length === 0 && wahanaReservations.length === 0) {
        fetchAttractionReservations();
        fetchRideReservations();
      }
    }
  }, [
    authLoading,
    isValid,
    userRole,
    atraksiReservations.length,
    wahanaReservations.length,
    fetchAttractionReservations,
    fetchRideReservations,
  ]);

  const handleEditAtraksiReservation = (reservation: ReservasiTiketAtraksi) => {
    setCurrentAtraksiReservation(reservation);
    setIsAtraksiEditModalOpen(true);
  };

  const formatDateForAPI = (date: Date | string): string => {
    if (typeof date === "string") {
      return date.split("T")[0];
    }

    console.log("Date object received:", date);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    console.log("Formatted date components:", { year, month, day });

    return `${year}-${month}-${day}`;
  };

  const handleUpdateAtraksiReservation = async (data: {
    jumlah_tiket: number;
    tanggal_kunjungan: Date;
    status: ReservationStatus;
  }) => {
    if (!currentAtraksiReservation) return;

    try {
      const formattedOriginalDate = formatDateForAPI(
        currentAtraksiReservation.tanggal_kunjungan
      );
      console.log(
        "Original date (JS):",
        currentAtraksiReservation.tanggal_kunjungan
      );
      console.log("Formatted original date:", formattedOriginalDate);
      const formattedNewDate = formatDateForAPI(data.tanggal_kunjungan);
      console.log("New date (JS):", data.tanggal_kunjungan);
      console.log("Formatted new date:", formattedNewDate);

      const response = await fetch("/api/reservasi", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username_P: currentAtraksiReservation.username_P,
          nama_fasilitas: currentAtraksiReservation.nama_fasilitas,
          tanggal_kunjungan: formattedOriginalDate,
          new_tanggal_kunjungan: formattedNewDate,
          jumlah_tiket: data.jumlah_tiket,
          status: data.status,
          type: "attraction",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update reservation");
      }

      const updatedReservations = atraksiReservations.map((res) => {
        if (
          res.username_P === currentAtraksiReservation.username_P &&
          res.nama_fasilitas === currentAtraksiReservation.nama_fasilitas
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

      setAtraksiReservations(updatedReservations);
      toast({
        title: "Success",
        description: "Reservasi atraksi berhasil diperbarui.",
      });
    } catch (error) {
      console.error("Error updating attraction reservation:", error);
      toast({
        title: "Error",
        description: "Failed to update attraction reservation",
        variant: "destructive",
      });
    }

    setIsAtraksiEditModalOpen(false);
    setCurrentAtraksiReservation(null);
  };

  const handleEditWahanaReservation = (reservation: ReservasiTiketWahana) => {
    setCurrentWahanaReservation(reservation);
    setIsWahanaEditModalOpen(true);
  };

  const handleShowCancelAtraksi = (reservation: ReservasiTiketAtraksi) => {
    setItemToCancel(reservation);
    setCancelType("attraction");
    setIsCancelModalOpen(true);
  };

  const handleShowCancelWahana = (reservation: ReservasiTiketWahana) => {
    setItemToCancel(reservation);
    setCancelType("ride");
    setIsCancelModalOpen(true);
  };

  const handleUpdateWahanaReservation = async (data: {
    jumlah_tiket: number;
    tanggal_kunjungan: Date;
    status: ReservationStatus;
  }) => {
    if (!currentWahanaReservation) return;

    try {
      const formattedOriginalDate = formatDateForAPI(
        currentWahanaReservation.tanggal_kunjungan
      );
      console.log(
        "Original date (JS):",
        currentWahanaReservation.tanggal_kunjungan
      );
      console.log("Formatted original date:", formattedOriginalDate);

      const formattedNewDate = formatDateForAPI(data.tanggal_kunjungan);
      console.log("New date (JS):", data.tanggal_kunjungan);
      console.log("Formatted new date:", formattedNewDate);

      const response = await fetch("/api/reservasi", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username_P: currentWahanaReservation.username_P,
          nama_fasilitas: currentWahanaReservation.nama_fasilitas,
          tanggal_kunjungan: formattedOriginalDate,
          new_tanggal_kunjungan: formattedNewDate,
          jumlah_tiket: data.jumlah_tiket,
          status: data.status,
          type: "ride",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update reservation");
      }

      const updatedReservations = wahanaReservations.map((res) => {
        if (
          res.username_P === currentWahanaReservation.username_P &&
          res.nama_fasilitas === currentWahanaReservation.nama_fasilitas
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

      setWahanaReservations(updatedReservations);
      toast({
        title: "Success",
        description: "Reservasi wahana berhasil diperbarui.",
      });
    } catch (error) {
      console.error("Error updating ride reservation:", error);
      toast({
        title: "Error",
        description: "Failed to update ride reservation",
        variant: "destructive",
      });
    }

    setIsWahanaEditModalOpen(false);
    setCurrentWahanaReservation(null);
  };

  const handleCancelReservation = async (reservation: any) => {
    try {
      const formattedDate = formatDateForAPI(reservation.tanggal_kunjungan);

      const response = await fetch("/api/reservasi", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username_P: reservation.username_P,
          nama_fasilitas: reservation.nama_fasilitas,
          tanggal_kunjungan: formattedDate,
          jumlah_tiket: reservation.jumlah_tiket,
          status: "Dibatalkan",
          type:
            reservation.jenis_reservasi === "Atraksi" ? "attraction" : "ride",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to cancel reservation");
      }

      if (cancelType === "attraction") {
        const updatedReservations = atraksiReservations.map((res) => {
          if (
            res.username_P === reservation.username_P &&
            res.nama_fasilitas === reservation.nama_fasilitas
          ) {
            return {
              ...res,
              status: "Dibatalkan" as ReservationStatus,
            };
          }
          return res;
        });
        setAtraksiReservations(updatedReservations);
      } else {
        const updatedReservations = wahanaReservations.map((res) => {
          if (
            res.username_P === reservation.username_P &&
            res.nama_fasilitas === reservation.nama_fasilitas
          ) {
            return {
              ...res,
              status: "Dibatalkan" as ReservationStatus,
            };
          }
          return res;
        });
        setWahanaReservations(updatedReservations);
      }

      toast({
        title: "Success",
        description: "Reservasi berhasil dibatalkan.",
      });
    } catch (error) {
      console.error("Error canceling reservation:", error);
      toast({
        title: "Error",
        description: "Failed to cancel reservation",
        variant: "destructive",
      });
    }

    setIsCancelModalOpen(false);
    setItemToCancel(null);
  };

  const handleReactivateReservation = async (reservation: any) => {
    try {
      const formattedDate = formatDateForAPI(reservation.tanggal_kunjungan);

      const response = await fetch("/api/reservasi", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username_P: reservation.username_P,
          nama_fasilitas: reservation.nama_fasilitas,
          tanggal_kunjungan: formattedDate,
          jumlah_tiket: reservation.jumlah_tiket,
          status: "Terjadwal",
          type:
            reservation.jenis_reservasi === "Atraksi" ? "attraction" : "ride",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to reactivate reservation"
        );
      }

      toast({
        title: "Success",
        description: "Reservasi berhasil diaktifkan kembali",
      });

      fetchAttractionReservations();
      fetchRideReservations();
    } catch (error: any) {
      console.error("Error reactivating reservation:", error);
      toast({
        title: "Error",
        description: error.message || "Gagal mengaktifkan kembali reservasi",
        variant: "destructive",
      });
    }
  };

  const formatDate = (date: Date) => {
    return format(date, "dd MMMM yyyy");
  };

  const formatRegulations = (peraturan: string[]) => {
    if (!peraturan || peraturan.length === 0) return "-";

    return (
      <ul className="list-disc list-inside">
        {peraturan.map((rule, index) => (
          <li key={index} className="text-sm">
            {rule}
          </li>
        ))}
      </ul>
    );
  };

  if (
    authLoading ||
    authState === "initializing" ||
    authState === "loading" ||
    authState === "unauthenticated"
  ) {
    return (
      <div className="flex h-screen w-full justify-center items-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium">Memverifikasi akses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-center items-center gap-5 p-4">
        <Link href="/kelola-pengunjung/">
          <Button variant="secondary">Reservasi</Button>
        </Link>
        <Link href="/kelola-pengunjung/atraksi">
          <Button variant="outline">Atraksi</Button>
        </Link>
        <Link href="/kelola-pengunjung/wahana">
          <Button variant="outline">Wahana</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-h3 font-bold text-foreground">
            DATA RESERVASII
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="attraction" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="attraction">Reservasi Atraksi</TabsTrigger>
              <TabsTrigger value="ride">Reservasi Wahana</TabsTrigger>
            </TabsList>

            <TabsContent value="attraction">
              {isAtraksiLoading && atraksiReservations.length === 0 ? (
                <div className="flex justify-center items-center p-8">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <p>Memuat data reservasi atraksi...</p>
                </div>
              ) : (
                <div className="rounded-md border border-border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Username pengunjung</TableHead>
                        <TableHead>Nama Atraksi</TableHead>
                        <TableHead>Tanggal reservasi</TableHead>
                        <TableHead>Jumlah tiket</TableHead>
                        <TableHead>Lokasi</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {atraksiReservations.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-6">
                            Tidak ada data reservasi atraksi yang ditemukan.
                          </TableCell>
                        </TableRow>
                      ) : (
                        atraksiReservations.map((reservation, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">
                              {reservation.username_P}
                            </TableCell>
                            <TableCell>{reservation.nama_fasilitas}</TableCell>
                            <TableCell>
                              {formatDate(reservation.tanggal_kunjungan)}
                            </TableCell>
                            <TableCell>{reservation.jumlah_tiket}</TableCell>
                            <TableCell>{reservation.lokasi}</TableCell>
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
                                  onClick={() =>
                                    handleEditAtraksiReservation(reservation)
                                  }
                                  className="h-8"
                                >
                                  <Pencil className="h-4 w-4 mr-1" /> Edit
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleShowCancelAtraksi(reservation)
                                  }
                                  className="h-8 text-destructive hover:bg-destructive/10"
                                  disabled={reservation.status === "Dibatalkan"}
                                >
                                  <Trash className="h-4 w-4 mr-1" /> Batalkan
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>

            <TabsContent value="ride">
              {isWahanaLoading && wahanaReservations.length === 0 ? (
                <div className="flex justify-center items-center p-8">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <p>Memuat data reservasi wahana...</p>
                </div>
              ) : (
                <div className="rounded-md border border-border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Username pengunjung</TableHead>
                        <TableHead>Nama Wahana</TableHead>
                        <TableHead>Tanggal reservasi</TableHead>
                        <TableHead>Jumlah tiket</TableHead>
                        <TableHead>Peraturan</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {wahanaReservations.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-6">
                            Tidak ada data reservasi wahana yang ditemukan.
                          </TableCell>
                        </TableRow>
                      ) : (
                        wahanaReservations.map((reservation, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">
                              {reservation.username_P}
                            </TableCell>
                            <TableCell>{reservation.nama_fasilitas}</TableCell>
                            <TableCell>
                              {formatDate(reservation.tanggal_kunjungan)}
                            </TableCell>
                            <TableCell>{reservation.jumlah_tiket}</TableCell>
                            <TableCell>
                              {formatRegulations(reservation.peraturan)}
                            </TableCell>
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
                                  onClick={() =>
                                    handleEditWahanaReservation(reservation)
                                  }
                                  className="h-8"
                                >
                                  <Pencil className="h-4 w-4 mr-1" /> Edit
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleShowCancelWahana(reservation)
                                  }
                                  className="h-8 text-destructive hover:bg-destructive/10"
                                  disabled={reservation.status === "Dibatalkan"}
                                >
                                  <Trash className="h-4 w-4 mr-1" /> Batalkan
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {currentAtraksiReservation && (
        <AdminAtraksiReservasiFormModal
          isOpen={isAtraksiEditModalOpen}
          onClose={() => {
            setIsAtraksiEditModalOpen(false);
            setCurrentAtraksiReservation(null);
          }}
          onSubmit={handleUpdateAtraksiReservation}
          initialData={currentAtraksiReservation}
        />
      )}

      {currentWahanaReservation && (
        <AdminWahanaReservasiFormModal
          isOpen={isWahanaEditModalOpen}
          onClose={() => {
            setIsWahanaEditModalOpen(false);
            setCurrentWahanaReservation(null);
          }}
          onSubmit={handleUpdateWahanaReservation}
          initialData={currentWahanaReservation}
        />
      )}

      <ReservasiCancelModal
        isOpen={isCancelModalOpen}
        onClose={() => {
          setIsCancelModalOpen(false);
          setItemToCancel(null);
        }}
        onConfirm={() => {
          if (itemToCancel) {
            handleCancelReservation(itemToCancel);
          }
        }}
      />
    </div>
  );
};

export default ReservasiTiketAdmin;
