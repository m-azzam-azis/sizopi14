"use client";

import React, { useState } from "react";
import { UserRole } from "@/types/user";
import DashboardShell from "./components/DashboardShell";
import AdminDashboard from "./components/AdminDashboard";
import VeterinarianDashboard from "./components/VeterinarianDashboard";

// Mock user data - would typically come from an API or auth context
const mockUserData = {
  id: "user-123",
  username: "johndoe",
  email: "john.doe@example.com",
  firstName: "John",
  middleName: "",
  lastName: "Doe",
  phoneNumber: "+62123456789",
  role: "admin" as UserRole, // Change this to test different dashboards

  // Role-specific fields
  // For admin
  staffId: "STAFF-001",
  todayTicketSales: 156,
  todayVisitors: 420,
  weeklyRevenue: 45000000,

  // For veterinarian
  certificationNumber: "VET-12345",
  specializations: ["Large Mammals", "Reptiles"],
  animalsTreated: 45,
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
      // Add more role-specific dashboards as needed
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
      }}
      roleSpecificContent={renderRoleSpecificContent()}
    />
  );
};

export default DashboardModule;
