import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  openGraph: {
    type: "website",
    url: "https://pollchain.arthprajapapti.com",
    title: "PollChain",
    description: "A decentralized Voting platform",
    images: [
      {
        url: "https://ideogram.ai/assets/progressive-image/balanced/response/nx2_9wH4Tni9fEmppqludQ",
        width: 1200,
        height: 630,
        alt: "PollChain",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
