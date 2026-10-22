import { describe, it, expect } from "vitest";
import {
  resolveAnchorId,
  samePath,
  findAnchorElement,
  internalRegmapsPath,
  ANCHOR_ATTR,
} from "./regmapsAnchor";

describe("resolveAnchorId", () => {
  const cogvp = ["CoGvP.VI.30.1-2", "CoGvP.VI.31", "CoGvP.VI.38"];

  it("matches the exact id", () => {
    expect(resolveAnchorId("CoGvP.VI.31", cogvp, "CoGvP.VI")).toBe("CoGvP.VI.31");
  });

  it("ignores case: links upper-case the standard code", () => {
    expect(resolveAnchorId("COGVP.VI.30.1-2", cogvp, "CoGvP.VI")).toBe("CoGvP.VI.30.1-2");
  });

  it("finds an article split into ranged subsections", () => {
    const aml = ["AML.IV.50", "AML.IV.51.1-5", "AML.IV.52"];
    expect(resolveAnchorId("AML.IV.51", aml, "AML.IV")).toBe("AML.IV.51.1-5");
  });

  it("falls back to the enclosing subsection after renumbering", () => {
    const lcr = ["LCR.III.13.(1)", "LCR.III.13.(2)", "LCR.III.16", "LCR.III.17.(1)"];
    expect(resolveAnchorId("LCR.III.16.a-b", lcr, "LCR.III")).toBe("LCR.III.16");
    expect(resolveAnchorId("LCR.III.13.(1).a-d", lcr, "LCR.III")).toBe("LCR.III.13.(1)");
  });

  it("does not strip into the chapter code, which has dots of its own", () => {
    const ilau = ["ILAU.L_I.EI.1-4", "ILAU.L_I.EII.0"];
    expect(resolveAnchorId("ILAU.L_I.EI.9", ilau, "ILAU.L_I.EI")).toBeNull();
  });

  it("reads the article number out of a free-text tail", () => {
    const aml = ["AML.IV.49.1-5", "AML.IV.50"];
    expect(resolveAnchorId("AML.IV.Article 50", aml, "AML.IV")).toBe("AML.IV.50");
  });

  it("returns null for an empty or unknown target", () => {
    expect(resolveAnchorId("", cogvp, "CoGvP.VI")).toBeNull();
    expect(resolveAnchorId("KPMo.07.55", cogvp, "CoGvP.VI")).toBeNull();
  });
});

describe("samePath", () => {
  it("compares paths case-insensitively and decoded", () => {
    expect(samePath("/regmaps/CoGvP/.VI", "/regmaps/cogvp/.VI")).toBe(true);
    expect(samePath("/regmaps/aml/.L%20I", "/regmaps/aml/.L I/")).toBe(true);
    expect(samePath("/regmaps/aml/.IV", "/regmaps/aml/.V")).toBe(false);
  });
});

describe("findAnchorElement", () => {
  it("resolves a hash against the subsection anchors on the page", () => {
    document.body.innerHTML = `
      <div id="CoGvP.VI.30.1-2" ${ANCHOR_ATTR}="CoGvP.VI"></div>
      <div id="CoGvP.VI.31" ${ANCHOR_ATTR}="CoGvP.VI"></div>`;
    expect(findAnchorElement(document, "COGVP.VI.31")?.id).toBe("CoGvP.VI.31");
    expect(findAnchorElement(document, "COGVP.VI.30")?.id).toBe("CoGvP.VI.30.1-2");
    expect(findAnchorElement(document, "LCR.III.16")).toBeNull();
  });

  it("decodes a percent-encoded hash", () => {
    document.body.innerHTML = `<div id="AML.IV.50" ${ANCHOR_ATTR}="AML.IV"></div>`;
    expect(findAnchorElement(document, "AML.IV.Article%2050")?.id).toBe("AML.IV.50");
  });
});

describe("internalRegmapsPath", () => {
  it("turns an absolute link to this site's RegMaps into a path", () => {
    expect(
      internalRegmapsPath("https://www.betterbankings.com/regmaps/lcr/.III#LCR.III.13.(1).a-d"),
    ).toBe("/regmaps/lcr/.III#LCR.III.13.(1).a-d");
    expect(internalRegmapsPath("https://betterbankings.com/regmaps/kpmm")).toBe("/regmaps/kpmm");
  });

  it("leaves other links alone", () => {
    expect(internalRegmapsPath("https://ojk.go.id/regmaps/x")).toBeNull();
    expect(internalRegmapsPath("https://www.betterbankings.com/b-foresight")).toBeNull();
    expect(internalRegmapsPath("https://www.betterbankings.com/regmapsfoo")).toBeNull();
  });
});
