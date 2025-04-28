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
import { PlusCircle, Eye, Pencil, Trash } from "lucide-react";
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
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HabitatFormModal from "@/modules/HabitatModule/components/modals/HabitatFormModal";
import { HabitatFormValues } from "@/modules/HabitatModule/components/forms/HabitatForm";

// Define the Habitat interface for better type safety
interface Habitat {
  id: string;
  name: string;
  type: string;
  area: number;
  capacity: number;
  status: "Available" | "Maintenance" | "Full";
  environmentStatus: string;
}

const HabitatModule = () => {
  const router = useRouter();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [habitatToDelete, setHabitatToDelete] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentHabitat, setCurrentHabitat] = useState<Habitat | null>(null);

  // Dummy data for habitats
  const [habitats, setHabitats] = useState<Habitat[]>([
    {
      id: "hab-001",
      name: "Savanna Enclosure",
      type: "Grassland",
      area: 5000,
      capacity: 15,
      status: "Available",
      environmentStatus: "Suhu: 28°C, Kelembapan: 60%, Vegetasi savana",
    },
    {
      id: "hab-002",
      name: "Tropical Rainforest",
      type: "Forest",
      area: 8000,
      capacity: 25,
      status: "Full",
      environmentStatus: "Suhu: 30°C, Kelembapan: 85%, Vegetasi lebat",
    },
    {
      id: "hab-003",
      name: "Arctic Zone",
      type: "Tundra",
      area: 4000,
      capacity: 10,
      status: "Available",
      environmentStatus: "Suhu: -5°C, Kelembapan: 40%, Es dan salju",
    },
    {
      id: "hab-004",
      name: "Desert Exhibit",
      type: "Desert",
      area: 3500,
      capacity: 12,
      status: "Maintenance",
      environmentStatus: "Suhu: 35°C, Kelembapan: 20%, Pasir dan kaktus",
    },
    {
      id: "hab-005",
      name: "Aquatic Center",
      type: "Aquatic",
      area: 6000,
      capacity: 30,
      status: "Available",
      environmentStatus: "Suhu air: 25°C, pH: 7.5, Terumbu karang",
    },
  ]);

  // Function to handle view details
  const handleViewDetails = (id: string) => {
    router.push(`/habitat/${id}`);
  };

  // Function to handle edit click
  const handleEditClick = (habitat: Habitat) => {
    setCurrentHabitat(habitat);
    setIsEditModalOpen(true);
  };

  // Function to show delete confirmation
  const handleDeleteClick = (id: string) => {
    setHabitatToDelete(id);
    setShowDeleteAlert(true);
  };

  // Function to handle actual delete action
  const handleDelete = () => {
    if (habitatToDelete) {
      setHabitats(habitats.filter((habitat) => habitat.id !== habitatToDelete));
      console.log(`Delete habitat with ID: ${habitatToDelete}`);
    }
    setShowDeleteAlert(false);
    setHabitatToDelete(null);
  };

  // Function to handle adding a new habitat
  const handleAddHabitat = (data: HabitatFormValues) => {
    const newHabitat: Habitat = {
      id: `hab-${Math.floor(Math.random() * 1000)}`,
      name: data.name,
      type: "New",
      area: parseInt(data.area),
      capacity: parseInt(data.capacity),
      status: "Available",
      environmentStatus: data.environmentStatus,
    };

    setHabitats([...habitats, newHabitat]);
    console.log("Added new habitat:", newHabitat);
  };

  // Function to handle editing a habitat
  const handleEditHabitat = (data: HabitatFormValues) => {
    if (currentHabitat) {
      const updatedHabitats = habitats.map((habitat) => {
        if (habitat.id === currentHabitat.id) {
          return {
            ...habitat,
            name: data.name,
            area: parseInt(data.area),
            capacity: parseInt(data.capacity),
            environmentStatus: data.environmentStatus,
          };
        }
        return habitat;
      });

      setHabitats(updatedHabitats);
      console.log("Updated habitat:", currentHabitat.id);
    }
  };

  // Function to get status badge color
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

  return (
    <div className="container mx-auto pb-20 px-4">
      <h1 className="mb-10 text-4xl font-bold"> Manajemen Habitat</h1>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-h3 font-bold text-foreground">
            Daftar Habitat
          </CardTitle>
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => setIsAddModalOpen(true)}
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Habitat
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Nama</TableHead>
                  <TableHead>Habitat</TableHead>
                  <TableHead className="text-right">Luas (m²)</TableHead>
                  <TableHead className="text-right">Kapasitas</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {habitats.map((habitat) => (
                  <TableRow key={habitat.id}>
                    <TableCell className="font-medium">
                      {habitat.name}
                    </TableCell>
                    <TableCell>{habitat.type}</TableCell>
                    <TableCell className="text-right">
                      {habitat.area.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {habitat.capacity}
                    </TableCell>
                    <TableCell>{getStatusBadge(habitat.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleViewDetails(habitat.id)}
                          className="h-8 w-8"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEditClick(habitat)}
                          className="h-8 w-8"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeleteClick(habitat.id)}
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Habitat Modal */}
      <HabitatFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddHabitat}
        isEditing={false}
      />

      {/* Edit Habitat Modal */}
      {currentHabitat && (
        <HabitatFormModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setCurrentHabitat(null);
          }}
          onSubmit={handleEditHabitat}
          initialData={{
            name: currentHabitat.name,
            area: currentHabitat.area,
            capacity: currentHabitat.capacity,
            environmentStatus: currentHabitat.environmentStatus,
          }}
          isEditing={true}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data habitat dan semua hewan
              yang terkait akan dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default HabitatModule;
