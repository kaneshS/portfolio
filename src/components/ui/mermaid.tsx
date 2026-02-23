"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

interface MermaidProps {
  chart: string;
  className?: string;
}

// Initialize mermaid with Harry Potter light theme
mermaid.initialize({
  startOnLoad: false,
  theme: "base",
  themeVariables: {
    primaryColor: "#e8f5e9",
    primaryTextColor: "#1e5128",
    primaryBorderColor: "#1e5128",
    lineColor: "#8b5a2b",
    secondaryColor: "#f5f0e6",
    tertiaryColor: "#fcfaf5",
    background: "#fcfaf5",
    mainBkg: "#f5f0e6",
    secondBkg: "#fcfaf5",
    nodeBorder: "#1e5128",
    clusterBkg: "#f5f0e6",
    clusterBorder: "#d2be9a",
    titleColor: "#3e2f23",
    edgeLabelBackground: "#fcfaf5",
    textColor: "#3e2f23",
    nodeTextColor: "#3e2f23",
  },
  flowchart: {
    htmlLabels: true,
    curve: "basis",
    padding: 15,
  },
});

export function Mermaid({ chart, className = "" }: MermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const renderChart = async () => {
      if (!containerRef.current || !chart) return;

      try {
        const id = `mermaid-${Math.random().toString(36).substring(7)}`;
        const { svg } = await mermaid.render(id, chart);
        setSvg(svg);
        setError(null);
      } catch (err) {
        console.error("Mermaid render error:", err);
        setError("Failed to render diagram");
      }
    };

    renderChart();
  }, [chart]);

  if (error) {
    return (
      <div className={`p-4 rounded-xl bg-maroon/10 border border-maroon/20 text-maroon text-sm ${className}`}>
        {error}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`mermaid-container overflow-x-auto rounded-xl border border-border p-4 flex justify-center ${className}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
