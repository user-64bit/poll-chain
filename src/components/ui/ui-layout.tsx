"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, Suspense } from "react";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { WalletButton } from "../solana/solana-provider";
import { Spinner } from "../spinner";
import { PageTransition } from "../page-transition";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300 } },
};

export function UiLayout({
  children,
  links,
}: {
  children: ReactNode;
  links: { label: string; path: string }[];
}) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <div className="h-full flex flex-col max-h-screen bg-background">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="py-4 flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 px-5 md:px-[10%] sticky top-0 z-50 backdrop-blur-sm bg-background/80 border-b border-border/40"
      >
        <div className="flex-1 flex items-center">
          <Link className="font-bold text-xl mr-6 relative group" href="/">
            <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">PollChain</span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-500 transition-all group-hover:w-full duration-300"></span>
          </Link>
          <motion.ul 
            variants={container}
            initial="hidden"
            animate="show"
            className="flex space-x-4 items-center"
          >
            {links.map(({ label, path }) => (
              <motion.li key={path} variants={item}>
                <Link
                  className={`px-3 py-2 rounded-md transition-colors relative ${
                    pathname.startsWith(path)
                      ? "text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  href={path}
                >
                  {label}
                  {pathname.startsWith(path) && (
                    <motion.span
                      className="absolute bottom-0 left-0 h-0.5 bg-primary rounded-full w-full"
                      layoutId="navbar-indicator"
                      transition={{ type: "spring", duration: 0.6, bounce: 0.25 }}
                    />
                  )}
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        </div>
        <div className="flex-none flex items-center space-x-4">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full bg-secondary/80 hover:bg-secondary transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <WalletButton />
        </div>
      </motion.div>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="flex-1 overflow-auto md:px-[10%] p-6"
      >
        <Suspense fallback={
          <div className="flex items-center justify-center h-full">
            <Spinner size="lg" />
          </div>
        }>
          <PageTransition>
            {children}
          </PageTransition>
        </Suspense>
      </motion.div>
    </div>
  );
}
