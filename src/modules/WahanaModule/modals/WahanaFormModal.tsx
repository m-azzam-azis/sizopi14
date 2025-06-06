import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import WahanaForm from "../forms/WahanaForm";
import {
  CreateWahanaFormValues,
  EditWahanaFormValues,
} from "../forms/WahanaForm";

interface WahanaFormModalProps<
  T = CreateWahanaFormValues | EditWahanaFormValues
> {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: T) => void;
  isEditing: boolean;
  nama_wahana?: string;
  initialData?: {
    jadwal: string | Date;
    kapasitas: number;
  };
}

const WahanaFormModal = <
  T extends CreateWahanaFormValues | EditWahanaFormValues
>({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditing = false,
  nama_wahana,
}: WahanaFormModalProps<T>) => {
  const handleSubmit = (
    data: CreateWahanaFormValues | EditWahanaFormValues
  ) => {
    onSubmit(data as T);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] max-h-[95vh] md:max-h-[90vh] overflow-y-auto scrollbar-hide">
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
