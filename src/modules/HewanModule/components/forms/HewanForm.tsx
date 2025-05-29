"use client";

import React, { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Define the form schema using zod
const hewanFormSchema = z.object({
  nama: z.string().min(1, "Nama hewan harus diisi"),
  spesies: z.string().min(1, "Spesies harus diisi"),
  asal_hewan: z.string().min(1, "Asal hewan harus diisi"),
  tanggal_lahir: z.date().optional(),
  status_kesehatan: z.string().min(1, "Status kesehatan harus diisi"),
  nama_habitat: z.string().min(1, "Habitat harus dipilih"),
  url_foto: z.string().url("URL foto harus valid").optional(),
});

export type HewanFormValues = z.infer<typeof hewanFormSchema>;

interface HewanFormProps {
  onSubmit: (data: HewanFormValues) => void;
  initialData?: Partial<HewanFormValues>;
  isEditing?: boolean;
}

const statusKesehatanOptions = [
  "Sehat",
  "Sedang Sakit",
  "Dalam Perawatan",
  "Pemulihan",
];

const HewanForm: React.FC<HewanFormProps> = ({
  onSubmit,
  initialData,
  isEditing = false,
}) => {
  const [habitats, setHabitats] = useState<{ nama: string }[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch habitats for the dropdown
  useEffect(() => {
    const fetchHabitats = async () => {
      try {
        const response = await fetch("/api/habitat");
        const result = await response.json();
        if (result.success) {
          setHabitats(result.data);
        }
      } catch (error) {
        console.error("Error fetching habitats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHabitats();
  }, []);

  const form = useForm<HewanFormValues>({
    resolver: zodResolver(hewanFormSchema),
    defaultValues: {
      nama: initialData?.nama || "",
      spesies: initialData?.spesies || "",
      asal_hewan: initialData?.asal_hewan || "",
      tanggal_lahir: initialData?.tanggal_lahir
        ? new Date(initialData.tanggal_lahir)
        : undefined,
      status_kesehatan: initialData?.status_kesehatan || "",
      nama_habitat: initialData?.nama_habitat || "",
      url_foto: initialData?.url_foto || "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nama"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Hewan</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan nama hewan" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="spesies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Spesies</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan spesies hewan" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="asal_hewan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Asal Hewan</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan asal hewan" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tanggal_lahir"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Tanggal Lahir</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pilih tanggal lahir</span>
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
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status_kesehatan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status Kesehatan</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status kesehatan" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {statusKesehatanOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nama_habitat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Habitat</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih habitat" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {loading ? (
                    <SelectItem value="loading" disabled>
                      Loading habitats...
                    </SelectItem>
                  ) : (
                    habitats.map((habitat) => (
                      <SelectItem key={habitat.nama} value={habitat.nama}>
                        {habitat.nama}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="url_foto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL Foto </FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/photo.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {isEditing ? "Update Hewan" : "Tambah Hewan"}
        </Button>
      </form>
    </Form>
  );
};

export default HewanForm;
