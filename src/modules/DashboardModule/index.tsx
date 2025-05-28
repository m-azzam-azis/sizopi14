"use client";

import React, { useState, useEffect } from "react";
import DashboardShell from "./components/DashboardShell";
import AdminDashboard from "./components/AdminDashboard";
import VeterinarianDashboard from "./components/VeterinarianDashboard";
import TrainerDashboard from "./components/TrainerDashboard";
import CaretakerDashboard from "./components/CaretakerDashboard";
import ReservasiTiketVisitorModule from "../ReservasiTiketModule/Visitor";
import { getUserData } from "@/hooks/getUserData";

const DashboardModule: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [feedingCount, setFeedingCount] = useState<number | undefined>(
    undefined
  );
  const [animalsTreated, setAnimalsTreated] = useState<number | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userData } = getUserData();

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      try {
        const profileRes = await fetch("/api/profile");
        if (!profileRes.ok) throw new Error("Failed to fetch user profile");
        const profileData = await profileRes.json();
        setUser(profileData);

        if (profileData.role === "caretaker") {
          const feedingRes = await fetch("/api/feeding-count");
          if (feedingRes.ok) {
            const feedingData = await feedingRes.json();
            setFeedingCount(feedingData.feedingCount);
          }
        }

        if (profileData.role === "veterinarian") {
          const treatedRes = await fetch("/api/hewan-treated");
          if (treatedRes.ok) {
            const treatedData = await treatedRes.json();
            setAnimalsTreated(treatedData.animalsTreated);
          }
        }
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!user) return <div>No user data found.</div>;

  const renderRoleSpecificContent = () => {
    switch (user.role) {
      case "admin":
        return <AdminDashboard userData={user} />;
      case "veterinarian":
        return (
          <VeterinarianDashboard
            userData={user}
            animalsTreated={animalsTreated}
          />
        );
      case "visitor":
        return <ReservasiTiketVisitorModule />;
      case "trainer":
        return <TrainerDashboard userData={user} />;
      case "caretaker":
        return (
          <CaretakerDashboard
            userData={userData}
            feedingCount={feedingCount || user.feedingCount}
          />
        );
      default:
        return <p>Welcome to your dashboard!</p>;
    }
  };

  return (
    <DashboardShell
      user={{
        firstName: userData.nama_depan,
        lastName: userData.nama_belakang,
        username: userData.username,
        email: userData.email,
        phoneNumber: userData.no_telepon,
        role: userData.role,
        ...(userData.role === "visitor"
          ? { alamat: user.alamat, tanggalLahir: user.tanggalLahir }
          : {}),
        ...(userData.role === "caretaker" ||
        userData.role === "trainer" ||
        userData.role === "admin"
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
