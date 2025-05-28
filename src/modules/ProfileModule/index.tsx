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
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
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
import PasswordChangeForm from "./components/PasswordChangeForm";

// Specializations options
const specializations = [
  { id: "large-mammals", label: "Large Mammals" },
  { id: "reptiles", label: "Reptiles" },
  { id: "exotic-birds", label: "Exotic Birds" },
  { id: "primates", label: "Primates" },
  { id: "other", label: "Other" },
];

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
    };

    fetchProfileData();
  }, [isValid, userData.username, toast]);

  // Role-specific schemas
  const visitorSchema = z.object({
    address: z.string().min(1, "Address is required"),
    birthDate: z.date({
      required_error: "Birth date is required",
    }),
  });

  const veterinarianSchema = z.object({
    certificationNumber: z.string().min(1, "Certification number is required"),
    specializations: z
      .array(z.string())
      .min(1, "Select at least one specialization"),
  });

  const staffSchema = z.object({
    staffId: z.string().min(1, "Staff ID is required"),
  });
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
    }
  };
  // Get role-specific form fields
  const getRoleSpecificFields = () => {
    if (!profileData) return null;

    switch (profileData.role) {
      case "visitor":
        return (
          <>
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input
                  name="address"
                  defaultValue={profileData.alamat || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            <FormItem className="flex flex-col">
              <FormLabel>Date of Birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !profileData.tgl_lahir && "text-muted-foreground"
                      )}
                    >
                      {profileData.tgl_lahir ? (
                        format(new Date(profileData.tgl_lahir), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={
                      profileData.tgl_lahir ? new Date(profileData.tgl_lahir) : undefined
                    }
                    onSelect={(date) => {
                      if (date && profileData) {
                        setProfileData({
                          ...profileData,
                          tgl_lahir: date.toISOString().split("T")[0],
                        });
                      }
                    }}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          </>
        );      case "veterinarian":
        return (
          <>
            <FormItem>
              <FormLabel>Certification Number (Read Only)</FormLabel>
              <FormControl>
                <Input
                  name="certificationNumber"
                  defaultValue={profileData.no_str || ""}
                  disabled
                />
              </FormControl>
            </FormItem>

            <FormItem>
              <FormLabel>Specializations (Read Only)</FormLabel>
              <div className="space-y-2">
                {specializations.map((spec) => (
                  <div key={spec.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={spec.id}
                      checked={(profileData.nama_spesialisasi || []).includes(spec.label)}
                      disabled
                    />
                    <label
                      htmlFor={spec.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {spec.label}
                    </label>
                  </div>
                ))}
              </div>
            </FormItem>
          </>
        );      case "admin":
      case "caretaker":
      case "trainer":
        return (
          <FormItem>
            <FormLabel>Staff ID (Read Only)</FormLabel>
            <FormControl>
              <Input name="staffId" defaultValue={profileData.id_staf || ""} disabled />
            </FormControl>
          </FormItem>
        );

      default:
        return null;
    }
  };

  // Get role-specific schema
  const getRoleSpecificSchema = () => {
    if (!profileData) return null;

    switch (profileData.role) {
      case "visitor":
        return visitorSchema;
      case "veterinarian":
        return veterinarianSchema;
      case "admin":
      case "caretaker":
      case "trainer":
        return staffSchema;
      default:
        return null;
    }
  };

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
            </CardHeader>            <CardContent>
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
                extraFields={getRoleSpecificFields()}
                extraSchema={getRoleSpecificSchema()}
              />
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
