"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, Suspense } from "react";

import { WalletButton } from "../solana/solana-provider";

export function UiLayout({
  children,
  links,
}: {
  children: ReactNode;
  links: { label: string; path: string }[];
}) {
  const pathname = usePathname();

  return (
    <div className="h-full flex flex-col">
      <div className="navbar bg-base-300 py-3 text-neutral-content flex-col md:flex-row space-y-2 md:space-y-0 md:px-[10%] px-5">
        <div className="flex-1">
          <Link className="btn btn-ghost normal-case text-xl" href="/">
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
      <div className="flex-grow mx-4 lg:mx-auto md:px-[10%] px-5">
        <Suspense
          fallback={
            <div className="text-center my-32">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          }
        >
          {children}
        </Suspense>
      </div>
      <footer className="footer footer-center p-4 bg-base-300 text-base-content">
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
