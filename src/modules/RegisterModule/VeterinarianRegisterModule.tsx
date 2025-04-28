"use client";

import React from "react";
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

// Specializations options
const specializations = [
  { id: "large-mammals", label: "Large Mammals" },
  { id: "reptiles", label: "Reptiles" },
  { id: "exotic-birds", label: "Exotic Birds" },
  { id: "primates", label: "Primates" },
  { id: "other", label: "Other" },
];

// Extra schema for veterinarian-specific fields
const vetExtraSchema = z.object({
  certificationNumber: z.string().min(1, "Certification number is required"),
  specializations: z
    .array(z.string())
    .min(1, "Select at least one specialization"),
  otherSpecialization: z.string().optional(),
});

export const VeterinarianRegisterModule: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedSpecs, setSelectedSpecs] = React.useState<string[]>([]);
  const [showOtherField, setShowOtherField] = React.useState(false);

  React.useEffect(() => {
    setShowOtherField(selectedSpecs.includes("other"));
  }, [selectedSpecs]);

  const handleSubmit = (data: any) => {
    setIsLoading(true);
    console.log("Veterinarian registration:", {
      ...data,
      role: "veterinarian",
    });

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      router.push("/login");
    }, 1000);
  };

  // Additional fields specific to veterinarians
  const extraFields = (
    <>
      <FormField
        name="certificationNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Professional Certification Number</FormLabel>
            <FormControl>
              <Input placeholder="VET-12345" {...field} />
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
