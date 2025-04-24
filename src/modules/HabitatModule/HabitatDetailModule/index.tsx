"use client";

import React, { useState } from "react";
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
import { Pencil, Trash, ChevronLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Define interfaces for better type safety
interface Habitat {
  id: string;
  name: string;
  type: string;
  area: number;
  capacity: number;
  status: "Available" | "Maintenance" | "Full";
  environmentStatus: "Excellent" | "Good" | "Fair" | "Poor";
  description: string;
}

interface Animal {
  id: string;
  name: string;
  species: string;
  origin: string;
  birthDate: string;
  healthStatus: "Healthy" | "Sick" | "Under Observation" | "Critical";
}

const HabitatDetailModule = () => {
  const router = useRouter();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  // Dummy data for a single habitat
  const habitat: Habitat = {
    id: "hab-001",
    name: "Savanna Enclosure",
    type: "Grassland",
    area: 5000,
    capacity: 15,
    status: "Available",
    environmentStatus: "Good",
    description:
      "A spacious savanna habitat designed to mimic the African plains. Features both open grassland areas and scattered shade trees.",
  };

  // Dummy data for animals in this habitat
  const animals: Animal[] = [
    {
      id: "ani-101",
      name: "Simba",
      species: "African Lion",
      origin: "Wildlife Conservation Center",
      birthDate: "2018-06-15",
      healthStatus: "Healthy",
    },
    {
      id: "ani-102",
      name: "Zara",
      species: "Plains Zebra",
      origin: "Born in captivity",
      birthDate: "2020-04-22",
      healthStatus: "Healthy",
    },
    {
      id: "ani-103",
      name: "Rafiki",
      species: "Giraffe",
      origin: "Animal Sanctuary",
      birthDate: "2019-08-10",
      healthStatus: "Under Observation",
    },
    {
      id: "ani-104",
      name: "Pumbaa",
      species: "Warthog",
      origin: "Wildlife Reserve",
      birthDate: "2021-02-28",
      healthStatus: "Sick",
    },
    {
      id: "ani-105",
      name: "Nala",
      species: "African Lion",
      origin: "Wildlife Conservation Center",
      birthDate: "2017-11-05",
      healthStatus: "Healthy",
    },
  ];

  // Function to handle edit (placeholder for now)
  const handleEdit = () => {
    console.log(`Edit habitat with ID: ${habitat.id}`);
  };

  // Function to handle delete confirmation
  const handleDelete = () => {
    console.log(`Delete habitat with ID: ${habitat.id}`);
    setShowDeleteAlert(false);
    router.push("/habitat");
  };

  // Function to get status badge color for habitat
  const getStatusBadge = (status: Habitat["status"]) => {
    switch (status) {
      case "Available":
        return (
          <Badge className="bg-success text-success-foreground">
            Available
          </Badge>
        );
      case "Full":
        return (
          <Badge className="bg-warning text-warning-foreground">Full</Badge>
        );
      case "Maintenance":
        return <Badge variant="destructive">Maintenance</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Function to get environment status badge
  const getEnvironmentBadge = (status: Habitat["environmentStatus"]) => {
    switch (status) {
      case "Excellent":
        return (
          <Badge className="bg-success text-success-foreground">
            Excellent
          </Badge>
        );
      case "Good":
        return (
          <Badge className="bg-success/80 text-success-foreground">Good</Badge>
        );
      case "Fair":
        return (
          <Badge className="bg-warning text-warning-foreground">Fair</Badge>
        );
      case "Poor":
        return <Badge variant="destructive">Poor</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Function to get health status badge for animals
  const getHealthBadge = (status: Animal["healthStatus"]) => {
    switch (status) {
      case "Healthy":
        return (
          <Badge className="bg-success text-success-foreground">Healthy</Badge>
        );
      case "Under Observation":
        return (
          <Badge className="bg-warning text-warning-foreground">
            Under Observation
          </Badge>
        );
      case "Sick":
        return (
          <Badge className="bg-destructive/80 text-destructive-foreground">
            Sick
          </Badge>
        );
      case "Critical":
        return <Badge variant="destructive">Critical</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-20 px-4">
      <div className="mb-8">
        <Link
          href="/habitat"
          className="inline-flex items-center text-primary hover:text-primary/80 mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to Habitats
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-h3 font-bold text-foreground">
              {habitat.name}
            </h1>
            <p className="text-muted-foreground mt-1">{habitat.type}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleEdit}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </Button>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteAlert(true)}
            >
              <Trash className="mr-2 h-4 w-4" /> Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-h6">Luas Area</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-h4 font-bold text-foreground">
              {habitat.area.toLocaleString()} m²
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-h6">Status Lingkungan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              {getEnvironmentBadge(habitat.environmentStatus)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-h6">Kapasitas Maksimal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <p className="text-h4 font-bold text-foreground">
                {habitat.capacity}
              </p>
              <p className="text-muted-foreground">
                (Current: {animals.length})
              </p>
              {getStatusBadge(habitat.status)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Deskripsi</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{habitat.description}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-h5">Daftar Hewan dalam Habitat</CardTitle>
          <CardDescription>
            Menampilkan {animals.length} hewan yang berada di habitat ini
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Individu</TableHead>
                <TableHead>Spesies</TableHead>
                <TableHead>Asal Hewan</TableHead>
                <TableHead>Tanggal Lahir</TableHead>
                <TableHead>Status Kesehatan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {animals.map((animal) => (
                <TableRow key={animal.id}>
                  <TableCell className="font-medium">{animal.name}</TableCell>
                  <TableCell>{animal.species}</TableCell>
                  <TableCell>{animal.origin}</TableCell>
                  <TableCell>
                    {new Date(animal.birthDate).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>{getHealthBadge(animal.healthStatus)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              habitat "{habitat.name}" and potentially affect all animals
              currently housed here.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default HabitatDetailModule;
