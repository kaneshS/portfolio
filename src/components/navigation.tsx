"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useTheme } from "@/components/theme-provider";

const navItems = [
  { label: "About", href: "/#about" },
  { label: "Projects", href: "/#projects" },
  { label: "Skills", href: "/#skills" },
  { label: "AI Assistant", href: "/ai" },
  { label: "Contact", href: "/#contact" },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showThemeNudge, setShowThemeNudge] = useState(false);
  const { theme, toggleTheme, mounted } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Show theme nudge on first visit
  useEffect(() => {
    if (!mounted) return;
    
    const hasSeenNudge = localStorage.getItem("theme-nudge-seen");
    if (!hasSeenNudge) {
      const timer = setTimeout(() => {
        setShowThemeNudge(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [mounted]);

  // Auto-dismiss nudge after 5 seconds
  useEffect(() => {
    if (showThemeNudge) {
      const timer = setTimeout(() => {
        dismissNudge();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showThemeNudge]);

  const dismissNudge = () => {
    setShowThemeNudge(false);
    localStorage.setItem("theme-nudge-seen", "true");
  };

  const handleThemeToggle = () => {
    toggleTheme();
    if (showThemeNudge) {
      dismissNudge();
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled ? "glass py-3" : "py-5"
        )}
      >
        <nav className="container mx-auto px-6 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-semibold tracking-tight focus-ring rounded"
          >
            <span className="text-accent">K</span>anesh
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors focus-ring rounded px-2 py-1"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {/* Theme Toggle */}
            <li className="relative">
              <button
                onClick={handleThemeToggle}
                className="p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors focus-ring"
                aria-label="Toggle theme"
              >
                {mounted ? (
                  theme === "light" ? (
                    <Moon className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <Sun className="w-5 h-5 text-muted-foreground" />
                  )
                ) : (
                  <div className="w-5 h-5" />
                )}
              </button>
              
              {/* Theme Nudge Tooltip - Desktop */}
              <AnimatePresence>
                {showThemeNudge && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.9 }}
                    className="absolute top-full right-0 mt-3 w-48 p-3 rounded-xl bg-card border border-border shadow-xl z-50"
                    onClick={dismissNudge}
                  >
                    <div className="absolute -top-2 right-4 w-4 h-4 rotate-45 bg-card border-l border-t border-border" />
                    <p className="text-sm text-foreground relative z-10">
                      Switch between <span className="text-accent font-medium">dark</span> and <span className="text-accent font-medium">light</span> mode
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Click to dismiss</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Mobile Theme Toggle */}
            <div className="relative">
              <button
                onClick={handleThemeToggle}
                className="p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors focus-ring"
                aria-label="Toggle theme"
              >
                {mounted ? (
                  theme === "light" ? (
                    <Moon className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <Sun className="w-5 h-5 text-muted-foreground" />
                  )
                ) : (
                  <div className="w-5 h-5" />
                )}
              </button>
              
              {/* Theme Nudge Tooltip - Mobile */}
              <AnimatePresence>
                {showThemeNudge && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.9 }}
                    className="absolute top-full right-0 mt-3 w-44 p-3 rounded-xl bg-card border border-border shadow-xl z-50"
                    onClick={dismissNudge}
                  >
                    <div className="absolute -top-2 right-3 w-4 h-4 rotate-45 bg-card border-l border-t border-border" />
                    <p className="text-sm text-foreground relative z-10">
                      Toggle <span className="text-accent font-medium">theme</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Tap to dismiss</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 -mr-2 focus-ring rounded"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <nav className="absolute top-20 left-6 right-6 glass rounded-xl p-6">
              <ul className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-lg text-foreground hover:text-accent transition-colors py-2"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
