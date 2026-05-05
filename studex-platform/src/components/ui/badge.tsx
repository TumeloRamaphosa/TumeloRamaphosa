import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider",
  {
    variants: {
      variant: {
        default: "bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/30",
        pink: "bg-cyber-pink/20 text-cyber-pink border border-cyber-pink/30",
        magenta: "bg-cyber-magenta/20 text-cyber-magenta border border-cyber-magenta/30",
        green: "bg-cyber-green/20 text-cyber-green border border-cyber-green/30",
        orange: "bg-cyber-orange/20 text-cyber-orange border border-cyber-orange/30",
        destructive: "bg-red-500/20 text-red-400 border border-red-500/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
