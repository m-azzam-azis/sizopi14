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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";

const editAtraksiFormSchema = z.object({
  jadwal: z.string({
    required_error: "Jadwal is required",
  }),
  kapasitas: z
    .number({
      required_error: "Kapasitas is required",
    })
    .int()
    .positive(),
});

const createAtraksiSchema = z.object({
  nama_atraksi: z.string().min(1, "Nama atraksi tidak boleh kosong"),
  lokasi: z.string().min(1, "Lokasi tidak boleh kosong"),
  pelatih_id: z.string().optional(),
  hewan_ids: z.array(z.string()).min(1, "Pilih minimal satu hewan"),
  kapasitas: z.number().min(1, "Kapasitas harus lebih dari 0"),
  jadwal: z.string(),
});

export type EditAtraksiFormValues = z.infer<typeof editAtraksiFormSchema>;
export type CreateAtraksiFormValues = z.infer<typeof createAtraksiSchema>;
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
  onSubmit: (data: CreateAtraksiFormValues | EditAtraksiFormValues) => void;
  initialValues?: {
    jadwal: string | Date;
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
  initialValues: { jadwal: string | Date; kapasitas: number };
  nama_atraksi?: string;
  lokasi?: string;
  pelatih?: string;
  hewan_terlibat?: string;
}) => {
  const getInitialJadwalValue = () => {
    if (!initialValues?.jadwal) return "09:00";

    if (typeof initialValues.jadwal === "string") {
      return initialValues.jadwal.substring(0, 5);
    } else {
      return format(initialValues.jadwal, "HH:mm");
    }
  };

  const form = useForm<z.infer<typeof editAtraksiFormSchema>>({
    resolver: zodResolver(editAtraksiFormSchema),
    defaultValues: {
      jadwal: getInitialJadwalValue(),
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
            <FormItem>
              <FormLabel>Jadwal Atraksi</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
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
    resolver: zodResolver(createAtraksiSchema),
    defaultValues: {
      nama_atraksi: "",
      lokasi: "",
      pelatih_id: "",
      hewan_ids: [],
      kapasitas: 100,
      jadwal: "09:00",
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
            <FormItem>
              <FormLabel>Jadwal Atraksi</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
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
        initialValues={
          initialValues as { jadwal: string | Date; kapasitas: number }
        }
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
