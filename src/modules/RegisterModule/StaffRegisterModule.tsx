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
import { toast } from "sonner";
import { mapToBackendPayload } from "./components/BaseRegisterForm";

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

  const handleSubmit = async (data: any) => {
    setIsLoading(true);

    try {
      const payload = {
        ...mapToBackendPayload(data, role),
        id_staf: data.staffId,
      };

      const res = await fetch(`/api/auth/register/${role}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Registration failed");
      }

      toast.success("Registration successful!");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message || "Registration failed. Please try again.");
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BaseRegisterForm
      onSubmit={handleSubmit}
      title={title}
      description={description}
      extraSchema={staffExtraSchema}
      isLoading={isLoading}
      extraFields={
        <FormField
          name="staffId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Staff ID</FormLabel>
              <FormControl>
                <Input placeholder="Enter your staff ID" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      }
    />
  );
};

export default StaffRegisterModule;
