"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

interface Mark {
  type: string;
  attrs?: Record<string, unknown>;
}

interface ContentNode {
  type: string;
  text?: string;
  content?: ContentNode[];
  marks?: Mark[];
  attrs?: Record<string, unknown>;
}

interface RichContentRendererProps {
  content: string;
}

// Component to render parsed TipTap JSON content with interactive tooltips and links
export default function RichContentRenderer({
  content,
}: RichContentRendererProps) {
  // Parse content - handle both JSON and plain text
  let nodes: ContentNode[] = [];

  try {
    const parsed = typeof content === "string" ? JSON.parse(content) : content;
    if (parsed && parsed.type === "doc" && parsed.content) {
      nodes = parsed.content;
    }
  } catch {
    // If not valid JSON, treat as plain text
    if (typeof content === "string" && content.trim()) {
      return <p className="text-gray-700 leading-relaxed">{content}</p>;
    }
    return null;
  }

  if (nodes.length === 0) {
    return <p className="text-gray-700 leading-relaxed">{content}</p>;
  }

  return (
    <div className="rich-content-container prose prose-sm max-w-none text-[#1a1a1a]">
      <RenderNodes nodes={nodes} />
    </div>
  );
}

function RenderNodes({ nodes }: { nodes: ContentNode[] }) {
  return (
    <>
      {nodes.map((node, i) => (
        <RenderNode key={i} node={node} />
      ))}
    </>
  );
}

