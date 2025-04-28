import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ReservasiTiketForm } from "../forms/ReservasiTiketForm";
import { Atraksi, ReservasiFormData } from "@/types/schema";

interface ReservasiTiketFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ReservasiFormData) => void;
  atraksiList: Atraksi[];
  isEditing: boolean;
  initialData?: ReservasiFormData;
}

const ReservasiTiketFormModal: React.FC<ReservasiTiketFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  atraksiList,
  isEditing,
  initialData,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Reservasi" : "Buat Reservasi"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Edit detail reservasi tiket anda di bawah ini."
              : "Silahkan isi form di bawah untuk mereservasi tiket."}
          </DialogDescription>
        </DialogHeader>
        <ReservasiTiketForm
          onSubmit={onSubmit}
          atraksiList={atraksiList}
          isEditing={isEditing}
          initialData={initialData}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ReservasiTiketFormModal;
