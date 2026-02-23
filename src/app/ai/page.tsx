"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Bot,
  User,
  Sparkles,
  AlertTriangle,
  Mail,
  CheckCircle,
  Loader2,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
   const displayedContentRef = useRef<string>("");
  const fullContentRef = useRef<string>("");
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, showTyping]);

  // Cleanup typing interval on unmount
  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, []);

  const sendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText.trim(),
    };

    const assistantMessageId = (Date.now() + 1).toString();
    const startTime = Date.now();

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setShowTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content, stream: true }),
      });

      // Helper to ensure minimum typing time
      const ensureMinTypingTime = async () => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 1000 - elapsed);
        if (remaining > 0) {
          await new Promise(resolve => setTimeout(resolve, remaining));
        }
      };

      // Check if streaming response
      if (response.headers.get("content-type")?.includes("text/event-stream")) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (reader) {
          let messageAdded = false;
          fullContentRef.current = "";
          displayedContentRef.current = "";

          // Typewriter function - reveals content gradually
          const startTypewriter = () => {
            if (typingIntervalRef.current) {
              clearInterval(typingIntervalRef.current);
            }
            
            typingIntervalRef.current = setInterval(() => {
              if (displayedContentRef.current.length < fullContentRef.current.length) {
                // Add next few characters (faster typing)
                const charsToAdd = Math.min(3, fullContentRef.current.length - displayedContentRef.current.length);
                displayedContentRef.current = fullContentRef.current.slice(0, displayedContentRef.current.length + charsToAdd);
                
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMessageId
                      ? { ...m, content: displayedContentRef.current }
                      : m
                  )
                );
              }
            }, 20); // 20ms per update = smooth typing
          };

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split("\n");

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6);
                if (data === "[DONE]") {
                  // Streaming complete - finish displaying remaining content
                  continue;
                } else {
                  try {
                    const parsed = JSON.parse(data);
                    if (parsed.content) {
                      fullContentRef.current += parsed.content;
                      
                      // First content - wait for min typing time, hide typing, add message
                      if (!messageAdded) {
                        await ensureMinTypingTime();
                        setShowTyping(false);
                        messageAdded = true;
                        setMessages((prev) => [
                          ...prev,
                          { id: assistantMessageId, role: "assistant", content: "" }
                        ]);
                        startTypewriter();
                      }
                    }
                  } catch {
                    // Skip invalid JSON
                  }
                }
              }
            }
          }

          // Wait for typewriter to finish
          await new Promise<void>((resolve) => {
            const checkComplete = setInterval(() => {
              if (displayedContentRef.current.length >= fullContentRef.current.length) {
                if (typingIntervalRef.current) {
                  clearInterval(typingIntervalRef.current);
                }
                clearInterval(checkComplete);
                // Final update to ensure all content is shown
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMessageId
                      ? { ...m, content: fullContentRef.current }
                      : m
                  )
                );
                resolve();
              }
            }, 50);
          });

          // If no content was received, hide typing
          if (!messageAdded) {
            await ensureMinTypingTime();
            setShowTyping(false);
          }
        }
      } else {
        // Non-streaming fallback response with typewriter effect
        const data = await response.json();
        const responseText = data.response || "Sorry, something went wrong.";
        
        await ensureMinTypingTime();
        setShowTyping(false);
        
        // Add empty message first
        setMessages((prev) => [
          ...prev,
          { id: assistantMessageId, role: "assistant", content: "" }
        ]);
        
        // Typewriter effect for non-streaming
        fullContentRef.current = responseText;
        displayedContentRef.current = "";
        
        await new Promise<void>((resolve) => {
          typingIntervalRef.current = setInterval(() => {
            if (displayedContentRef.current.length < fullContentRef.current.length) {
              const charsToAdd = Math.min(3, fullContentRef.current.length - displayedContentRef.current.length);
              displayedContentRef.current = fullContentRef.current.slice(0, displayedContentRef.current.length + charsToAdd);
              
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMessageId
                    ? { ...m, content: displayedContentRef.current }
                    : m
                )
              );
            } else {
              if (typingIntervalRef.current) {
                clearInterval(typingIntervalRef.current);
              }
              resolve();
            }
          }, 20);
        });
      }
    } catch {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 1000 - elapsed);
      if (remaining > 0) {
        await new Promise(resolve => setTimeout(resolve, remaining));
      }
      setShowTyping(false);
      setMessages((prev) => [
        ...prev,
        { 
          id: assistantMessageId, 
          role: "assistant", 
          content: "Sorry, the AI assistant is currently unavailable. You can report this issue to let Kaneshwar know.",
          isError: true 
        }
      ]);
      setReportStatus("idle"); // Reset report status for new error
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const sendErrorReport = useCallback(async () => {
    setReportStatus("sending");
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "",
          subject: "Portfolio AI Assistant Error Report",
          from_name: "Portfolio AI Error Reporter",
          message: `The AI assistant on your portfolio website is not working.\n\nTimestamp: ${new Date().toISOString()}\nUser Agent: ${navigator.userAgent}\n\nPlease check the Groq API key and server logs.`,
        }),
      });
      
      if (response.ok) {
        setReportStatus("sent");
      } else {
        setReportStatus("error");
      }
    } catch {
      setReportStatus("error");
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleSuggestedQuestion = (question: string) => {
    sendMessage(question);
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Simple background */}
      <div className="fixed inset-0 -z-10 bg-background" />

      <div className="container mx-auto px-4 pt-24 pb-6 max-w-4xl relative z-10">
        {/* Main chat area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50 overflow-hidden shadow-2xl shadow-accent/5"
        >
          {/* Chat header */}
          <div className="px-6 py-4 border-b border-border/50 bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-card" />
              </div>
              <div>
                <h1 className="font-semibold text-lg">Kaneshwar&apos;s AI</h1>
                <p className="text-xs text-muted-foreground">
                  Ask me anything about his experience
                </p>
              </div>
            </div>
          </div>

          {/* Messages area */}
          <div className="h-[55vh] overflow-y-auto p-6 space-y-6">
            {messages.length === 0 && !showTyping ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="h-full flex flex-col items-center justify-center text-center px-4"
              >
                <div className="w-20 h-20 rounded-3xl bg-accent/20 flex items-center justify-center mb-6">
                  <Bot className="w-10 h-10 text-accent" />
                </div>
                <h2 className="text-xl font-medium mb-2">
                  Hey! Ask me anything
                </h2>
                <p className="text-muted-foreground text-sm mb-8 max-w-sm">
                  I can tell you about Kaneshwar&apos;s experience, projects, skills, and more.
                </p>

                <div className="w-full max-w-xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {suggestedQuestions.map((question, idx) => (
                      <motion.button
                        key={question}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + idx * 0.05 }}
                        onClick={() => handleSuggestedQuestion(question)}
                        disabled={isLoading}
                        className="group relative px-4 py-3 text-sm text-left rounded-xl bg-muted/50 border border-border/50 hover:border-accent/50 hover:bg-accent/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="relative z-10">{question}</span>
                        <div className="absolute inset-0 rounded-xl bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-4 ${
                      message.role === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {message.role === "assistant" ? (
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          message.isError ? "bg-red-500/80" : "bg-accent"
                        }`}>
                          {message.isError ? (
                            <AlertTriangle className="w-5 h-5 text-white" />
                          ) : (
                            <Bot className="w-5 h-5 text-white" />
                          )}
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                          <User className="w-5 h-5" />
                        </div>
                      )}
                    </div>

                    {/* Message bubble */}
                    <div
                      className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                        message.role === "user"
                          ? "bg-accent rounded-tr-md"
                          : message.isError
                          ? "bg-red-500/10 border border-red-500/30 rounded-tl-md"
                          : "bg-muted/70 rounded-tl-md"
                      }`}
                    >
                      <div className={`text-sm leading-relaxed ${
                        message.role === "user" 
                          ? "text-white" 
                          : "prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0 prose-strong:text-foreground prose-a:text-accent prose-a:no-underline hover:prose-a:underline"
                      }`}>
                        {message.role === "assistant" ? (
                          <ReactMarkdown
                            components={{
                              a: ({ href, children }) => (
                                <a
                                  href={href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-accent hover:underline"
                                >
                                  {children}
                                </a>
                              ),
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        ) : (
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        )}
                      </div>

                      {/* Report button for error messages */}
                      {message.isError && (
                        <div className="mt-3 pt-3 border-t border-red-500/20">
                          {reportStatus === "sent" ? (
                            <div className="flex items-center gap-2 text-green-500 text-sm">
                              <CheckCircle className="w-4 h-4" />
                              <span>Report sent! Kaneshwar will be notified.</span>
                            </div>
                          ) : reportStatus === "error" ? (
                            <div className="text-sm text-red-400">
                              Failed to send report. Please try contacting directly.
                            </div>
                          ) : (
                            <button
                              onClick={sendErrorReport}
                              disabled={reportStatus === "sending"}
                              className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                            >
                              {reportStatus === "sending" ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  <span>Sending report...</span>
                                </>
                              ) : (
                                <>
                                  <Mail className="w-4 h-4" />
                                  <span>Report this issue</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {/* Typing indicator */}
                <AnimatePresence>
                  {showTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex gap-4"
                    >
                      <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                        <Bot className="w-5 h-5 text-accent-foreground" />
                      </div>
                      <div className="px-4 py-3 rounded-2xl bg-muted/70 rounded-tl-md">
                        <div className="flex items-center gap-1.5">
                          <motion.div
                            animate={{ y: [0, -4, 0] }}
                            transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                            className="w-2 h-2 bg-accent rounded-full"
                          />
                          <motion.div
                            animate={{ y: [0, -4, 0] }}
                            transition={{ repeat: Infinity, duration: 0.6, delay: 0.15 }}
                            className="w-2 h-2 bg-accent rounded-full"
                          />
                          <motion.div
                            animate={{ y: [0, -4, 0] }}
                            transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }}
                            className="w-2 h-2 bg-accent rounded-full"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="p-4 border-t border-border/50 bg-muted/30">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question..."
                disabled={isLoading}
                className="flex-1 px-4 py-3 rounded-xl bg-background/80 border border-border/50 focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all disabled:opacity-50 placeholder:text-muted-foreground/50"
              />
              <motion.button
                type="submit"
                disabled={!input.trim() || isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-5 py-3 rounded-xl bg-accent text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-opacity hover:bg-accent/90"
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </form>
          </div>
        </motion.div>

        {/* Quick suggestions when there are messages */}
        {messages.length > 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 flex flex-wrap gap-2 justify-center"
          >
            {suggestedQuestions
              .filter((q) => !messages.some((m) => m.role === "user" && m.content === q))
              .slice(0, 3)
              .map((question) => (
                <button
                  key={question}
                  onClick={() => handleSuggestedQuestion(question)}
                  className="px-3 py-1.5 text-xs rounded-full bg-muted/50 border border-border/50 hover:border-accent/50 hover:bg-accent/5 transition-all"
                >
                  {question}
                </button>
              ))}
          </motion.div>
        )}

        {/* Footer note */}
        <p className="text-center text-xs text-muted-foreground/50 mt-4">
          Responses from portfolio data only
        </p>
      </div>
    </div>
  );
}
