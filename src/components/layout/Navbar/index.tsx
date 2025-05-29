"use client";
import { useState, useEffect } from "react";
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
import { getUserData } from "@/hooks/getUserData";
import { toast } from "sonner";

export const Navbar = () => {
  const { userData, isValid, refreshUserData } = getUserData();
  const [isAdopter, setIsAdopter] = useState(false);

  const mapRoleToUIRole = (role: string): string => {
    switch (role) {
      case "visitor":
        return "pengunjung";
      case "veterinarian":
      case "dokter_hewan":
        return "dokter";
      case "caretaker":
      case "penjaga_hewan":
        return "penjaga";
      case "trainer":
      case "pelatih_hewan":
        return "pelatih";
      case "admin":
      case "staf_admin":
        return "admin";
      default:
        return "";
    }
  };

  const uiRole = mapRoleToUIRole(userData?.role || "");

  type Role = "dokter" | "penjaga" | "admin" | "pelatih" | "pengunjung";

  type NavigationItem = {
    label: string;
    href: string;
    className: string;
  };

  type RoleNavigation = {
    [key in Role]: NavigationItem[];
  };

  // Simple role-based navigation mapping
  const roleNavigation = {
    dokter: [
      {
        label: "Rekam Medis",
        href: "/rekam-medis",
        className: "text-lg text-primary font-outfit font-medium",
      },
      {
        label: "Jadwal Pemeriksaan",
        href: "/jadwal-pemeriksaan",
        className: "text-lg text-primary font-outfit font-medium",
      },
      {
        label: "Manajemen Satwa",
        href: "/satwa",
        className: "text-lg text-primary font-outfit font-medium",
      },
    ],
    penjaga: [
      {
        label: "Pemberian Pakan Hewan",
        href: "/pakan",
        className: "text-base text-primary font-outfit font-medium",
      },
      {
        label: "Manajemen Habitat",
        href: "/habitat",
        className: "text-base text-primary font-outfit font-medium",
      },
      {
        label: "Manajemen Satwa",
        href: "/satwa",
        className: "text-base text-primary font-outfit font-medium",
      },
    ],
    admin: [
      {
        label: "Kelola Pengunjung",
        href: "/kelola-pengunjung",
        className: "text-base text-primary font-outfit font-medium",
      },
      {
        label: "Kelola Adopsi",
        href: "/admin-adopsi",
        className: "text-base text-primary font-outfit font-medium",
      },
      {
        label: "Kelola Adopter",
        href: "/adopter",
        className: "text-base text-primary font-outfit font-medium",
      },
      {
        label: "Manajemen Habitat",
        href: "/habitat",
        className: "text-base text-primary font-outfit font-medium",
      },
      {
        label: "Manajemen Satwa",
        href: "/satwa",
        className: "text-base text-primary font-outfit font-medium",
      },
    ],
    pelatih: [
      {
        label: "Jadwal Pertunjukan",
        href: "/jadwal-pertunjukan",
        className: "text-base text-primary font-outfit font-medium",
      },
    ],
    pengunjung: [
      {
        label: "Reservasi Tiket",
        href: "/reservasi",
        className: "text-base text-primary font-outfit font-medium",
      },
    ],
  };

  // Get navigation items for current user role
  const getNavItems = () => {
    const baseItems: NavigationItem[] = roleNavigation[uiRole as Role] || [];
    // Add adopter link if user is adopter
    if (uiRole === "pengunjung" && isAdopter) {
      return [
        ...baseItems,
        {
          label: "Hewan Adopsi",
          href: "/adopter-adopsi",
          className: "text-base text-primary font-outfit font-medium",
        },
      ];
    }

    return baseItems;
  };

  // Check adopter status
  useEffect(() => {
    const checkIfAdopter = async () => {
      if (isValid && userData.username) {
        try {
          const response = await fetch(
            `/api/adopter-adopsi/check-type?username=${userData.username}`
          );

          if (response.ok) {
            setIsAdopter(true);
            if (typeof window !== "undefined") {
              localStorage.setItem("isAdopter", "true");
            }
          } else {
            setIsAdopter(false);
            if (typeof window !== "undefined") {
              localStorage.removeItem("isAdopter");
            }
          }
        } catch (error) {
          console.error("Error checking adopter status:", error);
          if (typeof window !== "undefined") {
            const cachedStatus = localStorage.getItem("isAdopter");
            setIsAdopter(cachedStatus === "true");
          }
        }
      } else {
        setIsAdopter(false);
      }
    };

    checkIfAdopter();
  }, [isValid, userData.username]);

  // Listen for profile update events to refresh user data
  useEffect(() => {
    const handleProfileUpdate = () => {
      refreshUserData();
    };

    window.addEventListener("profileUpdated", handleProfileUpdate);

    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdate);
    };
  }, [refreshUserData]);

  const logout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        toast.success("Logged out successfully");
        window.location.href = "/";
      } else {
        const data = await response.json();
        toast.error(data.error || "Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [popoverOpen2, setPopoverOpen2] = useState(false);

  const fullName =
    userData.nama_depan && userData.nama_belakang
      ? `${userData.nama_depan} ${userData.nama_belakang}`
      : "User";

  const navItems = getNavItems();

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

        {isValid ? (
          <div className="flex gap-4 md:gap-8 lg:gap-11 items-center">
            {/* Desktop Navigation */}
            {navItems.map((item: NavigationItem, index: number) => (
              <Link
                key={index}
                href={item.href}
                className={`max-md:hidden ${item.className}`}
              >
                {item.label}
              </Link>
            ))}

            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild className="max-md:hidden">
                <button className="relative group flex gap-3 max-sm:gap-2 py-2 items-center text-foreground fill-primary group cursor-pointer">
                  <p className="text-lg text-primary max-sm:hidden font-outfit font-medium">
                    {fullName}
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
                  onClick={logout}
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

                  {/* Mobile Navigation Items */}
                  {navItems.map((item: NavigationItem, index: number) => (
                    <Link
                      key={index}
                      href={item.href}
                      className="text-lg text-primary font-outfit"
                    >
                      {item.label}
                    </Link>
                  ))}

                  <Popover open={popoverOpen2} onOpenChange={setPopoverOpen2}>
                    <PopoverTrigger asChild>
                      <button className="relative group flex gap-3 max-sm:gap-2 py-2 items-center text-foreground fill-primary group cursor-pointer font-outfit">
                        <p className="text-lg text-primary">{fullName}</p>
                        <Chevron
                          className={`${
                            popoverOpen2 ? "-rotate-180" : ""
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
                        onClick={logout}
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
