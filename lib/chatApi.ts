// Streaming client for the RegMaps RAG chatbot (SSE over fetch).
//
// In production Nginx routes `/api/rag/` to the RAG service, so the default base is
// `${API_URL}/rag`. For local dev (RAG on :8000, BE on :8080) set
// NEXT_PUBLIC_RAG_URL=http://localhost:8000/api/rag.

import { API_URL } from "./api";

const RAG_URL =
  process.env.NEXT_PUBLIC_RAG_URL || `${API_URL}/rag`;

export interface Citation {
  source_type: string;
  source_id: string;
  number: string | null;
  breadcrumb: string;
  deep_link: string | null;
}

export interface ChatTurn {
  role: "user" | "model";
  parts: { text: string }[];
}

export interface StreamCallbacks {
  onToken?: (text: string) => void;
  onCitations?: (items: Citation[]) => void;
  onRefusal?: (text: string) => void;
  onError?: (text: string) => void;
  onDone?: () => void;
}

export type SSEEvent =
  | { type: "token"; text: string }
  | { type: "refusal"; text: string }
  | { type: "error"; text: string }
  | { type: "citations"; items: Citation[] }
  | { type: "done" };

// Pure: extract complete SSE events from a buffer, returning leftover text.
export function parseSSEBuffer(buffer: string): { events: SSEEvent[]; rest: string } {
  const events: SSEEvent[] = [];
  const parts = buffer.split("\n\n");
  const rest = parts.pop() ?? "";
  for (const part of parts) {
    const line = part.split("\n").find((l) => l.startsWith("data:"));
    if (!line) continue;
    const payload = line.slice("data:".length).trim();
    if (!payload) continue;
    try {
      events.push(JSON.parse(payload) as SSEEvent);
    } catch {
      // ignore malformed event
    }
  }
  return { events, rest };
}

export function dispatchEvent(event: SSEEvent, cbs: StreamCallbacks): void {
  switch (event.type) {
    case "token":
      cbs.onToken?.(event.text);
      break;
    case "refusal":
      cbs.onRefusal?.(event.text);
      break;
    case "error":
      cbs.onError?.(event.text);
      break;
    case "citations":
      cbs.onCitations?.(event.items);
      break;
    case "done":
      cbs.onDone?.();
      break;
  }
}

export async function streamChat(
  message: string,
  history: ChatTurn[] | undefined,
  cbs: StreamCallbacks,
  signal?: AbortSignal
): Promise<void> {
  const resp = await fetch(`${RAG_URL}/chat`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
    signal,
  });

  if (!resp.ok) {
    if (resp.status === 401) cbs.onError?.("Please sign in to use the assistant.");
    else if (resp.status === 429) cbs.onError?.("Too many requests — please slow down.");
    else cbs.onError?.("The assistant is unavailable right now.");
    cbs.onDone?.();
    return;
  }
  if (!resp.body) {
    cbs.onError?.("Streaming not supported.");
    cbs.onDone?.();
    return;
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const { events, rest } = parseSSEBuffer(buffer);
    buffer = rest;
    for (const event of events) dispatchEvent(event, cbs);
  }
}
