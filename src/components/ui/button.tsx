"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all focus-ring rounded-lg disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
      primary:
        "bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/25",
      secondary:
        "bg-muted text-foreground hover:bg-muted/80 border border-border",
      ghost: "text-foreground hover:bg-muted",
    };

    const sizes = {
      sm: "text-sm px-4 py-2",
      md: "text-sm px-6 py-3",
      lg: "text-base px-8 py-4",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

// Motion-enhanced button - simplified to avoid type conflicts
interface MotionButtonProps {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  children: ReactNode;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

export function MotionButton({
  className,
  variant = "primary",
  size = "md",
  children,
  disabled,
  type,
  onClick,
}: MotionButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-colors focus-ring rounded-lg disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary:
      "bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/25",
    secondary:
      "bg-muted text-foreground hover:bg-muted/80 border border-border",
    ghost: "text-foreground hover:bg-muted",
  };

  const sizes = {
    sm: "text-sm px-4 py-2",
    md: "text-sm px-6 py-3",
    lg: "text-base px-8 py-4",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      type={type}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}
