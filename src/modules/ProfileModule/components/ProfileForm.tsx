import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useToast } from "@/hooks/use-toast";
import { BaseUserData } from "@/types/user";

// Form schema for basic user information
export const baseProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  middleName: z.string().optional(),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  phoneNumber: z.string().min(1, "Phone number is required"),
});

interface ProfileFormProps {
  user: BaseUserData;
  onSubmit: (data: any) => void;
  extraFields?: React.ReactNode;
  extraSchema?: any;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  user,
  onSubmit,
  extraFields,
  extraSchema,
}) => {
  const { toast } = useToast();

  // Create form schema by combining base and extra schemas
  const formSchema = extraSchema
    ? baseProfileSchema.merge(extraSchema)
    : baseProfileSchema;

  // Initialize form with user data
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName || "",
      email: user.email,
      phoneNumber: user.phoneNumber,
      // Other fields are passed through defaultValues in the parent component
    },
  });

  const handleSubmit = (data: any) => {
    onSubmit(data);
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Username (read-only) */}
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input value={user.username} disabled />
            </FormControl>
          </FormItem>

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* First Name */}
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Last Name */}
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Middle Name */}
          <FormField
            control={form.control}
            name="middleName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Middle Name (Optional)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone Number */}
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Extra fields specific to the user role */}
        {extraFields}

        <Button variant={"default"}>Save Changes</Button>
      </form>
    </Form>
  );
};

export default ProfileForm;
