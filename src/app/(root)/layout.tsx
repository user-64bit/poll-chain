import { SolanaProvider } from "@/components/solana/solana-provider";
import { UiLayout } from "@/components/ui/ui-layout";

const links: { label: string; path: string }[] = [
  { label: "Polls", path: "/polls" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SolanaProvider>
      <UiLayout links={links}>{children}</UiLayout>
    </SolanaProvider>
  );
}
