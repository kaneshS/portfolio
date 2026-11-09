"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { TermDialog } from "@/components/ui/dialog";

export function ContactForm({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setState("loading");
    setError("");
    const data = new FormData(form);
    data.append("access_key", process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "");
    try {
      const res = await fetch("https://api.web3forms.com/submit", { method: "POST", body: data });
      const json = await res.json();
      if (json.success) {
        setState("success");
        form.reset();
        setTimeout(() => {
          onClose();
          setState("idle");
        }, 2500);
      } else {
        setState("error");
        setError(json.message || "Send failed. Try again, or email directly.");
      }
    } catch {
      setState("error");
      setError("Send failed. Try again, or email directly.");
    }
  };

  const busy = state === "loading" || state === "success";
  const label = "block text-[0.75rem] uppercase tracking-[0.08em] text-fg-faint";

  return (
    <TermDialog open={isOpen} onClose={onClose} title="~/contact/send">
      <h2 className="text-2xl font-medium">Send a message</h2>
      <p className="text-fg-dim mt-1 text-[0.9rem]">Goes straight to my inbox.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} aria-hidden="true" />
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className={label}>name <span className="text-accent">*</span></span>
            <input name="name" type="text" required autoComplete="name" disabled={busy} placeholder="Ada Lovelace…" className="field mt-1.5" />
          </label>
          <label className="block">
            <span className={label}>email <span className="text-accent">*</span></span>
            <input name="email" type="email" required autoComplete="email" spellCheck={false} disabled={busy} placeholder="you@example.com…" className="field mt-1.5" />
          </label>
        </div>
        <label className="block">
          <span className={label}>subject <span className="text-accent">*</span></span>
          <input name="subject" type="text" required disabled={busy} placeholder="A role, a question, a system…" className="field mt-1.5" />
        </label>
        <label className="block">
          <span className={label}>message <span className="text-accent">*</span></span>
          <textarea name="message" required rows={5} disabled={busy} placeholder="What are you building?" className="field mt-1.5 resize-y" />
        </label>

        <div aria-live="polite" className="min-h-[1.5rem] text-[0.9rem]">
          {state === "success" && <p className="text-accent">✓ sent. I&rsquo;ll reply by email.</p>}
          {state === "error" && <p className="text-fg">error: {error}</p>}
        </div>

        <button type="submit" disabled={busy} className="btn btn-primary w-full sm:w-auto disabled:opacity-60">
          {state === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
          {state === "loading" ? "sending…" : state === "success" ? "sent" : "$ send message"}
        </button>
      </form>
    </TermDialog>
  );
}
