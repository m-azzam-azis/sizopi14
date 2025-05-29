"use client";

import { decode } from "jsonwebtoken";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export type ReturnType = {
  userData: {
    username: string;
    email: string;
    nama_depan: string;
    nama_tengah: string;
    nama_belakang: string;
    no_telepon: string;
    role: "visitor" | "veterinarian" | "caretaker" | "trainer" | "admin" | "";
    alamat: string;
    tgl_lahir: string;
    id_staf_JH: string;
    id_staf_LH: string;
    no_str: string;
    nama_spesialisasi: string[];
    id_staf_sa: string;
  };
  isValid: boolean;
  isLoading: boolean;
  authState: "initializing" | "loading" | "authenticated" | "unauthenticated";
  refreshUserData: () => void;
};

type sessionType = {
  data: {
    username: string;
    email: string;
    nama_depan: string;
    nama_tengah: string;
    nama_belakang: string;
    no_telepon: string;
    role: "visitor" | "veterinarian" | "caretaker" | "trainer" | "admin" | "";
    alamat: string;
    tgl_lahir: string;
    id_staf_JH: string;
    id_staf_LH: string;
    no_str: string;
    nama_spesialisasi: string[];
    id_staf_sa: string;
  };
  exp: number;
  iat: number;
};

const nonAuthenticatedRoutes = ["/login", "/register", "/api/auth"];

const adminOnlyRoutes = [
  "/kelola-pengunjung",
  "/kelola-pengunjung/atraksi",
  "/kelola-pengunjung/wahana",
  "/admin-adopsi",
  "/admin-adopsi/detail",
  "/admin-adopsi/register",
  "/api/wahana",
  "/api/atraksi",
];

// Routes that admin and staff (caretaker) can access
const adminStaffRoutes = ["/api/habitat", "/habitat", "/habitat/"];

// Routes that admin, staff (caretaker), and veterinarian can access
const animalManagementRoutes = ["/hewan", "/hewan/", "/api/hewan", "/satwa"];

const visitorRoutes = ["/reservasi"];

const adopterRoutes = [
  "/adopter",
  "/adopter/",
  "/adopter-adopsi",
  "/adopter-adopsi/detail",
  "/adopter-adopsi/sertifikat",
  "/adopter-adopsi/kondisi",
];

const veterinarianRoutes = [
  "/rekam-medis",
  "/jadwal-pemeriksaan",
  "/api/rekam-medis",
  "/api/dokter",
  "/api/jadwal-pemeriksaan",
];

const trainerRoutes = [
  "/jadwal-pertunjukan",
  "/api/trainer-animals",
  "/api/jadwal-penugasan",
];

const caretakerRoutes = [
  "/pakan",
  "/pakan/",
  "/pakan/riwayat",
  "/api/pakan",
  "/api/feeding-history",
];

