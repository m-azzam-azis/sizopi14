"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

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
// import { useAuthContext } from "@/components/context/AuthContext";
import { useRouter } from "next/navigation";

const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export const LoginModule: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  // const { login } = useAuthContext();
  // const onSubmit = (data: LoginFormValues) => {
  //   login(data);
  //   router.push("/dashboard");
  // };

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
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/30 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-card/80 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-border"
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground">Welcome Back</h2>
            <p className="text-muted-foreground mt-2">
              Sign in to your SiZopi account
            </p>
          </motion.div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) => console.log(data))}
              className="space-y-6"
            >
              <motion.div variants={itemVariants} className="space-y-4">
                <FormField
                  // control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-secondary-foreground">
                        Email
                      </FormLabel>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1.5 h-6 w-5 text-muted-foreground" />
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="you@example.com"
                            type="email"
                            className="pl-10 bg-input/20 border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
                          />
                        </FormControl>
                      </div>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-secondary-foreground">
                        Password
                      </FormLabel>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1.5 h-6 w-5 text-muted-foreground" />
                        <FormControl>
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="pl-10 pr-10 bg-input/20 border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
                          />
                        </FormControl>
                        <button
                          variant={"default"}
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1.5 text-6uted-foreground hover:text-foreground"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button
                  variant={"default"}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 rounded-md transition-colors mt-4"
                >
                  Sign In
                </Button>
              </motion.div>
            </form>
          </Form>

          <motion.div
            variants={itemVariants}
            className="mt-6 text-center text-sm text-muted-foreground"
          >
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-primary hover:text-primary/80"
            >
              Register now
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};
