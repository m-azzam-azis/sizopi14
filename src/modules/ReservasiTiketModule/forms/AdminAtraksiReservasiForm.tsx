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
import { ReservationStatus, ReservasiTiketAtraksi } from "@/types/schema";

const adminAtraksiReservasiFormSchema = z.object({
  tanggal_kunjungan: z.date({
    required_error: "Tanggal harus diisi",
  }),
  jumlah_tiket: z
    .number({
      required_error: "Jumlah tiket harus diisi",
    })
    .min(1, "Minimal pembelian 1 tiket")
    .int("Jumlah tiket harus berupa bilangan bulat"),
  status: z.enum(["Terjadwal", "Dibatalkan"], {
    required_error: "Status harus diisi",
  }) as z.ZodEnum<[ReservationStatus, ReservationStatus]>,
});

type AdminAtraksiReservasiFormValues = z.infer<
  typeof adminAtraksiReservasiFormSchema
>;

interface AdminAtraksiReservasiFormProps {
  onSubmit: (data: AdminAtraksiReservasiFormValues) => void;
  initialData: ReservasiTiketAtraksi;
}

const AdminAtraksiReservasiForm = ({
  onSubmit,
  initialData,
}: AdminAtraksiReservasiFormProps) => {
  const form = useForm<AdminAtraksiReservasiFormValues>({
    resolver: zodResolver(adminAtraksiReservasiFormSchema),
    defaultValues: {
      tanggal_kunjungan: initialData?.tanggal_kunjungan || new Date(),
      jumlah_tiket: initialData?.jumlah_tiket || 1,
      status: initialData?.status || "Terjadwal",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <FormItem>
            <FormLabel>Nama Atraksi</FormLabel>
            <Input
              value={initialData.nama_fasilitas}
              disabled
              className="bg-muted"
            />
          </FormItem>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <FormItem>
            <FormLabel>Lokasi</FormLabel>
            <Input value={initialData.lokasi} disabled className="bg-muted" />
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
                <Input
                  type="number"
                  min={1}
                  placeholder="Contoh: 2"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Terjadwal">Terjadwal</SelectItem>
                  <SelectItem value="Dibatalkan">Dibatalkan</SelectItem>
                </SelectContent>
              </Select>
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

export default AdminAtraksiReservasiForm;
