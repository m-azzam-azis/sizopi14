import React from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Toaster } from "../ui/sonner";

export const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="min-h-screen font-openSans flex flex-col">
      <Toaster position="top-center" />
      <Navbar />
      {children}
      <Footer />
    </main>
  );
};
