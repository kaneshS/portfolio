import { cn } from "@/lib/utils";

/* Inline inventory list: "Python · Go · Kafka" in small caps, no chips. */
export function InkList({ items, className }: { items: string[]; className?: string }) {
  return (
    <p className={cn("font-display text-[0.85rem] text-ink-soft leading-relaxed", className)}>
      {items.map((item, i) => (
        <span key={item}>
          <span className="whitespace-nowrap">{item}</span>
          {i < items.length - 1 && (
            <>
              {" "}
              <span className="text-ink-faint" aria-hidden="true">·</span>{" "}
            </>
          )}
        </span>
      ))}
    </p>
  );
}
