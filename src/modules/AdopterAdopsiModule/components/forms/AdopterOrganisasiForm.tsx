"use client";

import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useState } from "react";

export default function AdopterOrganisasiForm({
  adopter,
  animal,
  onSubmit,
}: {
  adopter: { organizationName: string; npp: string; address: string; noTelp: string };
  animal: { id: string; name: string; species: string };
  onSubmit: (data: { nominal: string; adoptionPeriod: string }) => void;
}) {
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ nominal: string; adoptionPeriod: string }>({
    defaultValues: {
      nominal: "",
      adoptionPeriod: "3",
    },
  });

  const validateNominal = (value: string) =>
    /^\d+$/.test(value) && parseInt(value) > 0 || "Nominal harus berupa angka lebih dari 0";

  const handleFormSubmit = (data: { nominal: string; adoptionPeriod: string }) => {
    onSubmit(data);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      router.push("/adopter-adopsi"); 
    }, 2000);
  };

  return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <h2 className="text-center text-xl font-bold text-primary">FORM PERPANJANG PERIODE ADOPSI SATWA</h2>
        <p className="text-sm text-muted-foreground">Pihak di bawah ini, selaku organisasi/perusahaan</p>
        <p className="text-sm font-bold text-muted-foreground">Nama: {adopter.organizationName}</p>
        <p className="text-sm font-bold text-muted-foreground">NPP: {adopter.npp}</p>
        <p className="text-sm font-bold text-muted-foreground">Alamat: {adopter.address}</p>
        <p className="text-sm font-bold text-muted-foreground">Kontak: {adopter.noTelp}</p>
        <p className="text-sm text-muted-foreground">
          Dengan ini menyatakan kepedulian dan minat untuk lanjut mengadopsi secara simbolis satwa:
        </p>
        <p className="text-sm font-bold text-muted-foreground">Nama: {animal.name}</p>
        <p className="text-sm font-bold text-muted-foreground">Jenis: {animal.species}</p>
        <p className="text-sm text-muted-foreground">
          Adopter juga bersedia memberikan kontribusi finansial kepada pihak taman safari sebagai dukungan
          untuk pemeliharaan satwa:
        </p>
        <div>
          <label className="block text-sm font-bold text-muted-foreground">Nominal (Rp):</label>
          <Input
            {...register("nominal", { validate: validateNominal })}
            placeholder="Masukkan Nominal"
            className="border-primary focus:ring-primary"
          />
          {errors.nominal && <p className="text-sm text-red-500">{errors.nominal.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-bold text-muted-foreground">Untuk Periode Adopsi Selama</label>
          <Select
            onValueChange={(value) => {
              register("adoptionPeriod").onChange({ target: { value } });
            }}
          >
            <SelectTrigger className="border-primary focus:ring-primary">
              <SelectValue placeholder="Pilih Periode Adopsi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 Bulan</SelectItem>
              <SelectItem value="6">6 Bulan</SelectItem>
              <SelectItem value="12">12 Bulan</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            className="bg-red-500 text-white hover:bg-red-600 hover:text-white"
            onClick={() => router.back()}
          >
            Batal
          </Button>
          <Button type="submit" className="bg-primary text-white hover:bg-primary-dark">
            Submit Form
          </Button>
        </div>
      </form>
    </>
  );
}