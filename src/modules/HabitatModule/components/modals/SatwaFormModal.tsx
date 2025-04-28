import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  SatwaForm,
  SatwaFormValues,
} from "@/modules/HabitatModule/components/forms/SatwaForm";

interface SatwaFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SatwaFormValues) => void;
  initialData?: SatwaFormValues;
  habitats: { id: string; name: string }[];
  isEditing?: boolean;
}

const SatwaFormModal: React.FC<SatwaFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  habitats,
  isEditing = false,
}) => {
  const handleSubmit = (data: SatwaFormValues) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-525px">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Data Satwa" : "Tambah Data Satwa"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Ubah informasi satwa di bawah ini"
              : "Tambahkan satwa baru pada sistem"}
          </DialogDescription>
        </DialogHeader>
        <SatwaForm
          initialData={initialData}
          onSubmit={handleSubmit}
          habitats={habitats}
          isEditing={isEditing}
        />
      </DialogContent>
    </Dialog>
  );
};

export default SatwaFormModal;
