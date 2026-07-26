"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MessageCircle, X, Send, FileText, Sparkles } from "lucide-react";
import { Streamdown } from "streamdown";
import {
  sendMessage,
  getHistory,
  ChatApiError,
  type ChatMessage,
  type Citation,
} from "@/lib/chatApi";

interface DisplayMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations: Citation[];
}

function parseCitations(raw: string): Citation[] {
  try {
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function citationHref(citation: Citation): string {
  // Matches the DOM id scheme already used on the chapter page
  // (see app/regmaps/[standard]/[chapter]/page.tsx's `anchorId`), so the
  // existing scroll-to-hash logic there resolves this link with no FE changes.
  const anchorId = `${citation.standardCode}${citation.chapterCode}.${citation.subsectionNumber}`;
  return `/regmaps/${citation.standardCode}/${citation.chapterCode}#${anchorId}`;
}

const markdownComponents = {
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mb-2 last:mb-0 leading-relaxed" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="mb-2 ml-4 list-disc space-y-1 last:mb-0" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="mb-2 ml-4 list-decimal space-y-1 last:mb-0" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => <li className="leading-relaxed" {...props} />,
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold text-[#14213D]" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className="text-[#355189] underline underline-offset-2 hover:text-[#14213D]" {...props} />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code className="rounded bg-[#F1F4F9] px-1 py-0.5 text-[0.85em] text-[#14213D]" {...props} />
  ),
};

function CitationChips({ citations }: { citations: Citation[] }) {
  if (citations.length === 0) return null;
  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      {citations.map((c, i) => (
        <Link
          key={i}
          href={citationHref(c)}
          className="group flex items-center gap-1.5 rounded-full border border-[#DCE3EE] bg-white px-2.5 py-1 text-xs font-medium text-[#355189] shadow-sm transition hover:border-[#14213D] hover:bg-[#14213D] hover:text-white"
        >
          <FileText size={12} className="opacity-70 group-hover:opacity-100" />
          <span>
            {c.standardCode} {c.chapterCode} &middot; Art. {c.subsectionNumber}
          </span>
        </Link>
      ))}
    </div>
  );
}

// A grounded answer takes a while: the request fans out to a gatekeeper call, a
// query rewrite, an embedding call, a vector search and finally answer
// generation. Measured end-to-end against production, allowed questions land
// between roughly 9 and 16 seconds. A bare "Thinking" reads as stalled well
// before then, so the label escalates to set expectations instead.
const THINKING_STAGES = [
  { after: 0, label: "Thinking" },
  { after: 4, label: "Searching the regulations" },
  { after: 9, label: "Thinking — this may take a moment" },
  { after: 18, label: "Still working — detailed questions take longer" },
] as const;

function ThinkingIndicator() {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Last stage whose threshold has passed. Reduce (rather than findLast) keeps
  // this working on the older JS targets Next may compile down to.
  // The explicit <string> matters: THINKING_STAGES is `as const`, so without it
  // the accumulator is inferred as the first stage's literal type and assigning
  // any later label fails to compile.
  const label = THINKING_STAGES.reduce<string>(
    (current, stage) => (elapsed >= stage.after ? stage.label : current),
    THINKING_STAGES[0].label,
  );

  return (
    <div
      className="flex items-center gap-2 text-sm text-[#64748B]"
      // Announce to screen readers, but politely — this text changes a few
      // times while a single answer is being generated.
      role="status"
      aria-live="polite"
    >
      <Sparkles size={14} className="shrink-0 text-[#355189]" />
      <span>{label}</span>
      <span className="flex gap-0.5">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#355189] [animation-delay:-0.3s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#355189] [animation-delay:-0.15s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#355189]" />
      </span>
    </div>
  );
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const sessionIdRef = useRef<string | null>(null);
  const hasLoadedHistory = useRef(false);
  const scrollBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    sessionIdRef.current = window.sessionStorage.getItem("chatSessionId");
  }, []);

  useEffect(() => {
    if (!isOpen || hasLoadedHistory.current) return;
    hasLoadedHistory.current = true;

    const sessionId = sessionIdRef.current;
    if (!sessionId) return;

    getHistory(sessionId)
      .then(({ messages: history }: { messages: ChatMessage[] }) => {
        setMessages(
          history.map((m) => ({
            id: m.id,
            role: m.role,
            content: m.content,
            citations: parseCitations(m.citations),
          })),
        );
      })
      .catch(() => {
        // History failed to load (e.g. session expired) — start fresh silently.
      });
  }, [isOpen]);

  // Auto-scroll to the newest message (or the thinking indicator) whenever either changes.
  useEffect(() => {
    if (!isOpen) return;
    scrollBottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isSending, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    const userMessage: DisplayMessage = {
      id: `local-${Date.now()}`,
      role: "user",
      content: trimmed,
      citations: [],
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSending(true);

    try {
      const result = await sendMessage(sessionIdRef.current, trimmed);
      sessionIdRef.current = result.sessionId;
      window.sessionStorage.setItem("chatSessionId", result.sessionId);

      setMessages((prev) => [
        ...prev,
        {
          id: `local-${Date.now()}-reply`,
          role: "assistant",
          content: result.reply,
          citations: result.citations,
        },
      ]);
    } catch (err) {
      // Rate limits carry an actionable message from the server (how long to
      // wait, when the daily quota resets). Show it verbatim rather than
      // flattening it into a generic failure the user can't act on.
      const content =
        err instanceof ChatApiError && err.isRateLimit
          ? err.message
          : "Something went wrong sending that message. Please try again.";

      setMessages((prev) => [
        ...prev,
        {
          id: `local-${Date.now()}-error`,
          role: "assistant",
          content,
          citations: [],
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        aria-label="Open chat"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#14213D] text-white shadow-lg transition hover:bg-[#1B2B4B] hover:scale-105"
      >
        <MessageCircle size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex h-[34rem] w-96 flex-col overflow-hidden rounded-2xl border border-[#E1E7EF] bg-white shadow-2xl">
      <div className="flex items-center justify-between bg-[#14213D] px-4 py-3.5 text-white">
        <div className="flex items-center gap-2">
          <Sparkles size={17} className="text-[#F48C25]" />
          <div>
            <p className="text-sm font-semibold leading-tight">RegMaps Assistant</p>
            <p className="text-[11px] leading-tight text-[#AEBBD6]">Basel &amp; regulatory Q&amp;A</p>
          </div>
        </div>
        <button
          type="button"
          aria-label="Close chat"
          onClick={() => setIsOpen(false)}
          className="rounded-md p-1 text-[#AEBBD6] transition hover:bg-white/10 hover:text-white"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto bg-[#F8FAFC] px-4 py-4">
        {messages.length === 0 && (
          <p className="text-sm text-[#64748B]">
            Ask a question about any Basel standard, chapter, or subsection on this page.
          </p>
        )}
        {messages.map((m) =>
          m.role === "user" ? (
            <div key={m.id} className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-[#14213D] px-3.5 py-2.5 text-sm text-white">
                <p className="whitespace-pre-wrap">{m.content}</p>
              </div>
            </div>
          ) : (
            <div key={m.id} className="max-w-[92%] text-sm text-[#1E293B]">
              <Streamdown mode="static" components={markdownComponents}>
                {m.content}
              </Streamdown>
              <CitationChips citations={m.citations} />
            </div>
          ),
        )}
        {isSending && <ThinkingIndicator />}
        <div ref={scrollBottomRef} />
      </div>

      <form role="form" onSubmit={handleSubmit} className="flex gap-2 border-t border-[#E1E7EF] bg-white p-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about RegMaps..."
          disabled={isSending}
          className="flex-1 rounded-full border border-[#DCE3EE] px-3.5 py-2 text-sm outline-none transition focus:border-[#14213D] disabled:opacity-60"
        />
        <button
          type="submit"
          aria-label="Send message"
          disabled={isSending || !input.trim()}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#14213D] text-white transition hover:bg-[#1B2B4B] disabled:opacity-40"
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  );
}
