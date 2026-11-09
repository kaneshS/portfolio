"use client";

import { useEffect, useState } from "react";

const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata", hour12: false });

/* Live clock in Gurugram time. Renders blank until mounted to avoid hydration drift. */
export function LocalTime({ className = "" }: { className?: string }) {
  const [t, setT] = useState("");
  useEffect(() => {
    const tick = () => setT(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className={`font-mono tabular-nums ${className}`} suppressHydrationWarning>
      {t || "  :  "}&nbsp;IST
    </span>
  );
}
