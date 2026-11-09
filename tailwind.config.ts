import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const c = (v: string) => `rgb(var(${v}) / <alpha-value>)`;

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    container: { center: true, padding: { DEFAULT: "1rem", md: "2rem" }, screens: { "2xl": "1200px" } },
    extend: {
      colors: {
        bg: c("--bg"),
        "bg-deep": c("--bg-deep"),
        paper: c("--paper"),
        ink: { DEFAULT: c("--ink"), soft: c("--ink-soft"), faint: c("--ink-faint") },
        rule: c("--rule"),
        wax: { DEFAULT: c("--wax"), fg: c("--wax-fg") },
        gold: c("--gold"),
        // aliases so @tailwindcss/typography and any leftovers keep working
        background: c("--bg"),
        foreground: c("--ink"),
        muted: { DEFAULT: c("--paper"), foreground: c("--ink-soft") },
        border: c("--rule"),
        accent: { DEFAULT: c("--wax"), foreground: c("--wax-fg") },
        card: { DEFAULT: c("--paper"), foreground: c("--ink") },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "Georgia", "serif"],
        hand: ["var(--font-hand)", "cursive"],
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.23, 1, 0.32, 1)",
        "in-out": "cubic-bezier(0.77, 0, 0.175, 1)",
      },
    },
  },
  plugins: [typography],
};

export default config;
