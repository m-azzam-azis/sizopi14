"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

export default function AdopsiIndividuForm({
  onSubmit,
  adopter,
  animalData,
}: {
  onSubmit: (data: { nik: string; nominal: string; adoptionPeriod: string }) => void;
  adopter: { name: string; address: string; noTelp: string };
  animalData: { name: string; species: string };
}) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ nik: string; nominal: string; adoptionPeriod: string }>({
    defaultValues: {
      nik: "",
      nominal: "",
      adoptionPeriod: "3",
    },
  });

  const validateNIK = (value: string) => /^\d{16}$/.test(value) || "NIK harus berupa angka sepanjang 16 karakter";
  const validateNominal = (value: string) =>
    /^\d+$/.test(value) && parseInt(value) > 0 || "Nominal harus berupa angka lebih dari 0";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-center text-xl font-bold text-primary">FORM ADOPSI SATWA</h2>
      <p className="text-sm text-muted-foreground">Pihak di bawah ini,</p>
      <p className="text-sm font-bold text-muted-foreground">Nama: {adopter.name}</p>
      <p className="text-sm font-bold text-muted-foreground">Alamat: {adopter.address}</p>
      <p className="text-sm font-bold text-muted-foreground">Nomor Telepon: {adopter.noTelp}</p>
      <div>
        <label className="block text-sm font-bold text-muted-foreground">NIK:</label>
        <Input
          {...register("nik", { validate: validateNIK })}
          placeholder="Masukkan NIK"
          className="border-primary focus:ring-primary"
        />
        {errors.nik && <p className="text-sm text-red-500">{errors.nik.message}</p>}
      </div>
      <p className="text-sm text-muted-foreground">
        Dengan ini menyatakan kepedulian dan minat untuk mengadopsi secara simbolis satwa:
      </p>
      <p className="text-sm font-bold text-muted-foreground">Nama: {animalData.name}</p>
      <p className="text-sm font-bold text-muted-foreground">Jenis: {animalData.species}</p>
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
          {...register("adoptionPeriod")}
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
          onClick={() => router.push("/admin-adopsi")}
          className="bg-red-500 text-white hover:bg-red-600 hover:text-white"
        >
          Batal
        </Button>
        <Button type="submit" className="bg-primary text-white hover:bg-primary-dark">
          Submit Form
        </Button>
      </div>
    </form>
  );
}