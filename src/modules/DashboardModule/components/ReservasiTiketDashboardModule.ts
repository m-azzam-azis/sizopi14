import React from "react";

interface ReservasiTiketDashboardModuleProps {
  userData: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    phoneNumber: string;
    role: string;
    alamat?: string;
    tanggalLahir?: string;
    riwayatKunjungan?: any[]; // array of visit history
    tiketDibeli?: any[]; // array of ticket info
  };
}

const ReservasiTiketDashboardModule: React.FC<ReservasiTiketDashboardModuleProps> = ({ userData }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dashboard Pengunjung</h2>
      <ul className="mb-4 space-y-1">
        <li><b>Nama Lengkap:</b> {userData.firstName} {userData.lastName}</li>
        <li><b>Username:</b> {userData.username}</li>
        <li><b>Email:</b> {userData.email}</li>
        <li><b>Nomor Telepon:</b> {userData.phoneNumber}</li>
        <li><b>Peran:</b> {userData.role}</li>
        {userData.alamat && <li><b>Alamat Lengkap:</b> {userData.alamat}</li>}
        {userData.tanggalLahir && <li><b>Tanggal Lahir:</b> {userData.tanggalLahir}</li>}
      </ul>
      {userData.riwayatKunjungan && (
        <div className="mb-4">
          <h3 className="font-semibold">Riwayat Kunjungan</h3>
          <ul className="list-disc ml-6">
            {userData.riwayatKunjungan.length === 0 && <li>Tidak ada riwayat kunjungan.</li>}
            {userData.riwayatKunjungan.map((visit, idx) => (
              <li key={idx}>{visit}</li>
            ))}
          </ul>
        </div>
      )}
      {userData.tiketDibeli && (
        <div>
          <h3 className="font-semibold">Informasi Tiket yang Telah Dibeli</h3>
          <ul className="list-disc ml-6">
            {userData.tiketDibeli.length === 0 && <li>Belum ada tiket yang dibeli.</li>}
            {userData.tiketDibeli.map((tiket, idx) => (
              <li key={idx}>{tiket}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ReservasiTiketDashboardModule;
