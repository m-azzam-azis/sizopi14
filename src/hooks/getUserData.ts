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
  "/api/wahana",
  "/api/atraksi",
];

const visitorRoutes = ["/reservasi"];

export const getUserData: () => ReturnType = () => {
  const [token, setToken] = useState<string | null>(null);
  const [decodedToken, setDecodedToken] = useState<sessionType | null>(null);
  const [authState, setAuthState] = useState<
    "initializing" | "loading" | "authenticated" | "unauthenticated"
  >("initializing");
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  async function fetchCookie() {
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
  }

  useEffect(() => {
    fetchCookie();
  }, [pathname]);

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
        router.push("/dashboard");
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
  };
};