export const getUserData: () => ReturnType = () => {
  const [token, setToken] = useState<string | null>(null);
  const [decodedToken, setDecodedToken] = useState<sessionType | null>(null);
  const [authState, setAuthState] = useState<
    "initializing" | "loading" | "authenticated" | "unauthenticated"
  >("initializing");
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const fetchCookie = async () => {
    try {
      setAuthState("loading");
      const res = await fetch("/api/auth/cookies");
      const data: { message: string; token: string } = await res.json();
      if (data.token) {
        setToken(data.token);
      } else {
        setToken(null);
        setAuthState("unauthenticated");
      }
    } catch (error) {
      console.error("Error fetching cookie:", error);
      setToken(null);
      setAuthState("unauthenticated");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchCookie();
  }, []);

  useEffect(() => {
    if (token) {
      try {
        const decoded = decode(token) as sessionType;
        const isExpired = decoded.exp * 1000 < Date.now();
        if (isExpired) {
          setToken(null);
          setAuthState("unauthenticated");
        } else {
          setDecodedToken(decoded);
          setAuthState("authenticated");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        setDecodedToken(null);
        setAuthState("unauthenticated");
      }
    }
  }, [token]);

  useEffect(() => {
    if (authState === "initializing" || authState === "loading") {
      return;
    }

    // Check for animal management routes (admin, caretaker, veterinarian)
    const isAnimalManagementRoute = animalManagementRoutes.some((route) =>
      pathname.startsWith(route)
    );
    if (isAnimalManagementRoute) {
      if (authState === "unauthenticated") {
        router.push("/");
        return;
      }

      if (
        authState === "authenticated" &&
        !["veterinarian", "caretaker", "admin"].includes(
          decodedToken?.data.role || ""
        )
      ) {
        router.push("/");
        return;
      }
      return;
    }

    // Check for habitat routes (admin and caretaker only)
    const isAdminStaffRoute = adminStaffRoutes.some((route) =>
      pathname.startsWith(route)
    );
    if (isAdminStaffRoute) {
      if (authState === "unauthenticated") {
        router.push("/");
        return;
      }

      if (
        authState === "authenticated" &&
        !["caretaker", "admin"].includes(decodedToken?.data.role || "")
      ) {
        router.push("/");
        return;
      }
      return;
    }

    const isAdopterRoute = adopterRoutes.some((route) =>
      pathname.startsWith(route)
    );
    if (isAdopterRoute) {
      if (authState === "unauthenticated") {
        router.push("/");
        return;
      }
    }

    if (
      authState === "authenticated" &&
      nonAuthenticatedRoutes.some((route) => pathname.startsWith(route))
    ) {
      router.push("/");
      return;
    }

    const isAdminRoute = adminOnlyRoutes.some((route) =>
      pathname.startsWith(route)
    );
    if (isAdminRoute) {
      if (authState === "unauthenticated") {
        router.push("/");
        return;
      }

      if (
        authState === "authenticated" &&
        decodedToken?.data.role !== "admin"
      ) {
        router.push("/");
        return;
      }
    }

    const isVisitorRoute = visitorRoutes.some((route) =>
      pathname.startsWith(route)
    );
    if (isVisitorRoute) {
      if (authState === "unauthenticated") {
        router.push("/");
        return;
      }

      if (
        authState === "authenticated" &&
        decodedToken?.data.role !== "visitor"
      ) {
        router.push("/");
        return;
      }
    }

    const isVeterinarianRoute = veterinarianRoutes.some((route) =>
      pathname.startsWith(route)
    );
    if (isVeterinarianRoute) {
      if (authState === "unauthenticated") {
        router.push("/");
        return;
      }

      if (
        authState === "authenticated" &&
        decodedToken?.data.role !== "veterinarian"
      ) {
        router.push("/");
        return;
      }
    }

    const isCaretakerRoute = caretakerRoutes.some((route) =>
      pathname.startsWith(route)
    );
    if (isCaretakerRoute) {
      if (authState === "unauthenticated") {
        router.push("/");
        return;
      }

      if (
        authState === "authenticated" &&
        decodedToken?.data.role !== "caretaker"
      ) {
        router.push("/");
        return;
      }
    }

    const isTrainerRoute = trainerRoutes.some((route) =>
      pathname.startsWith(route)
    );
    if (isTrainerRoute) {
      if (authState === "unauthenticated") {
        router.push("/");
        return;
      }
      if (
        authState === "authenticated" &&
        decodedToken?.data.role !== "trainer"
      ) {
        router.push("/");
        return;
      }
    }
  }, [authState, decodedToken, pathname, router]);

  if (isLoading || !decodedToken) {
    return {
      userData: {
        username: "",
        email: "",
        nama_depan: "",
        nama_tengah: "",
        nama_belakang: "",
        no_telepon: "",
        role: "",
        alamat: "",
        tgl_lahir: "",
        id_staf_JH: "",
        id_staf_LH: "",
        no_str: "",
        nama_spesialisasi: [],
        id_staf_sa: "",
      },
      isValid: false,
      isLoading,
      authState,
      refreshUserData: fetchCookie,
    };
  }

  return {
    userData: {
      username: decodedToken.data.username,
      email: decodedToken.data.email,
      nama_depan: decodedToken.data.nama_depan,
      nama_tengah: decodedToken.data.nama_tengah,
      nama_belakang: decodedToken.data.nama_belakang,
      no_telepon: decodedToken.data.no_telepon,
      role: decodedToken.data.role,
      alamat: decodedToken.data.alamat,
      tgl_lahir: decodedToken.data.tgl_lahir,
      id_staf_JH: decodedToken.data.id_staf_JH,
      id_staf_LH: decodedToken.data.id_staf_LH,
      no_str: decodedToken.data.no_str,
      nama_spesialisasi: decodedToken.data.nama_spesialisasi,
      id_staf_sa: decodedToken.data.id_staf_sa,
    },
    isValid: true,
    isLoading,
    authState,
    refreshUserData: fetchCookie,
  };
};
