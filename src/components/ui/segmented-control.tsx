"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export type SegmentOption = {
  value: string;
  label: string;
  count?: number;
};

export function SegmentedControl({
  options,
  value,
  onChange,
  className,
}: {
  options: SegmentOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      aria-label="Filter polls"
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-border bg-card/60 p-1 backdrop-blur-sm",
        className
      )}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "relative rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {active && (
              <motion.span
                layoutId="segmented-active"
                className="absolute inset-0 rounded-full bg-primary"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {option.label}
              {typeof option.count === "number" && (
                <span
                  className={cn(
                    "font-mono text-[11px] tabular-nums",
                    active ? "text-primary-foreground/80" : "text-muted-foreground/70"
                  )}
                >
                  {option.count}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
