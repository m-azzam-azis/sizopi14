"use client";

import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import BaseRegisterForm, {
  baseRegisterSchema,
  BaseRegisterFormValues,
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

// Extra schema for visitor-specific fields
const visitorExtraSchema = z.object({
  address: z.string().min(1, "Address is required"),
  birthDate: z.date({
    required_error: "Birth date is required",
  }),
});

type VisitorRegisterFormValues = z.infer<typeof visitorExtraSchema>;

export const VisitorRegisterModule: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<VisitorRegisterFormValues>({
    resolver: zodResolver(visitorExtraSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      address: "",
    },
  });

  const handleSubmit = async (
    data: BaseRegisterFormValues & { address?: string; birthDate?: Date }
  ) => {
    setIsLoading(true);

    try {
      // In a real app, this would make an API call to register the user
      console.log("Registration submitted:", {
        ...data,
        role: "visitor",
      });

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Registration successful!");
      router.push("/login");
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Additional fields specific to visitors
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
      onSubmit={handleSubmit}
      roleTitle="Register as Visitor"
      roleDescription="Create your visitor account to purchase tickets and access visitor features"
      extraFields={extraFields}
      isLoading={isLoading}
    />
  );
};

export default VisitorRegisterModule;
