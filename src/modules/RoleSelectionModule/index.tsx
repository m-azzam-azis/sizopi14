"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import {
  UserCircle,
  Stethoscope,
  User,
  BriefcaseBusiness,
  HeartPulse,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RoleOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
}

const roleOptions: RoleOption[] = [
  {
    id: "visitor",
    title: "Visitor",
    description:
      "Register as a visitor to book tickets and access visitor features",
    icon: <User className="h-12 w-12" />,
    path: "/register/visitor",
  },
  {
    id: "veterinarian",
    title: "Veterinarian",
    description:
      "For veterinary professionals who manage animal health records",
    icon: <Stethoscope className="h-12 w-12" />,
    path: "/register/veterinarian",
  },
  {
    id: "caretaker",
    title: "Animal Caretaker",
    description: "For staff who manage animal feeding and care tasks",
    icon: <HeartPulse className="h-12 w-12" />,
    path: "/register/caretaker",
  },
  {
    id: "admin",
    title: "Administrative Staff",
    description:
      "For staff who manage tickets, visitors and administrative tasks",
    icon: <BriefcaseBusiness className="h-12 w-12" />,
    path: "/register/admin",
  },
];

const RoleSelectionModule: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/30 flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-6"
        >
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground">
              Choose Your Role
            </h2>
            <p className="text-muted-foreground mt-2">
              Select the role that best describes how you&apos;ll use the Sizopi
              platform
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {roleOptions.map((role) => (
              <Link key={role.id} href={role.path} className="block">
                <Card
                  className={cn(
                    "h-full transition-all duration-300 hover:shadow-md hover:border-primary/50",
                    "group cursor-pointer"
                  )}
                >
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {role.title}
                      </CardTitle>
                      <div className="text-primary/70 group-hover:text-primary transition-colors">
                        {role.icon}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">
                      {role.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </motion.div>

          <motion.div variants={itemVariants} className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary hover:text-primary/80"
              >
                Sign in
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RoleSelectionModule;
