import { SolanaProvider } from "@/components/solana/solana-provider";
import { UiLayout } from "@/components/ui/ui-layout";


const links: { label: string; path: string }[] = [];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SolanaProvider>
          <UiLayout links={links}>{children}</UiLayout>
        </SolanaProvider>
      </body>
    </html>
  );
}
