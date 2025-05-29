"use client";

import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";

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

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<{ nominal: string; adoptionPeriod: string }>({
    defaultValues: {
      nominal: "",
      adoptionPeriod: "3",
    },
  });

  // Calculate minimum contribution based on period - higher for organizations
  const watchPeriod = watch("adoptionPeriod");
  const getMinimumContribution = () => {
    switch (watchPeriod) {
      case "3":
        return 2500000; // 2.5 juta untuk 3 bulan
      case "6":
        return 4500000; // 4.5 juta untuk 6 bulan
      case "12":
        return 8000000; // 8 juta untuk 12 bulan
      default:
        return 2500000;
    }
  };

  const validateNominal = (value: string) => {
    if (!(/^\d+$/.test(value) && parseInt(value) > 0)) {
      return "Nominal harus berupa angka lebih dari 0";
    }
    
    // Check if contribution meets minimum requirement
    const minimumContribution = getMinimumContribution();
    if (parseInt(value) < minimumContribution) {
      return `Minimal kontribusi untuk organisasi periode ${watchPeriod} bulan adalah Rp ${minimumContribution.toLocaleString('id-ID')}`;
    }
    
    return true;
  };

  const handleFormSubmit = (data: { nominal: string; adoptionPeriod: string }) => {
    onSubmit(data);
  };

  return (
    <>
     <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <h2 className="text-center text-xl font-bold text-primary">FORM PERPANJANG PERIODE ADOPSI SATWA</h2>
        <p className="text-sm text-muted-foreground">Pihak di bawah ini, selaku organisasi/perusahaan</p>
        {/* Pastikan organizationName ditampilkan dengan benar */}
        <p className="text-sm font-bold text-muted-foreground">
          Nama: {adopter.organizationName || "Nama organisasi tidak tersedia"}
        </p>
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
          <label className="block text-sm font-bold text-muted-foreground">
            Nominal (Rp): <span className="text-xs font-normal text-muted-foreground">
            </span>
          </label>
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
            defaultValue="3"
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
            onClick={() => router.push("/adopter-adopsi")}
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