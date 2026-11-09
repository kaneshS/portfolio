"use client";

import { Suspense, useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowUp, Loader2, User, Briefcase, Wrench, Layers, Mail } from "lucide-react";
import ReactMarkdown from "react-markdown";
import posthog from "posthog-js";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isError?: boolean;
}

const chips = [
  { label: "Me", icon: User, q: "Who is Kaneshwar and what does he do?" },
  { label: "Projects", icon: Briefcase, q: "What are the most notable systems you have built?" },
  { label: "Skills", icon: Wrench, q: "What are your strongest technical skills?" },
  { label: "Stack", icon: Layers, q: "What languages, databases and cloud services do you use?" },
  { label: "Contact", icon: Mail, q: "How can I get in touch with you?" },
];

const suggestedQuestions = chips.map((c) => c.q);

function Assistant() {
  const params = useSearchParams();
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
  const bootedRef = useRef(false);

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

      const setAssistant = (content: string) => setMessages((prev) => prev.map((m) => (m.id === assistantId ? { ...m, content } : m)));

      const ensureMinTypingTime = async () => {
        const remaining = Math.max(0, 900 - (Date.now() - startTime));
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
          { id: assistantId, role: "assistant", content: "The assistant is not answering right now. You can report this so Kaneshwar hears about it.", isError: true },
        ]);
        setReportStatus("idle");
      } finally {
        isStreamingRef.current = false;
        setIsLoading(false);
      }
    },
    [isLoading]
  );

  // Arrived with ?q= from the home page
  useEffect(() => {
    const q = params.get("q");
    if (q && !bootedRef.current) {
      bootedRef.current = true;
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

  const empty = messages.length === 0 && !showTyping;

  const Composer = (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        sendMessage(input);
      }}
      className="relative"
    >
      <label htmlFor="q" className="sr-only">Your question</label>
      <input
        id="q"
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask me anything…"
        disabled={isLoading}
        autoComplete="off"
        autoFocus={empty}
        className="field !rounded-full !py-3.5 !pl-5 !pr-14 shadow-[0_10px_40px_-20px_rgb(0_0_0/0.6)]"
      />
      <button
        type="submit"
        disabled={!input.trim() || isLoading}
        className="absolute right-1.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-accent text-accent-fg inline-flex items-center justify-center disabled:opacity-40 transition-transform active:scale-95"
        aria-label="Send"
      >
        <ArrowUp className="w-4 h-4" />
      </button>
    </form>
  );

  if (empty) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center text-center px-4 pt-20 pb-12">
        <div className="w-16 h-16 rounded-full bg-accent text-accent-fg font-display text-2xl font-semibold inline-flex items-center justify-center reveal">
          <span style={{ ["--i" as string]: 0 }}>K</span>
        </div>
        <p className="reveal mt-6 text-text-soft">
          <span className="block" style={{ ["--i" as string]: 1 }}>Hi, I&rsquo;m Kanesh&rsquo;s assistant 👋</span>
        </p>
        <h1 className="reveal text-[clamp(2.2rem,6vw,3.6rem)]">
          <span className="block" style={{ ["--i" as string]: 2 }}>Senior Backend Engineer</span>
        </h1>
        <div className="w-full max-w-xl mt-8 reveal">
          <div style={{ ["--i" as string]: 3 }}>{Composer}</div>
        </div>
        <ul className="mt-5 flex flex-wrap justify-center gap-2 reveal">
          {chips.map((c, i) => (
            <li key={c.label} style={{ ["--i" as string]: 4 + i }}>
              <button onClick={() => sendMessage(c.q)} className="btn btn-line !min-h-[44px] !px-4 text-sm">
                <c.icon className="w-4 h-4 text-accent" /> {c.label}
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-10 label">Answers come from this portfolio only</p>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col pt-24">
      <div className="container max-w-3xl flex-1 space-y-6 pb-6" aria-live="polite" aria-busy={isLoading}>
        {messages.map((m) =>
          m.role === "user" ? (
            <div key={m.id} className="flex justify-end">
              <p className="max-w-[85%] px-4 py-3 rounded-2xl rounded-br-md bg-surface-2 border border-line/10 whitespace-pre-wrap">{m.content}</p>
            </div>
          ) : (
            <div key={m.id} className="flex gap-3">
              <span className="shrink-0 w-8 h-8 rounded-full bg-accent text-accent-fg font-display text-sm font-semibold inline-flex items-center justify-center mt-0.5" aria-hidden="true">
                K
              </span>
              <div className={`min-w-0 ${m.isError ? "text-accent" : ""}`}>
                <div className="prose dark:prose-invert prose-sm md:prose-base max-w-none prose-p:my-1.5 prose-ul:my-1.5 prose-li:my-0.5 text-text prose-headings:font-display prose-headings:font-medium prose-strong:text-text prose-a:text-accent">
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
                      <p className="text-text-soft">Reported. Thank you.</p>
                    ) : reportStatus === "error" ? (
                      <p>The report did not send. Email works too.</p>
                    ) : (
                      <button onClick={sendErrorReport} disabled={reportStatus === "sending"} className="btn btn-line !min-h-[36px] !py-1 text-sm">
                        {reportStatus === "sending" ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        {reportStatus === "sending" ? "Sending…" : "Report this"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        )}
        {showTyping && (
          <div className="flex gap-3 items-center text-text-faint">
            <span className="w-8 h-8 rounded-full bg-accent/20 inline-flex items-center justify-center" aria-hidden="true">
              <span className="w-2 h-2 rounded-full bg-accent pulse-dot" />
            </span>
            <span className="text-sm">Thinking…</span>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="sticky bottom-0 bg-bg border-t border-line/10 pt-3" style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}>
        <div className="container max-w-3xl">
          {!isLoading && (
            <ul className="mb-3 flex flex-wrap gap-2">
              {chips
                .filter((c) => !messages.some((m) => m.role === "user" && m.content === c.q))
                .slice(0, 4)
                .map((c) => (
                  <li key={c.label}>
                    <button onClick={() => sendMessage(c.q)} className="btn btn-line !min-h-[36px] !py-1 !px-3 text-xs">
                      <c.icon className="w-3.5 h-3.5 text-accent" /> {c.label}
                    </button>
                  </li>
                ))}
            </ul>
          )}
          {Composer}
        </div>
      </div>
    </div>
  );
}

export default function AIPage() {
  return (
    <Suspense fallback={null}>
      <Assistant />
    </Suspense>
  );
}
