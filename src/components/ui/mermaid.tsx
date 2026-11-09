"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { useTheme } from "@/components/theme-provider";

const palettes = {
  light: { surface: "#ebe6de", bg: "#f4f1ec", ink: "#1a1816", rule: "#b8b0a5", accent: "#9a3b1e" },
  dark: { surface: "#26231f", bg: "#1c1a17", ink: "#ece7df", rule: "#5a554e", accent: "#de7c54" },
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
      fontFamily: "var(--font-sans), system-ui, sans-serif",
      themeVariables: {
        primaryColor: p.surface,
        primaryTextColor: p.ink,
        primaryBorderColor: p.rule,
        lineColor: p.rule,
        secondaryColor: p.bg,
        tertiaryColor: p.bg,
        background: p.bg,
        mainBkg: p.surface,
        nodeBorder: p.rule,
        clusterBkg: p.bg,
        clusterBorder: p.rule,
        titleColor: p.ink,
        edgeLabelBackground: p.bg,
        textColor: p.ink,
        nodeTextColor: p.ink,
      },
      flowchart: { htmlLabels: true, curve: "basis", padding: 12 },
    });
    // strip hard-coded fills from older diagrams so the palette wins
    const clean = chart.replace(/^\s*style .*$/gm, "");
    mermaid
      .render(`${idRef.current}-${theme}`, clean)
      .then((r) => {
        setSvg(r.svg);
        setError(null);
      })
      .catch(() => setError("The diagram could not be rendered."));
  }, [chart, theme]);

  if (error) return <p className="text-sm text-accent">{error}</p>;
  return <div className={`mermaid-container overflow-x-auto flex justify-center ${className}`} dangerouslySetInnerHTML={{ __html: svg }} />;
}
