import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import RegInventoryTable, { explainRegulationQuestion } from "./RegInventoryTable";
import { ASK_CHAT_EVENT } from "@/lib/chatBridge";
import { regInventory } from "@/lib/regInventory";

afterEach(() => {
  cleanup();
});

const entry = regInventory.find((e) => e.id === "9/POJK.03/2016")!;

describe("explainRegulationQuestion", () => {
  it("names the regulation once and includes its title", () => {
    const q = explainRegulationQuestion(entry);
    expect(q).toMatch(/^Jelaskan apa itu 9\/POJK\.03\/2016 tentang Prinsip Kehati-hatian/);
    expect(q).not.toMatch(/POJK 9\/POJK/);
  });

  it("prefixes the type when the ID doesn't carry it", () => {
    const q = explainRegulationQuestion({ ...entry, id: "9 Tahun 2023", type: "POJK" });
    expect(q).toMatch(/^Jelaskan apa itu POJK 9 Tahun 2023 tentang /);
  });
});

describe("RegInventoryTable", () => {
  it("offers Ask AI only on rows that are on RegMaps", () => {
    // jsdom has no IntersectionObserver; the table uses it to load more rows.
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        observe() {}
        disconnect() {}
      },
    );
    render(<RegInventoryTable />);

    const buttons = screen.getAllByRole("button", { name: /ask the regmaps assistant/i });
    const visibleRegmapsRows = regInventory
      .slice(0, 40)
      .filter((e) => e.linkType === "regmaps").length;
    expect(buttons).toHaveLength(visibleRegmapsRows);

    const listener = vi.fn();
    window.addEventListener(ASK_CHAT_EVENT, listener);
    fireEvent.click(screen.getByRole("button", { name: /explain 9\/POJK\.03\/2016/ }));
    window.removeEventListener(ASK_CHAT_EVENT, listener);

    expect(listener).toHaveBeenCalledTimes(1);
    expect((listener.mock.calls[0][0] as CustomEvent).detail.question).toBe(
      explainRegulationQuestion(entry),
    );
    vi.unstubAllGlobals();
  });
});
