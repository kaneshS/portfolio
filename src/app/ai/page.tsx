"use client";

import { Suspense, useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { CornerDownLeft, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import posthog from "posthog-js";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isError?: boolean;
}

const chips: { label: string; q: string }[] = [
  { label: "Me", q: "Who is Kanesh and what does he do?" },
  { label: "Projects", q: "What projects has Kanesh built, and at what scale?" },
  { label: "Skills", q: "What are Kanesh's strongest skills?" },
  { label: "Stack", q: "What is Kanesh's tech stack?" },
  { label: "Contact", q: "How can I contact Kanesh?" },
];
const suggestedQuestions = chips.map((c) => c.q);

export default function AIPage() {
  return (
    <Suspense fallback={null}>
      <Chat />
    </Suspense>
  );
}

function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const [reportStatus, setReportStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const displayedRef = useRef("");
  const fullRef = useRef("");
  const typingRef = useRef<NodeJS.Timeout | null>(null);
  const isStreamingRef = useRef(false);
  const sentFromUrl = useRef(false);
  const params = useSearchParams();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, showTyping]);

  useEffect(() => () => {
    if (typingRef.current) clearInterval(typingRef.current);
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const message = text.trim();
      if (!message || isLoading) return;

      posthog.capture("ai_question_asked", { question: message.slice(0, 100), question_length: message.length, is_suggested: suggestedQuestions.includes(message) });

      const userMessage: Message = { id: Date.now().toString(), role: "user", content: message };
      const assistantId = (Date.now() + 1).toString();
      const startTime = Date.now();

      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsLoading(true);
      setShowTyping(true);

      const setAssistant = (content: string) =>
        setMessages((prev) => prev.map((m) => (m.id === assistantId ? { ...m, content } : m)));

      const ensureMinTypingTime = async () => {
        const remaining = Math.max(0, 1000 - (Date.now() - startTime));
        if (remaining > 0) await new Promise((r) => setTimeout(r, remaining));
      };

      const typewriter = () =>
        new Promise<void>((resolve) => {
          if (typingRef.current) clearInterval(typingRef.current);
          typingRef.current = setInterval(() => {
            if (displayedRef.current.length < fullRef.current.length) {
              displayedRef.current = fullRef.current.slice(0, displayedRef.current.length + 3);
              setAssistant(displayedRef.current);
            } else if (fullRef.current.length > 0 && !isStreamingRef.current) {
              if (typingRef.current) clearInterval(typingRef.current);
              setAssistant(fullRef.current);
              resolve();
            }
          }, 20);
        });

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message, stream: true }),
        });

        fullRef.current = "";
        displayedRef.current = "";

        if (response.headers.get("content-type")?.includes("text/event-stream") && response.body) {
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let added = false;
          isStreamingRef.current = true;
          const done = typewriter();

          while (true) {
            const { done: finished, value } = await reader.read();
            if (finished) break;
            for (const line of decoder.decode(value).split("\n")) {
              if (!line.startsWith("data: ")) continue;
              const data = line.slice(6);
              if (data === "[DONE]") continue;
              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  if (!added) {
                    added = true;
                    await ensureMinTypingTime();
                    setShowTyping(false);
                    setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "" }]);
                  }
                  fullRef.current += parsed.content;
                }
              } catch {}
            }
          }
          isStreamingRef.current = false;
          if (added) await done;
          else {
            if (typingRef.current) clearInterval(typingRef.current);
            await ensureMinTypingTime();
            setShowTyping(false);
          }
        } else {
          const data = await response.json();
          await ensureMinTypingTime();
          setShowTyping(false);
          setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "" }]);
          fullRef.current = data.response || "Sorry, something went wrong.";
          isStreamingRef.current = false;
          await typewriter();
        }
      } catch {
        await ensureMinTypingTime();
        setShowTyping(false);
        setMessages((prev) => [
          ...prev,
          { id: assistantId, role: "assistant", content: "error: the assistant is not responding right now. You can report this so Kaneshwar hears about it.", isError: true },
        ]);
        setReportStatus("idle");
      } finally {
        isStreamingRef.current = false;
        setIsLoading(false);
      }
    },
    [isLoading]
  );

  // /ai?q=… from the home-page ask box: send once on mount
  useEffect(() => {
    const q = params.get("q");
    if (q && !sentFromUrl.current) {
      sentFromUrl.current = true;
      sendMessage(q);
    }
  }, [params, sendMessage]);

  const sendErrorReport = useCallback(async () => {
    setReportStatus("sending");
    posthog.capture("ai_error_reported");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "",
          subject: "Portfolio AI Assistant Error Report",
          from_name: "Portfolio AI Error Reporter",
          message: `The AI assistant on your portfolio website is not working.\n\nTimestamp: ${new Date().toISOString()}\nUser Agent: ${navigator.userAgent}\n\nPlease check the Groq API key and server logs.`,
        }),
      });
      setReportStatus(res.ok ? "sent" : "error");
    } catch {
      setReportStatus("error");
    }
  }, []);

  const started = messages.length > 0 || showTyping;

  const form = (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        sendMessage(input);
      }}
      className="term flex items-center gap-2 px-3 py-1.5"
    >
      <label htmlFor="q" className="prompt text-base shrink-0">›</label>
      <input ref={inputRef} id="q" type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder={started ? "ask a follow-up…" : "ask anything about Kanesh…"} disabled={isLoading} autoComplete="off" autoFocus={!started} className="field !border-0 !bg-transparent !px-1 focus:!shadow-none" />
      <button type="submit" disabled={!input.trim() || isLoading} className="btn btn-primary !min-h-[40px] !px-3 text-[0.8rem] shrink-0 disabled:opacity-40" aria-label="Send">
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CornerDownLeft className="w-4 h-4" />}
      </button>
    </form>
  );

  if (!started) {
    return (
      <div className="min-h-[100dvh] flex flex-col justify-center pt-24 pb-12" style={{ paddingBottom: "max(3rem, env(safe-area-inset-bottom))" }}>
        <div className="container max-w-2xl text-center">
          <p className="inline-flex items-center gap-2 text-[0.75rem] text-fg-faint"><span className="dot" aria-hidden="true" /> ~/ask-me.sh · ready</p>
          <h1 className="mt-5 text-[clamp(1.75rem,5vw,2.75rem)] font-medium">Hi, I&rsquo;m Kanesh&rsquo;s assistant.</h1>
          <p className="mt-3 text-fg-dim max-w-[48ch] mx-auto">I answer from his resume and project notes only. Ask about systems, scale, stacks or decisions.</p>

          <div className="mt-8 text-left">{form}</div>

          <ul className="mt-5 flex flex-wrap justify-center gap-2">
            {chips.map((c) => (
              <li key={c.label}>
                <button onClick={() => sendMessage(c.q)} className="btn btn-ghost !min-h-[40px] text-[0.85rem] text-fg-dim">
                  <span className="prompt">$</span> {c.label.toLowerCase()}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] pt-24 flex flex-col" style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}>
      <div className="container max-w-3xl flex-1 min-h-0 flex flex-col">
        <div className="term flex-1 min-h-0 flex flex-col">
          <div className="term-bar">
            <span className="term-lights" aria-hidden="true"><i /><i /><i /></span>
            <h1 className="mx-auto text-[0.75rem] font-normal">~/ask-me.sh</h1>
            <span className="inline-flex items-center gap-1.5 text-accent"><span className="dot" aria-hidden="true" /> {isLoading ? "thinking" : "ready"}</span>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6 space-y-6 text-[0.95rem]" style={{ overscrollBehavior: "contain" }} aria-live="polite" aria-busy={isLoading}>
            {messages.map((m) =>
              m.role === "user" ? (
                <p key={m.id} className="msg-user whitespace-pre-wrap font-medium">{m.content}</p>
              ) : (
                <div key={m.id} className={m.isError ? "border-l border-accent pl-4" : "pl-4 border-l border-rule"}>
                  <div className="prose prose-sm md:prose-base max-w-none prose-p:my-1.5 prose-ul:my-1.5 prose-li:my-0.5 text-fg-dim prose-headings:font-medium prose-headings:text-fg prose-strong:text-fg prose-a:text-accent prose-code:text-fg prose-li:marker:text-accent">
                    <ReactMarkdown
                      components={{
                        a: ({ href, children }) => (
                          <a href={href} target="_blank" rel="noopener noreferrer">
                            {children}
                          </a>
                        ),
                      }}
                    >
                      {m.content.replace(/<br\s*\/?>/gi, "\n")}
                    </ReactMarkdown>
                  </div>

                  {m.isError && (
                    <div className="mt-3 text-sm">
                      {reportStatus === "sent" ? (
                        <p className="text-accent">✓ reported. Thank you.</p>
                      ) : reportStatus === "error" ? (
                        <p className="text-fg-dim">The report did not send. Email works too.</p>
                      ) : (
                        <button onClick={sendErrorReport} disabled={reportStatus === "sending"} className="btn btn-ghost !min-h-[36px] !py-1 text-sm">
                          {reportStatus === "sending" ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                          {reportStatus === "sending" ? "sending…" : "report this"}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )
            )}
            {showTyping && (
              <p className="text-fg-faint pl-4 border-l border-rule">
                <span className="caret" aria-hidden="true" /> <span className="sr-only">thinking</span>
              </p>
            )}
            <div ref={endRef} />
          </div>

          <div className="border-t border-rule p-2 md:p-3">
            <div className="[&>form]:border-0 [&>form]:shadow-none [&>form]:bg-transparent">{form}</div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[0.75rem] text-fg-faint">
          <p>answers come from this portfolio only</p>
          {!isLoading && (
            <ul className="flex flex-wrap gap-1.5">
              {chips.filter((c) => !messages.some((m) => m.role === "user" && m.content === c.q)).slice(0, 3).map((c) => (
                <li key={c.label}>
                  <button onClick={() => sendMessage(c.q)} className="btn btn-ghost !min-h-[32px] !py-0 !px-2.5 text-[0.75rem] text-fg-dim">
                    {c.label.toLowerCase()}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
