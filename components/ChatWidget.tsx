"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  streamChat,
  type ChatTurn,
  type Citation,
} from "@/lib/chatApi";

interface Message {
  role: "user" | "assistant";
  text: string;
  citations?: Citation[];
}

const OPEN_KEY = "regmaps-chat-open";
const MAX_HISTORY_TURNS = 6;

export default function ChatWidget() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOpen(window.localStorage.getItem(OPEN_KEY) === "1");
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(OPEN_KEY, open ? "1" : "0");
    }
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, streaming]);

  useEffect(() => () => abortRef.current?.abort(), []);

  // Only available to authenticated users (the API requires a valid JWT anyway).
  if (!user) return null;

  const buildHistory = (): ChatTurn[] =>
    messages.slice(-MAX_HISTORY_TURNS).map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    }));

  const appendToLastAssistant = (chunk: string) =>
    setMessages((prev) => {
      const next = [...prev];
      const last = next[next.length - 1];
      if (last?.role === "assistant") last.text += chunk;
      return next;
    });

  const setLastAssistant = (text: string, citations?: Citation[]) =>
    setMessages((prev) => {
      const next = [...prev];
      const last = next[next.length - 1];
      if (last?.role === "assistant") {
        last.text = text;
        if (citations) last.citations = citations;
      }
      return next;
    });

  const send = async () => {
    const message = input.trim();
    if (!message || streaming) return;
    const history = buildHistory();
    setInput("");
    setMessages((prev) => [
      ...prev,
      { role: "user", text: message },
      { role: "assistant", text: "" },
    ]);
    setStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;
    await streamChat(
      message,
      history,
      {
        onToken: (t) => appendToLastAssistant(t),
        onRefusal: (t) => setLastAssistant(t),
        onError: (t) => setLastAssistant(t),
        onCitations: (items) =>
          setMessages((prev) => {
            const next = [...prev];
            const last = next[next.length - 1];
            if (last?.role === "assistant") last.citations = items;
            return next;
          }),
        onDone: () => setStreaming(false),
      },
      controller.signal
    );
    setStreaming(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {open && (
        <div className="mb-3 flex h-[32rem] w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
          {/* header */}
          <div className="flex items-center justify-between bg-blue-700 px-4 py-3 text-white">
            <div>
              <p className="text-sm font-semibold">RegMaps Assistant</p>
              <p className="text-[11px] text-blue-100">Ask about Basel / OJK regulations</p>
            </div>
            <button
              aria-label="Close chat"
              onClick={() => setOpen(false)}
              className="rounded p-1 hover:bg-blue-600"
            >
              <X size={18} />
            </button>
          </div>

          {/* messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-gray-50 p-3">
            {messages.length === 0 && (
              <p className="mt-6 text-center text-sm text-gray-400">
                Tanyakan apa saja tentang regulasi di RegMaps.
              </p>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
              >
                <div
                  className={
                    "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm " +
                    (m.role === "user"
                      ? "bg-blue-700 text-white"
                      : "border border-gray-200 bg-white text-gray-800")
                  }
                >
                  {m.text || (m.role === "assistant" && streaming ? "…" : "")}
                  {m.citations && m.citations.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1 border-t border-gray-100 pt-2">
                      {m.citations.map((c, j) => (
                        <a
                          key={j}
                          href={c.deep_link ?? "#"}
                          className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700 hover:bg-blue-100"
                          title={c.breadcrumb}
                        >
                          {c.number ? `§${c.number}` : c.source_type}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
            className="flex items-center gap-2 border-t border-gray-200 bg-white p-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question…"
              className="flex-1 rounded-full border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={streaming || !input.trim()}
              aria-label="Send"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-700 text-white disabled:opacity-50"
            >
              {streaming ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </form>
        </div>
      )}

      <button
        aria-label={open ? "Minimize chat" : "Open RegMaps assistant"}
        onClick={() => setOpen((v) => !v)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-700 text-white shadow-lg transition hover:bg-blue-800"
      >
        {open ? <X size={22} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
}
