import { cn } from "@/lib/utils";
import { forwardRef } from "react";

const Card = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-[14px] border border-line bg-surface p-7 transition-colors duration-200 hover:border-primary/30",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

export { Card };
