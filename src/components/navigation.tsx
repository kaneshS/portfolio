"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";

const navItems = [
  { label: "Now", href: "/#now", id: "now" },
  { label: "Work", href: "/#work", id: "work" },
  { label: "Experience", href: "/#experience", id: "experience" },
  { label: "Stack", href: "/#stack", id: "stack" },
  { label: "Ask AI", href: "/ai", id: "ai-page" },
  { label: "Contact", href: "/#contact", id: "contact" },
];

export function Navigation() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const { theme, toggleTheme, mounted } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return setActive("ai-page");
    const els = navItems.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.2, 0.5] }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const ThemeButton = (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 inline-flex items-center justify-center rounded-full text-text-soft hover:text-text hover:bg-surface-2"
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={theme === "dark"}
    >
      {mounted ? theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" /> : <span className="w-4 h-4" />}
    </button>
  );

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 pointer-events-none" style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}>
        <nav
          aria-label="Primary"
          className="pointer-events-auto mx-auto w-[calc(100%-2rem)] max-w-3xl h-12 pl-4 pr-1.5 flex items-center justify-between rounded-full bg-surface/85 backdrop-blur-md border border-line/10 shadow-[0_8px_30px_-16px_rgb(0_0_0/0.5)]"
        >
          <Link href="/" className="font-display font-semibold text-[1.05rem] tracking-tight inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent pulse-dot" aria-hidden="true" />
            Kanesh
          </Link>

          <ul className="hidden md:flex items-center gap-5">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="link text-[0.9rem] text-text-soft hover:text-text py-2" aria-current={active === item.id ? "true" : undefined}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1">
            {ThemeButton}
            <button
              onClick={() => setOpen((o) => !o)}
              className="md:hidden w-10 h-10 inline-flex items-center justify-center rounded-full text-text-soft hover:text-text hover:bg-surface-2"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </header>

      {open && (
        <div id="mobile-menu" className={cn("md:hidden fixed inset-0 z-40 bg-bg/95 backdrop-blur-sm pt-20 overflow-y-auto")} style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
          <ul className="container flex flex-col">
            {navItems.map((item) => (
              <li key={item.href} className="border-b border-line/10">
                <Link href={item.href} onClick={() => setOpen(false)} className="block py-5 font-display text-3xl">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
