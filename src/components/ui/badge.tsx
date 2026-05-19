import { cn } from "@/lib/utils";

export function Badge({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-line bg-surface-2 px-4 py-1.5 text-[13px] font-medium text-muted",
        className
      )}
      {...props}
    />
  );
}
