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
import { CalendarIcon, Check } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const editFormSchema = z.object({
  jadwal: z.date({
    required_error: "Jadwal atraksi harus diisi",
  }),
  kapasitas: z
    .number({
      required_error: "Kapasitas harus diisi",
    })
    .min(1, "Kapasitas minimal 1 orang")
    .int("Kapasitas harus berupa bilangan bulat"),
});

const createFormSchema = z.object({
  nama_atraksi: z.string().min(1, "Nama atraksi harus diisi"),
  lokasi: z.string().min(1, "Lokasi harus diisi"),
  kapasitas: z
    .number({
      required_error: "Kapasitas harus diisi",
    })
    .min(1, "Kapasitas minimal 1 orang")
    .int("Kapasitas harus berupa bilangan bulat"),
  pelatih_id: z.string().min(1, "Pelatih harus dipilih"),
  jadwal: z.date({
    required_error: "Jadwal atraksi harus diisi",
  }),
  hewan_ids: z.array(z.string()).min(1, "Minimal satu hewan harus dipilih"),
});

export type EditAtraksiFormValues = z.infer<typeof editFormSchema>;
export type CreateAtraksiFormValues = z.infer<typeof createFormSchema>;
export type AtraksiFormValues = EditAtraksiFormValues | CreateAtraksiFormValues;

interface Pelatih {
  id: string;
  name: string;
}

interface Hewan {
  id: string;
  name: string;
  spesies: string;
}

interface AtraksiFormProps {
  onSubmit: (data: any) => void;
  initialValues?: {
    jadwal: Date;
    kapasitas: number;
    nama_atraksi?: string;
    lokasi?: string;
    pelatih_id?: string;
    hewan_ids?: string[];
  };
  isEditing?: boolean;
  nama_atraksi?: string;
  lokasi?: string;
  pelatih?: string;
  hewan_terlibat?: string;

  pelatihList?: Pelatih[];
  hewanList?: Hewan[];
}

const EditAtraksiForm = ({
  onSubmit,
  initialValues,
  nama_atraksi,
  lokasi,
  pelatih,
  hewan_terlibat,
}: {
  onSubmit: (data: EditAtraksiFormValues) => void;
  initialValues: { jadwal: Date; kapasitas: number };
  nama_atraksi?: string;
  lokasi?: string;
  pelatih?: string;
  hewan_terlibat?: string;
}) => {
  const form = useForm<EditAtraksiFormValues>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      jadwal: initialValues?.jadwal || new Date(),
      kapasitas: initialValues?.kapasitas || 100,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormItem>
          <FormLabel>Nama Atraksi</FormLabel>
          <Input value={nama_atraksi || ""} disabled className="bg-muted" />
        </FormItem>

        <FormItem>
          <FormLabel>Lokasi</FormLabel>
          <Input value={lokasi || ""} disabled className="bg-muted" />
        </FormItem>

        <FormItem>
          <FormLabel>Pelatih Pertunjukan</FormLabel>
          <Input value={pelatih || "-"} disabled className="bg-muted" />
        </FormItem>

        <FormItem>
          <FormLabel>Hewan yang Terlibat</FormLabel>
          <Input value={hewan_terlibat || "-"} disabled className="bg-muted" />
        </FormItem>

        <FormField
          control={form.control}
          name="kapasitas"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kapasitas Maksimum</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  placeholder="Contoh: 100"
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
          name="jadwal"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Jadwal Atraksi</FormLabel>
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
                        format(field.value, "PPP HH:mm")
                      ) : (
                        <span>Pilih tanggal dan waktu</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      if (date) {
                        const currentDate = field.value || new Date();
                        date.setHours(currentDate.getHours());
                        date.setMinutes(currentDate.getMinutes());
                        field.onChange(date);
                      }
                    }}
                    initialFocus
                  />
                  <div className="border-t border-border p-3">
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-xs">Waktu</FormLabel>
                      <div className="flex items-center space-x-2">
                        <Input
                          className="w-[4rem]"
                          type="number"
                          min={0}
                          max={23}
                          onChange={(e) => {
                            const date = new Date(field.value || new Date());
                            date.setHours(parseInt(e.target.value) || 0);
                            field.onChange(date);
                          }}
                          value={field.value ? field.value.getHours() : 0}
                        />
                        <span>:</span>
                        <Input
                          className="w-[4rem]"
                          type="number"
                          min={0}
                          max={59}
                          onChange={(e) => {
                            const date = new Date(field.value || new Date());
                            date.setMinutes(parseInt(e.target.value) || 0);
                            field.onChange(date);
                          }}
                          value={field.value ? field.value.getMinutes() : 0}
                        />
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button type="submit" className="bg-primary text-primary-foreground">
            Simpan Perubahan
          </Button>
        </div>
      </form>
    </Form>
  );
};

