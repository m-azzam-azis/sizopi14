import React from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Toaster } from "../ui/sonner";

export const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="min-h-screen overflow-x-hidden font-openSans max-w-[1920px] flex flex-col mx-auto">
      <Toaster position="top-center" />
      <Navbar />
      <main className="min-h-screen bg-background">{children}</main>
      <Footer />
    </main>
  );
};
