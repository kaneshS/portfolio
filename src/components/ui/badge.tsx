"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "outline" | "accent";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  const variants = {
    default: "bg-muted text-muted-foreground",
    outline: "border border-border text-muted-foreground",
    accent: "bg-accent/10 text-accent border border-accent/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

interface AnimatedBadgeProps extends BadgeProps {
  delay?: number;
}

export function AnimatedBadge({
  children,
  variant = "default",
  className,
  delay = 0,
}: AnimatedBadgeProps) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ scale: 1.05 }}
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium cursor-default transition-colors",
        variant === "default" && "bg-muted text-muted-foreground hover:bg-muted/80",
        variant === "outline" &&
          "border border-border text-muted-foreground hover:border-accent/50",
        variant === "accent" &&
          "bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20",
        className
      )}
    >
      {children}
    </motion.span>
  );
}