const CreateAtraksiForm = ({
  onSubmit,
  pelatihList,
  hewanList,
}: {
  onSubmit: (data: CreateAtraksiFormValues) => void;
  pelatihList: Pelatih[];
  hewanList: Hewan[];
}) => {
  const form = useForm<CreateAtraksiFormValues>({
    resolver: zodResolver(createFormSchema),
    defaultValues: {
      nama_atraksi: "",
      lokasi: "",
      kapasitas: 100,
      pelatih_id: "",
      jadwal: new Date(),
      hewan_ids: [],
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nama_atraksi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Atraksi</FormLabel>
              <FormControl>
                <Input
                  placeholder="Contoh: Pertunjukan Lumba-lumba"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lokasi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lokasi</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: Area Akuatik" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pelatih_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pelatih Pertunjukan</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih pelatih" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {pelatihList.map((pelatih) => (
                    <SelectItem key={pelatih.id} value={pelatih.id}>
                      {pelatih.name}
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
          name="hewan_ids"
          render={({ field }) => (
            <FormItem>
              <div className="mb-2">
                <FormLabel>Hewan yang Terlibat</FormLabel>
              </div>
              <div className="space-y-2 max-h-[200px] overflow-y-auto border rounded-md p-2">
                {hewanList.map((hewan) => (
                  <div
                    key={hewan.id}
                    className="flex flex-row items-start space-x-3 space-y-0 py-1"
                  >
                    <Checkbox
                      checked={field.value?.includes(hewan.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          field.onChange([...field.value, hewan.id]);
                        } else {
                          field.onChange(
                            field.value?.filter((value) => value !== hewan.id)
                          );
                        }
                      }}
                      id={`hewan-${hewan.id}`}
                    />
                    <label
                      htmlFor={`hewan-${hewan.id}`}
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {hewan.name || "Tanpa nama"} ({hewan.spesies})
                    </label>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="kapasitas"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kapasitas Maksimum</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  placeholder="Contoh: 100"
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
          name="jadwal"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Jadwal Atraksi</FormLabel>
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
                        format(field.value, "PPP HH:mm")
                      ) : (
                        <span>Pilih tanggal dan waktu</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      if (date) {
                        const currentDate = field.value || new Date();
                        date.setHours(currentDate.getHours());
                        date.setMinutes(currentDate.getMinutes());
                        field.onChange(date);
                      }
                    }}
                    initialFocus
                  />
                  <div className="border-t border-border p-3">
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-xs">Waktu</FormLabel>
                      <div className="flex items-center space-x-2">
                        <Input
                          className="w-[4rem]"
                          type="number"
                          min={0}
                          max={23}
                          onChange={(e) => {
                            const date = new Date(field.value || new Date());
                            date.setHours(parseInt(e.target.value) || 0);
                            field.onChange(date);
                          }}
                          value={field.value ? field.value.getHours() : 0}
                        />
                        <span>:</span>
                        <Input
                          className="w-[4rem]"
                          type="number"
                          min={0}
                          max={59}
                          onChange={(e) => {
                            const date = new Date(field.value || new Date());
                            date.setMinutes(parseInt(e.target.value) || 0);
                            field.onChange(date);
                          }}
                          value={field.value ? field.value.getMinutes() : 0}
                        />
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button type="submit" className="bg-primary text-primary-foreground">
            Tambah Atraksi
          </Button>
        </div>
      </form>
    </Form>
  );
};

export const AtraksiForm: React.FC<AtraksiFormProps> = ({
  onSubmit,
  initialValues,
  isEditing = false,
  nama_atraksi,
  lokasi,
  pelatih,
  hewan_terlibat,
  pelatihList = [],
  hewanList = [],
}) => {
  if (isEditing) {
    return (
      <EditAtraksiForm
        onSubmit={onSubmit}
        initialValues={initialValues as { jadwal: Date; kapasitas: number }}
        nama_atraksi={nama_atraksi}
        lokasi={lokasi}
        pelatih={pelatih}
        hewan_terlibat={hewan_terlibat}
      />
    );
  }

  return (
    <CreateAtraksiForm
      onSubmit={onSubmit}
      pelatihList={pelatihList}
      hewanList={hewanList}
    />
  );
};
