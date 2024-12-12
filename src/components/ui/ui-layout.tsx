"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, Suspense } from "react";

import { WalletButton } from "../solana/solana-provider";
import { Spinner } from "../spinner";

export function UiLayout({
  children,
  links,
}: {
  children: ReactNode;
  links: { label: string; path: string }[];
}) {
  const pathname = usePathname();

  return (
    <div className="h-full flex flex-col bg-white max-h-screen">
      <div className="py-3 flex flex-col md:flex-row justify-center border-b md:border-0 items-center space-y-2 md:space-y-0 px-5">
        <div className="flex-1">
          <Link className="font-bold text-xl" href="/">
            PollChain
          </Link>
          <ul className="menu menu-horizontal px-1 space-x-2">
            {links.map(({ label, path }) => (
              <li key={path}>
                <Link
                  className={pathname.startsWith(path) ? "active" : ""}
                  href={path}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-none space-x-2">
          <WalletButton />
        </div>
      </div>
      <div className="bg-white mb-auto">
        <Suspense fallback={<Spinner />}>{children}</Suspense>
      </div>
      <footer
        className="footer-center p-4 bg-white border-t md:border-0"
        style={{ backgroundColor: "white" }}
      >
        <aside>
          <p>
            All rights reserved. Copyright {new Date().getFullYear()}{" "}
            @PollChain.
          </p>
        </aside>
      </footer>
    </div>
  );
}
