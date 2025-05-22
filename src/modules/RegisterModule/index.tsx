"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/types/user";
import { Users, Stethoscope, Bone, ShieldCheck, Theater } from "lucide-react";

const roles: {
  id: UserRole;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
}[] = [
  {
    id: "visitor",
    title: "Pengunjung",
    description: "Beli tiket dan jelajahi kebun binatang",
    icon: <Users className="h-8 w-8" />,
    path: "/register/visitor",
  },
  {
    id: "veterinarian",
    title: "Dokter Hewan",
    description: "Kelola perawatan kesehatan satwa",
    icon: <Stethoscope className="h-8 w-8" />,
    path: "/register/veterinarian",
  },
  {
    id: "caretaker",
    title: "Penjaga Hewan",
    description: "Urus kebutuhan harian satwa",
    icon: <Bone className="h-8 w-8" />,
    path: "/register/caretaker",
  },
  {
    id: "admin",
    title: "Staf Administrasi",
    description: "Kelola operasional kebun binatang",
    icon: <ShieldCheck className="h-8 w-8" />,
    path: "/register/admin",
  },
  {
    id: "trainer",
    title: "Pelatih Pertunjukan",
    description: "Atur pertunjukan dan latihan satwa",
    icon: <Theater className="h-8 w-8" />,
    path: "/register/trainer",
  },
];

export const RegisterModule: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/30 flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-foreground">Daftar Akun Baru</h1>
        <p className="text-muted-foreground mt-2">
          Pilih jenis akun yang ingin Anda buat
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
        {roles.map((role, index) => (
          <motion.div
            key={role.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link href={role.path}>
              <Card className="h-full transition-all hover:shadow-lg hover:border-primary cursor-pointer">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                    {role.icon}
                  </div>
                  <CardTitle>{role.title}</CardTitle>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Daftar</Button>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-8 text-center"
      >
        <p className="text-sm text-muted-foreground">
          Sudah memiliki akun?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Masuk
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterModule;
