import { TriangleAlert } from "lucide-react";
import * as React from "react";
import { Label } from "@/components/ui/label";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  label?: string;
  error?: string;
  prefix?: string;
  desc?: string;
  required?: boolean;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      icon,
      error,
      label,
      prefix,
      desc,
      required,
      rightIcon,
      ...props
    },
    ref
  ) => {
    const clonedIcon = icon
      ? React.cloneElement(
          icon as React.ReactElement,
          {
            className:
              "absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-4",
          } as React.SVGProps<SVGSVGElement>
        )
      : null;

    const clonedRightIcon = rightIcon
      ? React.cloneElement(
          rightIcon as React.ReactElement,
          {
            className:
              "absolute right-3 top-1/2 transform -translate-y-1/2 text-black w-4",
          } as React.SVGProps<SVGSVGElement>
        )
      : null;

    return (
      <div className="space-y-2">
        <Label>
          {label} {required && <span className="text-red-600">*</span>}
        </Label>
        <div className="relative">
          {icon && clonedIcon}
          {prefix && (
            <div className="absolute left-3 md:mt-0 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
              <span className="text-neutral-900 text-b8">{prefix}</span>
              <div className="h-4 w-[1px] bg-neutral-900"></div>
            </div>
          )}
          <input
            type={type}
            className={cn(
              "disabled:opacity-40 px-4 py-3 flex h-12 w-full rounded-[8px] border-[1px] font-normal bg-white text-b8 file:border-0 file:bg-transparent file:text-b8 file:font-medium placeholder:text-gray-500 focus-visible:outline-none disabled:cursor-not-allowed  hover:placeholder:text-black/100 transition-all duration-500",
              icon ? "pl-10" : rightIcon ? "pr-10" : prefix ? "pl-12" : "pl-3",
              error
                ? "border-error"
                : "enabled:hover:border-black focus:border-black",
              className
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && clonedRightIcon}
        </div>
        {error && (
          <div className="flex gap-2 items-center text-error">
            <TriangleAlert className="w-4" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}
        {desc && <div className="text-s8">{desc}</div>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
