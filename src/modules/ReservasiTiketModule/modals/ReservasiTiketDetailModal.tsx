import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ReservasiTiket } from "@/types/schema";

interface ReservasiTiketDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: ReservasiTiket;
  onEdit: () => void;
  onCancel: () => void;
}

const ReservasiTiketDetailModal: React.FC<ReservasiTiketDetailModalProps> = ({
  isOpen,
  onClose,
  reservation,
  onEdit,
  onCancel,
}) => {
  const formatDate = (date: Date) => {
    return format(date, "dd MMMM yyyy");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Detail Reservasi</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Nama Atraksi:</p>
              <p className="font-semibold">{reservation.nama_fasilitas}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Lokasi:</p>
              <p className="font-semibold">{reservation.lokasi}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Jam:</p>
              <p className="font-semibold">{reservation.jadwal}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tanggal:</p>
              <p className="font-semibold">
                {formatDate(reservation.tanggal_kunjungan)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Jumlah Tiket:</p>
              <p className="font-semibold">{reservation.jumlah_tiket} tiket</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status:</p>
              <Badge
                className={
                  reservation.status === "Terjadwal"
                    ? "bg-green-500"
                    : "bg-red-500"
                }
              >
                {reservation.status}
              </Badge>
            </div>
          </div>
        </div>

        {reservation.status === "Terjadwal" && (
          <DialogFooter className="flex space-x-2 justify-end">
            <Button variant="outline" onClick={onEdit}>
              EDIT
            </Button>
            <Button variant="destructive" onClick={onCancel}>
              BATALKAN RESERVASI
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReservasiTiketDetailModal;
