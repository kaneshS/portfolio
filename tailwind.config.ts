import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const c = (v: string) => `rgb(var(${v}) / <alpha-value>)`;

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    container: { center: true, padding: { DEFAULT: "1rem", md: "2rem" }, screens: { "2xl": "1120px" } },
    extend: {
      colors: {
        bg: c("--bg"),
        surface: { DEFAULT: c("--surface"), 2: c("--surface-2") },
        fg: { DEFAULT: c("--fg"), dim: c("--fg-dim"), faint: c("--fg-faint") },
        rule: c("--rule"),
        accent: { DEFAULT: c("--accent"), fg: c("--on-accent") },
        // aliases for @tailwindcss/typography
        background: c("--bg"),
        foreground: c("--fg"),
        muted: { DEFAULT: c("--surface"), foreground: c("--fg-dim") },
        border: c("--rule"),
      },
      fontFamily: {
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.23, 1, 0.32, 1)",
      },
    },
  },
  plugins: [typography],
};

export default config;
