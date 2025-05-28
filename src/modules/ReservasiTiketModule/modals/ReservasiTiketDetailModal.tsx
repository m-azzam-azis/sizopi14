import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Pencil, Trash } from "lucide-react";

interface ReservasiTiketDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: {
    nama_fasilitas: string;
    tanggal_kunjungan: Date;
    jumlah_tiket: number;
    status: "Aktif" | "Batal" | "Selesai";
    jenis_reservasi: "Atraksi" | "Wahana";
    lokasi?: string;
    peraturan?: string[];
    jadwal: Date | string;
  };
  onEdit?: () => void;
  onCancel?: () => void;
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

  const formatTime = (time: Date | string) => {
    if (typeof time === "string") {
      return time;
    }
    return format(time, "HH:mm");
  };

  const getStatusText = (status: string) => {
    return status === "Aktif"
      ? "Terjadwal"
      : status === "Batal"
      ? "Dibatalkan"
      : "Selesai";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>DETAIL RESERVASI</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {reservation.jenis_reservasi === "Atraksi" ? (
            <>
              <div>
                <p className="text-sm text-muted-foreground">Nama Atraksi:</p>
                <p className="font-semibold">{reservation.nama_fasilitas}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Lokasi:</p>
                <p className="font-semibold">{reservation.lokasi}</p>
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="text-sm text-muted-foreground">Nama Wahana:</p>
                <p className="font-semibold">{reservation.nama_fasilitas}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Peraturan:</p>
                <ul className="list-disc list-inside">
                  {reservation.peraturan &&
                    reservation.peraturan.map((rule, index) => (
                      <li key={index} className="text-sm">
                        {rule}
                      </li>
                    ))}
                </ul>
              </div>
            </>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Jam:</p>
              <p className="font-semibold">{formatTime(reservation.jadwal)}</p>
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
              <p className="font-semibold">{reservation.jumlah_tiket}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status:</p>
              <p className="font-semibold">
                {getStatusText(reservation.status)}
              </p>
            </div>
          </div>

          {(onEdit || onCancel) && (
            <div className="flex justify-end gap-2 pt-4">
              {onEdit && (
                <Button variant="default" onClick={onEdit}>
                  <Pencil className="mr-2 h-4 w-4" /> EDIT
                </Button>
              )}
              {onCancel && (
                <Button variant="destructive" onClick={onCancel}>
                  <Trash className="mr-2 h-4 w-4" /> BATALKAN RESERVASI
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReservasiTiketDetailModal;
