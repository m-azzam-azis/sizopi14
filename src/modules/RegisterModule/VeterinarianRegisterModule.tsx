"use client";

import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import BaseRegisterForm, {
  BaseRegisterFormValues,
  baseRegisterSchema,
} from "./components/BaseRegisterForm";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const VeterinarianRegisterModule: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>([]);

  const [showOtherField, setShowOtherField] = useState(false);

  useEffect(() => {
    setShowOtherField(selectedSpecs.includes("other"));
  }, [selectedSpecs]);

  const [availableSpecializations, setAvailableSpecializations] = useState<
    string[]
  >([]);

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const response = await fetch("/api/specializations");
        const data = await response.json();
        if (data.specializations) {
          setAvailableSpecializations(data.specializations);
        }
      } catch (error) {
        console.error("Failed to fetch specializations:", error);
      }
    };

    fetchSpecializations();
  }, []);

  const specializations = [
    ...availableSpecializations.map((spec) => ({
      id: spec,
      label: spec,
    })),
    { id: "other", label: "Other" },
  ];

  const vetExtraSchema = z.object({
    certificationNumber: z.string().min(1, "Certification number is required"),
    specializations: z
      .array(z.string())
      .min(1, "Select at least one specialization"),
    otherSpecialization: z.string().optional(),
  });

  const vetRegisterSchema = z
    .object({
      ...baseRegisterSchema._def.schema.shape,
      ...vetExtraSchema.shape,
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    });

  type VetRegisterFormValues = BaseRegisterFormValues &
    z.infer<typeof vetExtraSchema>;

  const form = useForm<VetRegisterFormValues>({
    resolver: zodResolver(vetRegisterSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      certificationNumber: "",
      specializations: [],
      otherSpecialization: "",
    },
  });

  const handleSubmit = async (data: VetRegisterFormValues) => {
    setIsLoading(true);

    try {
      const payload = {
        ...mapToBackendPayload(data, "veterinarian"),
        specializations: data.specializations
          .map((spec) => (spec === "other" ? data.otherSpecialization : spec))
          .filter(Boolean),
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
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again.";
      toast.error(errorMessage);
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

                        const currentSpecializations =
                          form.getValues("specializations") || [];
                        if (checked) {
                          form.setValue("specializations", [
                            ...currentSpecializations,
                            spec.id,
                          ]);
                        } else {
                          form.setValue(
                            "specializations",
                            currentSpecializations.filter((s) => s !== spec.id)
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
      form={form}
      onSubmit={handleSubmit}
      title="Register as Veterinarian"
      description="Create your veterinarian account to manage animal healthcare"
      extraFields={extraFields}
      isLoading={isLoading}
    />
  );
};

export default VeterinarianRegisterModule;
