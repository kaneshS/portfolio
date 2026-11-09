"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ArrowUp, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import posthog from "posthog-js";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isError?: boolean;
}

/* Five chips, each a preset question. */
const chips = [
  { label: "Me", question: "Who is Kanesh and what does he do?" },
  { label: "Projects", question: "What are the most notable systems he has built?" },
  { label: "Skills", question: "What are his strongest technical skills?" },
  { label: "Stack", question: "Which languages, databases and cloud services does he use?" },
  { label: "Contact", question: "How can I get in touch with him?" },
];
const suggestedQuestions = chips.map((c) => c.question);

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const [reportStatus, setReportStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const endRef = useRef<HTMLDivElement>(null);
  const displayedRef = useRef("");
  const fullRef = useRef("");
  const typingRef = useRef<NodeJS.Timeout | null>(null);
  const isStreamingRef = useRef(false);

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
      className="relative"
    >
      <label htmlFor="q" className="sr-only">Your question</label>
      <input
        id="q"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask about a system, a stack, a decision…"
        disabled={isLoading}
        autoComplete="off"
        className="field !rounded-full !py-3.5 !pl-5 !pr-14 text-base md:text-lg"
      />
      <button
        type="submit"
        disabled={!input.trim() || isLoading}
        className="btn btn-primary absolute right-1.5 top-1/2 -translate-y-1/2 !min-h-0 !p-0 w-10 h-10 !rounded-full disabled:opacity-40"
        aria-label="Send"
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : <ArrowUp className="w-4 h-4" aria-hidden="true" />}
      </button>
    </form>
  );

  const chipList = (
    <ul className="flex flex-wrap justify-center gap-2">
      {chips.map((c) => (
        <li key={c.label}>
          <button
            onClick={() => sendMessage(c.question)}
            disabled={isLoading}
            className="btn btn-ghost !min-h-[44px] !py-2 !px-4 text-[0.95rem] disabled:opacity-50"
          >
            {c.label}
          </button>
        </li>
      ))}
    </ul>
  );

  if (!started) {
    return (
      <div className="min-h-[100dvh] flex flex-col pt-20" style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }}>
        <div className="container max-w-2xl my-auto text-center">
          <h1 className="text-[clamp(2rem,5vw,3.25rem)]">Hi, I&rsquo;m Kanesh&rsquo;s assistant.</h1>
          <p className="fade-up text-ink-soft mt-4 text-lg" style={{ ["--d" as string]: "120ms" }}>
            Ask about systems, scale, stacks or decisions. I answer from his resume only.
          </p>
          <div className="fade-up mt-10" style={{ ["--d" as string]: "240ms" }}>
            {form}
          </div>
          <div className="fade-up mt-6" style={{ ["--d" as string]: "340ms" }}>
            {chipList}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col pt-20">
      <div className="container max-w-3xl flex-1 py-6 space-y-6" aria-live="polite" aria-busy={isLoading}>
        {messages.map((m) => (
          <div key={m.id} className={m.role === "user" ? "flex justify-end" : ""}>
            {m.role === "user" ? (
              <p className="whitespace-pre-wrap max-w-[85%] px-4 py-2.5 rounded-2xl rounded-br-md bg-surface text-ink">{m.content}</p>
            ) : (
              <div className={`max-w-[92%] ${m.isError ? "border-l border-accent pl-4" : ""}`}>
                <div className="prose prose-base max-w-none text-ink prose-p:my-2 prose-ul:my-2 prose-li:my-0.5 prose-headings:font-medium prose-headings:tracking-tight prose-strong:text-ink prose-a:text-accent prose-code:text-ink">
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
                      <p className="text-ink font-medium">Reported. Thank you.</p>
                    ) : reportStatus === "error" ? (
                      <p className="text-accent">The report did not send. Email works too.</p>
                    ) : (
                      <button onClick={sendErrorReport} disabled={reportStatus === "sending"} className="btn btn-ghost !min-h-[40px] !py-1.5 text-sm">
                        {reportStatus === "sending" ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : null}
                        {reportStatus === "sending" ? "Sending…" : "Report this"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        {showTyping && (
          <p className="text-ink-soft text-sm" aria-label="Thinking">
            Thinking
            <span className="inline-block animate-[blink_1s_steps(1)_infinite]">…</span>
          </p>
        )}
        <div ref={endRef} className="h-px scroll-mb-24" />
      </div>

      <div className="sticky bottom-0 bg-bg pt-3" style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}>
        <div className="container max-w-3xl">
          {form}
          <p className="mt-3 text-center text-xs text-ink-soft">Answers come from this portfolio only.</p>
        </div>
      </div>
    </div>
  );
}
