import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import RichContentRenderer from "./RichContentRenderer";

afterEach(() => {
  cleanup();
});

const doc = (content: unknown[]) => JSON.stringify({ type: "doc", content });

describe("RichContentRenderer", () => {
  it("renders subscript and superscript marks", () => {
    const { container } = render(
      <RichContentRenderer
        content={doc([
          {
            type: "paragraph",
            content: [
              { type: "text", text: "AddOn" },
              { type: "text", text: "agregat", marks: [{ type: "superscript" }] },
              { type: "text", text: " dan D" },
              { type: "text", text: "jk", marks: [{ type: "subscript" }] },
            ],
          },
        ])}
      />,
    );
    expect(container.querySelector("sup")).toHaveTextContent("agregat");
    expect(container.querySelector("sub")).toHaveTextContent("jk");
  });

  it("shows an image at its stored width, and without one when none is set", () => {
    const { container } = render(
      <RichContentRenderer
        content={doc([
          { type: "image", attrs: { src: "https://api.example.com/f.png", width: 319 } },
          { type: "image", attrs: { src: "https://api.example.com/g.png", width: null } },
        ])}
      />,
    );
    const [withWidth, without] = Array.from(container.querySelectorAll("img"));
    expect(withWidth).toHaveAttribute("width", "319");
    expect(without).not.toHaveAttribute("width");
  });
});
