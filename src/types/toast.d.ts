// filepath: c:\Users\sayyi\Documents\Semester 4\basdat\tk basdat\webapp\sizopi14\src\types\toast.d.ts
import { ReactNode } from 'react';

// Extend the toast types to accept React nodes
declare module "@/hooks/use-toast" {
  interface ToastProps {
    title?: ReactNode;
    description?: ReactNode;
  }
}
