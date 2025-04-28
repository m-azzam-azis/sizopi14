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
import HabitatFormModal from "../components/modals/HabitatFormModal";
import { HabitatFormValues } from "@/modules/HabitatModule/components/forms/HabitatForm";
import { Habitat } from "../interface";
import { animals } from "../constants";
import { habitats_dummy } from "../constants";
import { Animal } from "../interface";

const HabitatDetailModule = () => {
  const router = useRouter();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Dummy data for a single habitat
  const [habitat, setHabitat] = useState<Habitat>(habitats_dummy[0]);

  // Function to handle edit habitat submission
  const handleEditHabitat = (data: HabitatFormValues) => {
    setHabitat({
      ...habitat,
      name: data.name,
      area: parseInt(data.area),
      capacity: parseInt(data.capacity),
      status: data.environmentStatus as any, // Type casting
    });
    console.log(`Edited habitat with ID: ${habitat.id}`, data);
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
  const getEnvironmentBadge = (status: Habitat["status"]) => {
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
    <div className="container mx-auto px-4 pb-20">
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
          </div>
          <div className="flex gap-2">
            {/* Edit Habitat Modal */}
            {habitat && (
              <HabitatFormModal
                isOpen={isEditModalOpen}
                onClose={() => {
                  setIsEditModalOpen(false);
                }}
                onSubmit={handleEditHabitat}
                initialData={{
                  name: habitat.name,
                  area: habitat.area,
                  capacity: habitat.capacity,
                  environmentStatus: habitat.status,
                }}
                isEditing={true}
              />
            )}
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
            <p className="flex items-center">{habitat.status}</p>
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
            </div>
          </CardContent>
        </Card>
      </div>

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
