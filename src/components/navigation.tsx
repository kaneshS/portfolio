"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";
import { Footprint } from "@/components/ui/ornaments";

const navItems = [
  { label: "The Walker", href: "/#about", id: "about" },
  { label: "Corridors", href: "/#journey", id: "journey" },
  { label: "Chambers", href: "/#projects", id: "projects" },
  { label: "Inventory", href: "/#skills", id: "skills" },
  { label: "Ask the Map", href: "/ai", id: "ai-page" },
  { label: "Owl Post", href: "/#contact", id: "contact" },
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

  // "You are here": track the section in view
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
      className="btn btn-ink !min-h-[40px] !px-3 !py-1 text-[0.8rem]"
      aria-label={theme === "dark" ? "Switch to parchment (light) theme" : "Switch to wandlight (dark) theme"}
      aria-pressed={theme === "dark"}
    >
      {mounted ? (theme === "dark" ? "Lumos" : "Nox") : " "}
    </button>
  );

  return (
    <>
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-[background-color,box-shadow] duration-200",
        scrolled || open ? "bg-bg/95 backdrop-blur-sm shadow-[0_1px_0_rgb(var(--rule)/0.5)]" : ""
      )}
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <nav className="container flex items-center justify-between h-16" aria-label="Primary">
        <Link href="/" className="font-display text-xl text-ink inline-flex items-center gap-2 rounded">
          <Footprint className="w-4 h-5 text-wax" />
          K. Sharma
        </Link>

        <ul className="hidden md:flex items-center gap-7">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="ink-link font-display text-[0.95rem] text-ink-soft hover:text-ink" aria-current={active === item.id ? "true" : undefined}>
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
            className="p-2 -mr-2 rounded min-h-[44px] min-w-[44px] inline-flex items-center justify-center"
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
        <div id="mobile-menu" className="md:hidden fixed inset-x-0 top-16 bottom-0 z-40 bg-bg overflow-y-auto" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
          <ul className="container py-6 flex flex-col">
            {navItems.map((item, i) => (
              <li key={item.href} className="border-b border-rule/40">
                <Link href={item.href} onClick={() => setOpen(false)} className="flex items-center gap-3 py-4 font-display text-2xl text-ink">
                  <Footprint left={i % 2 === 0} className="w-4 h-5 text-ink-faint" />
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
