"use client";

import React, { useState, useEffect } from "react";
import { UserRole } from "@/types/user";
import DashboardShell from "./components/DashboardShell";
import AdminDashboard from "./components/AdminDashboard";
import VeterinarianDashboard from "./components/VeterinarianDashboard";
import TrainerDashboard from "./components/TrainerDashboard";
import ReservasiTiketDashboardModule from "../ReservasiTiketModule/Pengunjung/Dashboard";
import CaretakerDashboard from "./components/CaretakerDashboard";

const DashboardModule: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/profile");
        if (!res.ok) throw new Error("Failed to fetch user profile");
        const data = await res.json();
        setUser(data);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!user) return <div>No user data found.</div>;

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
        return <CaretakerDashboard userData={user} feedingCount={user.feedingCount} />;
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
