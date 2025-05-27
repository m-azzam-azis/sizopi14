"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, Search } from "lucide-react";

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

export const FeedingHistoryModule = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [feedings, setFeedings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedings = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/feeding-history");
        const data = await res.json();
        setFeedings(data);
      } catch (e) {
        setFeedings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedings();
  }, []);

  // Filter by search (nama_hewan atau jenis pakan)
  const filteredFeedings = feedings.filter(item =>
    search === "" ||
    (item.nama_hewan?.toLowerCase().includes(search.toLowerCase()) ||
      item.jenis?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => router.push('/pakan')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Kembali ke Daftar Hewan
      </Button>
      <h1 className="text-3xl font-bold mb-6">Riwayat Pemberian Pakan</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Pencarian</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari berdasarkan nama hewan atau jenis pakan..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Hewan</TableHead>
                <TableHead>Spesies</TableHead>
                <TableHead>Asal Hewan</TableHead>
                <TableHead>Habitat</TableHead>
                <TableHead>Jenis Pakan</TableHead>
                <TableHead>Jumlah (gram)</TableHead>
                <TableHead>Jadwal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredFeedings.length > 0 ? (
                filteredFeedings.map((item, idx) => (
                  <TableRow key={`history-${item.id_hewan}-${item.jadwal}`}> 
                    <TableCell>{item.nama_hewan}</TableCell>
                    <TableCell>{item.spesies}</TableCell>
                    <TableCell>{item.asal_hewan}</TableCell>
                    <TableCell>{item.habitat}</TableCell>
                    <TableCell>{item.jenis}</TableCell>
                    <TableCell>{item.jumlah}</TableCell>
                    <TableCell>{format(new Date(item.jadwal), "dd/MM/yyyy")}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Tidak ada riwayat pemberian pakan yang ditemukan
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