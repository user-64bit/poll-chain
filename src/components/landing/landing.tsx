"use client";

import {
  getAllPollsWithCandidates,
  getReadonlyProvider,
} from "@/actions/blockchain.actions";
import { PollProps } from "@/utils/types";
import { formatCompact, getTimeframe } from "@/lib/format";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "../ui/button";
import { PollCard } from "../poll-card";
import { FeaturedPoll } from "./featured-poll";
import {
  ArrowRight,
  CheckCircle2,
  XCircle,
  PenLine,
  Vote,
  ShieldCheck,
} from "lucide-react";

const EXAMPLE_POLL: PollProps = {
  id: 42,
  title: "Who's the GOAT — Sachin or Virat?",
  publicKey: "ExamP1eY1eXamP1eY1eXamP1eY1eXamP1eY1e",
  candidates: 2,
  startDate: Date.now() - 1000 * 60 * 60 * 24,
  endDate: Date.now() + 1000 * 60 * 60 * 36,
  totalVotes: 1944,
  status: "running",
  options: [
    { id: "1", name: "Sachin Tendulkar", votes: 1204, color: "#7C5CFF" },
    { id: "2", name: "Virat Kohli", votes: 740, color: "#22D3EE" },
  ],
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

export function Landing() {
  const [polls, setPolls] = useState<PollProps[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const program = getReadonlyProvider();
    getAllPollsWithCandidates({ program })
      .then((data) => setPolls([...data].sort((a, b) => b.id - a.id)))
      .catch((e) => console.error("Landing load failed", e))
      .finally(() => setLoaded(true));
  }, []);

  const stats = useMemo(() => {
    const totalVotes = polls.reduce(
      (sum, p) => sum + p.options.reduce((a, o) => a + o.votes, 0),
      0
    );
    return { count: polls.length, votes: totalVotes };
  }, [polls]);

  // Featured: most-voted live poll → newest poll → labelled example.
  const featured = useMemo(() => {
    if (!polls.length) return { poll: EXAMPLE_POLL, isExample: true };
    const live = polls.filter(
      (p) => getTimeframe(p.startDate, p.endDate) === "live"
    );
    const pool = live.length ? live : polls;
    const best = pool.reduce((a, b) => {
      const av = a.options.reduce((s, o) => s + o.votes, 0);
      const bv = b.options.reduce((s, o) => s + o.votes, 0);
      return bv > av ? b : a;
    });
    return { poll: best, isExample: false };
  }, [polls]);

  const recent = polls.slice(0, 3);

  return (
    <div className="space-y-28 pb-24">
      {/* ===================== HERO ===================== */}
      <section className="relative pt-8">
        <div className="spotlight pointer-events-none absolute inset-0 -z-10" aria-hidden />
        <div className="bg-ledger-grid pointer-events-none absolute inset-0 -z-20 opacity-[0.4] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" aria-hidden />

        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 font-mono text-xs text-muted-foreground backdrop-blur"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-live animate-live-pulse" />
              BUILT ON SOLANA · LIVE ON DEVNET
            </motion.div>

            <motion.h1
              variants={fadeUp}
              custom={1}
              initial="hidden"
              animate="show"
              className="font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
            >
              Polls you don&apos;t
              <br />
              have to <span className="text-gradient">trust</span>.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={2}
              initial="hidden"
              animate="show"
              className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground"
            >
              Create a poll, share it anywhere, and let the world vote. One
              wallet, one vote — every result recorded forever on-chain. No
              host, no tampering, nothing to take on faith.
            </motion.p>

            <motion.div
              variants={fadeUp}
              custom={3}
              initial="hidden"
              animate="show"
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Button asChild size="lg" className="gap-2">
                <Link href="/polls">
                  Create a poll
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="#live">Explore live polls</Link>
              </Button>
            </motion.div>

            <motion.div
              variants={fadeUp}
              custom={4}
              initial="hidden"
              animate="show"
              className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-sm text-muted-foreground"
            >
              {loaded && stats.count > 0 ? (
                <>
                  <span>
                    <span className="text-foreground">{formatCompact(stats.count)}</span>{" "}
                    polls
                  </span>
                  <span className="text-border">·</span>
                  <span>
                    <span className="text-foreground">{formatCompact(stats.votes)}</span>{" "}
                    votes
                  </span>
                </>
              ) : (
                <span className="text-foreground">Fresh on devnet</span>
              )}
              <span className="text-border">·</span>
              <span className="text-foreground">100% on-chain</span>
            </motion.div>
          </div>

          <FeaturedPoll poll={featured.poll} isExample={featured.isExample} />
        </div>
      </section>

      {/* ===================== HOW IT WORKS ===================== */}
      <section>
        <SectionLabel>How it works</SectionLabel>
        <h2 className="mt-3 max-w-2xl font-display text-2xl font-bold tracking-tight sm:text-3xl">
          Three steps from a question to a result no one can fake.
        </h2>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            {
              n: "01",
              icon: PenLine,
              title: "Create",
              body: "Connect a wallet, ask your question, set the voting window. It's written to Solana as a poll account you own.",
            },
            {
              n: "02",
              icon: Vote,
              title: "Vote",
              body: "Anyone with a wallet casts a single vote. The program enforces one wallet, one vote — no duplicates, no edits.",
            },
            {
              n: "03",
              icon: ShieldCheck,
              title: "Verify",
              body: "Every tally is public. Open the poll on Solana Explorer and count the votes yourself. Trust nothing — verify everything.",
            },
          ].map((step, i) => (
            <motion.div
              key={step.n}
              variants={fadeUp}
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="group rounded-2xl border border-border/70 bg-card/40 p-6 transition-colors hover:border-brand/40"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-muted-foreground">{step.n}</span>
                <step.icon className="h-5 w-5 text-brand" />
              </div>
              <h3 className="mt-6 font-display text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.body}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===================== WHY ON-CHAIN ===================== */}
      <section>
        <SectionLabel>Why on-chain</SectionLabel>
        <h2 className="mt-3 max-w-2xl font-display text-2xl font-bold tracking-tight sm:text-3xl">
          The same poll, with and without something to hide.
        </h2>

        <div className="mt-10 overflow-x-auto rounded-2xl border border-border/70">
          <div className="grid min-w-[520px] grid-cols-[1.4fr_1fr_1fr] border-b border-border/70 bg-muted/30 text-sm font-medium">
            <div className="p-4 text-muted-foreground">The question that matters</div>
            <div className="flex items-center gap-2 border-l border-border/70 p-4 text-brand">
              <ShieldCheck className="h-4 w-4" /> PollChain
            </div>
            <div className="border-l border-border/70 p-4 text-muted-foreground">
              A normal poll
            </div>
          </div>
          {[
            {
              q: "Who controls the result?",
              good: "No one. The on-chain program does.",
              bad: "Whoever runs the server.",
            },
            {
              q: "Can votes change after the fact?",
              good: "Never — records are immutable.",
              bad: "Yes, silently.",
            },
            {
              q: "Can you audit every vote?",
              good: "Yes, on the public ledger.",
              bad: "No, you trust a number.",
            },
            {
              q: "One person, one vote?",
              good: "Enforced per wallet on-chain.",
              bad: "Easily faked.",
            },
          ].map((row, i) => (
            <div
              key={i}
              className="grid min-w-[520px] grid-cols-[1.4fr_1fr_1fr] border-b border-border/60 text-sm last:border-0"
            >
              <div className="p-4 font-medium">{row.q}</div>
              <div className="flex items-start gap-2 border-l border-border/60 p-4">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-live" />
                <span className="text-foreground">{row.good}</span>
              </div>
              <div className="flex items-start gap-2 border-l border-border/60 p-4 text-muted-foreground">
                <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-closed" />
                <span>{row.bad}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== LIVE NOW ===================== */}
      {recent.length > 0 && (
        <section id="live" className="scroll-mt-24">
          <div className="flex items-end justify-between">
            <div>
              <SectionLabel>Live now</SectionLabel>
              <h2 className="mt-3 font-display text-2xl font-bold tracking-tight sm:text-3xl">
                Polls on the ledger
              </h2>
            </div>
            <Link
              href="/polls"
              className="hidden items-center gap-1 text-sm font-medium text-brand hover:underline sm:inline-flex"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((poll) => (
              <PollCard key={poll.id} poll={poll} />
            ))}
          </div>
        </section>
      )}

      {/* ===================== CTA ===================== */}
      <section id="live-fallback">
        <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/40 px-6 py-16 text-center">
          <div className="spotlight pointer-events-none absolute inset-0" aria-hidden />
          <div className="relative">
            <h2 className="mx-auto max-w-xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Put your question on the ledger.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-muted-foreground">
              It takes one transaction and a few seconds. After that, the result
              belongs to everyone — and no one can change it.
            </p>
            <Button asChild size="lg" className="mt-8 gap-2">
              <Link href="/polls">
                Create your first poll
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
      {children}
    </span>
  );
}
