import React, { useState } from "react";
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
import { CalendarIcon, X, Plus } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const editFormSchema = z.object({
  jadwal: z.date({
    required_error: "Jadwal wahana harus diisi",
  }),
  kapasitas: z
    .number({
      required_error: "Kapasitas harus diisi",
    })
    .min(1, "Kapasitas minimal 1 orang")
    .int("Kapasitas harus berupa bilangan bulat"),
});

const createFormSchema = z.object({
  nama_wahana: z.string().min(1, "Nama wahana harus diisi"),
  kapasitas: z
    .number({
      required_error: "Kapasitas harus diisi",
    })
    .min(1, "Kapasitas minimal 1 orang")
    .int("Kapasitas harus berupa bilangan bulat"),
  jadwal: z.date({
    required_error: "Jadwal wahana harus diisi",
  }),
  peraturan: z
    .array(z.string().min(1, "Peraturan tidak boleh kosong"))
    .min(1, "Minimal satu peraturan harus diisi"),
});

export type EditWahanaFormValues = z.infer<typeof editFormSchema>;
export type CreateWahanaFormValues = z.infer<typeof createFormSchema>;
export type WahanaFormValues = EditWahanaFormValues | CreateWahanaFormValues;

const EditWahanaForm = ({
  onSubmit,
  initialValues,
  nama_wahana,
}: {
  onSubmit: (data: EditWahanaFormValues) => void;
  initialValues: { jadwal: Date; kapasitas: number };
  nama_wahana?: string;
}) => {
  const form = useForm<EditWahanaFormValues>({
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
          <FormLabel>Nama Wahana</FormLabel>
          <Input value={nama_wahana || ""} disabled className="bg-muted" />
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
              <FormLabel>Jadwal Wahana</FormLabel>
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

const CreateWahanaForm = ({
  onSubmit,
}: {
  onSubmit: (data: CreateWahanaFormValues) => void;
}) => {
  const form = useForm<CreateWahanaFormValues>({
    resolver: zodResolver(createFormSchema),
    defaultValues: {
      nama_wahana: "",
      kapasitas: 100,
      jadwal: new Date(),
      peraturan: [""],
    },
  });

  const [peraturanValues, setPeraturanValues] = useState<string[]>([""]);
  const [formTouched, setFormTouched] = useState(false);

  const addPeraturan = () => {
    setPeraturanValues([...peraturanValues, ""]);
  };

  const updatePeraturan = (index: number, value: string) => {
    const newValues = [...peraturanValues];
    newValues[index] = value;
    setPeraturanValues(newValues);

    form.setValue("peraturan", newValues);
  };

  const removePeraturan = (index: number) => {
    if (peraturanValues.length > 1) {
      const newValues = [...peraturanValues];
      newValues.splice(index, 1);
      setPeraturanValues(newValues);

      form.setValue("peraturan", newValues);
    }
  };

  React.useEffect(() => {
    form.setValue("peraturan", peraturanValues);
  }, []);

  const handleFormSubmit = (data: CreateWahanaFormValues) => {
    setFormTouched(true);

    const filteredPeraturan = peraturanValues.filter(
      (value) => value.trim() !== ""
    );

    if (filteredPeraturan.length === 0) {
      form.setError("peraturan", {
        type: "manual",
        message: "Minimal satu peraturan harus diisi",
      });
      return;
    }

    const updatedData = {
      ...data,
      peraturan: filteredPeraturan,
    };

    onSubmit(updatedData);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="nama_wahana"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Wahana</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: Taman Air Mini" {...field} />
              </FormControl>
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
              <FormLabel>Jadwal Wahana</FormLabel>
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

        <div>
          <FormLabel>Peraturan</FormLabel>
          <div className="space-y-3 mt-2">
            {peraturanValues.map((value, index) => (
              <div key={index} className="flex items-center gap-2">
                <FormItem className="flex-1 mb-0">
                  <FormControl>
                    <Input
                      placeholder={`Peraturan ${index + 1}`}
                      value={value}
                      onChange={(e) => {
                        updatePeraturan(index, e.target.value);
                        if (!formTouched) setFormTouched(true);
                      }}
                      className={
                        formTouched && value.trim() === ""
                          ? "border-destructive"
                          : ""
                      }
                    />
                  </FormControl>
                  {formTouched && value.trim() === "" && (
                    <p className="text-xs text-destructive mt-1">
                      Peraturan tidak boleh kosong
                    </p>
                  )}
                </FormItem>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => {
                    if (peraturanValues.length > 1) {
                      removePeraturan(index);
                      if (!formTouched) setFormTouched(true);
                    }
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => {
                addPeraturan();
                if (!formTouched) setFormTouched(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Tambah Peraturan
            </Button>
          </div>
          {formTouched && form.formState.errors.peraturan?.root && (
            <p className="text-sm font-medium text-destructive mt-1">
              {form.formState.errors.peraturan.root.message}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="submit" className="bg-primary text-primary-foreground">
            Tambah Wahana
          </Button>
        </div>
      </form>
    </Form>
  );
};

export const WahanaForm = ({
  onSubmit,
  initialValues,
  isEditing = false,
  nama_wahana,
}: {
  onSubmit: (data: WahanaFormValues) => void;
  initialValues?: {
    jadwal: Date;
    kapasitas: number;
  };
  isEditing?: boolean;
  nama_wahana?: string;
}) => {
  if (isEditing) {
    return (
      <EditWahanaForm
        onSubmit={onSubmit}
        initialValues={initialValues as { jadwal: Date; kapasitas: number }}
        nama_wahana={nama_wahana}
      />
    );
  }

  return <CreateWahanaForm onSubmit={onSubmit} />;
};
