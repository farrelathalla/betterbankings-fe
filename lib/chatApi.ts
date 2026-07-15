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
  if (!res.ok) throw new Error("Chat request failed");
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
