import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Chevron } from "@/components/icons/Chevron";
import { Logout } from "@/components/icons/Logout";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { DrawerLines } from "@/components/icons/DrawerLines";
import { X } from "lucide-react";
import { Dashboard } from "@/components/icons/Dashboard";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  const data = {
    isLoggedIn: true,
    user: {
      role: "dokter",
    },
  };

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [popoverOpen2, setPopoverOpen2] = useState(false);

  return (
    <nav className="fixed top-0 p-5 px-5 sm:px-16 md:px-14 lg:px-20 w-full bg-white z-50">
      <div className="flex gap-2 justify-between items-center">
        <Link
          className="flex flex-row justify-center items-center gap-3"
          href="/"
        >
          <div className="relative w-[38px] lg:w-[49px]">
            <img src="/logo.png" alt="text logo" className="object-contain" />
          </div>
          <div className="font-hepta font-bold text-h6 md:text-h3 text-orange-500">
            Sizopi
          </div>
        </Link>
        {data?.isLoggedIn ? (
          <div className="flex gap-4 md:gap-8 lg:gap-11 items-center">
            {data?.user.role == "dokter" ? (
              <Link
                href="/rekam-medis-hewan"
                className="max-md:hidden text-h7 text-orange-500 font-outfit font-medium"
              >
                Rekam Medis
              </Link>
            ) : data?.user.role == "penjaga" ? (
              <Link
                href="/catatan-perawatan-hewan"
                className="max-md:hidden text-h7 text-orange-500 font-outfit font-medium"
              >
                Catatan Perawatan
              </Link>
            ) : data?.user.role == "admin" ? (
              <>
                <Link
                  href="/kelola-pengunjung"
                  className="max-md:hidden text-h7 text-orange-500 font-outfit font-medium"
                >
                  Kelola Pengunjung
                </Link>
                <Link
                  href="/kelola-adopsi-hewan"
                  className="max-md:hidden text-h7 text-orange-500 font-outfit font-medium"
                >
                  Kelola Adopsi
                </Link>
                <Link
                  href="/kelola-adopter"
                  className="max-md:hidden text-h7 text-orange-500 font-outfit font-medium"
                >
                  Kelola Adopter
                </Link>
              </>
            ) : data?.user.role == "pelatih" ? (
              <Link
                href="/jadwal-pertunjukan"
                className="max-md:hidden text-h7 text-orange-500 font-outfit font-medium"
              >
                Jadwal Pertunjukan
              </Link>
            ) : data?.user.role == "pengunjung" ? (
              <Link
                href="/kebun-binatang"
                className="max-md:hidden text-h7 text-orange-500 font-outfit font-medium"
              >
                Kebun Binatang
              </Link>
            ) : data?.user.role == "adopter" ? (
              <Link
                href="/hewan-adopsi"
                className="max-md:hidden text-h7 text-orange-500 font-outfit font-medium"
              >
                Hewan Adopsi
              </Link>
            ) : null}

            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild className="max-md:hidden">
                <button className="relative group flex gap-3 max-sm:gap-2 py-2 items-center text-black fill-black group cursor-pointer">
                  <p className="text-s7 text-orange-500 max-sm:hidden font-outfit font-medium">
                    Shaney Zoya
                  </p>
                  <Chevron
                    className={`${
                      popoverOpen ? "-rotate-180" : ""
                    } duration-300`}
                    size="w-6 h-6 max-md:w-5 max-md:h-5"
                    fill="fill-orange-500"
                  />
                </button>
              </PopoverTrigger>
              <PopoverContent className="z-50 translate-y-6 -translate-x-2 space-y-6">
                <Link
                  href="/dashboard"
                  className="flex flex-row gap-2 text-s7 w-full text-left duration-300 rounded-xl font-jakarta"
                >
                  <Dashboard className="w-6 h-6" />
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  className="flex flex-row gap-2 text-s7 w-full text-left duration-300 rounded-xl font-jakarta"
                >
                  <Dashboard className="w-6 h-6" />
                  Profil Diri
                </Link>
                <button
                  // onClick={logout}
                  className="flex flex-row gap-2 text-s7 w-full text-left duration-300 rounded-xl cursor-pointer font-jakarta"
                >
                  <Logout className="w-6 h-6" />
                  Log Out
                </button>
              </PopoverContent>
            </Popover>

            <Drawer direction="right">
              <DrawerTrigger className="md:hidden">
                <DrawerLines className="w-6 h-6" />
              </DrawerTrigger>
              <DrawerContent className="!w-full !max-w-none sm:!max-w-none bg-orange-100">
                <DrawerHeader className="gap-8 justify-start items-start">
                  <DrawerClose className="self-end">
                    <X />
                  </DrawerClose>

                  <Link
                    href="/"
                    className="text-s7 text-orange-800 font-jakarta"
                  >
                    Home
                  </Link>

                  <Link
                    href="/faq"
                    className="text-s7 text-orange-800 font-jakarta"
                  >
                    FAQ
                  </Link>

                  <Popover open={popoverOpen2} onOpenChange={setPopoverOpen2}>
                    <PopoverTrigger asChild>
                      <button className="relative group flex gap-3 max-sm:gap-2 py-2 items-center text-black fill-black group cursor-pointer font-jakarta">
                        <p className="text-s7 text-orange-800">Shaney Zoya</p>
                        <Chevron
                          className={`${
                            popoverOpen ? "-rotate-180" : ""
                          } duration-300`}
                          size="w-6 h-6 max-md:w-5 max-md:h-5"
                          fill="fill-orange-800"
                        />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="z-50 bg-transparent px-0 translate-x-10 -translate-y-2 space-y-8 shadow-none">
                      <Link
                        href="/dashboard"
                        className="flex flex-row gap-2 text-s7 w-full text-left duration-300 rounded-xl font-jakarta"
                      >
                        <Dashboard className="w-6 h-6" />
                        Dashboard
                      </Link>
                      <Link
                        href="/profile"
                        className="flex flex-row gap-2 text-s7 w-full text-left duration-300 rounded-xl font-jakarta"
                      >
                        <Dashboard className="w-6 h-6" />
                        Profil Diri
                      </Link>
                      <button
                        // onClick={logout}
                        className="flex flex-row gap-2 text-s7 w-full text-left duration-300 rounded-xl cursor-pointer font-jakarta"
                      >
                        <Logout className="w-6 h-6" />
                        Log Out
                      </button>
                    </PopoverContent>
                  </Popover>
                </DrawerHeader>
                <div className="absolute w-[386.7px] bottom-0">
                  <img
                    src="/drawer-hat.png"
                    alt="drawer hat"
                    className="object-contain"
                  />
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        ) : (
          <Link
            href="/login"
            className="max-md:hidden text-h7 text-orange-500 font-outfit font-medium"
          >
            <Button className="text-orange-500 border-orange-500 hover:bg-orange-500 hover:text-white">
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
};
