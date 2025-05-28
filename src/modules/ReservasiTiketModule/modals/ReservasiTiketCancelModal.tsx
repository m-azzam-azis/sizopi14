import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ReservasiTiketCancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ReservasiTiketCancelModal: React.FC<ReservasiTiketCancelModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>BATALKAN RESERVASI</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>Apakah anda yakin ingin membatalkan reservasi ini?</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            TIDAK
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            YA
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReservasiTiketCancelModal;
