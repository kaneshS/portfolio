"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext<{ theme: Theme; toggleTheme: () => void; mounted: boolean }>({
  theme: "dark",
  toggleTheme: () => {},
  mounted: false,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let saved: Theme | null = null;
    try {
      saved = localStorage.getItem("theme") as Theme | null;
    } catch {}
    const t = saved ?? "dark";
    setTheme(t);
    document.documentElement.classList.toggle("dark", t === "dark");
  }, []);

  const toggleTheme = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    setTheme(next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme, mounted }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
