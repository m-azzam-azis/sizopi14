"use client";

import React from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { UserRole } from "@/types/user";
import BaseRegisterForm from "./components/BaseRegisterForm";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Extra schema for all staff types
const staffExtraSchema = z.object({
  staffId: z.string().min(1, "Staff ID is required"),
});

interface StaffRegisterModuleProps {
  role: Extract<UserRole, "admin" | "caretaker" | "trainer">;
  title: string;
  description: string;
}

export const StaffRegisterModule: React.FC<StaffRegisterModuleProps> = ({
  role,
  title,
  description,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = (data: any) => {
    setIsLoading(true);
    console.log(`${role} registration:`, { ...data, role });

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      router.push("/login");
    }, 1000);
  };

  return (
    <BaseRegisterForm
      onSubmit={handleSubmit}
      title={title}
      description={description}
      extraSchema={staffExtraSchema}
      isLoading={isLoading}
    />
  );
};

export default StaffRegisterModule;
