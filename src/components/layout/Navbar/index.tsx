"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Chevron } from "@/components/icons/Chevron";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { DrawerLines } from "@/components/icons/DrawerLines";
import { CircleUserRound, LayoutDashboard, LogOut, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export const Navbar = () => {
  const pathname = usePathname();

  const getUserRole = () => {
    if (pathname.includes("rekam-medis") || pathname.includes("jadwal-pemeriksaan")) {
      return "dokter";
    } else if (pathname.includes("pakan")) {
      return "penjaga";
    }
    return "pengunjung";
  };

  // Use getUserRole instead of hardcoded role
  const data = {
    isLoggedIn: true,
    user: {
      role: getUserRole(),
    },
  };

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [popoverOpen2, setPopoverOpen2] = useState(false);

  return (
    <nav className="fixed top-0 p-5 px-5 sm:px-16 md:px-14 lg:px-20 w-full bg-accent/70 backdrop-blur-md z-50">
      <div className="flex gap-2 justify-between items-center">
        <Link
          className="flex flex-row justify-center items-center gap-3"
          href="/"
        >
          <div className="relative w-[38px] lg:w-[49px]">
            <Image
              src="/icon.png"
              width={60}
              height={60}
              alt="text logo"
              className="object-contain"
            />
          </div>
          <div className="font-hepta font-bold text-2xl md:text-4xl text-primary">
            Sizopi
          </div>
        </Link>
        {data?.isLoggedIn ? (
          <div className="flex gap-4 md:gap-8 lg:gap-11 items-center">
            {/* Role-specific navigation links */}
            {data?.user.role == "dokter" ? (
               <>
               <Link
                  href="/rekam-medis"
                  className="max-md:hidden text-lg text-primary font-outfit font-medium"
                >
                  Rekam Medis
                </Link>
                <Link
                  href="/jadwal-pemeriksaan"
                  className="max-md:hidden text-lg text-primary font-outfit font-medium"
                >
                  Jadwal Pemeriksaan
               </Link>
              </>
            ) : data?.user.role == "penjaga" ? (
              <> 
                  <Link
                      href="/catatan-perawatan-hewan"
                      className="max-md:hidden text-base text-primary font-outfit font-medium"
                    >
                      Catatan Perawatan
                    </Link>
                    <Link
                      href="/pakan"
                      className="max-md:hidden text-base text-primary font-outfit font-medium"
                    >
                      Pemberian Pakan Hewan
                  </Link>
              </>
            ) : data?.user.role == "admin" ? (
              <>
                <Link
                  href="/kelola-pengunjung"
                  className="max-md:hidden text-base text-primary font-outfit font-medium"
                >
                  Kelola Pengunjung
                </Link>
                <Link
                  href="/kelola-adopsi-hewan"
                  className="max-md:hidden text-base text-primary font-outfit font-medium"
                >
                  Kelola Adopsi
                </Link>
                <Link
                  href="/kelola-adopter"
                  className="max-md:hidden text-base text-primary font-outfit font-medium"
                >
                  Kelola Adopter
                </Link>
              </>
            ) : data?.user.role == "pelatih" ? (
              <Link
                href="/jadwal-pertunjukan"
                className="max-md:hidden text-base text-primary font-outfit font-medium"
              >
                Jadwal Pertunjukan
              </Link>
            ) : data?.user.role == "pengunjung" ? (
              <Link
                href="/kebun-binatang"
                className="max-md:hidden text-base text-primary font-outfit font-medium"
              >
                Kebun Binatang
              </Link>
            ) : data?.user.role == "adopter" ? (
              <Link
                href="/hewan-adopsi"
                className="max-md:hidden text-base text-primary font-outfit font-medium"
              >
                Hewan Adopsi
              </Link>
            ) : null}

            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild className="max-md:hidden">
                <button className="relative group flex gap-3 max-sm:gap-2 py-2 items-center text-foreground fill-primary group cursor-pointer">
                  <p className="text-lg text-primary max-sm:hidden font-outfit font-medium">
                    Shaney Zoya
                  </p>
                  <Chevron
                    className={`${
                      popoverOpen ? "-rotate-180" : ""
                    } duration-300`}
                    size="w-6 h-6 max-md:w-5 max-md:h-5"
                    fill="fill-primary"
                  />
                </button>
              </PopoverTrigger>
              <PopoverContent className="z-50 translate-y-6 -translate-x-2 space-y-6 bg-card text-card-foreground">
                <Link
                  href="/dashboard"
                  className="flex flex-row gap-2 text-lg w-full text-left duration-300 rounded-xl font-outfit hover:text-primary"
                >
                  <LayoutDashboard className="w-6 h-6" />
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  className="flex flex-row gap-2 text-lg w-full text-left duration-300 rounded-xl font-outfit hover:text-primary"
                >
                  <CircleUserRound className="w-6 h-6" />
                  Profil Diri
                </Link>
                <button
                  // onClick={logout}
                  className="flex flex-row gap-2 text-lg w-full text-left duration-300 rounded-xl cursor-pointer font-outfit hover:text-primary"
                >
                  <LogOut className="w-6 h-6" />
                  Log Out
                </button>
              </PopoverContent>
            </Popover>

            <Drawer direction="right">
              <DrawerTrigger className="md:hidden">
                <DrawerLines className="w-6 h-6" />
              </DrawerTrigger>
              <DrawerContent className="!w-full !max-w-none sm:!max-w-none bg-card">
                <DrawerHeader className="gap-8 justify-start items-start">
                  <DrawerClose className="self-end">
                    <X />
                  </DrawerClose>

                  <Link href="/" className="text-lg text-primary font-outfit">
                    Home
                  </Link>

                  {/* Role-specific mobile menu items */}
                  {data?.user.role == "dokter" ? (
                    <>
                     <Link
                        href="/rekam-medis"
                        className="text-lg text-primary font-outfit"
                      >
                        Rekam Medis
                      </Link>
                      <Link
                        href="/jadwal-pemeriksaan"
                        className="text-lg text-primary font-outfit"
                      >
                        Jadwal Pemeriksaan
                     </Link>
                    </>
                  ) : data?.user.role == "penjaga" ? (
                    <> 
                    <Link
                      href="/catatan-perawatan-hewan"
                      className="text-base text-primary font-outfit"
                    >
                      Catatan Perawatan
                    </Link>
                    <Link
                      href="/pakan"
                      className="text-base text-primary font-outfit"
                    >
                      Pemberian Pakan Hewan
                    </Link>
                    </>
                  ) : data?.user.role == "admin" ? (
                    <>
                      <Link
                        href="/kelola-pengunjung"
                        className="text-base text-primary font-outfit"
                      >
                        Kelola Pengunjung
                      </Link>
                      <Link
                        href="/kelola-adopsi-hewan"
                        className="text-base text-primary font-outfit"
                      >
                        Kelola Adopsi
                      </Link>
                      <Link
                        href="/adopter"
                        className="text-base text-primary font-outfit"
                      >
                        Kelola Adopter
                      </Link>
                    </>
                  ) : data?.user.role == "pelatih" ? (
                    <Link
                      href="/jadwal-pertunjukan"
                      className="text-base text-primary font-outfit"
                    >
                      Jadwal Pertunjukan
                    </Link>
                  ) : data?.user.role == "pengunjung" ? (
                    <Link
                      href="/kebun-binatang"
                      className="text-base text-primary font-outfit"
                    >
                      Kebun Binatang
                    </Link>
                  ) : data?.user.role == "adopter" ? (
                    <Link
                      href="/hewan-adopsi"
                      className="text-base text-primary font-outfit"
                    >
                      Hewan Adopsi
                    </Link>
                  ) : null}

                  <Popover open={popoverOpen2} onOpenChange={setPopoverOpen2}>
                    <PopoverTrigger asChild>
                      <button className="relative group flex gap-3 max-sm:gap-2 py-2 items-center text-foreground fill-primary group cursor-pointer font-outfit">
                        <p className="text-lg text-primary">Shaney Zoya</p>
                        <Chevron
                          className={`${
                            popoverOpen ? "-rotate-180" : ""
                          } duration-300`}
                          size="w-6 h-6 max-md:w-5 max-md:h-5"
                          fill="fill-primary"
                        />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="z-50 bg-transparent border-0 translate-x-10 -translate-y-2 space-y-8 shadow-none">
                      <Link
                        href="/dashboard"
                        className="flex flex-row gap-2 text-lg w-full text-left duration-300 rounded-xl font-outfit hover:text-primary"
                      >
                        <LayoutDashboard className="w-6 h-6" />
                        Dashboard
                      </Link>
                      <Link
                        href="/profile"
                        className="flex flex-row gap-2 text-lg w-full text-left duration-300 rounded-xl font-outfit hover:text-primary"
                      >
                        <CircleUserRound className="w-6 h-6" />
                        Profil Diri
                      </Link>
                      <button
                        // onClick={logout}
                        className="flex flex-row gap-2 text-lg w-full text-left duration-300 rounded-xl cursor-pointer font-outfit hover:text-primary"
                      >
                        <LogOut className="w-6 h-6" />
                        Log Out
                      </button>
                    </PopoverContent>
                  </Popover>
                </DrawerHeader>
              </DrawerContent>
            </Drawer>
          </div>
        ) : (
          <div className="flex gap-4">
            <Link href="/login" className="">
              <Button className="text-primary-foreground bg-primary hover:bg-primary/90">
                Login
              </Button>
            </Link>
            <Link href="/register" className="">
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10"
              >
                Register
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};