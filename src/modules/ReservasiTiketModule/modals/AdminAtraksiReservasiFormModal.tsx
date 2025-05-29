import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ReservationStatus, ReservasiTiketAtraksi } from "@/types/schema";
import AdminAtraksiReservasiForm from "../forms/AdminAtraksiReservasiForm";

interface AdminAtraksiReservasiFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    jumlah_tiket: number;
    tanggal_kunjungan: Date;
    status: ReservationStatus;
  }) => void;
  initialData: ReservasiTiketAtraksi;
}

const AdminAtraksiReservasiFormModal: React.FC<
  AdminAtraksiReservasiFormModalProps
> = ({ isOpen, onClose, onSubmit, initialData }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Reservasi Atraksi</DialogTitle>
          <DialogDescription>
            Ubah detail reservasi atraksi di bawah ini.
          </DialogDescription>
        </DialogHeader>
        <AdminAtraksiReservasiForm
          onSubmit={onSubmit}
          initialData={initialData}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AdminAtraksiReservasiFormModal;
