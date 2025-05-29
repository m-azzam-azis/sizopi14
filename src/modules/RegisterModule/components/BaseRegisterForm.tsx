"use client";

import React, { useState } from "react";
import { z } from "zod";
import { FieldPath, useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Link from "next/link";
import { Eye, EyeOff, ChevronLeft } from "lucide-react";
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

export const baseRegisterSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    middleName: z.string().optional(),
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    phoneNumber: z.string().min(1, "Phone number is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type BaseRegisterFormValues = z.infer<typeof baseRegisterSchema>;

export interface VisitorFormValues extends BaseRegisterFormValues {
  address: string;
  birthDate: string | Date;
}

export interface VeterinarianFormValues extends BaseRegisterFormValues {
  certificationNumber: string;
  specializations?: string[];
  otherSpecialization?: string;
}

export interface StaffFormValues extends BaseRegisterFormValues {
  staffId?: string;
}

function isVisitorForm(
  data: BaseRegisterFormValues
): data is VisitorFormValues {
  return "address" in data && "birthDate" in data;
}

function isVeterinarianForm(
  data: BaseRegisterFormValues
): data is VeterinarianFormValues {
  return "certificationNumber" in data;
}

function isStaffForm(data: BaseRegisterFormValues): data is StaffFormValues {
  return "staffId" in data;
}

export function mapToBackendPayload<T extends BaseRegisterFormValues>(
  data: T,
  role: string
) {
  const base = {
    username: data.username,
    email: data.email,
    password: data.password,
    nama_depan: data.firstName,
    nama_tengah: data.middleName || "",
    nama_belakang: data.lastName,
    no_telepon: data.phoneNumber,
  };

  if (role === "visitor" && isVisitorForm(data)) {
    return {
      ...base,
      alamat: data.address,
      tgl_lahir: data.birthDate,
    };
  }

  if (role === "veterinarian" && isVeterinarianForm(data)) {
    return {
      ...base,
      no_str: data.certificationNumber,
    };
  }

  if (
    (role === "caretaker" || role === "trainer" || role === "admin") &&
    isStaffForm(data)
  ) {
    return {
      ...base,
      id_staf: data.staffId,
    };
  }

  return base;
}

interface BaseRegisterFormProps<
  T extends BaseRegisterFormValues = BaseRegisterFormValues
> {
  onSubmit: (data: T) => void;
  title?: string;
  description?: string;
  extraFields?: React.ReactNode;
  isLoading?: boolean;
  form?: UseFormReturn<T>;
}

function BaseRegisterForm<
  T extends BaseRegisterFormValues = BaseRegisterFormValues
>({
  onSubmit,
  title,
  description,
  extraFields,
  isLoading = false,
  form: externalForm,
}: BaseRegisterFormProps<T>) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const internalForm = useForm<BaseRegisterFormValues>({
    resolver: zodResolver(baseRegisterSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      middleName: "",
      email: "",
      username: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  const form = externalForm || (internalForm as unknown as UseFormReturn<T>);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/30 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl bg-card/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-border"
      >
        <Link
          href="/register"
          className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to role selection
        </Link>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          <p className="text-muted-foreground mt-2">{description}</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name={"firstName" as FieldPath<T>}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={"lastName" as FieldPath<T>}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name={"middleName" as FieldPath<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Middle Name (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Middle name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={"email" as FieldPath<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={"username" as FieldPath<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={"phoneNumber" as FieldPath<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+62xxx" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={"password" as FieldPath<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-0 right-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={"confirmPassword" as FieldPath<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-0 right-0 h-full px-3"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Render any extra fields specific to this role */}
            {extraFields}

            <Button
              variant={"default"}
              className=" px-5 mt-6 bg-primary text-white hover:bg-primary/80 cursor-pointer w-full"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Create Account"}
            </Button>
          </form>
        </Form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary hover:text-primary/80"
          >
            Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default BaseRegisterForm;
