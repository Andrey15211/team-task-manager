import { cn } from "@/lib/cn";

export function Avatar({
  initials,
  color,
  className,
}: {
  initials: string;
  color: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white ring-2 ring-white",
        className,
      )}
      style={{ backgroundColor: color }}
      aria-label={initials}
    >
      {initials}
    </span>
  );
}
