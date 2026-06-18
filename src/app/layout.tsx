import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pollchain.arthprajapati.com"),
  title: {
    default: "PollChain — Polls you don't have to trust",
    template: "%s · PollChain",
  },
  description:
    "Create polls and vote on Solana. One wallet, one vote, recorded forever on-chain — tamper-proof, transparent, and verifiable by anyone.",
  openGraph: {
    type: "website",
    url: "https://pollchain.arthprajapati.com",
    title: "PollChain — Polls you don't have to trust",
    description:
      "Create polls and vote on Solana. One wallet, one vote, recorded forever on-chain — verifiable by anyone.",
    siteName: "PollChain",
  },
  twitter: {
    card: "summary_large_image",
    title: "PollChain — Polls you don't have to trust",
    description:
      "Create polls and vote on Solana. One wallet, one vote, recorded forever on-chain.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-background antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
