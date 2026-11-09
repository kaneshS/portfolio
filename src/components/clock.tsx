"use client";

import { useEffect, useState } from "react";

const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Kolkata" });

/* Local time in Gurugram. Renders a fixed-width placeholder until mounted to avoid a hydration mismatch. */
export function Clock({ className = "" }: { className?: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className={`meta ${className}`} suppressHydrationWarning>
      Gurugram · <time dateTime={time ?? undefined}>{time ?? "--:--"}</time> IST
    </span>
  );
}
