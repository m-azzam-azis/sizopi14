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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SatwaFormModal from "@/components/modals/SatwaFormModal";
import { SatwaFormValues } from "@/components/forms/SatwaForm";

// Define interfaces for type safety
interface Animal {
  id: string;
  name: string;
  species: string;
  habitat: string;
  habitatId: string;
  origin: string;
  birthDate: string;
  healthStatus: "Healthy" | "Sick" | "Under Observation" | "Critical";
  photoUrl?: string;
}

interface Habitat {
  id: string;
  name: string;
}

const SatwaModule = () => {
  const router = useRouter();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [animalToDelete, setAnimalToDelete] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentAnimal, setCurrentAnimal] = useState<Animal | null>(null);

  // Dummy habitats data
  const habitats: Habitat[] = [
    { id: "hab-001", name: "Savanna Enclosure" },
    { id: "hab-002", name: "Tropical Rainforest" },
    { id: "hab-003", name: "Arctic Zone" },
    { id: "hab-004", name: "Desert Exhibit" },
    { id: "hab-005", name: "Aquatic Center" },
  ];

  // Dummy data for animals
  const [animals, setAnimals] = useState<Animal[]>([
    {
      id: "ani-101",
      name: "Simba",
      species: "African Lion",
      habitat: "Savanna Enclosure",
      habitatId: "hab-001",
      origin: "Wildlife Conservation Center",
      birthDate: "2018-06-15",
      healthStatus: "Healthy",
      photoUrl:
        "https://images.unsplash.com/photo-1545006398-2cf48043d3f3?q=80&w=400",
    },
    {
      id: "ani-102",
      name: "Zara",
      species: "Plains Zebra",
      habitat: "Savanna Enclosure",
      habitatId: "hab-001",
      origin: "Born in captivity",
      birthDate: "2020-04-22",
      healthStatus: "Healthy",
      photoUrl:
        "https://images.unsplash.com/photo-1549975248-52273875de73?q=80&w=400",
    },
    {
      id: "ani-103",
      name: "Rafiki",
      species: "Giraffe",
      habitat: "Savanna Enclosure",
      habitatId: "hab-001",
      origin: "Animal Sanctuary",
      birthDate: "2019-08-10",
      healthStatus: "Under Observation",
      photoUrl:
        "https://images.unsplash.com/photo-1534567059665-cbcfe2e19af4?q=80&w=400",
    },
    {
      id: "ani-104",
      name: "Pumbaa",
      species: "Warthog",
      habitat: "Savanna Enclosure",
      habitatId: "hab-001",
      origin: "Wildlife Reserve",
      birthDate: "2021-02-28",
      healthStatus: "Sick",
    },
    {
      id: "ani-105",
      name: "Nala",
      species: "African Lion",
      habitat: "Savanna Enclosure",
      habitatId: "hab-001",
      origin: "Wildlife Conservation Center",
      birthDate: "2017-11-05",
      healthStatus: "Healthy",
      photoUrl:
        "https://images.unsplash.com/photo-1534628526458-a8de087b1123?q=80&w=400",
    },
    {
      id: "ani-106",
      name: "Flipper",
      species: "Bottlenose Dolphin",
      habitat: "Aquatic Center",
      habitatId: "hab-005",
      origin: "Ocean Rescue",
      birthDate: "2015-03-12",
      healthStatus: "Healthy",
      photoUrl:
        "https://images.unsplash.com/photo-1607153333879-c174d265f1d2?q=80&w=400",
    },
    {
      id: "ani-107",
      name: "Frost",
      species: "Polar Bear",
      habitat: "Arctic Zone",
      habitatId: "hab-003",
      origin: "Arctic Preservation",
      birthDate: "2016-12-03",
      healthStatus: "Critical",
      photoUrl:
        "https://images.unsplash.com/photo-1461770354136-8f58567b617a?q=80&w=400",
    },
  ]);

  // Function to handle edit click
  const handleEditClick = (animal: Animal) => {
    setCurrentAnimal(animal);
    setIsEditModalOpen(true);
  };

  // Function to show delete confirmation
  const handleDeleteClick = (id: string) => {
    setAnimalToDelete(id);
    setShowDeleteAlert(true);
  };

  // Function to handle actual delete action
  const handleDelete = () => {
    if (animalToDelete) {
      setAnimals(animals.filter((animal) => animal.id !== animalToDelete));
      console.log(`Delete animal with ID: ${animalToDelete}`);
    }
    setShowDeleteAlert(false);
    setAnimalToDelete(null);
  };

  // Function to handle adding a new animal
  const handleAddAnimal = (data: SatwaFormValues) => {
    const newAnimal: Animal = {
      id: `ani-${Math.floor(Math.random() * 1000)}`,
      name: data.name || "",
      species: data.species,
      habitat: habitats.find((h) => h.id === data.habitatId)?.name || "",
      habitatId: data.habitatId,
      origin: data.origin,
      birthDate: data.birthDate
        ? data.birthDate.toISOString().split("T")[0]
        : "",
      healthStatus: data.healthStatus,
      photoUrl: data.photoUrl,
    };

    setAnimals([...animals, newAnimal]);
    console.log("Added new animal:", newAnimal);
  };

  // Function to handle editing an animal
  const handleEditAnimal = (data: SatwaFormValues) => {
    if (currentAnimal) {
      const updatedAnimals = animals.map((animal) => {
        if (animal.id === currentAnimal.id) {
          return {
            ...animal,
            name: data.name || "",
            species: data.species,
            habitat: habitats.find((h) => h.id === data.habitatId)?.name || "",
            habitatId: data.habitatId,
            origin: data.origin,
            birthDate: data.birthDate
              ? data.birthDate.toISOString().split("T")[0]
              : animal.birthDate,
            healthStatus: data.healthStatus,
            photoUrl: data.photoUrl,
          };
        }
        return animal;
      });

      setAnimals(updatedAnimals);
      console.log("Updated animal:", currentAnimal.id);
    }
  };

  // Function to get health status badge
  const getHealthBadge = (status: Animal["healthStatus"]) => {
    switch (status) {
      case "Healthy":
        return (
          <Badge className="bg-success text-success-foreground">Sehat</Badge>
        );
      case "Under Observation":
        return (
          <Badge className="bg-warning text-warning-foreground">
            Dalam Pemantauan
          </Badge>
        );
      case "Sick":
        return (
          <Badge className="bg-destructive/80 text-destructive-foreground">
            Sakit
          </Badge>
        );
      case "Critical":
        return <Badge variant="destructive">Kritis</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-h3 font-bold text-foreground">
            DATA SATWA
          </CardTitle>
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => setIsAddModalOpen(true)}
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Satwa
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Nama Individu</TableHead>
                  <TableHead>Spesies</TableHead>
                  <TableHead>Asal Hewan</TableHead>
                  <TableHead>Tanggal Lahir</TableHead>
                  <TableHead>Status Kesehatan</TableHead>
                  <TableHead>Habitat</TableHead>
                  <TableHead>Foto</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {animals.map((animal) => (
                  <TableRow key={animal.id}>
                    <TableCell className="font-medium">
                      {animal.name || "-"}
                    </TableCell>
                    <TableCell>{animal.species}</TableCell>
                    <TableCell>{animal.origin}</TableCell>
                    <TableCell>
                      {animal.birthDate
                        ? new Date(animal.birthDate).toLocaleDateString(
                            "id-ID",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )
                        : "-"}
                    </TableCell>
                    <TableCell>{getHealthBadge(animal.healthStatus)}</TableCell>
                    <TableCell>{animal.habitat}</TableCell>
                    <TableCell>
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={animal.photoUrl}
                          alt={animal.name || animal.species}
                        />
                        <AvatarFallback>
                          {animal.species.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEditClick(animal)}
                          className="h-8 w-8"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeleteClick(animal.id)}
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

      {/* Add Satwa Modal */}
      <SatwaFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddAnimal}
        habitats={habitats}
        isEditing={false}
      />

      {/* Edit Satwa Modal */}
      {currentAnimal && (
        <SatwaFormModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setCurrentAnimal(null);
          }}
          onSubmit={handleEditAnimal}
          initialData={{
            name: currentAnimal.name,
            species: currentAnimal.species,
            origin: currentAnimal.origin,
            birthDate: currentAnimal.birthDate
              ? new Date(currentAnimal.birthDate)
              : undefined,
            healthStatus: currentAnimal.healthStatus,
            habitatId: currentAnimal.habitatId,
            photoUrl: currentAnimal.photoUrl,
          }}
          habitats={habitats}
          isEditing={true}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data satwa akan dihapus
              secara permanen.
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

export default SatwaModule;
