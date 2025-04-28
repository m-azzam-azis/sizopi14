"use client";

import React, { useState } from "react";
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
import { CalendarIcon } from "lucide-react";
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

// Mock user data
const userData = {
  id: "user-123",
  username: "johndoe",
  email: "john.doe@example.com",
  firstName: "John",
  middleName: "",
  lastName: "Doe",
  phoneNumber: "+62123456789",
  role: "visitor" as UserRole, // Change this to test different role forms

  // Role-specific fields
  // For visitor
  address: "123 Main Street, City",
  birthDate: "1990-01-01",

  // For veterinarian
  certificationNumber: "VET-12345",
  specializations: ["Large Mammals", "Reptiles"],

  // For staff (admin, caretaker, trainer)
  staffId: "STAFF-54321",
};

const ProfileModule: React.FC = () => {
  const [user, setUser] = useState(userData);
  const [activeTab, setActiveTab] = useState("general");

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
  const handleProfileUpdate = (data: any) => {
    console.log("Updated profile:", data);
    // In a real app, this would send the data to an API
    setUser({ ...user, ...data });
  };

  // Get role-specific form fields
  const getRoleSpecificFields = () => {
    switch (user.role) {
      case "visitor":
        return (
          <>
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input
                  name="address"
                  defaultValue={(user as VisitorData).address}
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
                        !user.birthDate && "text-muted-foreground"
                      )}
                    >
                      {user.birthDate ? (
                        format(new Date(user.birthDate), "PPP")
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
                      user.birthDate ? new Date(user.birthDate) : undefined
                    }
                    onSelect={(date) => {
                      if (date) {
                        setUser({
                          ...user,
                          birthDate: date.toISOString().split("T")[0],
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
        );

      case "veterinarian":
        return (
          <>
            <FormItem>
              <FormLabel>Certification Number (Read Only)</FormLabel>
              <FormControl>
                <Input
                  name="certificationNumber"
                  defaultValue={(user as VeterinarianData).certificationNumber}
                  disabled
                />
              </FormControl>
            </FormItem>

            <FormItem>
              <FormLabel>Specializations</FormLabel>
              <div className="space-y-2">
                {specializations.map((spec) => (
                  <div key={spec.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={spec.id}
                      checked={(
                        user as VeterinarianData
                      ).specializations.includes(spec.label)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          const newSpecs = [
                            ...(user as VeterinarianData).specializations,
                            spec.label,
                          ];
                          setUser({ ...user, specializations: newSpecs });
                        } else {
                          const newSpecs = (
                            user as VeterinarianData
                          ).specializations.filter((s) => s !== spec.label);
                          setUser({ ...user, specializations: newSpecs });
                        }
                      }}
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
        );

      case "admin":
      case "caretaker":
      case "trainer":
        return (
          <FormItem>
            <FormLabel>Staff ID (Read Only)</FormLabel>
            <FormControl>
              <Input name="staffId" defaultValue={user.staffId} disabled />
            </FormControl>
          </FormItem>
        );

      default:
        return null;
    }
  };

  // Get role-specific schema
  const getRoleSpecificSchema = () => {
    switch (user.role) {
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
            </CardHeader>
            <CardContent>
              <ProfileForm
                user={user}
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
