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
import { Textarea } from "@/components/ui/textarea";

// Define the form schema using zod
const habitatFormSchema = z.object({
  name: z.string().min(1, "Nama habitat harus diisi"),
  area: z
    .string()
    .min(1, "Luas area harus diisi")
    .refine((value) => !isNaN(Number(value)), {
      message: "Luas area harus berupa angka",
    }),
  capacity: z
    .string()
    .min(1, "Kapasitas harus diisi")
    .refine((value) => !isNaN(Number(value)), {
      message: "Kapasitas harus berupa angka",
    }),
  environmentStatus: z.string().min(1, "Status lingkungan harus diisi"),
});

export type HabitatFormValues = z.infer<typeof habitatFormSchema>;

interface HabitatFormProps {
  initialData?: {
    name: string;
    area: number;
    capacity: number;
    environmentStatus: string;
  };
  onSubmit: (data: HabitatFormValues) => void;
  isEditing?: boolean;
}

export const HabitatForm: React.FC<HabitatFormProps> = ({
  initialData,
  onSubmit,
  isEditing = false,
}) => {
  const form = useForm<HabitatFormValues>({
    resolver: zodResolver(habitatFormSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          area: initialData.area.toString(),
          capacity: initialData.capacity.toString(),
          environmentStatus: initialData.environmentStatus,
        }
      : {
          name: "",
          area: "",
          capacity: "",
          environmentStatus: "",
        },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Habitat</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan nama habitat" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="area"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Luas Area (m²)</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: 5000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kapasitas Maksimal</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: 15" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="environmentStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status Lingkungan</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Contoh: Suhu: 28°C, Kelembapan: 70%, Vegetasi lebat"
                  className="resize-none bg-white"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="submit" className="bg-primary text-primary-foreground">
            {isEditing ? "Simpan Perubahan" : "Tambah Habitat"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
