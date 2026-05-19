import { cn } from "@/lib/utils";
import { forwardRef } from "react";

const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    className={cn(
      "flex h-12 w-full rounded-[10px] border border-line bg-surface-2 px-4 text-[15px] text-ink placeholder:text-muted/70 focus:border-signal/50 focus:outline-none focus:ring-2 focus:ring-signal/30 transition-colors duration-200",
      className
    )}
    ref={ref}
    {...props}
  />
));
Input.displayName = "Input";

export { Input };
