"use client";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-mono text-sm font-bold uppercase tracking-wider transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-cyan disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-cyber-cyan text-black hover:bg-cyber-cyan/80 hover:shadow-[0_0_30px_rgba(0,240,255,0.5)]",
        pink: "bg-cyber-pink text-white hover:bg-cyber-pink/80 hover:shadow-[0_0_30px_rgba(255,45,120,0.5)]",
        magenta:
          "bg-cyber-magenta text-white hover:bg-cyber-magenta/80 hover:shadow-[0_0_30px_rgba(255,0,255,0.5)]",
        outline:
          "border border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan/10 hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]",
        ghost: "text-cyber-cyan hover:bg-cyber-cyan/10",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        orange:
          "bg-gradient-to-r from-cyber-orange to-cyber-pink text-white hover:shadow-[0_0_30px_rgba(255,107,0,0.5)]",
      },
      size: {
        default: "h-11 px-6 py-2 rounded-lg",
        sm: "h-9 px-4 rounded-md text-xs",
        lg: "h-14 px-10 rounded-xl text-base",
        xl: "h-16 px-14 rounded-xl text-lg",
        icon: "h-10 w-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
