import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AdminReservasiForm } from "../forms/AdminReservasiForm";
import { ReservasiTiket, ReservationStatus } from "@/types/schema";

interface AdminReservasiFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    jumlah_tiket: number;
    tanggal_kunjungan: Date;
    status: ReservationStatus;
  }) => void;
  initialData: ReservasiTiket;
}

const AdminReservasiFormModal: React.FC<AdminReservasiFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>EDIT RESERVASI</DialogTitle>
        </DialogHeader>
        <AdminReservasiForm onSubmit={onSubmit} initialData={initialData} />
      </DialogContent>
    </Dialog>
  );
};

export default AdminReservasiFormModal;
