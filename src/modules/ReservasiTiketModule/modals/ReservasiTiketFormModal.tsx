import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ReservasiTiketForm } from "../forms/ReservasiTiketForm";

interface ReservasiTiketFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    nama_fasilitas: string;
    tanggal_kunjungan: Date;
    jumlah_tiket: number;
  }) => void;
  attraction: {
    nama_atraksi: string;
    lokasi: string;
    fasilitas: {
      jadwal: Date | string;
      kapasitas_tersedia: number;
      kapasitas_max: number;
    };
  };
  isEditing?: boolean;
  initialData?: {
    tanggal_kunjungan: Date;
    jumlah_tiket: number;
  };
  selectedDate: Date;
}

const ReservasiTiketFormModal: React.FC<ReservasiTiketFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  attraction,
  isEditing = false,
  initialData,
  selectedDate,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Reservasi" : "Form Reservasi"}
          </DialogTitle>
        </DialogHeader>
        <ReservasiTiketForm
          onSubmit={onSubmit}
          attraction={attraction}
          isEditing={isEditing}
          initialData={initialData}
          selectedDate={selectedDate}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ReservasiTiketFormModal;
