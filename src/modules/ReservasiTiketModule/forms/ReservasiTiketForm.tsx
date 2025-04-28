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
import { Atraksi, ReservasiFormData } from "@/types/schema";

const reservasiFormSchema = z.object({
  nama_fasilitas: z.string().min(1, "Pilih atraksi"),
  tanggal_kunjungan: z.date({
    required_error: "Tanggal harus diisi",
  }),
  jumlah_tiket: z
    .number({
      required_error: "Jumlah tiket harus diisi",
    })
    .min(1, "Minimal pembelian 1 tiket")
    .max(20, "Maksimal pembelian 20 tiket per transaksi")
    .int("Jumlah tiket harus berupa bilangan bulat"),
});

type ReservasiFormValues = z.infer<typeof reservasiFormSchema>;

interface ReservasiTiketFormProps {
  onSubmit: (data: ReservasiFormData) => void;
  atraksiList: Atraksi[];
  isEditing: boolean;
  initialData?: ReservasiFormData;
}

export const ReservasiTiketForm = ({
  onSubmit,
  atraksiList,
  isEditing,
  initialData,
}: ReservasiTiketFormProps) => {
  const [selectedAtraksiNama, setSelectedAtraksiNama] = useState<string>(
    initialData?.nama_fasilitas || ""
  );
  const [selectedAtraksi, setSelectedAtraksi] = useState<Atraksi | null>(null);

  const availableAtraksi = atraksiList.filter(
    (atraksi) =>
      atraksi.fasilitas.kapasitas_tersedia > 0 ||
      (isEditing && initialData?.nama_fasilitas === atraksi.nama_atraksi)
  );

  const form = useForm<ReservasiFormValues>({
    resolver: zodResolver(reservasiFormSchema),
    defaultValues: {
      nama_fasilitas: initialData?.nama_fasilitas || "",
      tanggal_kunjungan: initialData?.tanggal_kunjungan || new Date(),
      jumlah_tiket: initialData?.jumlah_tiket || 1,
    },
  });

  useEffect(() => {
    if (selectedAtraksiNama) {
      const atraksi = atraksiList.find(
        (a) => a.nama_atraksi === selectedAtraksiNama
      );
      setSelectedAtraksi(atraksi || null);
    } else {
      setSelectedAtraksi(null);
    }
  }, [selectedAtraksiNama, atraksiList]);

  const handleFormSubmit = (values: ReservasiFormValues) => {
    if (!selectedAtraksi) return;

    const formattedJadwal = format(selectedAtraksi.fasilitas.jadwal, "HH:mm");

    onSubmit({
      nama_fasilitas: values.nama_fasilitas,
      nama_atraksi: selectedAtraksi.nama_atraksi,
      lokasi: selectedAtraksi.lokasi,
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
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  setSelectedAtraksiNama(value);
                }}
                defaultValue={field.value}
                disabled={isEditing}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih atraksi" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableAtraksi.map((atraksi) => (
                    <SelectItem
                      key={atraksi.nama_atraksi}
                      value={atraksi.nama_atraksi}
                      disabled={
                        atraksi.fasilitas.kapasitas_tersedia === 0 && !isEditing
                      }
                    >
                      {atraksi.nama_atraksi} (
                      {atraksi.fasilitas.kapasitas_tersedia} tersedia)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedAtraksi && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <FormItem>
                <FormLabel>Lokasi</FormLabel>
                <Input
                  value={selectedAtraksi.lokasi}
                  disabled
                  className="bg-muted"
                />
              </FormItem>
              <FormItem>
                <FormLabel>Jam</FormLabel>
                <Input
                  value={format(selectedAtraksi.fasilitas.jadwal, "HH:mm")}
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
                            format(field.value, "PPP")
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
                            new Date(
                              new Date().setMonth(new Date().getMonth() + 3)
                            )
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
                  <FormLabel>Jumlah Tiket</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <Input
                        type="number"
                        min={1}
                        max={
                          isEditing
                            ? 20
                            : selectedAtraksi.fasilitas.kapasitas_tersedia
                        }
                        placeholder="Contoh: 2"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                      <span className="ml-2">tiket</span>
                    </div>
                  </FormControl>
                  {!isEditing && (
                    <p className="text-xs text-muted-foreground">
                      Tersedia: {selectedAtraksi.fasilitas.kapasitas_tersedia}{" "}
                      tiket
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

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
