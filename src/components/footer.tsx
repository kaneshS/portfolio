import { Clock } from "@/components/clock";
import { profile } from "@/data/profile";

export function Footer() {
  return (
    <footer className="border-t border-rule py-8" style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }}>
      <div className="container flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-ink-soft">
        <p>© {new Date().getFullYear()} {profile.name}. Built with Next.js and Tailwind.</p>
        <Clock />
      </div>
    </footer>
  );
}
