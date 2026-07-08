import { describe, expect, it, vi } from "vitest";
import {
  dispatchEvent,
  parseSSEBuffer,
  streamChat,
  type SSEEvent,
  type StreamCallbacks,
} from "./chatApi";

describe("parseSSEBuffer", () => {
  it("extracts complete events and keeps the remainder", () => {
    const buf =
      'data: {"type":"token","text":"Hel"}\n\n' +
      'data: {"type":"token","text":"lo"}\n\n' +
      'data: {"type":"token","te';
    const { events, rest } = parseSSEBuffer(buf);
    expect(events).toHaveLength(2);
    expect(events[0]).toEqual({ type: "token", text: "Hel" });
    expect(rest).toBe('data: {"type":"token","te');
  });

  it("ignores malformed payloads", () => {
    const { events } = parseSSEBuffer("data: not json\n\n");
    expect(events).toHaveLength(0);
  });
});

describe("dispatchEvent", () => {
  it("routes each event type to the right callback", () => {
    const cbs: StreamCallbacks = {
      onToken: vi.fn(),
      onCitations: vi.fn(),
      onRefusal: vi.fn(),
      onError: vi.fn(),
      onDone: vi.fn(),
    };
    const events: SSEEvent[] = [
      { type: "token", text: "x" },
      { type: "refusal", text: "no" },
      { type: "error", text: "boom" },
      { type: "citations", items: [] },
      { type: "done" },
    ];
    for (const e of events) dispatchEvent(e, cbs);
    expect(cbs.onToken).toHaveBeenCalledWith("x");
    expect(cbs.onRefusal).toHaveBeenCalledWith("no");
    expect(cbs.onError).toHaveBeenCalledWith("boom");
    expect(cbs.onCitations).toHaveBeenCalledWith([]);
    expect(cbs.onDone).toHaveBeenCalled();
  });
});

function streamFromStrings(chunks: string[]): ReadableStream<Uint8Array> {
  const enc = new TextEncoder();
  let i = 0;
  return new ReadableStream({
    pull(controller) {
      if (i < chunks.length) controller.enqueue(enc.encode(chunks[i++]));
      else controller.close();
    },
  });
}

describe("streamChat", () => {
  it("streams tokens then citations and includes credentials", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      body: streamFromStrings([
        'data: {"type":"token","text":"Bank "}\n\n',
        'data: {"type":"token","text":"wajib"}\n\ndata: {"type":"citations","items":[{"deep_link":"/regmaps#s1","source_type":"subsection","source_id":"s1","number":"40.1","breadcrumb":"BC"}]}\n\n',
        'data: {"type":"done"}\n\n',
      ]),
    });
    vi.stubGlobal("fetch", fetchMock);

    const tokens: string[] = [];
    let citations: unknown[] = [];
    let done = false;
    await streamChat("apa itu LCR?", undefined, {
      onToken: (t) => tokens.push(t),
      onCitations: (c) => (citations = c),
      onDone: () => (done = true),
    });

    expect(tokens.join("")).toBe("Bank wajib");
    expect(citations).toHaveLength(1);
    expect(done).toBe(true);
    expect(fetchMock.mock.calls[0][1]).toMatchObject({ credentials: "include", method: "POST" });
  });

  it("maps 429 to a slow-down error", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 429 }));
    const errors: string[] = [];
    await streamChat("q", undefined, { onError: (e) => errors.push(e) });
    expect(errors[0]).toMatch(/slow down/i);
  });
});
