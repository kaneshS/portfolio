import { LocalTime } from "@/components/ui/local-time";

export function Footer() {
  return (
    <footer className="border-t border-line/10 py-8" style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }}>
      <div className="container flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-text-soft">
        <p>© {new Date().getFullYear()} Kaneshwar Sharma</p>
        <p className="font-mono text-xs text-text-faint">
          Gurugram · <LocalTime /> · Next.js
        </p>
      </div>
    </footer>
  );
}
