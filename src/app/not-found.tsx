import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="spotlight pointer-events-none absolute inset-0" aria-hidden />
      <div className="bg-ledger-grid pointer-events-none absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" aria-hidden />
      <div className="relative">
        <p className="font-mono text-sm uppercase tracking-[0.2em] text-brand">
          404 · off-chain
        </p>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
          This page isn&apos;t on the ledger.
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-muted-foreground">
          The poll or page you&apos;re looking for doesn&apos;t exist — or was
          never recorded.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="gap-2">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" /> Back home
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/polls">Browse polls</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
