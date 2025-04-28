import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  HabitatForm,
  HabitatFormValues,
} from "@/modules/HabitatModule/components/forms/HabitatForm";

interface HabitatFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: HabitatFormValues) => void;
  initialData?: {
    name: string;
    area: number;
    capacity: number;
    environmentStatus: string;
  };
  isEditing?: boolean;
}

const HabitatFormModal: React.FC<HabitatFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditing = false,
}) => {
  const handleSubmit = (data: HabitatFormValues) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-525px">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Habitat" : "Tambah Habitat"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Ubah informasi habitat di bawah ini"
              : "Tambahkan habitat baru pada sistem"}
          </DialogDescription>
        </DialogHeader>
        <HabitatForm
          initialData={initialData}
          onSubmit={handleSubmit}
          isEditing={isEditing}
        />
      </DialogContent>
    </Dialog>
  );
};

export default HabitatFormModal;
