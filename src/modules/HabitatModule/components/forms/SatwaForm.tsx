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
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// Define the form schema using zod
const satwaFormSchema = z.object({
  name: z.string().optional(),
  species: z.string().min(1, "Spesies harus diisi"),
  origin: z.string().min(1, "Asal hewan harus diisi"),
  birthDate: z.date().optional(),
  healthStatus: z.enum(["Healthy", "Sick", "Under Observation", "Critical"]),
  habitatId: z.string().min(1, "Habitat harus dipilih"),
  photoUrl: z.string().url("URL foto tidak valid").optional(),
});

export type SatwaFormValues = z.infer<typeof satwaFormSchema>;

interface SatwaFormProps {
  initialData?: SatwaFormValues;
  onSubmit: (data: SatwaFormValues) => void;
  habitats: { id: string; name: string }[];
  isEditing?: boolean;
}

export const SatwaForm: React.FC<SatwaFormProps> = ({
  initialData,
  onSubmit,
  habitats,
  isEditing = false,
}) => {
  const form = useForm<SatwaFormValues>({
    resolver: zodResolver(satwaFormSchema),
    defaultValues: initialData || {
      name: "",
      species: "",
      origin: "",
      healthStatus: "Healthy",
      photoUrl: "",
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
              <FormLabel>Nama Individu</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nama satwa (opsional)"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="species"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Spesies</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan spesies satwa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="origin"
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
          name="birthDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Tanggal Lahir</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal bg-white hover:bg-white",
                        !field.value && "ring-accent"
                      )}
                      type="button"
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
                      date > new Date() || date < new Date("1900-01-01")
                    }
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="healthStatus"
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
                  <SelectItem value="Healthy">Sehat</SelectItem>
                  <SelectItem value="Sick">Sakit</SelectItem>
                  <SelectItem value="Under Observation">
                    Dalam Pemantauan
                  </SelectItem>
                  <SelectItem value="Critical">Kritis</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="habitatId"
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
                  {habitats.map((habitat) => (
                    <SelectItem key={habitat.id} value={habitat.id}>
                      {habitat.name}
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
          name="photoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL Foto Satwa</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://example.com/photo.jpg"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="submit" className="bg-primary text-primary-foreground">
            {isEditing ? "Simpan Perubahan" : "Tambah"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
