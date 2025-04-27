import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { WahanaForm } from "@/components/forms/WahanaForm";

interface WahanaFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: {
    jadwal: Date;
    kapasitas: number;
  };
  isEditing?: boolean;
  nama_wahana?: string;
}

const WahanaFormModal: React.FC<WahanaFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditing = false,
  nama_wahana,
}) => {
  const handleSubmit = (data: any) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Wahana" : "Tambah Wahana"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Ubah jadwal dan kapasitas wahana di bawah ini"
              : "Tambahkan wahana baru pada sistem"}
          </DialogDescription>
        </DialogHeader>
        <WahanaForm
          onSubmit={handleSubmit}
          initialValues={initialData}
          isEditing={isEditing}
          nama_wahana={nama_wahana}
        />
      </DialogContent>
    </Dialog>
  );
};

export default WahanaFormModal;
