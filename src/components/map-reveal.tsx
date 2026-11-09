"use client";

import { useEffect, useState } from "react";

const OATH = "I solemnly swear that I am up to no good.";

/*
  The map's opening ritual: the oath writes itself on blank parchment, then the
  page is revealed. Once per session; reduced motion gets a plain fade.
*/
export function MapReveal() {
  const [phase, setPhase] = useState<"idle" | "typing" | "reveal" | "done">("idle");
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("oath") === "1";
    } catch {}
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen) return setPhase("done");
    if (reduce) {
      setPhase("reveal");
      return;
    }
    setPhase("typing");
  }, []);

  useEffect(() => {
    if (phase !== "typing") return;
    if (typed >= OATH.length) {
      const t = setTimeout(() => setPhase("reveal"), 450);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setTyped((n) => n + 1), 38);
    return () => clearTimeout(t);
  }, [phase, typed]);

  useEffect(() => {
    if (phase !== "reveal") return;
    try {
      sessionStorage.setItem("oath", "1");
    } catch {}
    const t = setTimeout(() => setPhase("done"), 900);
    return () => clearTimeout(t);
  }, [phase]);

  if (phase === "done" || phase === "idle") return null;

  return (
    <div
      role="presentation"
      onClick={() => setPhase("reveal")}
      className="fixed inset-0 z-[90] bg-bg flex items-center justify-center p-6 cursor-pointer"
      style={phase === "reveal" ? { animation: "reveal-out 850ms var(--ease-in-out) forwards", clipPath: "circle(120% at 50% 50%)" } : undefined}
    >
      <p className="font-hand text-ink text-[clamp(1.6rem,4.5vw,3rem)] leading-tight text-center max-w-3xl" aria-live="polite">
        {OATH.slice(0, typed)}
        <span className="inline-block w-[2px] h-[0.9em] align-[-0.1em] bg-ink ml-1" style={{ animation: "blink 1s steps(2) infinite" }} />
      </p>
      <p className="absolute bottom-6 right-6 font-display text-xs text-ink-faint">tap to skip</p>
    </div>
  );
}
