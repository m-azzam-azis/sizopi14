"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { UserRole } from "@/types/user";
import BaseRegisterForm, {
  BaseRegisterFormValues,
} from "./components/BaseRegisterForm";
import { toast } from "sonner";
import { mapToBackendPayload } from "./components/BaseRegisterForm";

interface StaffRegisterModuleProps {
  role: Extract<UserRole, "admin" | "caretaker" | "trainer">;
  title: string;
  description: string;
}

interface StaffRegisterFormValues extends BaseRegisterFormValues {
  staffId?: string;
}

export const StaffRegisterModule: React.FC<StaffRegisterModuleProps> = ({
  role,
  title,
  description,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (data: StaffRegisterFormValues) => {
    setIsLoading(true);

    try {
      const payload = mapToBackendPayload(data, role);

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
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again.";
      toast.error(errorMessage);
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
      isLoading={isLoading}
    />
  );
};

export default StaffRegisterModule;
