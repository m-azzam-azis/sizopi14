import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { VeterinarianData } from "@/types/user";

interface VeterinarianDashboardProps {
  userData: VeterinarianData;
}

// Mock data for recent medical records
const recentMedicalRecords = [
  {
    id: 1,
    animalId: "A001",
    animalName: "Leo",
    species: "Lion",
    date: "2025-04-25",
    diagnosis: "Annual checkup",
    status: "Healthy",
  },
  {
    id: 2,
    animalId: "A015",
    animalName: "Gerry",
    species: "Giraffe",
    date: "2025-04-24",
    diagnosis: "Minor skin infection",
    status: "Under Treatment",
  },
  {
    id: 3,
    animalId: "A042",
    animalName: "Slithers",
    species: "Python",
    date: "2025-04-22",
    diagnosis: "Respiratory infection",
    status: "Improving",
  },
];

const VeterinarianDashboard: React.FC<VeterinarianDashboardProps> = ({
  userData,
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
            <div className="text-2xl font-bold">
              {userData.animalsTreated || 0}
            </div>
            <p className="text-xs text-muted-foreground">+5 new this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Certification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-md font-medium">
              {userData.certificationNumber}
            </div>
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
              {userData.specializations.map((spec, index) => (
                <Badge key={index} variant="secondary">
                  {spec}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

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
              {recentMedicalRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">
                    {record.animalName}
                  </TableCell>
                  <TableCell>{record.species}</TableCell>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.diagnosis}</TableCell>
                  <TableCell>
                    <Badge>{record.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
};

export default VeterinarianDashboard;
