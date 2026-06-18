"use client";

import { PollProps } from "@/utils/types";
import Link from "next/link";
import { Card } from "./ui/card";
import { LedgerBar } from "./ui/ledger-bar";
import { StatusPill } from "./ui/status-pill";
import SharePollDialog from "./share-poll-dailog";
import { motion } from "framer-motion";
import { ArrowRight, Share2, Trophy } from "lucide-react";
import { getTimeframe, timeframeLabel, formatNumber } from "@/lib/format";
import { getPollWinner } from "@/utils/helper";

export const PollCard = ({ poll }: { poll: PollProps }) => {
  const totalVotes = poll.options.reduce((acc, o) => acc + o.votes, 0);
  const frame = getTimeframe(poll.startDate, poll.endDate);
  const winner = frame === "closed" ? getPollWinner({ ...poll, totalVotes }) : null;
  const leading = totalVotes > 0
    ? poll.options.reduce((a, b) => (b.votes > a.votes ? b : a))
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Card className="group flex h-full flex-col gap-4 p-5 transition-shadow duration-300 hover:border-brand/40 hover:shadow-card-hover">
        <div className="flex items-center justify-between gap-2">
          <StatusPill frame={frame} label={frame === "closed" ? "Closed" : timeframeLabel(poll.startDate, poll.endDate)} />
          <span className="font-mono text-xs text-muted-foreground">#{poll.id}</span>
        </div>

        <Link href={`/poll/${poll.publicKey}`} className="block">
          <h3 className="font-display text-lg font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-brand">
            {poll.title}
          </h3>
        </Link>

        {winner && (
          <div className="flex items-center gap-1.5 text-sm">
            <Trophy className="h-4 w-4 text-upcoming" />
            <span className="text-muted-foreground">Winner</span>
            <span className="font-semibold text-foreground">{winner.name}</span>
          </div>
        )}

        <div className="mt-auto space-y-3">
          <LedgerBar
            options={poll.options}
            totalVotes={totalVotes}
            height="h-8"
            leadingId={leading?.id}
          />

          <div className="flex items-center justify-between">
            <p className="font-mono text-xs text-muted-foreground">
              <span className="text-foreground">{formatNumber(totalVotes)}</span> votes
              <span className="px-1.5 text-border">·</span>
              {poll.options.length} options
            </p>
            <div className="flex items-center gap-1">
              <SharePollDialog
                pollAdress={poll.publicKey}
                candidates={poll.options}
                trigger={
                  <button
                    aria-label="Share poll"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                }
              />
              <Link
                href={`/poll/${poll.publicKey}`}
                className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium text-brand transition-colors hover:bg-brand/10"
              >
                View
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
