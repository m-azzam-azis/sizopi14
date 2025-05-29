"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TrainerData } from "@/types/user";
import { Loader2 } from "lucide-react";
import { getUserData } from "@/hooks/getUserData";

interface DashboardData {
  trainer: {
    id_staf: string;
    nama_depan: string;
    nama_belakang: string;
  } | null;
  assignmentSchedules: {
    username_lh: string;
    tgl_penugasan: string;
    nama_atraksi: string;
    lokasi: string;
  }[];
  trainedAnimals: {
    id: string;
    nama: string;
    spesies: string;
    status_kesehatan: string;
    nama_atraksi: string;
    url_foto: string;
  }[];
  trainingStatuses: {
    id: string;
    id_hewan: string;
    animal_name: string;
    date: string;
    status: string;
    notes: string;
  }[];
}

const JadwalPertunjukanModule = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const { userData } = getUserData();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/jadwal-penugasan?username=${userData.username}`
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Gagal memuat data dashboard");
      } finally {
        setLoading(false);
      }
    };

    if (userData.username) {
      fetchDashboardData();
    }
  }, [userData.username]);

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), "HH:mm");
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMM yyyy");
  };

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), "dd MMM yyyy, HH:mm");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 py-4">{error}</div>;
  }

  if (!dashboardData) {
    return <div>No data available</div>;
  }

  const { trainer, assignmentSchedules, trainedAnimals, trainingStatuses } =
    dashboardData;
  const todayShows = assignmentSchedules || [];

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 mb-4 mx-auto px-5 md:px-10 lg:px-20">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Jadwal Pertunjukan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Atraksi</TableHead>
                    <TableHead>Lokasi</TableHead>
                    <TableHead>Tanggal & Jam</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignmentSchedules.length > 0 ? (
                    assignmentSchedules.map((show, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {show.nama_atraksi}
                        </TableCell>
                        <TableCell>{show.lokasi}</TableCell>
                        <TableCell>
                          {formatDateTime(show.tgl_penugasan)}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-500">Terjadwal</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        Tidak ada jadwal pertunjukan
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Hewan Yang Dilatih</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hewan</TableHead>
                    <TableHead>Spesies</TableHead>
                    <TableHead>Pertunjukan</TableHead>
                    <TableHead>Status Kesehatan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trainedAnimals.length > 0 ? (
                    trainedAnimals.map((animal) => (
                      <TableRow key={animal.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarImage
                                src={animal.url_foto || ""}
                                alt={animal.nama}
                              />
                              <AvatarFallback>
                                {animal.nama?.charAt(0) || "?"}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{animal.nama}</span>
                          </div>
                        </TableCell>
                        <TableCell>{animal.spesies}</TableCell>
                        <TableCell>{animal.nama_atraksi}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              animal.status_kesehatan === "Sehat"
                                ? "bg-green-500"
                                : "bg-yellow-500"
                            }
                          >
                            {animal.status_kesehatan}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        Belum ada hewan yang dilatih
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mx-5 md:mx-10 lg:mx-20 mb-10">
        <CardHeader>
          <CardTitle>Status Latihan Terakhir</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hewan</TableHead>
                  <TableHead>Tanggal & Jam</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Catatan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trainingStatuses.length > 0 ? (
                  trainingStatuses.map((status) => (
                    <TableRow key={status.id}>
                      <TableCell className="font-medium">
                        {status.animal_name}
                      </TableCell>
                      <TableCell>{formatDateTime(status.date)}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            status.status === "Selesai"
                              ? "bg-green-500"
                              : status.status === "Dalam Proses"
                              ? "bg-blue-500"
                              : "bg-yellow-500"
                          }
                        >
                          {status.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{status.notes}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      Belum ada data latihan
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default JadwalPertunjukanModule;
