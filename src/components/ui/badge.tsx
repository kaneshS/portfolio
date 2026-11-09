import { cn } from "@/lib/utils";

/* Mono chips for stacks. */
export function Chips({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)}>
      {items.map((item) => (
        <li key={item} className="font-mono text-[0.72rem] tracking-wide text-text-soft px-2 py-1 rounded-md bg-surface-2 border border-line/10 whitespace-nowrap">
          {item}
        </li>
      ))}
    </ul>
  );
}
