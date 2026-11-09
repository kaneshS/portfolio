"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import posthog from "posthog-js";
import { Footprint, Frame } from "@/components/ui/ornaments";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isError?: boolean;
}

const suggestedQuestions = [
  "What kind of backend work have you done?",
  "Tell me about your GCP and AWS experience",
  "What scale systems have you built?",
  "What AI and Web3 projects have you worked on?",
  "Tell me about your experience with Kafka",
  "What databases have you worked with?",
];

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
          { id: assistantId, role: "assistant", content: "The map is not answering right now. You can report this so Kaneshwar hears about it.", isError: true },
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

  const remaining = suggestedQuestions.filter((q) => !messages.some((m) => m.role === "user" && m.content === q));

  return (
    <div className="min-h-[100dvh] pt-24 pb-8" style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }}>
      <div className="container max-w-4xl">
        <header className="mb-6 ink-in">
          <h1 className="text-4xl md:text-5xl">Ask the map</h1>
          <p className="text-ink-soft mt-2 max-w-[56ch]">It answers from what is written on this map and nothing else. Ask about systems, scale, stacks or decisions.</p>
        </header>

        <Frame paper className="p-0 ink-in" data-delay="1">
          <div className="h-[56dvh] min-h-[22rem] overflow-y-auto p-5 md:p-8 space-y-6" style={{ overscrollBehavior: "contain" }} aria-live="polite" aria-busy={isLoading}>
            {messages.length === 0 && !showTyping ? (
              <div className="h-full flex flex-col justify-center">
                <p className="font-hand text-2xl text-ink-soft mb-6">Some questions people ask first:</p>
                <ul className="grid sm:grid-cols-2 gap-2">
                  {suggestedQuestions.map((q) => (
                    <li key={q}>
                      <button onClick={() => sendMessage(q)} disabled={isLoading} className="w-full text-left px-4 py-3 min-h-[44px] rounded-[2px] border border-rule/60 text-[0.95rem] text-ink hover:border-ink hover:bg-ink/5 transition-colors disabled:opacity-50">
                        {q}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <>
                {messages.map((m) => (
                  <div key={m.id} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                    <div className="shrink-0 w-8 h-8 mt-1 flex items-center justify-center" aria-hidden="true">
                      {m.role === "assistant" ? <Footprint className={`w-5 h-6 ${m.isError ? "text-wax" : "text-ink"}`} /> : <span className="font-display text-ink-faint">you</span>}
                    </div>
                    <div className={`max-w-[80%] px-4 py-3 rounded-[2px] ${m.role === "user" ? "bg-ink text-bg" : m.isError ? "border border-wax/60 text-ink" : "bg-bg/60 text-ink"}`}>
                      {m.role === "assistant" ? (
                        <div className="prose prose-sm md:prose-base max-w-none prose-p:my-1.5 prose-ul:my-1.5 prose-li:my-0.5 text-ink prose-headings:font-display prose-headings:font-normal prose-strong:text-ink prose-a:text-wax">
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
                      ) : (
                        <p className="whitespace-pre-wrap">{m.content}</p>
                      )}

                      {m.isError && (
                        <div className="mt-3 pt-3 border-t border-wax/30 text-sm">
                          {reportStatus === "sent" ? (
                            <p className="font-hand text-lg">Reported. Thank you.</p>
                          ) : reportStatus === "error" ? (
                            <p className="text-wax">The report did not send. Email works too.</p>
                          ) : (
                            <button onClick={sendErrorReport} disabled={reportStatus === "sending"} className="btn btn-ink !min-h-[36px] !py-1 text-sm">
                              {reportStatus === "sending" ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                              {reportStatus === "sending" ? "Sending…" : "Report this"}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {showTyping && (
                  <div className="flex gap-3 items-center text-ink-faint">
                    <Footprint className="w-5 h-6 text-ink" />
                    <span className="font-hand text-xl">the ink is drying…</span>
                  </div>
                )}
              </>
            )}
            <div ref={endRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="border-t border-rule/50 p-3 md:p-4 flex gap-2"
          >
            <label htmlFor="q" className="sr-only">Your question</label>
            <input id="q" type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about a system, a stack, a decision…" disabled={isLoading} autoComplete="off" className="field" />
            <button type="submit" disabled={!input.trim() || isLoading} className="btn btn-wax shrink-0" aria-label="Send">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </Frame>

        {messages.length > 0 && !isLoading && remaining.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {remaining.slice(0, 3).map((q) => (
              <li key={q}>
                <button onClick={() => sendMessage(q)} className="px-3 py-2 min-h-[40px] text-sm border border-rule/60 rounded-[2px] hover:border-ink hover:bg-ink/5 transition-colors">
                  {q}
                </button>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-4 font-display text-xs text-ink-faint">Answers come from this portfolio only.</p>
      </div>
    </div>
  );
}
