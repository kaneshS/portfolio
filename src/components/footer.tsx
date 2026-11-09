"use client";

import { useEffect, useState } from "react";

/* "Mischief managed": the map wipes itself clean. Rare, so it gets the delight budget. */
export function Footer() {
  const [managed, setManaged] = useState(false);

  useEffect(() => {
    if (!managed) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setManaged(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [managed]);

  return (
    <footer className="border-t border-rule/50 py-8" style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }}>
      <div className="container flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-ink-soft">
        <p>© {new Date().getFullYear()} Kaneshwar Sharma. Drawn with Next.js and Tailwind.</p>
        <button onClick={() => setManaged(true)} className="font-hand text-xl text-ink ink-link">
          Mischief managed.
        </button>
      </div>

      {managed && (
        <div
          role="dialog"
          aria-label="Map closed"
          onClick={() => setManaged(false)}
          className="fixed inset-0 z-[95] bg-bg flex items-center justify-center cursor-pointer ink-in"
        >
          <p className="font-hand text-ink text-[clamp(1.8rem,5vw,3.4rem)] text-center px-6">
            Mischief managed.
            <span className="block font-display text-sm text-ink-faint mt-4">tap anywhere to reopen the map</span>
          </p>
        </div>
      )}
    </footer>
  );
}
