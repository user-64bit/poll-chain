"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageHeadingProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export function PageHeading({ title, description, children }: PageHeadingProps) {
  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <motion.h1 
            className="text-3xl font-bold tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-300 dark:to-gray-500 bg-clip-text text-transparent">
              {title}
            </span>
          </motion.h1>
          
          {description && (
            <motion.p 
              className="text-muted-foreground mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {description}
            </motion.p>
          )}
        </div>
        
        {children && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            {children}
          </motion.div>
        )}
      </div>
      
      <motion.div 
        className="h-0.5 bg-gradient-to-r from-gray-200 to-transparent dark:from-gray-700"
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: "100%", opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      />
    </div>
  );
} 