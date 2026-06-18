"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { WalletButton } from "../solana/solana-provider";
import { Spinner } from "../spinner";
import { PageTransition } from "../page-transition";
import { cn } from "@/lib/utils";

function LogoMark() {
  return (
    <span className="grid h-8 w-8 place-items-center rounded-lg bg-signature shadow-brand">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <rect x="2" y="3" width="12" height="2" rx="1" fill="white" />
        <rect x="2" y="7" width="8" height="2" rx="1" fill="white" fillOpacity="0.85" />
        <rect x="2" y="11" width="10" height="2" rx="1" fill="white" fillOpacity="0.7" />
      </svg>
    </span>
  );
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";
  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card/60 text-muted-foreground transition-colors hover:text-foreground"
      aria-label="Toggle theme"
    >
      {mounted ? isDark ? <Sun size={16} /> : <Moon size={16} /> : <span className="h-4 w-4" />}
    </button>
  );
}

export function UiLayout({
  children,
  links,
}: {
  children: ReactNode;
  links: { label: string; path: string }[];
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-6 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <LogoMark />
            <span className="font-display text-lg font-bold tracking-tight">
              PollChain
            </span>
          </Link>

          <nav className="hidden items-center gap-1 sm:flex">
            {links.map(({ label, path }) => {
              const active = pathname.startsWith(path);
              return (
                <Link
                  key={path}
                  href={path}
                  className={cn(
                    "relative rounded-md px-3 py-2 text-sm transition-colors",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {label}
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-signature"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <ThemeToggle />
            <WalletButton />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <Suspense
            fallback={
              <div className="flex min-h-[50vh] items-center justify-center">
                <Spinner size="lg" />
              </div>
            }
          >
            <PageTransition>{children}</PageTransition>
          </Suspense>
        </div>
      </main>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <LogoMark />
            <span className="font-display text-sm font-semibold">PollChain</span>
            <span className="font-mono text-xs text-muted-foreground">· devnet</span>
          </div>
          <p className="text-center text-xs text-muted-foreground sm:text-right">
            On-chain polling on Solana. Every vote public, permanent, and
            verifiable.
          </p>
        </div>
      </footer>
    </div>
  );
}
