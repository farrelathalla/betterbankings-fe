import { getApiUrl } from "./api";

export interface Citation {
  standardCode: string;
  chapterCode: string;
  subsectionId: string;
  subsectionNumber: string;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: "user" | "assistant";
  content: string;
  citations: string;
  blocked: boolean;
  createdAt: string;
}

export interface ChatReply {
  sessionId: string;
  reply: string;
  citations: Citation[];
  blocked: boolean;
  /** Present only when the backend enforces a daily cap (CHAT_DAILY_LIMIT). */
  quota?: { limit: number; used: number };
}

/**
 * Carries the backend's own explanation through to the UI.
 *
 * This matters most for 429s: the server returns an actionable message ("wait
 * 57 seconds", "quota resets at 00:00 UTC") that a generic "something went
 * wrong" would throw away, leaving the user with no idea what to do.
 */
export class ChatApiError extends Error {
  readonly status: number;
  /** "burst" | "daily" for rate limits; undefined for other failures. */
  readonly reason?: string;

  constructor(message: string, status: number, reason?: string) {
    super(message);
    this.name = "ChatApiError";
    this.status = status;
    this.reason = reason;
  }

  get isRateLimit(): boolean {
    return this.status === 429;
  }
}

export async function sendMessage(
  sessionId: string | null,
  message: string,
): Promise<ChatReply> {
  const res = await fetch(getApiUrl("/chat"), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, message }),
  });

  if (!res.ok) {
    // Error bodies are JSON `{error, reason?}`, but don't assume it: a proxy or
    // gateway failure can return HTML, and parsing must not mask the status.
    let serverMessage = "";
    let reason: string | undefined;
    try {
      const body = await res.json();
      if (typeof body?.error === "string") serverMessage = body.error;
      if (typeof body?.reason === "string") reason = body.reason;
    } catch {
      // Non-JSON body — fall back to a generic message below.
    }
    throw new ChatApiError(
      serverMessage || "Chat request failed",
      res.status,
      reason,
    );
  }

  return res.json();
}

export async function getHistory(
  sessionId: string,
): Promise<{ messages: ChatMessage[] }> {
  const res = await fetch(getApiUrl(`/chat/history?sessionId=${sessionId}`), {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to load chat history");
  return res.json();
}

export async function clearSession(sessionId: string): Promise<void> {
  await fetch(getApiUrl("/chat/session"), {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId }),
  });
}
