/*
  Hero illustration: a line-drawn event pipeline (producers → Kafka → autoscaled
  workers → database). Authored SVG, one stroke weight, currentColor. Stands in
  for the portrait slot; see DESIGN.md.
*/
export function SystemDiagram({ className = "" }: { className?: string }) {
  const label = { fontFamily: "var(--font-mono), ui-monospace, monospace", fontSize: 11, letterSpacing: 0.4 } as const;
  const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.25 } as const;
  const dashed = { ...s, strokeDasharray: "3 4" } as const;

  return (
    <svg viewBox="0 0 560 420" className={className} role="img" aria-labelledby="sys-title sys-desc">
      <title id="sys-title">Event-driven pipeline</title>
      <desc id="sys-desc">Producers publish to a Kafka topic; an autoscaler sizes a pool of workers by consumer lag; workers write to a database.</desc>

      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M1 1 L9 5 L1 9" {...s} />
        </marker>
      </defs>

      {/* Producers */}
      <g>
        <text x="24" y="60" style={label} fill="currentColor" opacity="0.7">PRODUCERS</text>
        {[86, 150, 214].map((y) => (
          <g key={y}>
            <rect x="24" y={y} width="88" height="40" rx="4" {...s} />
            <line x1="112" y1={y + 20} x2="176" y2="210" {...s} markerEnd={y === 150 ? "url(#arrow)" : undefined} />
          </g>
        ))}
        <text x="42" y={86 + 25} style={label} fill="currentColor">api</text>
        <text x="42" y={150 + 25} style={label} fill="currentColor">mobile</text>
        <text x="42" y={214 + 25} style={label} fill="currentColor">batch</text>
      </g>

      {/* Kafka topic: a partitioned bar */}
      <g>
        <text x="180" y="60" style={label} fill="currentColor" opacity="0.7">KAFKA · TOPIC</text>
        <rect x="180" y="150" width="130" height="120" rx="4" {...s} />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <line x1="180" y1={150 + 40 * (i + 1)} x2="310" y2={150 + 40 * (i + 1)} {...s} opacity={i === 2 ? 0 : 1} />
            <text x="190" y={150 + 40 * i + 24} style={label} fill="currentColor">p{i}</text>
            {[0, 1, 2, 3, 4].map((k) => (
              <rect key={k} x={222 + k * 16} y={150 + 40 * i + 14} width="10" height="12" rx="1" {...s} opacity={k < 3 + (i % 2) ? 1 : 0.35} />
            ))}
          </g>
        ))}
        <line x1="310" y1="210" x2="360" y2="210" {...s} markerEnd="url(#arrow)" />
      </g>

      {/* Workers */}
      <g>
        <text x="362" y="60" style={label} fill="currentColor" opacity="0.7">WORKERS</text>
        {[86, 150, 214, 278].map((y, i) => (
          <g key={y}>
            <rect x="362" y={y} width="88" height="40" rx="4" {...(i === 3 ? dashed : s)} opacity={i === 3 ? 0.6 : 1} />
            <text x="380" y={y + 25} style={label} fill="currentColor" opacity={i === 3 ? 0.6 : 1}>
              {i === 3 ? "+1" : `w-${i}`}
            </text>
            <line x1="360" y1="210" x2="362" y2={y + 20} {...s} opacity={i === 3 ? 0.4 : 1} />
            <line x1="450" y1={y + 20} x2="500" y2="210" {...s} opacity={i === 3 ? 0.4 : 1} />
          </g>
        ))}
        <line x1="500" y1="210" x2="508" y2="210" {...s} markerEnd="url(#arrow)" />
      </g>

      {/* Autoscaler, reading lag */}
      <g>
        <rect x="362" y="340" width="88" height="40" rx="20" {...s} />
        <text x="376" y="365" style={label} fill="currentColor">autoscale</text>
        <path d="M 406 340 V 318" {...dashed} markerEnd="url(#arrow)" />
        <path d="M 362 360 H 245 V 270" {...dashed} markerEnd="url(#arrow)" />
        <text x="252" y="326" style={label} fill="currentColor" opacity="0.7">lag</text>
      </g>

      {/* Database cylinder */}
      <g>
        <text x="500" y="60" style={label} fill="currentColor" opacity="0.7">DB</text>
        <path d="M 510 176 a 22 8 0 0 1 44 0 v 68 a 22 8 0 0 1 -44 0 z" {...s} />
        <path d="M 510 176 a 22 8 0 0 0 44 0" {...s} />
      </g>

      {/* Measure */}
      <g opacity="0.7">
        <line x1="24" y1="400" x2="554" y2="400" {...s} />
        <line x1="24" y1="394" x2="24" y2="406" {...s} />
        <line x1="554" y1="394" x2="554" y2="406" {...s} />
        <rect x="200" y="390" width="180" height="20" fill="rgb(var(--bg))" />
        <text x="290" y="404" textAnchor="middle" style={label} fill="currentColor">200K+ IMAGES / DAY</text>
      </g>
    </svg>
  );
}
