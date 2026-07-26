import { describe, it, expect, vi, beforeEach } from "vitest";
import { sendMessage, getHistory, clearSession, ChatApiError } from "./chatApi";

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

  it("sendMessage surfaces a 429's server message, status and reason", async () => {
    (fetch as any).mockResolvedValue({
      ok: false,
      status: 429,
      json: async () => ({
        error: "You're sending messages too quickly. Please wait 57 seconds and try again.",
        reason: "burst",
      }),
    });

    await expect(sendMessage(null, "spam")).rejects.toMatchObject({
      message: expect.stringContaining("Please wait 57 seconds"),
      status: 429,
      reason: "burst",
    });

    const err = await sendMessage(null, "spam").catch((e) => e);
    expect(err).toBeInstanceOf(ChatApiError);
    expect(err.isRateLimit).toBe(true);
  });

  it("sendMessage falls back to a generic message when the error body isn't JSON", async () => {
    (fetch as any).mockResolvedValue({
      ok: false,
      status: 502,
      json: async () => {
        throw new Error("Unexpected token < in JSON");
      },
    });

    const err = await sendMessage(null, "hi").catch((e) => e);
    expect(err).toBeInstanceOf(ChatApiError);
    expect(err.message).toBe("Chat request failed");
    expect(err.status).toBe(502);
    expect(err.isRateLimit).toBe(false);
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
