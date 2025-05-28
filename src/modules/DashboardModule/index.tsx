"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserRole } from "@/types/user";
import DashboardShell from "./components/DashboardShell";
import AdminDashboard from "./components/AdminDashboard";
import VeterinarianDashboard from "./components/VeterinarianDashboard";
import TrainerDashboard from "./components/TrainerDashboard";
import CaretakerDashboard from "./components/CaretakerDashboard";
import ReservasiTiketVisitorModule from "../ReservasiTiketModule/Visitor";

const DashboardModule: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/profile");
        if (!res.ok) {
          if (res.status === 401) {
            router.push('/login');
            return;
          } 
          throw new Error("Failed to fetch user profile");
        }

        const data = await res.json();
        setUser(data);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

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
        return <ReservasiTiketVisitorModule />;
      case "trainer":
        return <TrainerDashboard userData={user} />;
      case "caretaker":
        return <CaretakerDashboard userData={user} feedingCount={user.feedingCount} />;
      default:
        return <p>Welcome to your dashboard!</p>;
    }
  };

  const formattedUser = {
    firstName: user.firstName || user.nama_depan || '',
    middleName: user.middleName || user.nama_tengah || '',
    lastName: user.lastName || user.nama_belakang || '',
    username: user.username || '',
    email: user.email || '',
    phoneNumber: user.phoneNumber || user.no_telepon || '',
    role: user.role as UserRole,
    staffId: user.staffId || user.id_staf,
  };

  return (
    <DashboardShell
      user={formattedUser}
      roleSpecificContent={renderRoleSpecificContent()}
    />
  );
};

export default DashboardModule;
