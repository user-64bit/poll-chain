// Curated, accessible option palette tuned to the PollChain identity.
// Used for both the ledger bars and the results donut so a poll looks
// the same everywhere. Colors are assigned by option index (stable order),
// replacing the old "green if registered, red if not" logic that made every
// segment the same color.
export const OPTION_PALETTE = [
  "#7C5CFF", // brand violet
  "#22D3EE", // brand cyan
  "#34D399", // mint
  "#F5A524", // amber
  "#FB7185", // rose
  "#A78BFA", // lavender
  "#38BDF8", // sky
  "#F472B6", // pink
  "#4ADE80", // green
  "#FBBF24", // gold
  "#2DD4BF", // teal
  "#C084FC", // purple
];

export function getOptionColor(index: number): string {
  return OPTION_PALETTE[index % OPTION_PALETTE.length];
}
