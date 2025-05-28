import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AtraksiForm } from "../forms/AtraksiForm";
import {
  CreateAtraksiFormValues,
  EditAtraksiFormValues,
} from "../forms/AtraksiForm";

interface Pelatih {
  id: string;
  name: string;
}

interface Hewan {
  id: string;
  name: string;
  spesies: string;
}

interface AtraksiFormModalProps<
  T = CreateAtraksiFormValues | EditAtraksiFormValues
> {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: T) => void;
  initialData?: {
    jadwal: string | Date;
    kapasitas: number;
  };
  isEditing: boolean;
  nama_atraksi?: string;
  lokasi?: string;
  pelatih?: string;
  hewan_terlibat?: string;
  pelatihList?: Pelatih[];
  hewanList?: Hewan[];
}

const AtraksiFormModal = <
  T extends CreateAtraksiFormValues | EditAtraksiFormValues
>({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditing = false,
  nama_atraksi,
  lokasi,
  pelatih,
  hewan_terlibat,
  pelatihList = [],
  hewanList = [],
}: AtraksiFormModalProps<T>) => {
  const handleSubmit = (
    data: CreateAtraksiFormValues | EditAtraksiFormValues
  ) => {
    onSubmit(data as T);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] max-h-[95vh] md:max-h-[90vh] overflow-y-auto scrollbar-hide">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Atraksi" : "Tambah Atraksi"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Ubah jadwal dan kapasitas atraksi di bawah ini"
              : "Tambahkan atraksi baru pada sistem"}
          </DialogDescription>
        </DialogHeader>
        <AtraksiForm
          onSubmit={handleSubmit}
          initialValues={initialData}
          isEditing={isEditing}
          nama_atraksi={nama_atraksi}
          lokasi={lokasi}
          pelatih={pelatih}
          hewan_terlibat={hewan_terlibat}
          pelatihList={pelatihList}
          hewanList={hewanList}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AtraksiFormModal;
