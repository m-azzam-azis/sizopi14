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
import { toast } from "sonner";
import { UserRole } from "@/types/user";

const staffFormSchema = z.object({
  staffId: z.string().min(1, "Staff ID is required"),
});

type StaffFormValues = z.infer<typeof staffFormSchema>;

interface StaffProfileFormProps {
  user: {
    staffId?: string;
    role: UserRole;
    [key: string]: any;
  };
}

const getRoleTitle = (role: UserRole): string => {
  switch (role) {
    case "admin":
      return "Administration Staff";
    case "caretaker":
      return "Animal Caretaker";
    case "trainer":
      return "Show Trainer";
    default:
      return "Staff";
  }
};

const StaffProfileForm: React.FC<StaffProfileFormProps> = ({ user }) => {
  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      staffId: user.staffId || "",
    },
  });
  const onSubmit = async (data: StaffFormValues) => {
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_staf: data.staffId,
        }),
      });      if (response.ok) {
        toast.success("Staff profile updated successfully!");
        
        // Dispatch custom event to notify navbar about profile update
        window.dispatchEvent(new CustomEvent('profileUpdated'));
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating staff profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="staffId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{getRoleTitle(user.role)} ID</FormLabel>
              <FormControl>
                <Input {...field} disabled className="bg-muted" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button variant={"default"}>Save Changes</Button>
        </div>
      </form>
    </Form>
  );
};

export default StaffProfileForm;
