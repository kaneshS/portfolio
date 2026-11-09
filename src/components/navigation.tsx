"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";
import { Clock } from "@/components/clock";
import { profile } from "@/data/profile";

const navItems = [
  { label: "Work", href: "/#work", id: "work" },
  { label: "Experience", href: "/#experience", id: "experience" },
  { label: "Skills", href: "/#skills", id: "skills" },
  { label: "Ask AI", href: "/ai", id: "ai-page" },
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
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.2, 0.5] }
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
      className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded text-ink-soft hover:text-ink transition-colors"
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={theme === "dark"}
    >
      {mounted ? theme === "dark" ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" /> : <span className="w-[18px] h-[18px]" />}
    </button>
  );

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 bg-bg transition-[box-shadow] duration-200",
          scrolled || open ? "shadow-[0_1px_0_rgb(var(--rule))]" : ""
        )}
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <nav className="container flex items-center justify-between h-16 gap-6" aria-label="Primary">
          <Link href="/" className="rounded leading-tight shrink-0">
            <span className="block font-medium text-[0.95rem] text-ink">{profile.name}</span>
            <span className="meta block mt-0.5">Senior Backend</span>
          </Link>

          <ul className="hidden md:flex items-center gap-6 lg:gap-7">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="link inline-flex items-center min-h-[44px] text-[0.95rem] text-ink-soft whitespace-nowrap"
                  aria-current={active === item.id ? "true" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden md:flex items-center gap-4">
            <Clock className="hidden lg:inline" />
            {ThemeButton}
            <Link href="/#contact" className="btn btn-primary !min-h-[40px] !py-2 text-[0.9rem] whitespace-nowrap">
              Get in touch
            </Link>
          </div>

          <div className="flex items-center gap-1 md:hidden">
            {ThemeButton}
            <button
              onClick={() => setOpen((o) => !o)}
              className="min-h-[44px] min-w-[44px] -mr-2 inline-flex items-center justify-center rounded"
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
        <div
          id="mobile-menu"
          className="md:hidden fixed inset-x-0 top-16 bottom-0 z-40 bg-bg overflow-y-auto flex flex-col"
          style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
        >
          <ul className="container pt-4 flex flex-col">
            {navItems.map((item) => (
              <li key={item.href} className="border-b border-rule">
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center py-5 text-3xl font-medium tracking-tight text-ink"
                  aria-current={active === item.id ? "true" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="container mt-auto pt-8 flex flex-col gap-5">
            <Clock />
            <Link href="/#contact" onClick={() => setOpen(false)} className="btn btn-primary w-full">
              Get in touch
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
