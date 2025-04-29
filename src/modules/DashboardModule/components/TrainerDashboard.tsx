import React from "react";
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

interface TrainerDashboardProps {
  userData: TrainerData;
}

// Dummy data based on the schema provided
const assignmentSchedules = [
  {
    username_lh: "johndoe",
    tgl_penugasan: new Date("2025-05-15T10:00:00"),
    nama_atraksi: "Dolphin Show",
    lokasi: "Aquatic Center",
    status: "Scheduled",
  },
  {
    username_lh: "johndoe",
    tgl_penugasan: new Date("2025-05-15T14:30:00"),
    nama_atraksi: "Safari Adventure",
    lokasi: "Savanna Area",
    status: "Scheduled",
  },
  {
    username_lh: "johndoe",
    tgl_penugasan: new Date("2025-05-16T11:00:00"),
    nama_atraksi: "Lion Feeding Show",
    lokasi: "Predator Zone",
    status: "Scheduled",
  },
];

// Animals participating in the trainer's attractions (based on BERPARTISIPASI and HEWAN)
const trainedAnimals = [
  {
    id: "550e8400-e29b-41d4-a716-446655440000",
    nama: "Flipper",
    spesies: "Bottlenose Dolphin",
    status_kesehatan: "Healthy",
    nama_atraksi: "Dolphin Show",
    last_trained: new Date("2025-05-14T09:30:00"),
    training_level: "Expert",
    url_foto: "/animals/dolphin.jpg",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    nama: "Simba",
    spesies: "African Lion",
    status_kesehatan: "Healthy",
    nama_atraksi: "Safari Adventure",
    last_trained: new Date("2025-05-14T13:45:00"),
    training_level: "Advanced",
    url_foto: "/animals/lion.jpg",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    nama: "Raja",
    spesies: "Bengal Tiger",
    status_kesehatan: "Minor Injury",
    nama_atraksi: "Safari Adventure",
    last_trained: new Date("2025-05-13T11:15:00"),
    training_level: "Intermediate",
    url_foto: "/animals/tiger.jpg",
  },
];

// Training status records (this would be a custom view or join of multiple tables)
const trainingStatuses = [
  {
    id: "tr-001",
    id_hewan: "550e8400-e29b-41d4-a716-446655440001",
    animal_name: "Simba",
    date: new Date("2025-05-14T13:45:00"),
    status: "Completed",
    notes: "Successfully performed jumping routine",
  },
  {
    id: "tr-002",
    id_hewan: "550e8400-e29b-41d4-a716-446655440000",
    animal_name: "Flipper",
    date: new Date("2025-05-14T09:30:00"),
    status: "Completed",
    notes: "New flipping technique introduced",
  },
  {
    id: "tr-003",
    id_hewan: "550e8400-e29b-41d4-a716-446655440002",
    animal_name: "Raja",
    date: new Date("2025-05-13T11:15:00"),
    status: "In Progress",
    notes: "Working on new balancing act",
  },
];

const TrainerDashboard: React.FC<TrainerDashboardProps> = ({ userData }) => {
  const formatTime = (date: Date) => {
    return format(date, "HH:mm");
  };

  const formatDate = (date: Date) => {
    return format(date, "dd MMM yyyy");
  };

  const formatDateTime = (date: Date) => {
    return format(date, "dd MMM yyyy, HH:mm");
  };

  // Filter today's shows
  const today = new Date();
  const todayShows = assignmentSchedules.filter(
    (show) => show.tgl_penugasan.toDateString() === today.toDateString()
  );

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Today's Shows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayShows.length}</div>
            <p className="text-xs text-muted-foreground">
              {todayShows.length > 0
                ? `Next show at ${formatTime(todayShows[0].tgl_penugasan)}`
                : "No shows scheduled today"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Animals Trained
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trainedAnimals.length}</div>
            <p className="text-xs text-muted-foreground">
              Multiple species under training
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Trainings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                trainingStatuses.filter(
                  (status) => status.status === "Completed"
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Out of {trainingStatuses.length} training sessions
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mb-4">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Show Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Attraction Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Date & Time</TableHead>
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
                          <Badge className="bg-green-500">{show.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        No shows scheduled
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
            <CardTitle>Animals Under Training</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Animal</TableHead>
                    <TableHead>Species</TableHead>
                    <TableHead>Show</TableHead>
                    <TableHead>Health Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trainedAnimals.map((animal) => (
                    <TableRow key={animal.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage
                              src={animal.url_foto}
                              alt={animal.nama}
                            />
                            <AvatarFallback>
                              {animal.nama.charAt(0)}
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
                            animal.status_kesehatan === "Healthy"
                              ? "bg-green-500"
                              : "bg-yellow-500"
                          }
                        >
                          {animal.status_kesehatan}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Latest Training Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Animal</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trainingStatuses.map((status) => (
                  <TableRow key={status.id}>
                    <TableCell className="font-medium">
                      {status.animal_name}
                    </TableCell>
                    <TableCell>{formatDateTime(status.date)}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          status.status === "Completed"
                            ? "bg-green-500"
                            : "bg-blue-500"
                        }
                      >
                        {status.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{status.notes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default TrainerDashboard;
