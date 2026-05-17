"use client";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet/60 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-r from-violet to-teal text-ink hover:shadow-[0_16px_40px_-12px_rgba(109,94,248,0.6)] hover:-translate-y-0.5",
        outline:
          "border border-line text-text hover:border-teal/60 hover:bg-white/[0.03]",
        ghost: "text-text hover:bg-white/[0.05]",
      },
      size: {
        default: "h-12 px-7 rounded-full text-[15px]",
        sm: "h-10 px-5 rounded-full text-sm",
        lg: "h-14 px-9 rounded-full text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };
