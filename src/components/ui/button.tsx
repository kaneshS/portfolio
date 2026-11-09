import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "accent" | "line" | "ghost";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = "accent", ...props }, ref) => (
  <button ref={ref} className={cn("btn", `btn-${variant}`, "disabled:opacity-50 disabled:pointer-events-none", className)} {...props} />
));
Button.displayName = "Button";
