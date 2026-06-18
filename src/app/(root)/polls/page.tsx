"use client";

import {
  getAllPollsWithCandidates,
  getProvider,
  getReadonlyProvider,
} from "@/actions/blockchain.actions";
import { CreatePollDialog } from "@/components/create-poll";
import { PollCard } from "@/components/poll-card";
import { PollGridSkeleton } from "@/components/poll-card-skeleton";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Button } from "@/components/ui/button";
import { PollProps } from "@/utils/types";
import { formatNumber, getTimeframe } from "@/lib/format";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Inbox, Plus, Wallet } from "lucide-react";

const FILTERS = ["all", "live", "upcoming", "closed"] as const;

export default function PollsPage() {
  const [polls, setPolls] = useState<PollProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentState, setCurrentState] = useState<string>("all");
  const { publicKey, signTransaction, signAllTransactions } = useWallet();
  const { setVisible } = useWalletModal();

  const programReadOnly = useMemo(() => getReadonlyProvider(), []);
  const program = useMemo(
    () => getProvider({ publicKey, signTransaction, signAllTransactions }),
    [publicKey, signTransaction, signAllTransactions]
  );

  const fetchAllPolls = async (force = false) => {
    try {
      const data = await getAllPollsWithCandidates({
        program: programReadOnly,
        force,
      });
      // newest first
      setPolls([...data].sort((a, b) => b.id - a.id));
    } catch (e) {
      console.error("Failed to load polls", e);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshPolls = () => fetchAllPolls(true);

  useEffect(() => {
    fetchAllPolls();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programReadOnly]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: polls.length, live: 0, upcoming: 0, closed: 0 };
    polls.forEach((p) => {
      c[getTimeframe(p.startDate, p.endDate)]++;
    });
    return c;
  }, [polls]);

  const totalVotes = useMemo(
    () =>
      polls.reduce(
        (sum, p) => sum + p.options.reduce((a, o) => a + o.votes, 0),
        0
      ),
    [polls]
  );

  const filtered = useMemo(() => {
    if (currentState === "all") return polls;
    return polls.filter((p) => getTimeframe(p.startDate, p.endDate) === currentState);
  }, [polls, currentState]);

  return (
    <div className="mx-auto w-full max-w-6xl">
      {/* Header */}
      <div className="flex flex-col gap-6 border-b border-border/60 pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            The public ledger of opinion
          </p>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Polls
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-sm">
            <Stat value={formatNumber(counts.all)} label="polls" />
            <span className="text-border">/</span>
            <Stat value={formatNumber(totalVotes)} label="votes" />
            <span className="text-border">/</span>
            <span className="flex items-center gap-1.5 text-live">
              <span className="h-1.5 w-1.5 rounded-full bg-live animate-live-pulse" />
              {counts.live} live now
            </span>
          </div>
        </div>

        {publicKey ? (
          <CreatePollDialog program={program!} publicKey={publicKey} onCreated={refreshPolls} />
        ) : (
          <Button size="lg" onClick={() => setVisible(true)} className="gap-2">
            <Wallet className="h-4 w-4" />
            Connect to create
          </Button>
        )}
      </div>

      {/* Filter */}
      <div className="sticky top-16 z-30 -mx-2 mt-6 mb-8 overflow-x-auto px-2 py-3">
        <SegmentedControl
          value={currentState}
          onChange={setCurrentState}
          options={FILTERS.map((f) => ({
            value: f,
            label: f[0].toUpperCase() + f.slice(1),
            count: counts[f],
          }))}
        />
      </div>

      {/* Content */}
      {isLoading ? (
        <PollGridSkeleton />
      ) : polls.length === 0 ? (
        <EmptyDashboard onConnect={() => setVisible(true)} canCreate={!!publicKey} program={program} publicKey={publicKey} onCreated={refreshPolls} />
      ) : filtered.length === 0 ? (
        <EmptyFilter state={currentState} onReset={() => setCurrentState("all")} />
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((poll) => (
            <PollCard key={poll.id} poll={poll} />
          ))}
        </motion.div>
      )}
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <span className="text-muted-foreground">
      <span className="text-foreground">{value}</span> {label}
    </span>
  );
}

function EmptyDashboard({
  canCreate,
  onConnect,
  program,
  publicKey,
  onCreated,
}: {
  canCreate: boolean;
  onConnect: () => void;
  program: any;
  publicKey: any;
  onCreated: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-card/30 px-6 py-20 text-center">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-brand/20 bg-brand/5 text-brand">
        <Inbox className="h-7 w-7" />
      </div>
      <h2 className="font-display text-xl font-semibold">No polls on-chain yet</h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Be the first to put a question on the ledger. Anyone with a wallet can
        vote, and no one — not even you — can change the result.
      </p>
      <div className="mt-6">
        {canCreate ? (
          <CreatePollDialog program={program} publicKey={publicKey} onCreated={onCreated} />
        ) : (
          <Button size="lg" onClick={onConnect} className="gap-2">
            <Plus className="h-4 w-4" />
            Connect & create the first poll
          </Button>
        )}
      </div>
    </div>
  );
}

function EmptyFilter({ state, onReset }: { state: string; onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-card/30 px-6 py-16 text-center">
      <h2 className="font-display text-lg font-semibold">No {state} polls right now</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Nothing matches this filter yet.
      </p>
      <Button variant="outline" className="mt-5" onClick={onReset}>
        View all polls
      </Button>
    </div>
  );
}
