"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

export interface FlowNode {
  id: string;
  label: string;
  sub?: string;
  col: number;
  row: number;
  dashed?: boolean;
}

export interface FlowSpec {
  cols: number;
  rows: number;
  nodes: FlowNode[];
  edges: [string, string][];
}

const ROW_H = 72;
const NODE_H = 44;
const PAD = 16;
const sizes = { normal: { COL_W: 168, NODE_W: 128 }, compact: { COL_W: 140, NODE_W: 118 } };

function center(n: FlowNode, COL_W: number, NODE_W: number) {
  return { x: PAD + n.col * COL_W + NODE_W / 2, y: PAD + n.row * ROW_H + NODE_H / 2 };
}

function edgePath(a: FlowNode, b: FlowNode, COL_W: number, NODE_W: number) {
  const p = center(a, COL_W, NODE_W);
  const q = center(b, COL_W, NODE_W);
  const x1 = p.x + NODE_W / 2;
  const x2 = q.x - NODE_W / 2;
  const mx = (x1 + x2) / 2;
  return `M ${x1} ${p.y} C ${mx} ${p.y}, ${mx} ${q.y}, ${x2} ${q.y}`;
}

/*
  Authored system diagram: nodes on a grid, bezier edges, packets travelling
  along them (SMIL, off the main thread). One pause control for the loop.
*/
export function FlowDiagram({ spec, title, className = "", packets = true, compact = false }: { spec: FlowSpec; title: string; className?: string; packets?: boolean; compact?: boolean }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [paused, setPaused] = useState(false);
  const { COL_W, NODE_W } = sizes[compact ? "compact" : "normal"];
  const w = PAD * 2 + (spec.cols - 1) * COL_W + NODE_W;
  const h = PAD * 2 + (spec.rows - 1) * ROW_H + NODE_H;
  const byId = Object.fromEntries(spec.nodes.map((n) => [n.id, n]));

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || paused) svg.pauseAnimations();
    else svg.unpauseAnimations();
  }, [paused]);

  return (
    <div className={`relative ${className}`}>
      <svg ref={svgRef} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={title} className="w-full h-auto">
        <title>{title}</title>
        {spec.edges.map(([from, to], i) => {
          const d = edgePath(byId[from], byId[to], COL_W, NODE_W);
          return (
            <g key={`${from}-${to}`}>
              <path d={d} fill="none" stroke="rgb(var(--line) / 0.25)" strokeWidth="1.25" />
              {packets && (
                <circle r="3" fill="rgb(var(--accent))">
                  <animateMotion dur="2.6s" begin={`${(i * 0.45) % 2.6}s`} repeatCount="indefinite" path={d} />
                </circle>
              )}
            </g>
          );
        })}
        {spec.nodes.map((n) => {
          const x = PAD + n.col * COL_W;
          const y = PAD + n.row * ROW_H;
          return (
            <g key={n.id} transform={`translate(${x} ${y})`}>
              <rect
                width={NODE_W}
                height={NODE_H}
                rx="10"
                fill="rgb(var(--surface-2))"
                stroke={n.dashed ? "rgb(var(--accent) / 0.7)" : "rgb(var(--line) / 0.18)"}
                strokeDasharray={n.dashed ? "4 3" : undefined}
              />
              <text x={NODE_W / 2} y={n.sub ? 18 : 27} textAnchor="middle" fontSize="12.5" fontWeight="500" fill="rgb(var(--text))" fontFamily="var(--font-body), system-ui">
                {n.label}
              </text>
              {n.sub && (
                <text x={NODE_W / 2} y={33} textAnchor="middle" fontSize="9.5" fill="rgb(var(--text-faint))" fontFamily="var(--font-mono), monospace" letterSpacing="0.04em">
                  {n.sub}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      {packets && (
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          className="absolute bottom-1 right-1 inline-flex items-center justify-center w-9 h-9 rounded-full text-text-faint hover:text-text"
          aria-label={paused ? "Resume diagram animation" : "Pause diagram animation"}
          aria-pressed={paused}
        >
          {paused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
        </button>
      )}
    </div>
  );
}

/* Shorthand: a straight pipeline of stages in one row. */
export function lanes(stages: Array<string | [string, string]>): FlowSpec {
  const nodes = stages.map((s, i) => {
    const [label, sub] = Array.isArray(s) ? s : [s, undefined];
    return { id: `n${i}`, label, sub, col: i, row: 0 } as FlowNode;
  });
  const edges = nodes.slice(1).map((n, i) => [`n${i}`, n.id] as [string, string]);
  return { cols: stages.length, rows: 1, nodes, edges };
}
