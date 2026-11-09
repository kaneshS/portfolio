"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { useTheme } from "@/components/theme-provider";

const palettes = {
  light: { surface: "#f7f0dc", bg: "#fdf6e3", fg: "#1f2d33", rule: "#b8b09a", line: "#5a6f76", accent: "#167a48" },
  dark: { surface: "#111311", bg: "#0a0b0a", fg: "#e6e8e3", rule: "#3a403a", line: "#7a827a", accent: "#39d98a" },
};

export function Mermaid({ chart, className = "" }: { chart: string; className?: string }) {
  const { theme } = useTheme();
  const [svg, setSvg] = useState("");
  const [error, setError] = useState<string | null>(null);
  const idRef = useRef(`m${Math.random().toString(36).slice(2, 8)}`);

  useEffect(() => {
    const p = palettes[theme];
    mermaid.initialize({
      startOnLoad: false,
      theme: "base",
      fontFamily: "var(--font-mono), ui-monospace, monospace",
      themeVariables: {
        primaryColor: p.surface,
        primaryTextColor: p.fg,
        primaryBorderColor: p.rule,
        lineColor: p.line,
        secondaryColor: p.bg,
        tertiaryColor: p.bg,
        background: p.bg,
        mainBkg: p.surface,
        nodeBorder: p.rule,
        clusterBkg: p.bg,
        clusterBorder: p.rule,
        titleColor: p.fg,
        edgeLabelBackground: p.bg,
        textColor: p.fg,
        nodeTextColor: p.fg,
      },
      flowchart: { htmlLabels: true, curve: "linear", padding: 12 },
    });
    // strip hard-coded fills so the palette wins
    const clean = chart.replace(/^\s*style .*$/gm, "");
    mermaid
      .render(`${idRef.current}-${theme}`, clean)
      .then((r) => {
        setSvg(r.svg);
        setError(null);
      })
      .catch(() => setError("error: diagram failed to render"));
  }, [chart, theme]);

  if (error) return <p className="text-sm text-fg-dim">{error}</p>;
  return <div className={`mermaid-container overflow-x-auto flex justify-center ${className}`} dangerouslySetInnerHTML={{ __html: svg }} />;
}
