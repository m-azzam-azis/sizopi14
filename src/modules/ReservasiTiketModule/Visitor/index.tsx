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
import { PlusCircle, Eye, Pencil, Trash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { getUserData } from "@/hooks/getUserData";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import ReservasiTiketFormModal from "../modals/ReservasiTiketFormModal";
import ReservasiTiketDetailModal from "../modals/ReservasiTiketDetailModal";
import ReservasiTiketCancelModal from "../modals/ReservasiTiketCancelModal";
import WahanaReservasiFormModal from "../modals/WahanaReservasiFormModal";

// Define types for our data
interface Facility {
  jadwal: Date;
  kapasitas_max: number;
  kapasitas_tersedia: number;
}

interface Attraction {
  nama_atraksi: string;
  lokasi: string;
  jadwal: string; // Changed from Date to string
  kapasitas_max: number;
  kapasitas_tersedia: number;
  tiket_terjual: number;
  jenis_reservasi: "Atraksi";
}

interface Ride {
  nama_wahana: string;
  peraturan: string;
  jadwal: string; // Changed from Date to string
  kapasitas_max: number;
  kapasitas_tersedia: number;
  tiket_terjual: number;
  jenis_reservasi: "Wahana";
}

interface Reservation {
  username_P: string;
  nama_fasilitas: string;
  tanggal_kunjungan: Date;
  jumlah_tiket: number;
  status: "Aktif" | "Batal";
  jenis_reservasi: "Atraksi" | "Wahana";
  lokasi?: string;
  peraturan?: string;
  jadwal: string; // Changed from Date to string
  kapasitas_tersedia?: number; // Add this line
  kapasitas_max?: number; // Add this line
}

const ReservasiTiketVisitorModule = () => {
  const { toast } = useToast();
  const {
    userData,
    isValid,
    isLoading: authLoading,
    authState,
  } = getUserData();

  // Current user
  const username = userData?.username || "";

  // State for user's reservations
  const [userReservations, setUserReservations] = useState<Reservation[]>([]);
  const [isReservationsLoading, setIsReservationsLoading] = useState(true);

  // State for available facilities
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [rides, setRides] = useState<Ride[]>([]);
  const [isAvailableLoading, setIsAvailableLoading] = useState(true);

  // Modal states
  const [isAttractionFormOpen, setIsAttractionFormOpen] = useState(false);
  const [isRideFormOpen, setIsRideFormOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditAttractionModalOpen, setIsEditAttractionModalOpen] =
    useState(false);
  const [isEditRideModalOpen, setIsEditRideModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  // Current item being viewed/edited
  const [currentReservation, setCurrentReservation] =
    useState<Reservation | null>(null);

  // Selected date for booking
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Fetch user's reservations
  const fetchUserReservations = async () => {
    if (!isValid || !username) return;

    setIsReservationsLoading(true);
    try {
      const response = await fetch(
        `/api/reservasi-visitor?username=${username}`
      );
      if (!response.ok) throw new Error("Failed to fetch reservations");

      const data = await response.json();

      // Format dates
      const formattedReservations = data.reservations.map((res: any) => ({
        ...res,
        tanggal_kunjungan: new Date(res.tanggal_kunjungan),
        jadwal: new Date(res.jadwal),
      }));

      setUserReservations(formattedReservations);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      toast({
        title: "Error",
        description: "Gagal memuat data reservasi",
        variant: "destructive",
      });
    } finally {
      setIsReservationsLoading(false);
    }
  };

  // Fetch available attractions and rides
  const fetchAvailableFacilities = async (date: Date = selectedDate) => {
    setIsAvailableLoading(true);
    try {
      const dateParam = format(date, "yyyy-MM-dd");
      const response = await fetch(
        `/api/reservasi-visitor?type=available&date=${dateParam}`
      );

      if (!response.ok) throw new Error("Failed to fetch available facilities");

      const data = await response.json();

      // Format attractions properly
      const formattedAttractions = data.attractions.map((attr: any) => ({
        nama_atraksi: attr.nama_atraksi,
        lokasi: attr.lokasi,
        jadwal: attr.jadwal, // Just use the time string directly
        kapasitas_max: parseInt(attr.kapasitas_max),
        kapasitas_tersedia: parseInt(attr.kapasitas_tersedia),
        tiket_terjual: parseInt(attr.tiket_terjual || 0),
        jenis_reservasi: "Atraksi",
      }));

      // Format rides properly
      const formattedRides = data.rides.map((ride: any) => ({
        nama_wahana: ride.nama_wahana,
        peraturan: ride.peraturan,
        jadwal: ride.jadwal, // Just use the time string directly
        kapasitas_max: parseInt(ride.kapasitas_max),
        kapasitas_tersedia: parseInt(ride.kapasitas_tersedia),
        tiket_terjual: parseInt(ride.tiket_terjual || 0),
        jenis_reservasi: "Wahana",
      }));

      setAttractions(formattedAttractions);
      setRides(formattedRides);
    } catch (error) {
      console.error("Error fetching available facilities:", error);
      toast({
        title: "Error",
        description: "Gagal memuat data fasilitas tersedia",
        variant: "destructive",
      });
    } finally {
      setIsAvailableLoading(false);
    }
  };

  // Load data when user is authenticated
  useEffect(() => {
    if (!authLoading && isValid) {
      fetchUserReservations();
      fetchAvailableFacilities(selectedDate);
    }
  }, [authLoading, isValid, username, selectedDate]);

  // Handle creating a new attraction reservation
  const handleCreateAttractionReservation = async (data: {
    nama_fasilitas: string;
    tanggal_kunjungan: Date;
    jumlah_tiket: number;
  }) => {
    try {
      const response = await fetch("/api/reservasi-visitor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username_P: username,
          nama_fasilitas: data.nama_fasilitas,
          tanggal_kunjungan: data.tanggal_kunjungan,
          jumlah_tiket: data.jumlah_tiket,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast({
          title: "Error",
          description: result.message || "Gagal membuat reservasi",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sukses",
        description: "Berhasil membuat reservasi",
      });

      // Refresh data
      fetchUserReservations();
      fetchAvailableFacilities(selectedDate);
      setIsAttractionFormOpen(false);
    } catch (error) {
      console.error("Error creating attraction reservation:", error);
      toast({
        title: "Error",
        description: "Gagal membuat reservasi",
        variant: "destructive",
      });
    }
  };

  // Handle creating a new ride reservation
  const handleCreateRideReservation = async (data: {
    nama_fasilitas: string;
    tanggal_kunjungan: Date;
    jumlah_tiket: number;
  }) => {
    try {
      const response = await fetch("/api/reservasi-visitor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username_P: username,
          nama_fasilitas: data.nama_fasilitas,
          tanggal_kunjungan: data.tanggal_kunjungan,
          jumlah_tiket: data.jumlah_tiket,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast({
          title: "Error",
          description: result.message || "Gagal membuat reservasi",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sukses",
        description: "Berhasil membuat reservasi",
      });

      // Refresh data
      fetchUserReservations();
      fetchAvailableFacilities(selectedDate);
      setIsRideFormOpen(false);
    } catch (error) {
      console.error("Error creating ride reservation:", error);
      toast({
        title: "Error",
        description: "Gagal membuat reservasi",
        variant: "destructive",
      });
    }
  };

  // Handle updating a reservation
  const handleUpdateReservation = async (data: {
    tanggal_kunjungan: Date;
    jumlah_tiket: number;
  }) => {
    if (!currentReservation) return;

    try {
      const response = await fetch("/api/reservasi-visitor", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username_P: username,
          nama_fasilitas: currentReservation.nama_fasilitas,
          tanggal_kunjungan: currentReservation.tanggal_kunjungan,
          new_tanggal_kunjungan: data.tanggal_kunjungan,
          new_jumlah_tiket: data.jumlah_tiket,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast({
          title: "Error",
          description: result.message || "Gagal mengubah reservasi",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sukses",
        description: "Berhasil mengubah reservasi",
      });

      // Refresh data and close modal
      fetchUserReservations();
      fetchAvailableFacilities(selectedDate);
      setIsEditAttractionModalOpen(false);
      setIsEditRideModalOpen(false);
      setCurrentReservation(null);
    } catch (error) {
      console.error("Error updating reservation:", error);
      toast({
        title: "Error",
        description: "Gagal mengubah reservasi",
        variant: "destructive",
      });
    }
  };

  // Handle canceling a reservation
  const handleCancelReservation = async () => {
    if (!currentReservation) return;

    try {
      const response = await fetch(
        `/api/reservasi-visitor?username=${username}&facility=${
          currentReservation.nama_fasilitas
        }&date=${format(
          currentReservation.tanggal_kunjungan,
          "yyyy-MM-dd HH:mm:ss"
        )}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        toast({
          title: "Error",
          description: result.message || "Gagal membatalkan reservasi",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sukses",
        description: "Berhasil membatalkan reservasi",
      });

      // Refresh data and close modal
      fetchUserReservations();
      fetchAvailableFacilities(selectedDate);
      setIsCancelModalOpen(false);
      setCurrentReservation(null);
    } catch (error) {
      console.error("Error canceling reservation:", error);
      toast({
        title: "Error",
        description: "Gagal membatalkan reservasi",
        variant: "destructive",
      });
    }
  };

  // Showing reservation details
  const handleShowDetail = (reservation: Reservation) => {
    setCurrentReservation(reservation);
    setIsDetailModalOpen(true);
  };

  // Opening edit form
  const handleShowEditForm = async (reservation: Reservation) => {
    try {
      // Fetch current capacity for this facility on this date
      const dateParam = format(reservation.tanggal_kunjungan, "yyyy-MM-dd");
      const facilityType =
        reservation.jenis_reservasi === "Atraksi" ? "attraction" : "ride";
      const facilityName = encodeURIComponent(reservation.nama_fasilitas);

      const response = await fetch(
        `/api/reservasi-visitor?type=${facilityType}&name=${facilityName}&date=${dateParam}`
      );

      if (!response.ok) throw new Error("Failed to fetch facility details");

      const data = await response.json();
      console.log("Capacity data:", data);

      // Update reservation with current capacity data
      setCurrentReservation({
        ...reservation,
        kapasitas_tersedia: parseInt(data.data.kapasitas_tersedia),
        kapasitas_max: parseInt(data.data.kapasitas_max),
      });

      if (reservation.jenis_reservasi === "Atraksi") {
        setIsEditAttractionModalOpen(true);
      } else {
        setIsEditRideModalOpen(true);
      }
    } catch (error) {
      console.error("Error fetching capacity data:", error);
      toast({
        title: "Error",
        description: "Gagal memuat data kapasitas fasilitas",
        variant: "destructive",
      });

      // Fallback to showing the edit form without updated capacity
      setCurrentReservation(reservation);
      if (reservation.jenis_reservasi === "Atraksi") {
        setIsEditAttractionModalOpen(true);
      } else {
        setIsEditRideModalOpen(true);
      }
    }
  };

  // Opening cancel confirmation
  const handleShowCancelConfirm = (reservation: Reservation) => {
    setCurrentReservation(reservation);
    setIsCancelModalOpen(true);
  };

  // Format date
  const formatDate = (date: Date) => {
    return format(date, "dd MMMM yyyy");
  };

  // Format capacity
  const formatCapacity = (available: number, total: number) => {
    return `${available} dari ${total}`;
  };

  // Parse peraturan string into array
  const parsePeraturan = (peraturan: string): string[] => {
    if (!peraturan) return [];
    return peraturan.split(",").map((item) => item.trim());
  };

  // Display peraturan as bullet points
  const displayPeraturan = (peraturan: string) => {
    const rules = parsePeraturan(peraturan);

    if (rules.length === 0) return "-";

    return (
      <ul className="list-disc list-inside">
        {rules.map((rule, index) => (
          <li key={index} className="text-sm">
            {rule}
          </li>
        ))}
      </ul>
    );
  };

  // Add this helper function
  const formatTime = (timeString: string) => {
    return timeString;
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <Tabs defaultValue="my-reservations">
        <TabsList className="mb-4">
          <TabsTrigger value="my-reservations">Reservasi Saya</TabsTrigger>
          <TabsTrigger value="book-tickets">Pesan Tiket</TabsTrigger>
        </TabsList>

        {/* My Reservations Tab */}
        <TabsContent value="my-reservations">
          <Card>
            <CardHeader>
              <CardTitle className="text-h3 font-bold text-foreground">
                DATA RESERVASI SAYA
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isReservationsLoading ? (
                <div className="flex justify-center items-center p-8">
                  <div className="loader"></div>
                  <p className="ml-2">Memuat data reservasi...</p>
                </div>
              ) : (
                <div className="rounded-md border border-border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Jenis Reservasi</TableHead>
                        <TableHead>Nama Fasilitas</TableHead>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Jumlah Tiket</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userReservations.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-6">
                            Anda belum memiliki reservasi tiket
                          </TableCell>
                        </TableRow>
                      ) : (
                        userReservations.map((reservation, index) => (
                          <TableRow key={index}>
                            <TableCell>{reservation.jenis_reservasi}</TableCell>
                            <TableCell className="font-medium">
                              {reservation.nama_fasilitas}
                            </TableCell>
                            <TableCell>
                              {formatDate(reservation.tanggal_kunjungan)}
                            </TableCell>
                            <TableCell>{reservation.jumlah_tiket}</TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  reservation.status === "Aktif"
                                    ? "bg-green-500"
                                    : reservation.status === "Batal"
                                    ? "bg-red-500"
                                    : "bg-blue-500"
                                }
                              >
                                {reservation.status === "Aktif"
                                  ? "Terjadwal"
                                  : reservation.status === "Batal"
                                  ? "Dibatalkan"
                                  : "Selesai"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleShowDetail(reservation)}
                                  className="h-8 w-8"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>

                                {reservation.status === "Aktif" && (
                                  <>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() =>
                                        handleShowEditForm(reservation)
                                      }
                                      className="h-8 w-8"
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() =>
                                        handleShowCancelConfirm(reservation)
                                      }
                                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                    >
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Book Tickets Tab */}
        <TabsContent value="book-tickets">
          <Card>
            <CardHeader>
              <CardTitle className="text-h3 font-bold text-foreground">
                PESAN TIKET
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Pilih Tanggal Kunjungan:
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      {selectedDate ? (
                        format(selectedDate, "dd MMMM yyyy")
                      ) : (
                        <span>Pilih tanggal</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        if (date) {
                          setSelectedDate(date);
                          fetchAvailableFacilities(date); // Fetch attractions for this specific date
                        }
                      }}
                      disabled={(date) =>
                        date < new Date() ||
                        date >
                          new Date(
                            new Date().setMonth(new Date().getMonth() + 9)
                          )
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <p className="text-xs text-muted-foreground mt-1">
                  Menampilkan ketersediaan tiket untuk tanggal:{" "}
                  {format(selectedDate, "dd MMMM yyyy")}
                </p>
              </div>

              <Tabs defaultValue="attractions">
                <TabsList className="mb-4">
                  <TabsTrigger value="attractions">Atraksi</TabsTrigger>
                  <TabsTrigger value="rides">Wahana</TabsTrigger>
                </TabsList>

                {/* Attractions Booking Tab */}
                <TabsContent value="attractions">
                  {isAvailableLoading ? (
                    <div className="flex justify-center items-center p-8">
                      <div className="loader"></div>
                      <p className="ml-2">Memuat data atraksi...</p>
                    </div>
                  ) : (
                    <div className="rounded-md border border-border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nama Atraksi</TableHead>
                            <TableHead>Lokasi</TableHead>
                            <TableHead>Jam</TableHead>
                            <TableHead>Kapasitas Tersedia</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {attractions.length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={5}
                                className="text-center py-6"
                              >
                                Tidak ada data atraksi tersedia
                              </TableCell>
                            </TableRow>
                          ) : (
                            attractions.map((attraction, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">
                                  {attraction.nama_atraksi}
                                </TableCell>
                                <TableCell>{attraction.lokasi}</TableCell>
                                <TableCell>
                                  {format(new Date(attraction.jadwal), "HH:mm")}
                                </TableCell>
                                <TableCell>
                                  {formatCapacity(
                                    attraction.kapasitas_tersedia,
                                    attraction.kapasitas_max
                                  )}
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setCurrentReservation({
                                        username_P: username,
                                        nama_fasilitas: attraction.nama_atraksi,
                                        tanggal_kunjungan: selectedDate,
                                        jumlah_tiket: 1,
                                        status: "Aktif",
                                        jenis_reservasi: "Atraksi",
                                        lokasi: attraction.lokasi,
                                        jadwal: attraction.jadwal,
                                        kapasitas_tersedia:
                                          attraction.kapasitas_tersedia, // Add this line
                                        kapasitas_max: attraction.kapasitas_max, // Add this line
                                      });
                                      setIsAttractionFormOpen(true);
                                    }}
                                    disabled={
                                      attraction.kapasitas_tersedia <= 0
                                    }
                                  >
                                    Pesan Tiket
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>

                {/* Rides Booking Tab */}
                <TabsContent value="rides">
                  {isAvailableLoading ? (
                    <div className="flex justify-center items-center p-8">
                      <div className="loader"></div>
                      <p className="ml-2">Memuat data wahana...</p>
                    </div>
                  ) : (
                    <div className="rounded-md border border-border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nama Wahana</TableHead>
                            <TableHead>Peraturan</TableHead>
                            <TableHead>Jam</TableHead>
                            <TableHead>Kapasitas Tersedia</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {rides.length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={5}
                                className="text-center py-6"
                              >
                                Tidak ada data wahana tersedia
                              </TableCell>
                            </TableRow>
                          ) : (
                            rides.map((ride, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">
                                  {ride.nama_wahana}
                                </TableCell>
                                <TableCell>
                                  {displayPeraturan(ride.peraturan)}
                                </TableCell>
                                <TableCell>
                                  {format(new Date(ride.jadwal), "HH:mm")}
                                </TableCell>
                                <TableCell>
                                  {formatCapacity(
                                    ride.kapasitas_tersedia,
                                    ride.kapasitas_max
                                  )}
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setCurrentReservation({
                                        username_P: username,
                                        nama_fasilitas: ride.nama_wahana,
                                        tanggal_kunjungan: selectedDate, // Use the selected date here
                                        jumlah_tiket: 1,
                                        status: "Aktif",
                                        jenis_reservasi: "Wahana",
                                        peraturan: ride.peraturan,
                                        jadwal: ride.jadwal,
                                        kapasitas_tersedia:
                                          ride.kapasitas_tersedia, // Add this line
                                        kapasitas_max: ride.kapasitas_max, // Add this line
                                      });
                                      setIsRideFormOpen(true);
                                    }}
                                    disabled={ride.kapasitas_tersedia <= 0}
                                  >
                                    Pesan Tiket
                                  </Button>
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
        </TabsContent>
      </Tabs>

      {/* Modals */}
      {currentReservation && (
        <>
          {/* Attraction Booking Form Modal */}
          <ReservasiTiketFormModal
            isOpen={isAttractionFormOpen}
            onClose={() => {
              setIsAttractionFormOpen(false);
              setCurrentReservation(null);
            }}
            onSubmit={handleCreateAttractionReservation}
            attraction={{
              nama_atraksi: currentReservation.nama_fasilitas,
              lokasi: currentReservation.lokasi || "",
              fasilitas: {
                jadwal: currentReservation.jadwal,
                kapasitas_tersedia: currentReservation.kapasitas_tersedia || 0, // Use actual capacity
                kapasitas_max: currentReservation.kapasitas_max || 0, // Use actual capacity
              },
            }}
          />

          {/* Ride Booking Form Modal */}
          <WahanaReservasiFormModal
            isOpen={isRideFormOpen}
            onClose={() => {
              setIsRideFormOpen(false);
              setCurrentReservation(null);
            }}
            onSubmit={handleCreateRideReservation}
            ride={{
              nama_wahana: currentReservation.nama_fasilitas,
              peraturan: parsePeraturan(currentReservation.peraturan || ""),
              fasilitas: {
                jadwal: currentReservation.jadwal,
                kapasitas_tersedia: currentReservation.kapasitas_tersedia || 0, // Use actual capacity
                kapasitas_max: currentReservation.kapasitas_max || 0, // Use actual capacity
              },
            }}
          />

          {/* Attraction Edit Form Modal */}
          <ReservasiTiketFormModal
            isOpen={isEditAttractionModalOpen}
            onClose={() => {
              setIsEditAttractionModalOpen(false);
              setCurrentReservation(null);
            }}
            onSubmit={handleUpdateReservation}
            attraction={{
              nama_atraksi: currentReservation.nama_fasilitas,
              lokasi: currentReservation.lokasi || "",
              fasilitas: {
                jadwal: currentReservation.jadwal,
                kapasitas_tersedia: currentReservation.kapasitas_tersedia || 0, // Use actual capacity
                kapasitas_max: currentReservation.kapasitas_max || 0, // Use actual capacity
              },
            }}
            isEditing={true}
            initialData={{
              tanggal_kunjungan: currentReservation.tanggal_kunjungan,
              jumlah_tiket: currentReservation.jumlah_tiket,
            }}
          />

          {/* Ride Edit Form Modal */}
          <WahanaReservasiFormModal
            isOpen={isEditRideModalOpen}
            onClose={() => {
              setIsEditRideModalOpen(false);
              setCurrentReservation(null);
            }}
            onSubmit={handleUpdateReservation}
            ride={{
              nama_wahana: currentReservation.nama_fasilitas,
              peraturan: parsePeraturan(currentReservation.peraturan || ""),
              fasilitas: {
                jadwal: currentReservation.jadwal,
                kapasitas_tersedia: currentReservation.kapasitas_tersedia || 0, // Use actual capacity
                kapasitas_max: currentReservation.kapasitas_max || 0, // Use actual capacity
              },
            }}
            isEditing={true}
            initialData={{
              tanggal_kunjungan: currentReservation.tanggal_kunjungan,
              jumlah_tiket: currentReservation.jumlah_tiket,
            }}
          />

          {/* Reservation Detail Modal */}
          <ReservasiTiketDetailModal
            isOpen={isDetailModalOpen}
            onClose={() => {
              setIsDetailModalOpen(false);
              setCurrentReservation(null);
            }}
            reservation={{
              ...currentReservation,
              peraturan: parsePeraturan(currentReservation.peraturan || ""),
            }}
            onEdit={
              currentReservation.status === "Aktif"
                ? () => {
                    setIsDetailModalOpen(false);
                    handleShowEditForm(currentReservation);
                  }
                : undefined
            }
            onCancel={
              currentReservation.status === "Aktif"
                ? () => {
                    setIsDetailModalOpen(false);
                    handleShowCancelConfirm(currentReservation);
                  }
                : undefined
            }
          />

          {/* Cancel Confirmation Modal */}
          <ReservasiTiketCancelModal
            isOpen={isCancelModalOpen}
            onClose={() => {
              setIsCancelModalOpen(false);
              setCurrentReservation(null);
            }}
            onConfirm={handleCancelReservation}
          />
        </>
      )}

      <style jsx>{`
        .loader {
          border: 3px solid #f3f3f3;
          border-radius: 50%;
          border-top: 3px solid #3498db;
          width: 20px;
          height: 20px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default ReservasiTiketVisitorModule;
