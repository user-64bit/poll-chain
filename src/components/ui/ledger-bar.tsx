"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { formatNumber } from "@/lib/format";

export type LedgerOption = {
  id?: string;
  name: string;
  votes: number;
  color: string;
};

/**
 * The PollChain signature: results rendered as a segmented "vote ledger".
 * Each segment is sized by vote share and overlaid with fine tally ticks,
 * so the bar reads as discrete recorded votes rather than an abstract
 * progress fill. Used on cards (compact) and the poll page (with legend).
 */
export function LedgerBar({
  options,
  totalVotes,
  className,
  height = "h-9",
  showLegend = false,
  leadingId,
}: {
  options: LedgerOption[];
  totalVotes: number;
  className?: string;
  height?: string;
  showLegend?: boolean;
  leadingId?: string;
}) {
  const hasVotes = totalVotes > 0;

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-lg border border-border/60 bg-muted/40",
          height
        )}
        role="img"
        aria-label={
          hasVotes
            ? `Vote distribution across ${options.length} options`
            : "No votes recorded yet"
        }
      >
        {hasVotes ? (
          <div className="flex h-full w-full">
            {options.map((option, index) => {
              const pct = (option.votes / totalVotes) * 100;
              if (pct === 0) return null;
              return (
                <motion.div
                  key={option.id ?? option.name}
                  initial={{ width: "0%" }}
                  whileInView={{ width: `${pct}%` }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="group relative h-full"
                  style={{ backgroundColor: option.color }}
                  title={`${option.name} — ${formatNumber(option.votes)} votes (${pct.toFixed(1)}%)`}
                >
                  {/* tally ticks */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-[0.18]"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(90deg, rgba(0,0,0,0.55) 0 1px, transparent 1px 9px)",
                    }}
                  />
                  {option.id === leadingId && (
                    <span className="absolute inset-0 ring-1 ring-inset ring-white/40" aria-hidden />
                  )}
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "repeating-linear-gradient(135deg, hsl(var(--muted-foreground) / 0.25) 0 1px, transparent 1px 10px)",
            }}
            aria-hidden
          />
        )}
        {!hasVotes && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              Awaiting first vote
            </span>
          </div>
        )}
      </div>

      {showLegend && hasVotes && (
        <ul className="mt-4 space-y-2.5">
          {options.map((option) => {
            const pct = (option.votes / totalVotes) * 100;
            const leading = option.id === leadingId;
            return (
              <li key={option.id ?? option.name} className="flex items-center gap-3">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: option.color }}
                  aria-hidden
                />
                <span
                  className={cn(
                    "min-w-0 flex-1 truncate text-sm",
                    leading ? "font-semibold text-foreground" : "text-muted-foreground"
                  )}
                >
                  {option.name}
                </span>
                <span className="font-mono text-xs tabular-nums text-muted-foreground">
                  {formatNumber(option.votes)}
                </span>
                <span
                  className={cn(
                    "w-14 text-right font-mono text-sm tabular-nums",
                    leading ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {pct.toFixed(1)}%
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
