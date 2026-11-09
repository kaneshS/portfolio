"use client";

import { Suspense, useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowUp, ChevronDown, ChevronUp, Info, Loader2, User, Briefcase, Wrench, Layers, Mail, Sun, Moon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import posthog from "posthog-js";
import { resume } from "@/data/profile";
import { Dialog } from "@/components/ui/dialog";
import { useTheme } from "@/components/theme-provider";

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

/* Avatar: a K mark. Drop a memoji at public/memoji.png and swap the span for <img>. */
function Avatar({ size }: { size: "sm" | "lg" }) {
  const cls = size === "lg" ? "w-40 h-40 md:w-52 md:h-52 text-6xl md:text-8xl" : "w-12 h-12 text-xl";
  return (
    <span className={`${cls} rounded-full bg-accent text-accent-fg font-display font-semibold inline-flex items-center justify-center`} aria-hidden="true">
      K
    </span>
  );
}

function ThemeButton() {
  const { theme, toggleTheme, mounted } = useTheme();
  return (
    <button onClick={toggleTheme} className="w-11 h-11 inline-flex items-center justify-center rounded-full text-text-soft hover:text-text hover:bg-surface-2" aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}>
      {mounted ? theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" /> : <span className="w-4 h-4" />}
    </button>
  );
}

function Assistant() {
  const params = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const [showChips, setShowChips] = useState(true);
  const [infoOpen, setInfoOpen] = useState(false);
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
        className={`field !rounded-full !py-4 !pl-6 !pr-16 ${empty ? "!bg-surface shadow-[0_10px_40px_-20px_rgb(0_0_0/0.6)]" : ""}`}
      />
      <button
        type="submit"
        disabled={!input.trim() || isLoading}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-accent text-accent-fg inline-flex items-center justify-center disabled:opacity-40 transition-transform active:scale-95"
        aria-label="Send"
      >
        <ArrowUp className="w-4 h-4" />
      </button>
    </form>
  );

  const TopBar = (
    <div className="fixed top-0 inset-x-0 z-30 flex items-start justify-between px-4 md:px-6 pointer-events-none" style={{ paddingTop: "max(1rem, env(safe-area-inset-top))" }}>
      <Link href="/" className="btn btn-line pointer-events-auto !min-h-[44px] !px-4 text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to site
      </Link>
      <div className="flex items-center gap-1 pointer-events-auto">
        <ThemeButton />
        <button onClick={() => setInfoOpen(true)} className="w-11 h-11 inline-flex items-center justify-center rounded-full text-text-soft hover:text-text hover:bg-surface-2" aria-label="About this assistant">
          <Info className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  const InfoDialog = (
    <Dialog open={infoOpen} onClose={() => setInfoOpen(false)} title="About this assistant">
      <h2 className="font-display text-2xl pr-10">About this assistant</h2>
      <ul className="mt-4 space-y-2 text-text-soft">
        <li>Answers come only from this portfolio: resume, projects and the write-ups on the site.</li>
        <li>It speaks as Kaneshwar in the first person. It is a model, not him.</li>
        <li>Nothing you type is stored beyond the request. Questions are counted, not kept.</li>
        <li>
          Want a human? <a className="link text-text" href={`mailto:${resume.email}`}>{resume.email}</a>
        </li>
      </ul>
    </Dialog>
  );

  if (empty) {
    return (
      <div className="relative min-h-[100dvh] overflow-hidden flex flex-col items-center justify-center text-center px-4 pt-24 pb-16">
        {TopBar}
        <div className="reveal">
          <span className="block w-12 h-12 mx-auto rounded-2xl bg-surface border border-line/10 shadow-[0_8px_24px_-12px_rgb(0_0_0/0.5)] inline-flex items-center justify-center font-mono text-sm text-accent" style={{ ["--i" as string]: 0 }}>
            {"{k}"}
          </span>
        </div>
        <p className="reveal mt-5 text-lg text-text-soft">
          <span className="block" style={{ ["--i" as string]: 1 }}>Hey, I&rsquo;m Kanesh 👋</span>
        </p>
        <h1 className="reveal text-[clamp(2.4rem,7vw,4.2rem)]">
          <span className="block" style={{ ["--i" as string]: 2 }}>Full-Stack Engineer</span>
        </h1>
        <div className="reveal mt-8">
          <div style={{ ["--i" as string]: 3 }}>
            <Avatar size="lg" />
          </div>
        </div>
        <div className="w-full max-w-xl mt-8 reveal">
          <div style={{ ["--i" as string]: 4 }}>{Composer}</div>
        </div>
        <ul className="w-full max-w-2xl mt-4 grid grid-cols-3 sm:grid-cols-5 gap-3 reveal">
          {chips.map((c, i) => (
            <li key={c.label} style={{ ["--i" as string]: 5 + i }}>
              <button onClick={() => sendMessage(c.q)} className="card lift w-full min-h-[72px] py-3 px-2 flex flex-col items-center justify-center gap-1.5 text-sm font-medium">
                <c.icon className="w-4 h-4 text-accent" /> {c.label}
              </button>
            </li>
          ))}
        </ul>
        <span aria-hidden="true" className="pointer-events-none select-none absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-[28%] font-display font-semibold leading-none text-[clamp(6rem,24vw,20rem)] text-text/[0.04] whitespace-nowrap">
          Kanesh
        </span>
        {InfoDialog}
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col">
      {TopBar}
      <div className="sticky top-0 z-20 bg-bg/90 backdrop-blur-md flex justify-center pt-4 pb-3" style={{ paddingTop: "max(1rem, env(safe-area-inset-top))" }}>
        <Avatar size="sm" />
      </div>

      <div className="container max-w-3xl flex-1 space-y-6 pt-4 pb-6" aria-live="polite" aria-busy={isLoading}>
        {messages.map((m) =>
          m.role === "user" ? (
            <div key={m.id} className="flex justify-center">
              <p className="max-w-[85%] px-5 py-2.5 rounded-full bg-accent text-accent-fg font-medium whitespace-pre-wrap">{m.content}</p>
            </div>
          ) : (
            <div key={m.id} className={`min-w-0 ${m.isError ? "text-accent" : ""}`}>
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
          )
        )}
        {showTyping && (
          <div className="flex items-center gap-2 text-text-faint text-sm">
            <span className="w-2 h-2 rounded-full bg-accent pulse-dot" aria-hidden="true" />
            Thinking…
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="sticky bottom-0 z-20 bg-bg pt-2" style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
        <div className="container max-w-3xl">
          <button onClick={() => setShowChips((s) => !s)} className="mx-auto mb-2 flex items-center gap-1 text-xs text-text-faint hover:text-text min-h-[32px]" aria-expanded={showChips}>
            {showChips ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            {showChips ? "Hide quick questions" : "Show quick questions"}
          </button>
          {showChips && (
            <ul className="mb-3 flex flex-wrap justify-center gap-2">
              {chips.map((c) => (
                <li key={c.label}>
                  <button onClick={() => sendMessage(c.q)} disabled={isLoading} className="btn btn-line !min-h-[40px] !py-1.5 !px-4 text-sm disabled:opacity-50">
                    <c.icon className="w-4 h-4 text-accent" /> {c.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {Composer}
          <p className="mt-3 text-center text-xs text-text-faint">Answers come from this portfolio only</p>
        </div>
      </div>
      {InfoDialog}
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
