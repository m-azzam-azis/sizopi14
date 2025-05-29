import { toast as useToast } from "@/hooks/use-toast";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

type ToastParams = {
  title: string;
  description: string;
  variant?: "default" | "destructive" | "success" | "warning";
}

export const showToast = ({ title, description, variant = "default" }: ToastParams) => {
  // Use different styling based on the variant
  if (variant === "success") {
    return useToast({
      // Using simple string title and description to avoid type conflicts
      title: "✓ " + title,
      description: description,
      className: "bg-green-50 border-2 border-green-400 text-green-900 shadow-xl",
      duration: 8000, // Show for 8 seconds
      variant: "success",
    });
  } else if (variant === "warning") {
    return useToast({
      title: "⚠️ " + title,
      description: description,
      className: "bg-amber-50 border-amber-300 text-amber-900",
    });
  } else if (variant === "destructive") {
    return useToast({
      title: "❌ " + title,
      description: description,
      className: "bg-red-50 border-red-300 text-red-900",
      variant: "destructive",
    });
  } else {
    // Default toast
    return useToast({
      title,
      description,
    });
  }
};
