import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import HewanForm, { HewanFormValues } from "../forms/HewanForm";

interface HewanFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: HewanFormValues) => void;
  initialData?: Partial<HewanFormValues>;
  isEditing?: boolean;
}

const HewanFormModal: React.FC<HewanFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditing = false,
}) => {
  const handleSubmit = (data: HewanFormValues) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Hewan" : "Tambah Hewan Baru"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Ubah informasi hewan di bawah ini."
              : "Masukkan informasi hewan baru di bawah ini."}
          </DialogDescription>
        </DialogHeader>
        <HewanForm
          onSubmit={handleSubmit}
          initialData={initialData}
          isEditing={isEditing}
        />
      </DialogContent>
    </Dialog>
  );
};

export default HewanFormModal;
