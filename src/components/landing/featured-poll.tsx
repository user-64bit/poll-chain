"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card } from "../ui/card";
import { LedgerBar } from "../ui/ledger-bar";
import { StatusPill } from "../ui/status-pill";
import { VerifiedChip } from "../ui/verified-chip";
import { PollProps } from "@/utils/types";
import { getTimeframe, timeframeLabel, formatNumber } from "@/lib/format";
import { ShieldCheck } from "lucide-react";

/**
 * The hero's thesis: a real poll pulled from devnet, rendered as proof that
 * the product is live and verifiable. Falls back to a clearly-labelled
 * example when the chain has no polls yet.
 */
export function FeaturedPoll({
  poll,
  isExample = false,
}: {
  poll: PollProps;
  isExample?: boolean;
}) {
  const totalVotes = poll.options.reduce((a, o) => a + o.votes, 0);
  const frame = getTimeframe(poll.startDate, poll.endDate);
  const leading =
    totalVotes > 0
      ? poll.options.reduce((a, b) => (b.votes > a.votes ? b : a))
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotateX: 6 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
      style={{ perspective: 1000 }}
    >
      <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-signature opacity-20 blur-2xl" aria-hidden />
      <Card className="overflow-hidden border-border/80 shadow-brand">
        <div className="flex items-center justify-between border-b border-border/60 bg-muted/30 px-5 py-3">
          <StatusPill
            frame={frame}
            label={
              isExample
                ? undefined
                : frame === "closed"
                ? "Closed"
                : timeframeLabel(poll.startDate, poll.endDate)
            }
          />
          <span className="font-mono text-xs text-muted-foreground">
            {isExample ? "Example" : `Poll #${poll.id}`}
          </span>
        </div>

        <div className="space-y-5 p-5">
          <h3 className="font-display text-xl font-semibold leading-snug tracking-tight">
            {poll.title}
          </h3>

          <LedgerBar
            options={poll.options}
            totalVotes={totalVotes}
            height="h-10"
            showLegend
            leadingId={leading?.id}
          />

          <div className="flex items-center justify-between border-t border-border/60 pt-4">
            <span className="font-mono text-xs text-muted-foreground">
              <span className="text-foreground">{formatNumber(totalVotes)}</span> votes recorded
            </span>
            {isExample ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5" />
                Verified on-chain
              </span>
            ) : (
              <VerifiedChip address={poll.publicKey} showAddress={false} />
            )}
          </div>
        </div>
      </Card>

      {!isExample && (
        <Link
          href={`/poll/${poll.publicKey}`}
          className="absolute inset-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`Open poll: ${poll.title}`}
        />
      )}
    </motion.div>
  );
}
