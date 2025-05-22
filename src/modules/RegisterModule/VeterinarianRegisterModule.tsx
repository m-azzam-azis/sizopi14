"use client";

import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import BaseRegisterForm from "./components/BaseRegisterForm";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { mapToBackendPayload } from "./components/BaseRegisterForm";

const specializations = [
  { id: "large-mammals", label: "Large Mammals" },
  { id: "reptiles", label: "Reptiles" },
  { id: "exotic-birds", label: "Exotic Birds" },
  { id: "primates", label: "Primates" },
  { id: "other", label: "Other" },
];

const vetExtraSchema = z.object({
  certificationNumber: z.string().min(1, "Certification number is required"),
  specializations: z
    .array(z.string())
    .min(1, "Select at least one specialization"),
  otherSpecialization: z.string().optional(),
});

export const VeterinarianRegisterModule: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>([]);
  const [showOtherField, setShowOtherField] = useState(false);

  useEffect(() => {
    setShowOtherField(selectedSpecs.includes("other"));
  }, [selectedSpecs]);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);

    try {
      const payload = {
        ...mapToBackendPayload(data, "veterinarian"),
        no_str: data.certificationNumber,
      };

      const res = await fetch("/api/auth/register/veterinarian", {
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
    } finally {
      setIsLoading(false);
    }
  };

  const extraFields = (
    <>
      <FormField
        name="certificationNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Professional Certification Number</FormLabel>
            <FormControl>
              <Input placeholder="STR-12345" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="specializations"
        render={() => (
          <FormItem>
            <FormLabel>Specializations</FormLabel>
            <div className="space-y-2">
              {specializations.map((spec) => (
                <FormItem
                  key={spec.id}
                  className="flex flex-row items-start space-x-3 space-y-0"
                >
                  <FormControl>
                    <Checkbox
                      checked={selectedSpecs.includes(spec.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedSpecs([...selectedSpecs, spec.id]);
                        } else {
                          setSelectedSpecs(
                            selectedSpecs.filter((s) => s !== spec.id)
                          );
                        }
                      }}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">{spec.label}</FormLabel>
                </FormItem>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {showOtherField && (
        <FormField
          name="otherSpecialization"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Other Specialization</FormLabel>
              <FormControl>
                <Input placeholder="Specify other specialization" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );

  return (
    <BaseRegisterForm
      onSubmit={handleSubmit}
      title="Register as Veterinarian"
      description="Create your veterinarian account to manage animal healthcare"
      extraFields={extraFields}
      extraSchema={vetExtraSchema}
      isLoading={isLoading}
    />
  );
};

export default VeterinarianRegisterModule;
