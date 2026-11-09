"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";

const navItems = [
  { label: "~/work", href: "/#work", id: "work" },
  { label: "~/experience", href: "/#experience", id: "experience" },
  { label: "~/stack", href: "/#stack", id: "stack" },
  { label: "~/ai", href: "/ai", id: "ai-page" },
  { label: "~/contact", href: "/#contact", id: "contact" },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const { theme, toggleTheme, mounted } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (pathname !== "/") return setActive("ai-page");
    const ids = navItems.map((n) => n.id).filter((id) => id !== "ai-page");
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-25% 0px -55% 0px", threshold: [0, 0.2, 0.5] }
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
      className="btn btn-ghost btn-icon"
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={theme === "dark"}
    >
      {mounted ? theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" /> : <span className="w-4 h-4" />}
    </button>
  );

  return (
    <>
      <header
        className={cn("fixed top-0 inset-x-0 z-50 transition-[background-color,border-color] duration-200 border-b", scrolled || open ? "bg-bg/95 border-rule" : "border-transparent")}
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <nav className="container flex items-center justify-between h-16" aria-label="Primary">
          <Link href="/" className="inline-flex items-center gap-2.5 text-[0.95rem] font-medium text-fg rounded min-h-[44px]" translate="no">
            <span className="dot" aria-hidden="true" />
            <span className="text-fg-faint">~/</span>kaneshwar
          </Link>

          <ul className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="t-link text-[0.85rem] text-fg-dim hover:text-fg py-2 inline-block" aria-current={active === item.id ? (item.id === "ai-page" ? "page" : "true") : undefined}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li>{ThemeButton}</li>
          </ul>

          <div className="flex items-center gap-2 md:hidden">
            {ThemeButton}
            <button
              onClick={() => setOpen((o) => !o)}
              className="btn btn-ghost btn-icon"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </nav>
      </header>

      {open && (
        <div id="mobile-menu" className="md:hidden fixed inset-x-0 top-16 bottom-0 z-40 bg-bg overflow-y-auto" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
          <ul className="container py-6 flex flex-col">
            {navItems.map((item) => (
              <li key={item.href} className="border-b border-rule">
                <Link href={item.href} onClick={() => setOpen(false)} className="flex items-center gap-3 py-4 min-h-[56px] text-xl text-fg" aria-current={active === item.id ? "true" : undefined}>
                  <span className="prompt" aria-hidden="true">$</span> cd {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
