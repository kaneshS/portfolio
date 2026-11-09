"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { useTheme } from "@/components/theme-provider";

const palettes = {
  light: { paper: "#f1e5c6", bg: "#e9d9b3", ink: "#2a1a0e", rule: "#6e543a", wax: "#8f2a1f" },
  dark: { paper: "#261d12", bg: "#1a140d", ink: "#e6d5ae", rule: "#7a6548", wax: "#dc6854" },
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
      fontFamily: "var(--font-body), Georgia, serif",
      themeVariables: {
        primaryColor: p.paper,
        primaryTextColor: p.ink,
        primaryBorderColor: p.rule,
        lineColor: p.rule,
        secondaryColor: p.bg,
        tertiaryColor: p.bg,
        background: p.bg,
        mainBkg: p.paper,
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
    // strip hard-coded fills from older diagrams so the ink theme wins
    const clean = chart.replace(/^\s*style .*$/gm, "");
    mermaid
      .render(`${idRef.current}-${theme}`, clean)
      .then((r) => {
        setSvg(r.svg);
        setError(null);
      })
      .catch(() => setError("The diagram would not draw."));
  }, [chart, theme]);

  if (error) return <p className="text-sm text-wax">{error}</p>;
  return <div className={`mermaid-container overflow-x-auto flex justify-center ${className}`} dangerouslySetInnerHTML={{ __html: svg }} />;
}
