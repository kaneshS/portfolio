import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const c = (v: string) => `rgb(var(${v}) / <alpha-value>)`;

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    container: { center: true, padding: { DEFAULT: "1rem", md: "2rem" }, screens: { "2xl": "1152px" } },
    extend: {
      colors: {
        bg: c("--bg"),
        surface: { DEFAULT: c("--surface"), 2: c("--surface-2") },
        text: { DEFAULT: c("--text"), soft: c("--text-soft"), faint: c("--text-faint") },
        line: c("--line"),
        accent: { DEFAULT: c("--accent"), fg: c("--accent-fg") },
        // aliases for @tailwindcss/typography
        foreground: c("--text"),
        muted: { DEFAULT: c("--surface-2"), foreground: c("--text-soft") },
        border: c("--line"),
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
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
