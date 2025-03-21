import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";

const spinnerVariants = cva("relative", {
  variants: {
    size: {
      default: "h-8 w-8",
      sm: "h-4 w-4",
      lg: "h-12 w-12",
      icon: "h-16 w-16",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface SpinnerProps extends VariantProps<typeof spinnerVariants> {}

const spinTransition = {
  loop: Infinity,
  ease: "linear",
  duration: 1,
};

export const Spinner = ({ size }: SpinnerProps) => {
  return (
    <div className={cn(spinnerVariants({ size }), "flex items-center justify-center")}>
      <motion.span
        className="block absolute h-full w-full rounded-full border-t-2 border-r-2 border-transparent"
        style={{ 
          borderTopColor: "var(--primary)",
          borderRightColor: "var(--primary)",
        }}
        animate={{ rotate: 360 }}
        transition={spinTransition}
      />
      <motion.span
        className="block absolute h-full w-full rounded-full border-b-2 border-l-2 border-transparent opacity-70"
        style={{ 
          borderBottomColor: "var(--primary)",
          borderLeftColor: "var(--primary)",
          scale: 0.8,
        }}
        animate={{ rotate: -360 }}
        transition={{
          ...spinTransition,
          duration: 1.5,
        }}
      />
    </div>
  );
};
