import { cn } from "@/lib/utils";
import { explorerAccountUrl, truncateAddress } from "@/lib/format";
import { ShieldCheck, ArrowUpRight } from "lucide-react";

/**
 * "Verified on-chain" affordance — the core trust signal.
 * Shows that a poll lives on Solana and links to the public explorer
 * so anyone can audit it. The whole point of the product, made visible.
 */
export function VerifiedChip({
  address,
  className,
  showAddress = true,
}: {
  address: string;
  className?: string;
  showAddress?: boolean;
}) {
  return (
    <a
      href={explorerAccountUrl(address)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group inline-flex items-center gap-1.5 rounded-full border border-brand/25 bg-brand/5 px-2.5 py-1 text-[11px] font-medium text-brand transition-colors hover:border-brand/50 hover:bg-brand/10",
        className
      )}
      aria-label={`Verified on-chain — view ${address} on Solana Explorer`}
    >
      <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
      <span className="tracking-wide">Verified on-chain</span>
      {showAddress && (
        <span className="font-mono text-muted-foreground group-hover:text-brand/80">
          {truncateAddress(address)}
        </span>
      )}
      <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
    </a>
  );
}
