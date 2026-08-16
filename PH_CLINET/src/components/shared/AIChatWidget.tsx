"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  Sparkles,
  X,
  Send,
  Bot,
  User,
  RefreshCw,
  Trash2,
  Database,
  CheckCircle2,
  HelpCircle,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import {
  queryRagAction,
  ingestDoctorsAction,
  getCurrentUserRoleAction,
} from "@/app/_actions/rag.actions";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  sources?: string;
  isError?: boolean;
}

const SAMPLE_QUERIES = [
  { label: "Neurologist in Dhaka", icon: "🧠" },
  { label: "Cardiologist for chest pain", icon: "❤️" },
  { label: "Pediatrician near Dhanmondi", icon: "👶" },
  { label: "Top rated Dental specialist", icon: "🦷" },
  { label: "Gynecologist in Uttara", icon: "🩺" },
];

export const AIChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [hasUnreadPrompt, setHasUnreadPrompt] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check user role on mount
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const res = await getCurrentUserRoleAction();
        if (res?.role) {
          setUserRole(res.role);
        }
      } catch (err) {
        console.error("Failed to retrieve user role for AI chat widget", err);
      }
    };

    fetchUserRole();
  }, []);

  const isAdminOrSuperAdmin =
    userRole === "ADMIN" || userRole === "SUPER_ADMIN";

  // Auto scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
      setHasUnreadPrompt(false);
    }
  }, [isOpen]);

  const handleSendMessage = async (queryText?: string) => {
    const query = (queryText ?? inputQuery).trim();
    if (!query || isLoading) return;

    const userMessageId = `user-${Date.now()}`;
    const newUserMessage: ChatMessage = {
      id: userMessageId,
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputQuery("");
    setIsLoading(true);

    try {
      const response = await queryRagAction(query);

      if (response.success && response.answer) {
        const assistantMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: "assistant",
          content: response.answer,
          sources: response.sources,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        const errorMessage: ChatMessage = {
          id: `ai-err-${Date.now()}`,
          role: "assistant",
          content:
            response.error ||
            "I couldn't retrieve an answer right now. Please try asking again.",
          isError: true,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (err) {
      console.error("AI query execution error:", err);
      const errorMessage: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        role: "assistant",
        content: "An unexpected error occurred. Please try again.",
        isError: true,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSyncDoctorData = async () => {
    if (isSyncing) return;

    setIsSyncing(true);
    const toastId = toast.loading("Syncing Doctor knowledge base into RAG...");

    try {
      const result = await ingestDoctorsAction();

      if (result.success) {
        toast.success(result.message || "Doctors knowledge synced successfully!", {
          id: toastId,
        });

        // Add a system update in the conversation
        const systemMessage: ChatMessage = {
          id: `sys-${Date.now()}`,
          role: "assistant",
          content:
            "✅ **Doctor Knowledge Base Synced Successfully!**\n\nThe RAG vector database has been refreshed with the latest doctors data from the system.",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prev) => [...prev, systemMessage]);
      } else {
        toast.error(result.error || "Failed to synchronize doctors data.", {
          id: toastId,
        });
      }
    } catch (err) {
      console.error("Sync error:", err);
      toast.error("Failed to synchronize doctors data.", {
        id: toastId,
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    toast.info("Chat conversation cleared");
  };

  // Helper to render markdown-like bold text and line breaks cleanly
  const renderMessageContent = (text: string) => {
    const lines = text.split("\n");
    return (
      <div className="space-y-1.5 text-sm leading-relaxed">
        {lines.map((line, lineIndex) => {
          if (!line.trim()) {
            return <div key={lineIndex} className="h-1.5" />;
          }

          // Parse **bold** parts
          const parts = line.split(/(\*\*.*?\*\*)/g);
          return (
            <p key={lineIndex} className="break-words">
              {parts.map((part, partIndex) => {
                if (part.startsWith("**") && part.endsWith("**")) {
                  return (
                    <strong
                      key={partIndex}
                      className="font-semibold text-foreground"
                    >
                      {part.slice(2, -2)}
                    </strong>
                  );
                }
                return <span key={partIndex}>{part}</span>;
              })}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <TooltipProvider delayDuration={200}>
      <aside
        aria-label="AI Healthcare Assistant"
        className="fixed bottom-5 right-5 z-50 flex flex-col items-end pointer-events-auto"
      >
        {/* Floating Bubble Prompt Notification */}
        {!isOpen && hasUnreadPrompt && (
          <div
            onClick={() => setIsOpen(true)}
            className="mb-3 mr-1 flex cursor-pointer items-center gap-2 rounded-full border border-primary/20 bg-background/95 px-3.5 py-2 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-primary/40 animate-in fade-in slide-in-from-bottom-2"
          >
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-xs font-medium text-foreground">
              Ask AI Doctor Finder <span className="text-primary font-bold">✨</span>
            </p>
            <button
              type="button"
              aria-label="Dismiss notification"
              onClick={(e) => {
                e.stopPropagation();
                setHasUnreadPrompt(false);
              }}
              className="ml-1 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3" />
            </button>
          </div>
        )}

        {/* Chat Window Panel */}
        {isOpen && (
          <div className="mb-3 flex h-[580px] max-h-[85vh] w-[360px] sm:w-[420px] flex-col overflow-hidden rounded-2xl border border-border/80 bg-card/95 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
            {/* Window Header */}
            <div className="relative flex items-center justify-between border-b border-border/60 bg-muted/40 px-4 py-3.5">
              <div className="flex items-center gap-2.5">
                <div className="relative flex size-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-primary/70 text-primary-foreground shadow-md">
                  <Bot className="size-5" />
                  <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-background bg-emerald-500" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-semibold text-sm text-foreground">
                      PH AI Health Assistant
                    </h3>
                    <Badge
                      variant="secondary"
                      className="px-1.5 py-0 text-[10px] font-medium bg-primary/10 text-primary border-0"
                    >
                      RAG AI
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Doctor & Specialist Recommendation
                  </p>
                </div>
              </div>

              {/* Header Action Buttons */}
              <div className="flex items-center gap-1">
                {/* Admin/SuperAdmin Doctor Data Sync Button */}
                {isAdminOrSuperAdmin && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleSyncDoctorData}
                        disabled={isSyncing}
                        className="size-8 rounded-lg border-amber-500/30 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 dark:text-amber-400"
                        aria-label="Sync Doctors Knowledge"
                      >
                        <RefreshCw
                          className={`size-3.5 ${
                            isSyncing ? "animate-spin text-amber-500" : ""
                          }`}
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs">
                      Sync Doctor Vector Database (Admin Only)
                    </TooltipContent>
                  </Tooltip>
                )}

                {/* Clear Chat Button */}
                {messages.length > 0 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleClearChat}
                        className="size-8 rounded-lg text-muted-foreground hover:text-foreground"
                        aria-label="Clear chat"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs">
                      Clear conversation
                    </TooltipContent>
                  </Tooltip>
                )}

                {/* Minimize / Close Button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsOpen(false)}
                      className="size-8 rounded-lg text-muted-foreground hover:text-foreground"
                      aria-label="Close chat"
                    >
                      <X className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    Close assistant
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            {/* Admin Knowledge Sync Alert Banner if Admin */}
            {isAdminOrSuperAdmin && (
              <div className="flex items-center justify-between border-b border-amber-500/20 bg-amber-500/5 px-3 py-1.5 text-[11px] text-amber-700 dark:text-amber-300">
                <span className="flex items-center gap-1">
                  <Database className="size-3 text-amber-500" />
                  Admin Mode: Doctor Sync available
                </span>
                <button
                  type="button"
                  onClick={handleSyncDoctorData}
                  disabled={isSyncing}
                  className="font-semibold underline hover:text-amber-800 dark:hover:text-amber-200 disabled:opacity-50"
                >
                  {isSyncing ? "Syncing..." : "Sync now"}
                </button>
              </div>
            )}

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Empty state / Welcome card */}
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center pt-2 pb-4 text-center">
                  <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Stethoscope className="size-6" />
                  </div>
                  <h4 className="text-sm font-semibold text-foreground">
                    How can I assist your health journey?
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground max-w-[280px]">
                    Ask me to find doctors by specialty, symptoms, or location
                    across Dhaka and Bangladesh.
                  </p>

                  {/* Sample Query Suggestions */}
                  <div className="mt-5 w-full space-y-2 text-left">
                    <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground px-1">
                      <Sparkles className="size-3 text-primary" />
                      <span>Suggested Queries:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {SAMPLE_QUERIES.map((sample, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSendMessage(sample.label)}
                          className="group flex items-center gap-1.5 rounded-full border border-border/80 bg-background px-3 py-1.5 text-xs text-foreground/90 shadow-sm transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-primary active:scale-95"
                        >
                          <span className="text-xs">{sample.icon}</span>
                          <span>{sample.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Chat Message List */}
              {messages.map((message) => {
                const isUser = message.role === "user";
                return (
                  <div
                    key={message.id}
                    className={`flex items-start gap-2.5 ${
                      isUser ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div
                      className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                        isUser
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground border border-border"
                      }`}
                    >
                      {isUser ? (
                        <User className="size-3.5" />
                      ) : (
                        <Bot className="size-3.5 text-primary" />
                      )}
                    </div>

                    <div
                      className={`max-w-[82%] space-y-1.5 rounded-2xl px-3.5 py-2.5 shadow-sm text-sm ${
                        isUser
                          ? "bg-primary text-primary-foreground rounded-tr-xs"
                          : message.isError
                          ? "bg-destructive/10 border border-destructive/20 text-destructive rounded-tl-xs"
                          : "bg-muted/70 border border-border/60 text-foreground rounded-tl-xs"
                      }`}
                    >
                      {isUser ? (
                        <p className="whitespace-pre-wrap break-words">
                          {message.content}
                        </p>
                      ) : (
                        renderMessageContent(message.content)
                      )}

                      <div
                        className={`flex items-center gap-2 pt-1 text-[10px] ${
                          isUser
                            ? "text-primary-foreground/70 justify-end"
                            : "text-muted-foreground justify-between"
                        }`}
                      >
                        {!isUser && message.sources && (
                          <span className="inline-flex items-center gap-1 rounded bg-background/80 px-1.5 py-0.5 text-[9px] font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="size-2.5" />
                            {message.sources}
                          </span>
                        )}
                        <span>{message.timestamp}</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Loading / Thinking State */}
              {isLoading && (
                <div className="flex items-start gap-2.5">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground border border-border">
                    <Bot className="size-3.5 text-primary animate-pulse" />
                  </div>
                  <div className="rounded-2xl rounded-tl-xs border border-border/60 bg-muted/60 px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className="size-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                        <span className="size-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                        <span className="size-1.5 rounded-full bg-primary animate-bounce" />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Searching medical database...
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts Bar (when messages exist) */}
            {messages.length > 0 && !isLoading && (
              <div className="flex items-center gap-1.5 overflow-x-auto border-t border-border/40 bg-muted/20 px-3 py-2 text-xs no-scrollbar">
                <span className="text-[10px] font-medium text-muted-foreground shrink-0">
                  Quick:
                </span>
                {SAMPLE_QUERIES.slice(0, 3).map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(sample.label)}
                    className="shrink-0 rounded-full border border-border/70 bg-background px-2.5 py-1 text-[11px] text-foreground/80 hover:border-primary/40 hover:text-primary transition-colors"
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            )}

            {/* Input Area */}
            <div className="border-t border-border/60 bg-card p-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask for doctors (e.g. Neurologist in Dhaka)..."
                  disabled={isLoading}
                  className="flex-1 rounded-xl border border-border bg-muted/40 px-3.5 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!inputQuery.trim() || isLoading}
                  className="size-9 shrink-0 rounded-xl bg-primary text-primary-foreground shadow-md transition-transform active:scale-95 disabled:opacity-40"
                  aria-label="Send message"
                >
                  <Send className="size-4" />
                </Button>
              </form>
              <div className="mt-1.5 flex items-center justify-between px-1 text-[10px] text-muted-foreground">
                <span>Press Enter to send</span>
                <span className="flex items-center gap-1">
                  <HelpCircle className="size-2.5" /> Healthcare AI
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Floating Trigger Bubble Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className={`group relative flex size-14 items-center justify-center rounded-full bg-gradient-to-tr from-primary via-primary/90 to-accent text-primary-foreground shadow-xl shadow-primary/25 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/40 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                isOpen ? "rotate-90" : ""
              }`}
              aria-label={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
            >
              {/* Outer Pulse Ring */}
              <span className="absolute -inset-1 rounded-full bg-primary/20 animate-ping opacity-75" />

              {isOpen ? (
                <X className="size-6 transition-transform" />
              ) : (
                <>
                  <MessageSquare className="size-6 transition-transform group-hover:scale-110" />
                  <Sparkles className="absolute top-2 right-2 size-3 text-amber-300 animate-pulse" />
                  <span className="absolute -top-0.5 -right-0.5 flex size-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex size-3 rounded-full bg-emerald-500 border-2 border-background" />
                  </span>
                </>
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent side="left" className="text-xs font-medium">
            {isOpen ? "Close AI Assistant" : "Ask PH AI Health Assistant ✨"}
          </TooltipContent>
        </Tooltip>
      </aside>
    </TooltipProvider>
  );
};

export default AIChatWidget;
