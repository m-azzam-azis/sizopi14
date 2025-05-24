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

const nonAuthenticatedRoutes = [
  "/login",
  "/register",
  "/register/visitor",
  "/register/veterinarian",
  "/register/caretaker",
  "/register/trainer",
  "/register/admin",
];

export const getUserData: () => ReturnType = () => {
  const [token, setToken] = useState<string | null>(null);
  const [decodedToken, setDecodedToken] = useState<sessionType | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  async function fetchCookie() {
    try {
      const res = await fetch("/api/auth/cookies");
      const data: { message: string; token: string } = await res.json();
      if (data.token) setToken(data.token);
      else setToken(null);
    } catch (error) {
      console.error("Error fetching cookie:", error);
      setToken(null);
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
        } else {
          setDecodedToken(decoded);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        setDecodedToken(null);
      }
    }
  }, [token]);

  useEffect(() => {
    if (!isLoading) {
      if (token && nonAuthenticatedRoutes.includes(pathname)) {
        router.push("/");
      }
    }
  }, [isLoading, token, pathname, router]);

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
  };
};
