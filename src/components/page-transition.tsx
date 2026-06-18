"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

/**
 * Enter-only page transition.
 *
 * We deliberately avoid `AnimatePresence mode="wait"` here: wrapping the App
 * Router's `children` in a waiting exit animation caused the active page to
 * remount in a loop, which interrupted in-flight data fetches (the poll list
 * would stay empty on client-side navigation but load on a hard refresh).
 *
 * Keying a single motion element by pathname re-triggers the enter animation
 * once per real navigation, and leaves the subtree untouched on internal
 * re-renders (state updates) — so data fetches complete normally.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}
