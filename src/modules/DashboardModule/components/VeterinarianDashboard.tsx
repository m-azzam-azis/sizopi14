import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VeterinarianData } from "@/types/user";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface MedicalRecord {
  id: string;
  animalId: string;
  animalName: string;
  species: string;
  date: string;
  diagnosis: string;
  status: string;
}

interface VeterinarianDashboardProps {
  userData: {
    username: string;
    email: string;
    nama_depan: string;
    nama_tengah: string;
    nama_belakang: string;
    no_telepon: string;
    role: "visitor" | "veterinarian" | "caretaker" | "trainer" | "admin" | "";
    alamat: string;
    tgl_lahir: string;
    id_staf_JH: string;
    id_staf_LH: string;
    no_str: string;
    nama_spesialisasi: string[];
    id_staf_sa: string;
  };
  animalsTreated?: number;
}

const VeterinarianDashboard: React.FC<VeterinarianDashboardProps> = ({
  userData,
  animalsTreated,
}) => {
  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Veterinarian Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Animals Treated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{animalsTreated ?? 0}</div>
            <p className="text-xs text-muted-foreground">
              Total hewan yang ditangani
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Certification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-md font-medium">{userData.no_str || "-"}</div>
            <p className="text-xs text-muted-foreground">Valid until 2026</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Specializations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {(userData.nama_spesialisasi || []).map((spec, index) => (
                <Badge key={index} variant="secondary">
                  {spec}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* {userData.medicalRecords && userData.medicalRecords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Medical Records</CardTitle>
            <CardDescription>Latest animals you've treated</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Animal</TableHead>
                  <TableHead>Species</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Diagnosis</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userData.medicalRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.animalName}</TableCell>
                    <TableCell>{record.species}</TableCell>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.diagnosis}</TableCell>
                    <TableCell><Badge>{record.status}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )} */}
    </>
  );
};

export default VeterinarianDashboard;
