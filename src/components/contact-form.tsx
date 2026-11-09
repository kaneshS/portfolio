"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";

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
        setError(json.message || "The message did not send. Try again, or email directly.");
      }
    } catch {
      setState("error");
      setError("The message did not send. Try again, or email directly.");
    }
  };

  const busy = state === "loading" || state === "success";

  return (
    <Dialog open={isOpen} onClose={onClose} title="Send a message">
      <h2 className="text-3xl pr-10">Send a message</h2>
      <p className="text-ink-soft mt-1 text-[0.95rem]">Goes straight to my inbox.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} aria-hidden="true" />
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium">Name</span>
            <input name="name" type="text" required autoComplete="name" disabled={busy} placeholder="Your name…" className="field mt-1" />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Email</span>
            <input name="email" type="email" required autoComplete="email" spellCheck={false} disabled={busy} placeholder="you@example.com…" className="field mt-1" />
          </label>
        </div>
        <label className="block">
          <span className="text-sm font-medium">Subject</span>
          <input name="subject" type="text" required disabled={busy} placeholder="A role, a question, a system…" className="field mt-1" />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Message</span>
          <textarea name="message" required rows={5} disabled={busy} placeholder="What are you building, and where does it hurt…" className="field mt-1 resize-y" />
        </label>

        <div aria-live="polite" className="min-h-[1.5rem] text-[0.95rem]">
          {state === "success" && <p className="text-ink font-medium">Sent. I will reply within two days.</p>}
          {state === "error" && <p className="text-accent">{error}</p>}
        </div>

        <button type="submit" disabled={busy} className="btn btn-primary w-full sm:w-auto disabled:opacity-60">
          {state === "loading" && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
          {state === "loading" ? "Sending…" : state === "success" ? "Sent" : "Send"}
        </button>
      </form>
    </Dialog>
  );
}
