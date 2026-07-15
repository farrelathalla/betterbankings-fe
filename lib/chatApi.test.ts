import { describe, it, expect, vi, beforeEach } from "vitest";
import { sendMessage, getHistory, clearSession } from "./chatApi";

beforeEach(() => {
  global.fetch = vi.fn();
});

describe("chatApi", () => {
  it("sendMessage posts to /chat with credentials included", async () => {
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ reply: "hi", citations: [], sessionId: "s1" }),
    });
    const result = await sendMessage("s1", "What is CRE20?");
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/chat"),
      expect.objectContaining({ method: "POST", credentials: "include" }),
    );
    expect(result.reply).toBe("hi");
  });

  it("sendMessage sends the sessionId and message in the request body", async () => {
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ reply: "hi", citations: [], sessionId: "s1" }),
    });
    await sendMessage("s1", "hello");
    const [, options] = (fetch as any).mock.calls[0];
    expect(JSON.parse(options.body)).toEqual({ sessionId: "s1", message: "hello" });
  });

  it("sendMessage throws when the response is not ok", async () => {
    (fetch as any).mockResolvedValue({ ok: false });
    await expect(sendMessage(null, "hello")).rejects.toThrow();
  });

  it("getHistory fetches /chat/history with the sessionId as a query param", async () => {
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ messages: [] }),
    });
    await getHistory("s1");
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/chat/history?sessionId=s1"),
      expect.objectContaining({ credentials: "include" }),
    );
  });

  it("clearSession sends DELETE to /chat/session", async () => {
    (fetch as any).mockResolvedValue({ ok: true, json: async () => ({}) });
    await clearSession("s1");
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/chat/session"),
      expect.objectContaining({ method: "DELETE" }),
    );
  });
});
