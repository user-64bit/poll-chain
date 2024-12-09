import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

export const metadata = {
  title: "PollChain",
  description: "A decentralized polling platform",
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