function RenderNode({ node }: { node: ContentNode }) {
  switch (node.type) {
    case "paragraph": {
      const align = node.attrs?.textAlign as string | undefined;
      const lineHeight = node.attrs?.lineHeight as string | undefined;
      const hasContent = node.content && node.content.length > 0;
      return (
        <p
          style={{
            textAlign: align as any,
            lineHeight:
              lineHeight && lineHeight !== "normal" ? lineHeight : undefined,
          }}
        >
          {hasContent ? <RenderNodes nodes={node.content!} /> : <br />}
        </p>
      );
    }

    case "heading": {
      const level = (node.attrs?.level as number) || 1;
      const children = node.content ? (
        <RenderNodes nodes={node.content} />
      ) : null;
      const lineHeight = node.attrs?.lineHeight as string | undefined;
      const style = {
        lineHeight:
          lineHeight && lineHeight !== "normal" ? lineHeight : undefined,
      };
      switch (level) {
        case 1:
          return <h1 style={style}>{children}</h1>;
        case 2:
          return <h2 style={style}>{children}</h2>;
        case 3:
          return <h3 style={style}>{children}</h3>;
        case 4:
          return <h4 style={style}>{children}</h4>;
        case 5:
          return <h5 style={style}>{children}</h5>;
        case 6:
          return <h6 style={style}>{children}</h6>;
        default:
          return <h3 style={style}>{children}</h3>;
      }
    }

    case "bulletList":
      return <ul>{node.content && <RenderNodes nodes={node.content} />}</ul>;

    case "orderedList":
      return <ol>{node.content && <RenderNodes nodes={node.content} />}</ol>;

    case "listItem":
      return <li>{node.content && <RenderNodes nodes={node.content} />}</li>;

    case "blockquote":
      return (
        <blockquote className="border-l-4 border-[#355189] pl-4 italic text-gray-600">
          {node.content && <RenderNodes nodes={node.content} />}
        </blockquote>
      );

    case "table": {
      const isOverflow = node.attrs?.overflow === true;
      return (
        <div
          className="tableWrapper"
          style={
            isOverflow
              ? { overflowX: "auto", width: "100%", maxWidth: "100%" }
              : undefined
          }
        >
          <table
            style={
              isOverflow
                ? { tableLayout: "auto", width: "auto" }
                : undefined
            }
          >
            {node.content && (
              <tbody>
                <RenderNodes nodes={node.content} />
              </tbody>
            )}
          </table>
        </div>
      );
    }

    case "tableRow":
      return (
        <tr className="border-b border-gray-200">
          {node.content && <RenderNodes nodes={node.content} />}
        </tr>
      );

    case "tableHeader": {
      const colwidthH = node.attrs?.colwidth as number[] | undefined;
      const widthH = colwidthH?.[0];
      return (
        <th
          className="border border-gray-300 px-3 py-2 bg-gray-100 font-semibold text-left text-[#14213D]"
          colSpan={(node.attrs?.colspan as number) || 1}
          rowSpan={(node.attrs?.rowspan as number) || 1}
          style={widthH ? { width: widthH, minWidth: widthH } : undefined}
        >
          {node.content && <RenderNodes nodes={node.content} />}
        </th>
      );
    }

    case "tableCell": {
      const colwidthC = node.attrs?.colwidth as number[] | undefined;
      const widthC = colwidthC?.[0];
      return (
        <td
          className="border border-gray-300 px-3 py-2 text-gray-700"
          colSpan={(node.attrs?.colspan as number) || 1}
          rowSpan={(node.attrs?.rowspan as number) || 1}
          style={widthC ? { width: widthC, minWidth: widthC } : undefined}
        >
          {node.content && <RenderNodes nodes={node.content} />}
        </td>
      );
    }

    case "image": {
      const rawSrc = (node.attrs?.src as string) || "";
      // Only allow http/https image URLs to prevent javascript: src XSS
      if (!/^https?:\/\//i.test(rawSrc)) return null;
      return (
        <img
          src={rawSrc}
          alt={(node.attrs?.alt as string) || ""}
          title={(node.attrs?.title as string) || undefined}
          className="max-w-full h-auto rounded-lg my-3"
        />
      );
    }

    case "hardBreak":
      return <br />;

    case "horizontalRule":
      return <hr className="border-gray-300 my-4" />;

    case "text":
      return <RenderText text={node.text || ""} marks={node.marks} />;

    default:
      // Fallback: try to render content if it exists
      if (node.content) {
        return <RenderNodes nodes={node.content} />;
      }
      return null;
  }
}

function RenderText({ text, marks }: { text: string; marks?: Mark[] }) {
  let element: React.ReactNode = text;

  if (marks && marks.length > 0) {
    // Apply marks in order
    marks.forEach((mark) => {
      switch (mark.type) {
        case "bold":
          element = <strong className="font-bold">{element}</strong>;
          break;

        case "italic":
          element = <em className="italic">{element}</em>;
          break;

        case "underline":
          element = <u className="underline">{element}</u>;
          break;

        case "strike":
          element = <s className="line-through">{element}</s>;
          break;

        case "link": {
          const rawHref = (mark.attrs?.href as string) || "";
          // Block javascript: and data: URIs to prevent XSS
          const safeHref = /^(https?:\/\/|mailto:|\/|#)/i.test(rawHref)
            ? rawHref
            : "#";
          element = (
            <a
              href={safeHref}
              target={
                safeHref.startsWith("/") || safeHref.startsWith("#")
                  ? undefined
                  : "_blank"
              }
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {element}
            </a>
          );
          break;
        }

        case "tooltip":
          element = (
            <TooltipSpan definition={mark.attrs?.definition as string}>
              {element}
            </TooltipSpan>
          );
          break;

        case "reference": {
          const stdCode = (
            (mark.attrs?.standardCode as string) || ""
          ).toLowerCase();
          const chapCode = mark.attrs?.chapterCode as string;
          const subsNum = mark.attrs?.subsectionNumber as string;

          // Build URL with optional subsection anchor
          let refUrl = `/regmaps/${stdCode}`;
          if (chapCode) {
            refUrl += `/${chapCode}`;
            if (subsNum) {
              refUrl += `#${stdCode.toUpperCase()}${chapCode}.${subsNum}`;
            }
          }

          // Anchor ID that matches the id="..." set on each subsection div in page.tsx
          const anchorId = subsNum
            ? `${stdCode.toUpperCase()}${chapCode}.${subsNum}`
            : null;

          element = (
            <Link
              href={refUrl}
              className="text-[#F48C25] font-bold underline hover:text-[#E07A0B]"
              onClick={(e) => {
                if (!anchorId) return;
                // Same-page check: pathname matches but hash may differ
                const targetPathname = refUrl.split("#")[0];
                if (
                  typeof window !== "undefined" &&
                  window.location.pathname === targetPathname
                ) {
                  // Prevent Next.js from re-navigating (no-op or hash update).
                  // Scroll to the anchor ourselves so repeated clicks always work.
                  e.preventDefault();
                  const el =
                    document.getElementById(anchorId) ??
                    (document.querySelector(
                      `[id^="${anchorId}."]`,
                    ) as HTMLElement | null);
                  if (el)
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                }
                // Different page: let Link navigate normally; page.tsx hash effect handles scroll
              }}
            >
              {element}
            </Link>
          );
          break;
        }

        case "textStyle": {
          const styles: React.CSSProperties = {};
          if (mark.attrs?.color) styles.color = mark.attrs.color as string;
          if (mark.attrs?.fontSize)
            styles.fontSize = mark.attrs.fontSize as string;
          if (Object.keys(styles).length > 0) {
            element = <span style={styles}>{element}</span>;
          }
          break;
        }
      }
    });
  }

  return <>{element}</>;
}

// Interactive tooltip component with hover popup
function TooltipSpan({
  definition,
  children,
}: {
  definition: string;
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const spanRef = useRef<HTMLSpanElement>(null);

  const showTooltip = () => {
    if (spanRef.current) {
      const rect = spanRef.current.getBoundingClientRect();
      setPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 8,
      });
    }
    setVisible(true);
  };

  return (
    <>
      <span
        ref={spanRef}
        onMouseEnter={showTooltip}
        onMouseLeave={() => setVisible(false)}
        className="border-b border-dashed border-[#355189] cursor-help relative"
      >
        {children}
      </span>

      {visible && (
        <div
          className="fixed z-50 transform -translate-x-1/2 -translate-y-full"
          style={{ left: position.x, top: position.y }}
        >
          <div className="bg-[#14213D] text-white text-sm px-3 py-2 rounded-lg shadow-lg max-w-xs">
            {definition}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-[#14213D]" />
          </div>
        </div>
      )}
    </>
  );
}
