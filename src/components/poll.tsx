"use client";

import { getProvider, hasVoted, vote } from "@/actions/blockchain.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getPollWinner } from "@/utils/helper";
import { PollProps } from "@/utils/types";
import { BN, Program } from "@coral-xyz/anchor";
import { Polly } from "@project/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { format } from "date-fns";
import SharePollDialog from "./share-poll-dailog";
import { Spinner } from "./spinner";
import { Button } from "./ui/button";
import { LedgerBar } from "./ui/ledger-bar";
import { StatusPill } from "./ui/status-pill";
import { VerifiedChip } from "./ui/verified-chip";
import { getTimeframe, formatNumber } from "@/lib/format";
import { ArrowLeft, Check, Share2, Trophy } from "lucide-react";

function DonutTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-lg">
      <p className="font-medium text-popover-foreground">{d.name}</p>
      <p className="font-mono text-muted-foreground">
        {formatNumber(d.value)} votes
      </p>
    </div>
  );
}

export default function Poll({ pollData }: { pollData: PollProps }) {
  const router = useRouter();
  const totalVotes = pollData.totalVotes;
  const [voted, setVoted] = useState(false);
  const [votedFor, setVotedFor] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const winner = getPollWinner(pollData);
  const frame = getTimeframe(pollData.startDate, pollData.endDate);
  const { publicKey, signTransaction, signAllTransactions, wallet } = useWallet();
  const { setVisible } = useWalletModal();
  const program = useMemo(
    () => getProvider({ publicKey, signTransaction, signAllTransactions }),
    [publicKey, signTransaction, signAllTransactions]
  );
  const { toast } = useToast();

  const leading =
    totalVotes > 0
      ? pollData.options.reduce((a, b) => (b.votes > a.votes ? b : a))
      : null;

  const checkVoted = async () => {
    const voteStatus = await hasVoted({
      program: program as Program<Polly>,
      publicKey: publicKey!,
      pollId: new BN(pollData.id),
    });
    setVotedFor(voteStatus?.candidateId.toString() ?? null);
    setVoted(voteStatus?.hasVoted ?? false);
  };

  useEffect(() => {
    if (!program || voted || !publicKey || !pollData) return;
    checkVoted();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [program, publicKey, wallet, voted]);

  const handleVote = async (option: any) => {
    if (frame !== "live") {
      toast({
        title: frame === "closed" ? "This poll has closed" : "Voting hasn't opened",
        description:
          frame === "closed"
            ? "The voting window is over — results are final and on-chain."
            : "Come back when the poll opens to cast your vote.",
        variant: "destructive",
      });
      return;
    }
    if (!publicKey || !wallet) {
      setVisible(true);
      return;
    }
    setPendingId(option.id.toString());
    try {
      const voteData = await vote({
        program: program as Program<Polly>,
        publicKey: publicKey!,
        pollId: new BN(pollData.id),
        candidateId: new BN(option.id),
      });
      if (voteData.hasVoted) {
        setVoted(true);
        setVotedFor(option.id.toString());
        toast({
          title: "Vote recorded on-chain",
          description: `You voted for ${option.name}. It's now part of the public ledger.`,
        });
        router.refresh();
      }
    } catch (error) {
      console.error("Error voting:", error);
      toast({
        title: "Vote failed",
        description:
          "The transaction was rejected or you've already voted in this poll.",
        variant: "destructive",
      });
    } finally {
      setPendingId(null);
    }
  };

  const canVote = frame === "live" && !voted;

  return (
    <div className="mx-auto w-full max-w-4xl">
      <Link
        href="/polls"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> All polls
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <StatusPill frame={frame} />
            <span className="font-mono text-xs text-muted-foreground">
              Poll #{pollData.id}
            </span>
          </div>
          <SharePollDialog
            pollAdress={pollData.publicKey}
            candidates={pollData.options}
            trigger={
              <button
                aria-label="Share poll"
                className="inline-flex h-9 items-center gap-2 rounded-full border border-border px-3 text-sm text-muted-foreground transition-colors hover:border-brand/40 hover:text-foreground"
              >
                <Share2 className="h-4 w-4" /> Share
              </button>
            }
          />
        </div>

        <h1 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          {pollData.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
          <VerifiedChip address={pollData.publicKey} />
          <span className="font-mono text-xs text-muted-foreground">
            {format(new Date(pollData.startDate), "MMM d")} —{" "}
            {format(new Date(pollData.endDate), "MMM d, yyyy")}
          </span>
        </div>

        {frame === "closed" && winner && (
          <div className="mt-5 flex items-center gap-2 rounded-xl border border-upcoming/30 bg-upcoming/10 px-4 py-3 text-sm">
            <Trophy className="h-4 w-4 text-upcoming" />
            <span className="text-muted-foreground">Final result —</span>
            <span className="font-semibold text-foreground">{winner.name}</span>
            <span className="text-muted-foreground">won this poll.</span>
          </div>
        )}
      </div>

      {/* Results */}
      <Card className="mb-6">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="font-display text-lg">Results</CardTitle>
          <span className="font-mono text-sm text-muted-foreground">
            <span className="text-foreground">{formatNumber(totalVotes)}</span> votes
          </span>
        </CardHeader>
        <CardContent>
          {totalVotes > 0 ? (
            <div className="grid items-center gap-8 md:grid-cols-2">
              <div className="relative mx-auto h-60 w-full max-w-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pollData.options}
                      dataKey="votes"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius="62%"
                      outerRadius="90%"
                      paddingAngle={2}
                      stroke="none"
                    >
                      {pollData.options.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<DonutTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display text-2xl font-bold">
                    {formatNumber(totalVotes)}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    votes
                  </span>
                </div>
              </div>
              <LedgerBar
                options={pollData.options}
                totalVotes={totalVotes}
                height="h-3"
                showLegend
                leadingId={leading?.id}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/70 py-12 text-center">
              <div className="mb-3 grid h-12 w-12 place-items-center rounded-full border border-brand/20 bg-brand/5 text-brand">
                <Check className="h-6 w-6" />
              </div>
              <p className="font-display text-base font-semibold">No votes yet</p>
              <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                {frame === "live"
                  ? "Be the first to put a vote on the ledger."
                  : frame === "upcoming"
                  ? "Voting hasn't opened yet."
                  : "This poll closed without any votes."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Vote */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg">
            {voted ? "You've voted" : "Cast your vote"}
          </CardTitle>
          {frame === "live" && !voted && (
            <p className="text-sm text-muted-foreground">
              One wallet, one vote. Your choice is permanent once confirmed.
            </p>
          )}
        </CardHeader>
        <CardContent>
          <ul className="space-y-2.5">
            {pollData.options.map((option) => {
              const pct =
                totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
              const isChoice = votedFor === option.id.toString();
              const isPending = pendingId === option.id.toString();
              return (
                <li
                  key={option.id}
                  className={`flex items-center gap-4 rounded-xl border p-3 transition-colors ${
                    isChoice ? "border-brand/40 bg-brand/5" : "border-border/70"
                  }`}
                >
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: option.color }}
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{option.name}</p>
                    <p className="font-mono text-xs text-muted-foreground">
                      {formatNumber(option.votes)} votes · {pct.toFixed(1)}%
                    </p>
                  </div>
                  {isChoice ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1.5 text-sm font-medium text-brand">
                      <Check className="h-4 w-4" /> Your vote
                    </span>
                  ) : (
                    <Button
                      onClick={() => handleVote(option)}
                      disabled={!canVote || isPending}
                      variant={canVote ? "default" : "secondary"}
                      size="sm"
                      className="min-w-[88px]"
                    >
                      {isPending ? <Spinner size="sm" /> : "Vote"}
                    </Button>
                  )}
                </li>
              );
            })}
          </ul>

          {!publicKey && frame === "live" && !voted && (
            <button
              onClick={() => setVisible(true)}
              className="mt-4 w-full rounded-xl border border-dashed border-border/70 py-3 text-sm text-muted-foreground transition-colors hover:border-brand/40 hover:text-foreground"
            >
              Connect a wallet to vote
            </button>
          )}
          {frame === "upcoming" && (
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Voting opens {format(new Date(pollData.startDate), "MMM d, yyyy")}.
            </p>
          )}
          {frame === "closed" && (
            <p className="mt-4 text-center text-sm text-muted-foreground">
              This poll is closed. Results are final and recorded on-chain.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
