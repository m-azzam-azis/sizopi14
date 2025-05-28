import React from "react";

interface CaretakerDashboardProps {
  userData: {
    staffId?: string;
    jumlahHewan?: number;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    phoneNumber: string;
    role: string;
    // Tambahkan field lain jika perlu
  };
  feedingCount?: number; // jumlah hewan yang sudah diberi pakan
}

const CaretakerDashboard: React.FC<CaretakerDashboardProps> = ({ userData, feedingCount }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dashboard Penjaga Hewan</h2>
      <ul className="mb-4 space-y-1">
        <li><b>Nama Lengkap:</b> {userData.firstName} {userData.lastName}</li>
        <li><b>Username:</b> {userData.username}</li>
        <li><b>Email:</b> {userData.email}</li>
        <li><b>Nomor Telepon:</b> {userData.phoneNumber}</li>
        <li><b>Peran:</b> {userData.role}</li>
        {userData.staffId && <li><b>ID Staf:</b> {userData.staffId}</li>}
        {typeof feedingCount === "number" && (
          <li><b>Jumlah hewan yang sudah diberi pakan:</b> {feedingCount}</li>
        )}
      </ul>
    </div>
  );
};

export default CaretakerDashboard;
