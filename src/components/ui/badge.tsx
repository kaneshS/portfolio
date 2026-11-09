import { cn } from "@/lib/utils";

/* Inline list: "Python · Go · Kafka". No chips. */
export function InlineList({ items, className }: { items: string[]; className?: string }) {
  return (
    <p className={cn("text-[0.9rem] text-ink-soft leading-relaxed", className)}>
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
