import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ReservationStatus, ReservasiTiketWahana } from "@/types/schema";
import AdminWahanaReservasiForm from "../forms/AdminWahanaReservasiForm";

interface AdminWahanaReservasiFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    jumlah_tiket: number;
    tanggal_kunjungan: Date;
    status: ReservationStatus;
  }) => void;
  initialData: ReservasiTiketWahana;
}

const AdminWahanaReservasiFormModal: React.FC<
  AdminWahanaReservasiFormModalProps
> = ({ isOpen, onClose, onSubmit, initialData }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Reservasi Wahana</DialogTitle>
          <DialogDescription>
            Ubah detail reservasi wahana di bawah ini.
          </DialogDescription>
        </DialogHeader>
        <AdminWahanaReservasiForm
          onSubmit={onSubmit}
          initialData={initialData}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AdminWahanaReservasiFormModal;
