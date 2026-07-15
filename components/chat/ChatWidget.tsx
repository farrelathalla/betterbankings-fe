"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MessageCircle, X, Send } from "lucide-react";
import { sendMessage, getHistory, type ChatMessage, type Citation } from "@/lib/chatApi";

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

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const sessionIdRef = useRef<string | null>(null);
  const hasLoadedHistory = useRef(false);

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
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `local-${Date.now()}-error`,
          role: "assistant",
          content: "Something went wrong sending that message. Please try again.",
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
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition hover:bg-blue-700"
      >
        <MessageCircle size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex h-[32rem] w-96 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl">
      <div className="flex items-center justify-between border-b border-gray-200 bg-blue-600 px-4 py-3 text-white">
        <span className="font-semibold">RegMaps Assistant</span>
        <button type="button" aria-label="Close chat" onClick={() => setIsOpen(false)}>
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
        {messages.length === 0 && (
          <p className="text-sm text-gray-500">
            Ask a question about any Basel standard, chapter, or subsection on this page.
          </p>
        )}
        {messages.map((m) => (
          <div key={m.id} className={m.role === "user" ? "text-right" : "text-left"}>
            <div
              className={
                m.role === "user"
                  ? "inline-block rounded-lg bg-blue-600 px-3 py-2 text-sm text-white"
                  : "inline-block rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-900"
              }
            >
              <p className="whitespace-pre-wrap">{m.content}</p>
              {m.citations.length > 0 && (
                <div className="mt-2 space-y-1 border-t border-gray-300 pt-2 text-xs">
                  {m.citations.map((c, i) => (
                    <Link
                      key={i}
                      href={citationHref(c)}
                      className="block text-blue-700 underline hover:text-blue-900"
                    >
                      {c.standardCode} {c.chapterCode} &sect;{c.subsectionNumber}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <form role="form" onSubmit={handleSubmit} className="flex gap-2 border-t border-gray-200 p-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about RegMaps..."
          disabled={isSending}
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          aria-label="Send message"
          disabled={isSending || !input.trim()}
          className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-600 text-white disabled:opacity-50"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
