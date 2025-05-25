"use client";

import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import BaseRegisterForm, {
  baseRegisterSchema,
  BaseRegisterFormValues,
  mapToBackendPayload,
} from "./components/BaseRegisterForm";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const visitorExtraSchema = z.object({
  address: z.string().min(1, "Address is required"),
  birthDate: z.date({
    required_error: "Birth date is required",
  }),
});

const visitorRegisterSchema = z
  .object({
    ...baseRegisterSchema._def.schema.shape,
    ...visitorExtraSchema.shape,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type VisitorRegisterFormValues = BaseRegisterFormValues &
  z.infer<typeof visitorExtraSchema>;

export const VisitorRegisterModule: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<VisitorRegisterFormValues>({
    resolver: zodResolver(visitorRegisterSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      middleName: "",
      email: "",
      username: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      address: "",
      birthDate: undefined,
    },
  });

  const handleSubmit = async (data: VisitorRegisterFormValues) => {
    setIsLoading(true);

    try {
      const formattedData = {
        ...data,
        birthDate: data.birthDate
          ? data.birthDate.toISOString().split("T")[0]
          : null,
      };

      const payload = mapToBackendPayload(formattedData, "visitor");

      const res = await fetch("/api/auth/register/visitor", {
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
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-secondary-foreground">
              Full Address
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="Enter your full address"
                className="bg-input/20 border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
              />
            </FormControl>
            <FormMessage className="text-destructive" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="birthDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel className="text-sm font-medium text-secondary-foreground">
              Date of Birth
            </FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "pl-3 text-left font-normal bg-input/20 border-border text-foreground",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP")
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
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage className="text-destructive" />
          </FormItem>
        )}
      />
    </>
  );

  return (
    <BaseRegisterForm
      form={form}
      onSubmit={handleSubmit}
      title="Register as Visitor"
      description="Create your visitor account to purchase tickets and access visitor features"
      extraFields={extraFields}
      isLoading={isLoading}
    />
  );
};

export default VisitorRegisterModule;
