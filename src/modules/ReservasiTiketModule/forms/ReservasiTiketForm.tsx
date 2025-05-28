import React, { useEffect, useState } from "react";
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
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// Schema for form validation
const reservasiFormSchema = z.object({
  nama_fasilitas: z.string({
    required_error: "Pilih atraksi",
  }),
  tanggal_kunjungan: z.date({
    required_error: "Pilih tanggal kunjungan",
  }),
  jumlah_tiket: z
    .number({
      required_error: "Jumlah tiket harus diisi",
    })
    .min(1, "Minimal pembelian 1 tiket")
    .int("Jumlah tiket harus berupa bilangan bulat"),
});

// Define types
type ReservasiFormValues = z.infer<typeof reservasiFormSchema>;

interface ReservasiFormData {
  nama_fasilitas: string;
  nama_atraksi?: string;
  lokasi?: string;
  jadwal?: string;
  tanggal_kunjungan: Date;
  jumlah_tiket: number;
}

interface Atraksi {
  nama_atraksi: string;
  lokasi: string;
  fasilitas: {
    jadwal: Date | string; // Accept both Date and string
    kapasitas_tersedia: number;
    kapasitas_max: number;
  };
}

interface ReservasiTiketFormProps {
  onSubmit: (data: ReservasiFormData) => void;
  attraction: {
    nama_atraksi: string;
    lokasi: string;
    fasilitas: {
      jadwal: Date | string; // Accept both Date and string
      kapasitas_tersedia: number;
      kapasitas_max: number;
    };
  };
  isEditing?: boolean;
  initialData?: {
    tanggal_kunjungan: Date;
    jumlah_tiket: number;
  };
}

// Add this helper function at the top of the file
const getFormattedTime = (jadwal: Date | string): string => {
  if (typeof jadwal === "string") {
    return jadwal;
  }
  return format(jadwal, "HH:mm");
};

export const ReservasiTiketForm: React.FC<ReservasiTiketFormProps> = ({
  onSubmit,
  attraction,
  isEditing = false,
  initialData,
}) => {
  const form = useForm<ReservasiFormValues>({
    resolver: zodResolver(reservasiFormSchema),
    defaultValues: {
      nama_fasilitas: attraction.nama_atraksi,
      tanggal_kunjungan: initialData?.tanggal_kunjungan || new Date(),
      jumlah_tiket: initialData?.jumlah_tiket || 1,
    },
  });

  const handleFormSubmit = (values: ReservasiFormValues) => {
    const formattedJadwal = format(attraction.fasilitas.jadwal, "HH:mm");

    onSubmit({
      nama_fasilitas: values.nama_fasilitas,
      nama_atraksi: attraction.nama_atraksi,
      lokasi: attraction.lokasi,
      jadwal: formattedJadwal,
      tanggal_kunjungan: values.tanggal_kunjungan,
      jumlah_tiket: values.jumlah_tiket,
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="nama_fasilitas"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Atraksi</FormLabel>
              <Input
                value={attraction.nama_atraksi}
                disabled
                className="bg-muted"
              />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4">
          <FormItem>
            <FormLabel>Lokasi</FormLabel>
            <Input value={attraction.lokasi} disabled className="bg-muted" />
          </FormItem>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <FormItem>
            <FormLabel>Jam</FormLabel>
            <Input
              value={getFormattedTime(attraction.fasilitas.jadwal)}
              disabled
              className="bg-muted"
            />
          </FormItem>
        </div>

        <FormField
          control={form.control}
          name="tanggal_kunjungan"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Tanggal</FormLabel>
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
                        format(field.value, "dd MMMM yyyy")
                      ) : (
                        <span>Pilih tanggal</span>
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
                      date < new Date() ||
                      date >
                        new Date(new Date().setMonth(new Date().getMonth() + 3))
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
          name="jumlah_tiket"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jumlah tiket yang ingin dibeli</FormLabel>
              <FormControl>
                <div className="flex items-center">
                  <Input
                    type="number"
                    min={1}
                    max={
                      isEditing
                        ? attraction.fasilitas.kapasitas_tersedia +
                          (initialData?.jumlah_tiket || 0)
                        : attraction.fasilitas.kapasitas_tersedia
                    }
                    placeholder="Contoh: 2"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                  <span className="ml-2">tiket</span>
                </div>
              </FormControl>
              <p className="text-xs text-muted-foreground">
                Tersedia:{" "}
                {isEditing
                  ? attraction.fasilitas.kapasitas_tersedia +
                    (initialData?.jumlah_tiket || 0)
                  : attraction.fasilitas.kapasitas_tersedia}{" "}
                tiket
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            BATAL
          </Button>
          <Button type="submit" className="bg-primary text-primary-foreground">
            SIMPAN
          </Button>
        </div>
      </form>
    </Form>
  );
};
