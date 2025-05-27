"use client";

import React, { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DateTimePicker } from "@/components/elements/DateTimePicker/DateTimePicker";

const createWahanaSchema = z.object({
  nama_wahana: z.string().min(1, "Nama wahana tidak boleh kosong"),
  kapasitas: z.number().min(1, "Kapasitas harus lebih dari 0"),
  jadwal: z.date(),
  peraturan: z.array(z.string()).min(1, "Peraturan tidak boleh kosong"),
});

const editWahanaSchema = z.object({
  kapasitas: z.number().min(1, "Kapasitas harus lebih dari 0"),
  jadwal: z.date(),
});

export type CreateWahanaFormValues = z.infer<typeof createWahanaSchema>;
export type EditWahanaFormValues = z.infer<typeof editWahanaSchema>;

export const CreateWahanaForm = ({
  onSubmit,
}: {
  onSubmit: (data: CreateWahanaFormValues) => void;
}) => {
  const form = useForm<CreateWahanaFormValues>({
    resolver: zodResolver(createWahanaSchema),
    defaultValues: {
      nama_wahana: "",
      kapasitas: 10,
      jadwal: new Date(),
      peraturan: [""],
    },
  });

  const peraturanFields = form.watch("peraturan");

  const addRegulation = () => {
    form.setValue("peraturan", [...peraturanFields, ""], {
      shouldValidate: true,
    });
  };

  const removeRegulation = (index: number) => {
    if (peraturanFields.length > 1) {
      const newPeraturan = [...peraturanFields];
      newPeraturan.splice(index, 1);
      form.setValue("peraturan", newPeraturan, { shouldValidate: true });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nama_wahana"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Wahana</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan nama wahana" {...field} />
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
                  placeholder="Masukkan kapasitas"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
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
              <FormLabel>Jadwal</FormLabel>
              <FormControl>
                <DateTimePicker
                  date={field.value}
                  setDate={field.onChange}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel>Peraturan</FormLabel>
          {peraturanFields.map((_, index) => (
            <div
              key={index}
              className="flex flex-row justify-center items-center mb-2 h-fit"
            >
              <FormField
                control={form.control}
                name={`peraturan.${index}`}
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Masukkan peraturan"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {index > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="ml-2 self-center mt-2"
                  onClick={() => removeRegulation(index)}
                >
                  X
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addRegulation}
            className="mt-2"
          >
            Tambah Peraturan
          </Button>
        </div>

        <div className="flex justify-end">
          <Button type="submit">Simpan</Button>
        </div>
      </form>
    </Form>
  );
};

export const EditWahanaForm = ({
  onSubmit,
  initialValues,
  nama_wahana,
}: {
  onSubmit: (data: EditWahanaFormValues) => void;
  initialValues: { jadwal: Date; kapasitas: number };
  nama_wahana?: string;
}) => {
  const form = useForm<EditWahanaFormValues>({
    resolver: zodResolver(editWahanaSchema),
    defaultValues: initialValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {nama_wahana && (
          <div className="mb-4">
            <h3 className="font-medium">Nama Wahana:</h3>
            <p className="text-foreground/80">{nama_wahana}</p>
          </div>
        )}

        <FormField
          control={form.control}
          name="kapasitas"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kapasitas Maksimum</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Masukkan kapasitas"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
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
              <FormLabel>Jadwal</FormLabel>
              <FormControl>
                <DateTimePicker
                  date={field.value}
                  setDate={field.onChange}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit">Update</Button>
        </div>
      </form>
    </Form>
  );
};

const WahanaForm = ({
  onSubmit,
  initialValues,
  isEditing = false,
  nama_wahana,
}: {
  onSubmit: (data: any) => void;
  initialValues?: { jadwal: Date; kapasitas: number };
  isEditing?: boolean;
  nama_wahana?: string;
}) => {
  if (isEditing && initialValues) {
    return (
      <EditWahanaForm
        onSubmit={onSubmit}
        initialValues={initialValues}
        nama_wahana={nama_wahana}
      />
    );
  }

  return <CreateWahanaForm onSubmit={onSubmit} />;
};

export default WahanaForm;
