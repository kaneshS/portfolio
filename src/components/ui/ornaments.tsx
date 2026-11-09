/* Hand-drawn map ornaments: single stroke weight, currentColor. */

export function Footprint({ left = true, className = "" }: { left?: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 76 76"
      aria-hidden="true"
      className={className}
      style={{ transform: left ? undefined : "scaleX(-1)" }}
    >
      <path
        fill="currentColor"
        d="M 44.5,18.5C 45.9,18.5 47,20.3 47,22.5C 47,24.7 45.9,26.5 44.5,26.5C 43.1,26.5 42,24.7 42,22.5C 42,20.3 43.1,18.5 44.5,18.5 Z M 39.25,19.75C 40.1,19.75 40.75,20.9 40.75,22.25C 40.75,23.6 40.1,24.75 39.25,24.75C 38.4,24.75 37.75,23.6 37.75,22.25C 37.75,20.9 38.4,19.75 39.25,19.75 Z M 35,21C 35.8,21 36.5,21.9 36.5,23C 36.5,24.1 35.8,25 35,25C 34.2,25 33.5,24.1 33.5,23C 33.5,21.9 34.2,21 35,21 Z M 31.5,23.25C 32.3,23.25 33,24.1 33,25.25C 33,26.4 32.3,27.25 31.5,27.25C 30.7,27.25 30,26.4 30,25.25C 30,24.1 30.7,23.25 31.5,23.25 Z M 28.75,26.75C 29.3,26.75 29.75,27.4 29.75,28.25C 29.75,29.1 29.3,29.75 28.75,29.75C 28.2,29.75 27.75,29.1 27.75,28.25C 27.75,27.4 28.2,26.75 28.75,26.75 Z M 34,27.5C 43,23 49.2,31.3 42,40C 37,46 51.1,55.5 42,57.5C 35,59 37.2,49.9 35,46C 26,30 34,27.5 34,27.5 Z"
      />
    </svg>
  );
}

/* A short walking trail; count steps, direction in degrees (0 = up). */
export function Trail({ steps = 6, angle = 0, className = "" }: { steps?: number; angle?: number; className?: string }) {
  return (
    <div className={`flex flex-col items-center gap-1 ${className}`} style={{ transform: `rotate(${angle}deg)` }} aria-hidden="true">
      {Array.from({ length: steps }).map((_, i) => (
        <span key={i} className="footprint block w-5 h-6 text-ink-soft" style={{ ["--i" as string]: i, marginLeft: i % 2 ? 14 : -14 }}>
          <Footprint left={i % 2 === 0} className="w-full h-full rotate-180" />
        </span>
      ))}
    </div>
  );
}

export function Compass({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true" className={className} fill="none" stroke="currentColor">
      <circle cx="100" cy="100" r="92" strokeWidth="1" />
      <circle cx="100" cy="100" r="86" strokeWidth="0.75" strokeDasharray="2 4" />
      <circle cx="100" cy="100" r="34" strokeWidth="1" />
      <g strokeWidth="1">
        {Array.from({ length: 16 }).map((_, i) => {
          const a = (i * Math.PI) / 8;
          const r1 = i % 4 === 0 ? 70 : i % 2 === 0 ? 76 : 80;
          return <line key={i} x1={100 + Math.cos(a) * r1} y1={100 + Math.sin(a) * r1} x2={100 + Math.cos(a) * 86} y2={100 + Math.sin(a) * 86} />;
        })}
      </g>
      <path d="M100 18 L112 100 L100 182 L88 100 Z" fill="currentColor" fillOpacity="0.12" strokeWidth="1" />
      <path d="M18 100 L100 88 L182 100 L100 112 Z" fill="currentColor" fillOpacity="0.12" strokeWidth="1" />
      <path d="M100 18 L112 100 L100 100 Z" fill="currentColor" />
      <g fontFamily="var(--font-display)" fontSize="16" fill="currentColor" stroke="none" textAnchor="middle">
        <text x="100" y="14">N</text>
        <text x="100" y="196">S</text>
        <text x="190" y="105">E</text>
        <text x="10" y="105">W</text>
      </g>
    </svg>
  );
}

/* Corner flourish for the map frame; rotate per corner. */
export function Corner({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
      <path d="M2 38 V14 Q2 2 14 2 H38" />
      <path d="M8 32 V18 Q8 8 18 8 H32" strokeDasharray="1.5 3" />
      <circle cx="8" cy="8" r="2" fill="currentColor" />
    </svg>
  );
}

export function Frame({ children, className = "", paper = false }: { children: React.ReactNode; className?: string; paper?: boolean }) {
  const corner = "absolute w-7 h-7 text-ink-faint";
  return (
    <div className={`map-frame ${paper ? "on-paper" : ""} ${className}`}>
      <Corner className={`${corner} -top-1 -left-1`} />
      <Corner className={`${corner} -top-1 -right-1 rotate-90`} />
      <Corner className={`${corner} -bottom-1 -right-1 rotate-180`} />
      <Corner className={`${corner} -bottom-1 -left-1 -rotate-90`} />
      {children}
    </div>
  );
}

/* Ribbon banner behind a label, like the map's room names. */
export function Ribbon({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`relative inline-block px-5 py-1 font-display text-ink ${className}`}>
      <svg viewBox="0 0 200 40" preserveAspectRatio="none" aria-hidden="true" className="absolute inset-0 w-full h-full text-paper" fill="currentColor" stroke="rgb(var(--rule) / 0.8)" strokeWidth="1">
        <path d="M8 6 H192 L184 20 L192 34 H8 L16 20 Z" vectorEffect="non-scaling-stroke" />
      </svg>
      <span className="relative">{children}</span>
    </span>
  );
}

export function WaxSeal({ className = "", letter = "K" }: { className?: string; letter?: string }) {
  return (
    <svg viewBox="0 0 80 80" aria-hidden="true" className={className}>
      <path
        d="M40 4c8 0 12 6 20 6s12 8 12 16-6 10-6 18 8 12 2 20-12 6-20 8-10-4-18-4-14-6-16-14 4-12 2-20-6-10 0-18S32 4 40 4z"
        fill="rgb(var(--wax))"
      />
      <circle cx="40" cy="40" r="22" fill="none" stroke="rgb(var(--wax-fg))" strokeOpacity="0.5" strokeWidth="1.5" strokeDasharray="2 3" />
      <text x="40" y="50" textAnchor="middle" fontFamily="var(--font-display)" fontSize="30" fill="rgb(var(--wax-fg))">
        {letter}
      </text>
    </svg>
  );
}
