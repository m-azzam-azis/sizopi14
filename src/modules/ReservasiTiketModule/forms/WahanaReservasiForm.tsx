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
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const wahanaReservasiFormSchema = z.object({
  nama_fasilitas: z.string({
    required_error: "Pilih wahana",
  }),
  jumlah_tiket: z
    .number({
      required_error: "Jumlah tiket harus diisi",
    })
    .min(1, "Minimal pembelian 1 tiket")
    .int("Jumlah tiket harus berupa bilangan bulat"),
  tanggal_kunjungan: z.date({
    required_error: "Pilih tanggal kunjungan",
  }),
});

type WahanaReservasiFormValues = z.infer<typeof wahanaReservasiFormSchema>;

interface WahanaReservasiFormData {
  nama_fasilitas: string;
  tanggal_kunjungan: Date;
  jumlah_tiket: number;
}

interface WahanaReservasiFormProps {
  onSubmit: (data: WahanaReservasiFormData) => void;
  ride: {
    nama_wahana: string;
    peraturan: string[];
    fasilitas: {
      jadwal: Date | string;
      kapasitas_tersedia: number;
      kapasitas_max: number;
    };
  };
  isEditing?: boolean;
  initialData?: {
    tanggal_kunjungan: Date;
    jumlah_tiket: number;
  };
  selectedDate: Date;
}

const getFormattedTime = (jadwal: Date | string): string => {
  if (typeof jadwal === "string") {
    return jadwal;
  }
  return format(jadwal, "HH:mm");
};

export const WahanaReservasiForm: React.FC<WahanaReservasiFormProps> = ({
  onSubmit,
  ride,
  isEditing = false,
  initialData,
  selectedDate,
}) => {
  const form = useForm<WahanaReservasiFormValues>({
    resolver: zodResolver(wahanaReservasiFormSchema),
    defaultValues: {
      nama_fasilitas: ride.nama_wahana,
      jumlah_tiket: initialData?.jumlah_tiket || 1,
      tanggal_kunjungan: initialData?.tanggal_kunjungan || selectedDate,
    },
  });

  const handleFormSubmit = (values: WahanaReservasiFormValues) => {
    onSubmit({
      nama_fasilitas: values.nama_fasilitas,
      tanggal_kunjungan: isEditing ? values.tanggal_kunjungan : selectedDate,
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
          render={
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            ({ field: _ }) => (
              <FormItem>
                <FormLabel>Nama Wahana</FormLabel>
                <Input value={ride.nama_wahana} disabled className="bg-muted" />
              </FormItem>
            )
          }
        />

        <FormItem>
          <FormLabel>Peraturan</FormLabel>
          <div className="bg-muted rounded-md p-3">
            <ul className="list-disc list-inside space-y-1">
              {ride.peraturan.map((rule, index) => (
                <li key={index} className="text-sm">
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        </FormItem>

        <div className="grid grid-cols-1 gap-4">
          <FormItem>
            <FormLabel>Jam</FormLabel>
            <Input
              value={getFormattedTime(ride.fasilitas.jadwal)}
              disabled
              className="bg-muted"
            />
          </FormItem>
        </div>

        {isEditing ? (
          <FormField
            control={form.control}
            name="tanggal_kunjungan"
            render={({ field: renderField }) => (
              <FormItem>
                <FormLabel>Tanggal</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !renderField.value && "text-muted-foreground"
                        )}
                      >
                        {renderField.value ? (
                          format(renderField.value, "dd MMMM yyyy")
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
                      selected={renderField.value}
                      onSelect={renderField.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          /* Show selected date as info when creating new reservation */
          <FormItem>
            <FormLabel>Tanggal Kunjungan</FormLabel>
            <Input
              value={format(selectedDate, "dd MMMM yyyy")}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Tanggal dipilih dari kalender di atas
            </p>
          </FormItem>
        )}

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
                        ? ride.fasilitas.kapasitas_tersedia +
                          (initialData?.jumlah_tiket || 0)
                        : ride.fasilitas.kapasitas_tersedia
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
                  ? ride.fasilitas.kapasitas_tersedia +
                    (initialData?.jumlah_tiket || 0)
                  : ride.fasilitas.kapasitas_tersedia}{" "}
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

export default WahanaReservasiForm;
