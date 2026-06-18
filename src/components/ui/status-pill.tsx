import { cn } from "@/lib/utils";
import type { Timeframe } from "@/lib/format";

const STYLES: Record<Timeframe, { dot: string; text: string; ring: string; label: string }> = {
  live: {
    dot: "bg-live animate-live-pulse",
    text: "text-live",
    ring: "border-live/30 bg-live/10",
    label: "Live",
  },
  upcoming: {
    dot: "bg-upcoming",
    text: "text-upcoming",
    ring: "border-upcoming/30 bg-upcoming/10",
    label: "Upcoming",
  },
  closed: {
    dot: "bg-closed",
    text: "text-closed",
    ring: "border-border bg-muted/40",
    label: "Closed",
  },
};

export function StatusPill({
  frame,
  label,
  className,
}: {
  frame: Timeframe;
  label?: string;
  className?: string;
}) {
  const s = STYLES[frame];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wider",
        s.ring,
        s.text,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} aria-hidden />
      {label ?? s.label}
    </span>
  );
}
