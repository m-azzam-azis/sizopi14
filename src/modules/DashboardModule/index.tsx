"use client";

import React, { useState } from "react";
import { UserRole } from "@/types/user";
import DashboardShell from "./components/DashboardShell";
import AdminDashboard from "./components/AdminDashboard";
import VeterinarianDashboard from "./components/VeterinarianDashboard";
import TrainerDashboard from "./components/TrainerDashboard";
import ReservasiTiketDashboardModule from "../ReservasiTiketModule/Pengunjung/Dashboard";

// Mock user data - aligned with the database schema
const mockUserData = {
  id: "user-123",
  username: "johndoe",
  email: "john.doe@example.com",
  firstName: "John",
  middleName: "",
  lastName: "Doe",
  phoneNumber: "+62123456789",
  role: "trainer" as UserRole, // Change this to test different dashboards

  // Role-specific fields

  // For staffs
  staffId: "STAFF-001",

  // For admin
  todayTicketSales: 156,
  todayVisitors: 420,
  weeklyRevenue: 45000000,

  // For veterinarian
  certificationNumber: "VET-12345",
  specializations: ["Large Mammals", "Reptiles"],
  animalsTreated: 45,

  // For visitor
  alamat: "123 Main St, Cityville",
  tanggalLahir: "1990-01-01",

  // For caretaker
  jumlahHewan: 50,

  // From PELATIH_HEWAN table (if trainer)
  username_lh: "johndoe", // Same as username from PENGGUNA
  id_staf: "550e8400-e29b-41d4-a716-446655440010", // UUID format
};

const DashboardModule: React.FC = () => {
  // This would typically be fetched from an API or auth context
  const [user] = useState(mockUserData);

  // Render different content based on user role
  const renderRoleSpecificContent = () => {
    switch (user.role) {
      case "admin":
        return <AdminDashboard userData={user} />;
      case "veterinarian":
        return <VeterinarianDashboard userData={user} />;
      case "visitor":
        return <ReservasiTiketDashboardModule />;
      case "trainer":
        return <TrainerDashboard userData={user} />;
      case "caretaker":
      default:
        return <p>Welcome to your dashboard!</p>;
    }
  };

  return (
    <DashboardShell
      user={{
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        ...(user.role === "visitor"
          ? { alamat: user.alamat, tanggalLahir: user.tanggalLahir }
          : {}),
        ...(user.role === "caretaker" ||
        user.role === "trainer" ||
        user.role === "admin"
          ? {
              jumlahHewan: user.jumlahHewan,
              staffId: user.staffId,
            }
          : {}),
      }}
      roleSpecificContent={renderRoleSpecificContent()}
    />
  );
};

export default DashboardModule;
