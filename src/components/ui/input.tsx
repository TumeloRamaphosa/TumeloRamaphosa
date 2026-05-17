import { cn } from "@/lib/utils";
import { forwardRef } from "react";

const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    className={cn(
      "flex h-12 w-full rounded-xl border border-line bg-ink-2/70 px-4 text-[15px] text-text placeholder:text-muted/70 focus:border-violet/50 focus:outline-none focus:ring-2 focus:ring-violet/30 transition-all duration-200",
      className
    )}
    ref={ref}
    {...props}
  />
));
Input.displayName = "Input";

export { Input };
