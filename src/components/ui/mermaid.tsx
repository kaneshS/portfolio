"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { useTheme } from "@/components/theme-provider";

const palettes = {
  light: { surface: "#eeebe4", bg: "#fffefb", text: "#15161a", line: "#8d8e94", accent: "#c47d0a" },
  dark: { surface: "#181b21", bg: "#121419", text: "#ecebe6", line: "#6e6e68", accent: "#f5b544" },
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
      fontFamily: "var(--font-body), system-ui, sans-serif",
      themeVariables: {
        primaryColor: p.surface,
        primaryTextColor: p.text,
        primaryBorderColor: p.line,
        lineColor: p.line,
        secondaryColor: p.bg,
        tertiaryColor: p.bg,
        background: p.bg,
        mainBkg: p.surface,
        nodeBorder: p.line,
        clusterBkg: p.bg,
        clusterBorder: p.line,
        titleColor: p.text,
        edgeLabelBackground: p.bg,
        textColor: p.text,
        nodeTextColor: p.text,
      },
      flowchart: { htmlLabels: true, curve: "basis", padding: 12 },
    });
    const clean = chart.replace(/^\s*style .*$/gm, "");
    mermaid
      .render(`${idRef.current}-${theme}`, clean)
      .then((r) => {
        setSvg(r.svg);
        setError(null);
      })
      .catch(() => setError("The diagram could not render."));
  }, [chart, theme]);

  if (error) return <p className="text-sm text-accent">{error}</p>;
  return <div className={`mermaid-container overflow-x-auto flex justify-center ${className}`} dangerouslySetInnerHTML={{ __html: svg }} />;
}
