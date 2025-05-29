import { toast } from "react-hot-toast";

export const handleDbNotification = (message: string | null | undefined): boolean => {
  if (!message) return false;
  
  if (message.includes("SUKSES:")) {
    toast.success(message, {
      duration: 5000,
    });
    return true;
  }
  return false;
};