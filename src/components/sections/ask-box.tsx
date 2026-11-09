import { CornerDownLeft } from "lucide-react";
import { resume } from "@/data/profile";

/* Plain GET form: submits to /ai?q=…, which sends the question on mount. No JS needed here. */
export function AskBox() {
  return (
    <section className="pb-16 md:pb-24" aria-labelledby="ask-title">
      <div className="container max-w-3xl">
        <div className="term">
          <div className="term-bar">
            <span className="term-lights" aria-hidden="true"><i /><i /><i /></span>
            <span id="ask-title" className="mx-auto">~/ask-me.sh</span>
            <span className="inline-flex items-center gap-1.5 text-accent"><span className="dot" aria-hidden="true" /> ready</span>
          </div>
          <div className="p-4 md:p-5 text-[0.9rem]">
            <p className="text-fg-faint">{"// system"}</p>
            <p className="text-fg-dim">connected to {new URL(resume.links.portfolio).host} — ask anything about the work.</p>
            <form action="/ai" method="get" className="mt-5 flex items-center gap-2 border-t border-rule pt-4">
              <label htmlFor="ask" className="prompt text-base shrink-0">›</label>
              <input id="ask" name="q" type="text" required autoComplete="off" placeholder="ask anything about Kanesh…" className="field !border-0 !bg-transparent !px-1 focus:!shadow-none" />
              <button type="submit" className="btn btn-ghost !min-h-[40px] text-[0.8rem] shrink-0 text-fg-dim">
                send <CornerDownLeft className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
