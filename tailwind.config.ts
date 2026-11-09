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
        surface: c("--surface"),
        ink: { DEFAULT: c("--ink"), soft: c("--ink-soft"), faint: c("--ink-faint") },
        rule: c("--rule"),
        accent: { DEFAULT: c("--accent"), fg: c("--accent-fg") },
        // aliases so @tailwindcss/typography keeps working
        background: c("--bg"),
        foreground: c("--ink"),
        muted: { DEFAULT: c("--surface"), foreground: c("--ink-soft") },
        border: c("--rule"),
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [typography],
};

export default config;
