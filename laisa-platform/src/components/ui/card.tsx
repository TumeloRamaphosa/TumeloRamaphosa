import { cn } from "@/lib/utils";
import { forwardRef } from "react";

const Card = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border border-line bg-surface/70 p-7 backdrop-blur-xl transition-colors duration-300 hover:border-white/15",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

export { Card };
