// On-chain formatting helpers — the "vernacular" of the product.

const CLUSTER = "devnet";

/** Shorten a base58 address: 7Xk9…q4Vz */
export function truncateAddress(address: string, chars = 4): string {
  if (!address) return "";
  if (address.length <= chars * 2 + 1) return address;
  return `${address.slice(0, chars)}…${address.slice(-chars)}`;
}

/** Solana Explorer link for an account (defaults to devnet). */
export function explorerAccountUrl(address: string): string {
  return `https://explorer.solana.com/address/${address}?cluster=${CLUSTER}`;
}

/** Compact number formatting: 1500 -> 1.5k, 14200 -> 14.2k */
export function formatCompact(n: number): string {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n ?? 0);
}

/** Full grouped number: 14200 -> 14,200 */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en").format(n ?? 0);
}

export type Timeframe = "upcoming" | "live" | "closed";

export function getTimeframe(startMs: number, endMs: number, now = Date.now()): Timeframe {
  if (now < startMs) return "upcoming";
  if (now > endMs) return "closed";
  return "live";
}

/** Human countdown label, e.g. "Ends in 3 days", "Starts in 5 hours". */
export function timeframeLabel(
  startMs: number,
  endMs: number,
  now = Date.now()
): string {
  const frame = getTimeframe(startMs, endMs, now);
  if (frame === "closed") return "Closed";
  const target = frame === "upcoming" ? startMs : endMs;
  const verb = frame === "upcoming" ? "Starts" : "Ends";
  const diff = Math.abs(target - now);
  const mins = Math.round(diff / 60000);
  if (mins < 60) return `${verb} in ${mins} min${mins !== 1 ? "s" : ""}`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${verb} in ${hours} hour${hours !== 1 ? "s" : ""}`;
  const days = Math.round(hours / 24);
  return `${verb} in ${days} day${days !== 1 ? "s" : ""}`;
}
