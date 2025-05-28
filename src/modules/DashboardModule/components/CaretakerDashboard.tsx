import React from "react";

interface CaretakerDashboardProps {
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
  feedingCount?: number;
}

const CaretakerDashboard: React.FC<CaretakerDashboardProps> = ({ userData, feedingCount }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dashboard Penjaga Hewan</h2>
      <ul className="mb-4 space-y-1">
        {userData.id_staf_JH && <li><b>ID Staf:</b> {userData.id_staf_JH}</li>}
        {typeof feedingCount === "number" && (
          <li><b>Jumlah hewan yang sudah diberi pakan:</b> {feedingCount}</li>
        )}
      </ul>
    </div>
  );
};

export default CaretakerDashboard;
