import { describe, it, expect, beforeEach } from "vitest";
import {
  SCROLL_KEY_PREFIX,
  scrollStorageKey,
  saveScrollPosition,
  consumeScrollPosition,
  isBackForwardNavigation,
  isScrollTargetReachable,
  type StorageLike,
} from "./scrollRestore";

// Minimal in-memory implementation of the Web Storage API for testing.
class MemoryStorage implements StorageLike {
  private map = new Map<string, string>();
  getItem(key: string): string | null {
    return this.map.has(key) ? this.map.get(key)! : null;
  }
  setItem(key: string, value: string): void {
    this.map.set(key, value);
  }
  removeItem(key: string): void {
    this.map.delete(key);
  }
  get size(): number {
    return this.map.size;
  }
}

describe("scrollStorageKey", () => {
  it("namespaces the pathname with the shared prefix", () => {
    expect(scrollStorageKey("/regmaps/corme/1")).toBe(
      `${SCROLL_KEY_PREFIX}/regmaps/corme/1`,
    );
  });
});

describe("saveScrollPosition / consumeScrollPosition", () => {
  let storage: MemoryStorage;
  const path = "/regmaps/corme/1";

  beforeEach(() => {
    storage = new MemoryStorage();
  });

  it("round-trips a saved scroll position for a path", () => {
    saveScrollPosition(storage, path, 1234);
    expect(consumeScrollPosition(storage, path)).toBe(1234);
  });

  it("rounds fractional scroll values", () => {
    saveScrollPosition(storage, path, 1234.7);
    expect(consumeScrollPosition(storage, path)).toBe(1235);
  });

  it("clamps negative or non-finite values to 0", () => {
    saveScrollPosition(storage, path, -50);
    expect(consumeScrollPosition(storage, path)).toBe(0);

    saveScrollPosition(storage, path, Number.NaN);
    expect(consumeScrollPosition(storage, path)).toBe(0);
  });

  it("returns null when nothing is stored for the path", () => {
    expect(consumeScrollPosition(storage, path)).toBeNull();
  });

  it("is consume-once: a second read returns null", () => {
    saveScrollPosition(storage, path, 800);
    expect(consumeScrollPosition(storage, path)).toBe(800);
    expect(consumeScrollPosition(storage, path)).toBeNull();
    expect(storage.size).toBe(0);
  });

  it("keeps positions for different paths independent", () => {
    saveScrollPosition(storage, "/regmaps/corme/1", 100);
    saveScrollPosition(storage, "/regmaps/cogve/1", 900);

    // A back-nav to one page must not consume the other page's value.
    expect(consumeScrollPosition(storage, "/regmaps/cogve/1")).toBe(900);
    expect(consumeScrollPosition(storage, "/regmaps/corme/1")).toBe(100);
  });

  it("treats a stored garbage value as nothing to restore", () => {
    storage.setItem(scrollStorageKey(path), "not-a-number");
    expect(consumeScrollPosition(storage, path)).toBeNull();
  });
});

describe("isBackForwardNavigation", () => {
  it("detects back_forward from Navigation Timing L2 entries", () => {
    expect(isBackForwardNavigation([{ type: "back_forward" }])).toBe(true);
  });

  it("returns false for a fresh navigation or reload", () => {
    expect(isBackForwardNavigation([{ type: "navigate" }])).toBe(false);
    expect(isBackForwardNavigation([{ type: "reload" }])).toBe(false);
  });

  it("falls back to legacy performance.navigation.type (2 = back/forward)", () => {
    expect(isBackForwardNavigation(undefined, 2)).toBe(true);
    expect(isBackForwardNavigation([], 2)).toBe(true);
    expect(isBackForwardNavigation(undefined, 0)).toBe(false);
  });

  it("returns false when no information is available", () => {
    expect(isBackForwardNavigation(undefined, undefined)).toBe(false);
    expect(isBackForwardNavigation([])).toBe(false);
  });
});

describe("isScrollTargetReachable", () => {
  const viewport = 800;

  it("is true once the page is tall enough for the target", () => {
    // page 3000 tall, viewport 800 -> max scroll 2200, target 2000 reachable
    expect(isScrollTargetReachable(3000, viewport, 2000)).toBe(true);
  });

  it("is false while async content has not grown the page yet", () => {
    // page only 1000 tall -> max scroll 200, target 2000 not reachable
    expect(isScrollTargetReachable(1000, viewport, 2000)).toBe(false);
  });

  it("allows a small tolerance at the very bottom of the page", () => {
    // max scroll = 2000 - 800 = 1200; target 1201 within default tolerance of 2
    expect(isScrollTargetReachable(2000, viewport, 1201)).toBe(true);
  });

  it("treats a target of 0 (top of page) as always reachable", () => {
    expect(isScrollTargetReachable(0, viewport, 0)).toBe(true);
  });
});
