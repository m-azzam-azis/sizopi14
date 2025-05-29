import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const specializations = [
  { id: "large_mammals", label: "Large Mammals" },
  { id: "reptiles", label: "Reptiles" },
  { id: "exotic_birds", label: "Exotic Birds" },
  { id: "primates", label: "Primates" },
  { id: "other", label: "Other" },
];

const veterinarianFormSchema = z.object({
  certificationNumber: z.string().min(1, "Certification number is required"),
  specializations: z
    .array(z.string())
    .min(1, "Select at least one specialization"),
  otherSpecialization: z.string().optional(),
});

type VeterinarianFormValues = z.infer<typeof veterinarianFormSchema>;

interface VeterinarianProfileFormProps {
  user: {
    certificationNumber?: string;
    specializations?: string[];
    [key: string]: any;
  };
}

const VeterinarianProfileForm: React.FC<VeterinarianProfileFormProps> = ({
  user,
}) => {
  const hasOtherSpecialization = user.specializations?.some(
    (spec) => !specializations.map((s) => s.label).includes(spec)
  );

  const otherSpecValue = user.specializations?.find(
    (spec) => !specializations.map((s) => s.label).includes(spec)
  );

  const form = useForm<VeterinarianFormValues>({
    resolver: zodResolver(veterinarianFormSchema),
    defaultValues: {
      certificationNumber: user.certificationNumber || "",
      specializations:
        user.specializations?.filter((spec) =>
          specializations.map((s) => s.label).includes(spec)
        ) || [],
      otherSpecialization: otherSpecValue || "",
    },
  });
  const onSubmit = async (data: VeterinarianFormValues) => {
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          no_str: data.certificationNumber,
          // Note: specializations updates would be handled separately if needed
        }),
      });      if (response.ok) {
        toast.success("Veterinarian profile updated successfully!");
        
        // Dispatch custom event to notify navbar about profile update
        window.dispatchEvent(new CustomEvent('profileUpdated'));
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating veterinarian profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const watchedSpecializations = form.watch("specializations");
  const hasOther = watchedSpecializations.includes("other");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="certificationNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Professional Certification Number</FormLabel>
              <FormControl>
                <Input {...field} disabled className="bg-muted" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="specializations"
          render={() => (
            <FormItem>
              <FormLabel>Specializations</FormLabel>
              <div className="space-y-2">
                {specializations.map((specialization) => (
                  <FormField
                    key={specialization.id}
                    control={form.control}
                    name="specializations"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={specialization.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(
                                specialization.label
                              )}
                              onCheckedChange={(checked) => {
                                const updatedSpecializations = checked
                                  ? [...field.value, specialization.label]
                                  : field.value.filter(
                                      (value) => value !== specialization.label
                                    );
                                field.onChange(updatedSpecializations);
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {specialization.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {hasOther && (
          <FormField
            control={form.control}
            name="otherSpecialization"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Other Specialization</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter your specialization" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-end">
          <Button variant={"default"}>Save Changes</Button>
        </div>
      </form>
    </Form>
  );
};

export default VeterinarianProfileForm;
