'use client';

import * as ToastPrimitives from '@radix-ui/react-toast';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      'fixed bottom-0 right-0 top-auto z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:max-w-[420px]',
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  'group pointer-events-auto border-solid border-2 relative flex w-fit items-center justify-start space-x-3 overflow-hidden rounded-[15px] shadow-lg transition-all data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-top-full data-[state=closed]:slide-out-to-right-full data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:sm:slide-in-from-bottom-full ml-auto px-[25px] py-[15px]',
  {    variants: {
      variant: {
        default:
          'bg-blue-500 text-[#FFFFFF] border-blue-600',        loading:
          'bg-blue-500 text-[#FFFFFF] border-blue-600',
        error: 'bg-error text-[#FFFFFF] border-red-600',
        success: 'bg-green-100 text-green-900 border-green-500 font-medium',
        destructive: 'bg-red-100 text-red-900 border-red-500 font-medium',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, children, ...props }, ref) => {
  const icon =
    variant === 'loading' ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className="animate-spin"
      >
        <path
          d="M12 2.25C6.616 2.25 2.25 6.616 2.25 12C2.25 17.384 6.616 21.75 12 21.75V19.313C10.5539 19.3128 9.14035 18.8838 7.93805 18.0803C6.73575 17.2768 5.79871 16.1348 5.2454 14.7987C4.6921 13.4627 4.54738 11.9925 4.82955 10.5743C5.11171 9.15596 5.80809 7.85318 6.83064 6.83064C7.85318 5.80809 9.15596 5.11171 10.5743 4.82955C11.9925 4.54738 13.4627 4.6921 14.7987 5.2454C16.1348 5.79871 17.2768 6.73575 18.0803 7.93805C18.8838 9.14035 19.3128 10.5539 19.313 12H21.75C21.75 6.616 17.384 2.25 12 2.25Z"
          fill="currentColor"
        />
      </svg>
    ) : variant === 'error' ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 13C11.45 13 11 12.55 11 12V8C11 7.45 11.45 7 12 7C12.55 7 13 7.45 13 8V12C13 12.55 12.55 13 12 13ZM13 17H11V15H13V17Z"
          fill="currentColor"
        />
      </svg>
    ) : variant === 'success' ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M12 1.5C14.7848 1.5 17.4555 2.60625 19.4246 4.57538C21.3938 6.54451 22.5 9.21523 22.5 12C22.5 14.7848 21.3938 17.4555 19.4246 19.4246C17.4555 21.3938 14.7848 22.5 12 22.5C9.21523 22.5 6.54451 21.3938 4.57538 19.4246C2.60625 17.4555 1.5 14.7848 1.5 12C1.5 9.21523 2.60625 6.54451 4.57538 4.57538C6.54451 2.60625 9.21523 1.5 12 1.5ZM10.692 14.0715L8.3595 11.7375C8.27588 11.6539 8.17661 11.5876 8.06736 11.5423C7.9581 11.497 7.84101 11.4737 7.72275 11.4737C7.60449 11.4737 7.4874 11.497 7.37814 11.5423C7.26889 11.5876 7.16962 11.6539 7.086 11.7375C6.91712 11.9064 6.82225 12.1354 6.82225 12.3743C6.82225 12.6131 6.91712 12.8421 7.086 13.011L10.056 15.981C10.1394 16.065 10.2386 16.1317 10.3479 16.1773C10.4571 16.2228 10.5744 16.2462 10.6927 16.2462C10.8111 16.2462 10.9284 16.2228 11.0376 16.1773C11.1469 16.1317 11.2461 16.065 11.3295 15.981L17.4795 9.8295C17.5642 9.74623 17.6316 9.647 17.6778 9.53755C17.724 9.42809 17.7481 9.31057 17.7487 9.19177C17.7492 9.07297 17.7262 8.95523 17.6811 8.84535C17.6359 8.73547 17.5694 8.63562 17.4854 8.55156C17.4015 8.46751 17.3017 8.4009 17.1919 8.3556C17.0821 8.31029 16.9644 8.28718 16.8455 8.28759C16.7267 8.288 16.6092 8.31193 16.4997 8.358C16.3902 8.40407 16.2909 8.47136 16.2075 8.556L10.692 14.0715Z"
          fill="currentColor"
        />
      </svg>
    ) : null;

  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    >
      {icon}
      {children}
    </ToastPrimitives.Root>
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      'inline-flex h-8 shrink-0 items-center justify-center rounded-md px-3 text-s5 font-bold font-ubuntu ring-offset-white transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-neutral-950 dark:focus:ring-neutral-300',
      className
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      'absolute right-2 rounded-md p-1 text-white opacity-0 transition-opacity hover:text-neutral-100 focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100',
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn('text-sm font-medium font-ubuntu', className)}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn('text-sm hidden', className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  type ToastActionElement,
  type ToastProps,
};
