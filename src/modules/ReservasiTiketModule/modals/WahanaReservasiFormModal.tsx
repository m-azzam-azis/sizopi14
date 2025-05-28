import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import WahanaReservasiForm from "../forms/WahanaReservasiForm";

interface WahanaReservasiFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    nama_fasilitas: string;
    tanggal_kunjungan: Date;
    jumlah_tiket: number;
  }) => void;
  ride: {
    nama_wahana: string;
    peraturan: string[];
    fasilitas: {
      jadwal: Date | string; // Accept both Date and string
      kapasitas_tersedia: number;
      kapasitas_max: number;
    };
  };
  isEditing?: boolean;
  initialData?: {
    tanggal_kunjungan: Date;
    jumlah_tiket: number;
  };
}

const WahanaReservasiFormModal: React.FC<WahanaReservasiFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  ride,
  isEditing = false,
  initialData,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Reservasi" : "Form Reservasi"}
          </DialogTitle>
        </DialogHeader>
        <WahanaReservasiForm
          onSubmit={onSubmit}
          ride={ride}
          isEditing={isEditing}
          initialData={initialData}
        />
      </DialogContent>
    </Dialog>
  );
};

export default WahanaReservasiFormModal;
