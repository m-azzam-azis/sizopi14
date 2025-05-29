"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getUserData } from "@/hooks/getUserData";

import {
  AdminData,
  BaseUserData,
  CaretakerData,
  TrainerData,
  UserRole,
  VeterinarianData,
  VisitorData,
} from "@/types/user";

import ProfileForm from "./components/ProfileForm";
import ProfileRoleSpecificForm from "./components/ProfileRoleSpecificForm";
import PasswordChangeForm from "./components/PasswordChangeForm";

interface ProfileData {
  username: string;
  email: string;
  nama_depan: string;
  nama_tengah: string;
  nama_belakang: string;
  no_telepon: string;
  role: string;
  alamat?: string;
  tgl_lahir?: string;
  no_str?: string;
  nama_spesialisasi?: string[];
  id_staf?: string;
}

const ProfileModule: React.FC = () => {
  const { userData, isValid, isLoading } = getUserData();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [activeTab, setActiveTab] = useState("general");
  const { toast } = useToast();

  // Fetch profile data from API
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!isValid || !userData.username) return;
      
      try {
        const response = await fetch("/api/profile");
        if (response.ok) {
          const data = await response.json();
          setProfileData(data);
        } else {
          console.error("Failed to fetch profile data");
          toast({
            title: "Error",
            description: "Failed to load profile data",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error", 
          description: "Failed to load profile data",

        });
      } finally {
        setLoadingProfile(false);
      }
    };    fetchProfileData();
  }, [isValid, userData.username, toast]);

  // Handle form submission
  const handleProfileUpdate = async (data: any) => {
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama_depan: data.firstName,
          nama_tengah: data.middleName,
          nama_belakang: data.lastName,
          email: data.email,
          no_telepon: data.phoneNumber,
          // Role-specific fields
          ...(data.address && { alamat: data.address }),
          ...(data.birthDate && { tgl_lahir: data.birthDate }),
        }),
      });

      if (response.ok) {
        // Update local state
        if (profileData) {
          const updatedProfile = {
            ...profileData,
            nama_depan: data.firstName,
            nama_tengah: data.middleName,
            nama_belakang: data.lastName,
            email: data.email,
            no_telepon: data.phoneNumber,
            ...(data.address && { alamat: data.address }),
            ...(data.birthDate && { tgl_lahir: data.birthDate }),
          };
          setProfileData(updatedProfile);
        }
          toast({
          title: "Profile updated",
          description: "Your profile information has been updated successfully.",
        });

        // Dispatch custom event to notify navbar about profile update
        window.dispatchEvent(new CustomEvent('profileUpdated'));
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.error || "Failed to update profile",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
      });
    }  };

  // Show loading state
  if (isLoading || loadingProfile || !profileData) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading profile...</span>
        </div>
      </div>
    );
  }

  // Show error if user is not valid
  if (!isValid) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
          <p className="text-gray-600 mt-2">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general">General Information</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and account settings.
              </CardDescription>
            </CardHeader>            <CardContent className="space-y-6">
              {/* Basic Profile Information */}
              <ProfileForm
                user={{
                  username: profileData.username,
                  firstName: profileData.nama_depan,
                  middleName: profileData.nama_tengah || "",
                  lastName: profileData.nama_belakang,
                  email: profileData.email,
                  phoneNumber: profileData.no_telepon,
                }}
                onSubmit={handleProfileUpdate}
              />
              
              {/* Role-specific Information */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Role-specific Information</h3>
                <ProfileRoleSpecificForm
                  user={{
                    id: profileData.username,
                    role: profileData.role as any,
                    // For visitor
                    address: profileData.alamat,
                    birthDate: profileData.tgl_lahir,
                    // For veterinarian
                    certificationNumber: profileData.no_str,
                    specializations: profileData.nama_spesialisasi,
                    // For staff
                    staffId: profileData.id_staf,
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PasswordChangeForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileModule;
