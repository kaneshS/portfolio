import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "wax" | "ink";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = "wax", ...props }, ref) => (
  <button ref={ref} className={cn("btn", variant === "wax" ? "btn-wax" : "btn-ink", "disabled:opacity-50 disabled:pointer-events-none", className)} {...props} />
));
Button.displayName = "Button";
