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

  return <RenderNodes nodes={nodes} />;
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
    case "paragraph":
      return (
        <p className="text-gray-700 leading-relaxed mb-3">
          {node.content && <RenderNodes nodes={node.content} />}
        </p>
      );

    case "heading": {
      const level = (node.attrs?.level as number) || 1;
      const children = node.content ? (
        <RenderNodes nodes={node.content} />
      ) : null;
      switch (level) {
        case 1:
          return (
            <h1 className="text-2xl font-bold text-[#14213D] mb-4">
              {children}
            </h1>
          );
        case 2:
          return (
            <h2 className="text-xl font-bold text-[#14213D] mb-3">
              {children}
            </h2>
          );
        case 3:
          return (
            <h3 className="text-lg font-semibold text-[#14213D] mb-2">
              {children}
            </h3>
          );
        case 4:
          return (
            <h4 className="text-base font-semibold text-[#14213D] mb-2">
              {children}
            </h4>
          );
        case 5:
          return (
            <h5 className="text-sm font-semibold text-[#14213D] mb-1">
              {children}
            </h5>
          );
        case 6:
          return (
            <h6 className="text-xs font-semibold text-[#14213D] mb-1">
              {children}
            </h6>
          );
        default:
          return (
            <h3 className="text-lg font-semibold text-[#14213D] mb-2">
              {children}
            </h3>
          );
      }
    }

    case "bulletList":
      return (
        <ul className="list-disc list-inside text-gray-700 mb-3 space-y-1">
          {node.content && <RenderNodes nodes={node.content} />}
        </ul>
      );

    case "orderedList":
      return (
        <ol className="list-decimal list-inside text-gray-700 mb-3 space-y-1">
          {node.content && <RenderNodes nodes={node.content} />}
        </ol>
      );

    case "listItem":
      return <li>{node.content && <RenderNodes nodes={node.content} />}</li>;

    case "blockquote":
      return (
        <blockquote className="border-l-4 border-[#355189] pl-4 italic text-gray-600 mb-3">
          {node.content && <RenderNodes nodes={node.content} />}
        </blockquote>
      );

    case "table":
      return (
        <div className="overflow-x-auto mb-4">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            {node.content && (
              <tbody>
                <RenderNodes nodes={node.content} />
              </tbody>
            )}
          </table>
        </div>
      );

    case "tableRow":
      return (
        <tr className="border-b border-gray-200">
          {node.content && <RenderNodes nodes={node.content} />}
        </tr>
      );

    case "tableHeader":
      return (
        <th
          className="border border-gray-300 px-3 py-2 bg-gray-100 font-semibold text-left text-[#14213D]"
          colSpan={(node.attrs?.colspan as number) || 1}
          rowSpan={(node.attrs?.rowspan as number) || 1}
        >
          {node.content && <RenderNodes nodes={node.content} />}
        </th>
      );

    case "tableCell":
      return (
        <td
          className="border border-gray-300 px-3 py-2 text-gray-700"
          colSpan={(node.attrs?.colspan as number) || 1}
          rowSpan={(node.attrs?.rowspan as number) || 1}
        >
          {node.content && <RenderNodes nodes={node.content} />}
        </td>
      );

    case "image":
      return (
        <img
          src={node.attrs?.src as string}
          alt={(node.attrs?.alt as string) || ""}
          title={(node.attrs?.title as string) || undefined}
          className="max-w-full h-auto rounded-lg my-3"
        />
      );

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

        case "link":
          element = (
            <a
              href={mark.attrs?.href as string}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {element}
            </a>
          );
          break;

        case "tooltip":
          element = (
            <TooltipSpan definition={mark.attrs?.definition as string}>
              {element}
            </TooltipSpan>
          );
          break;

        case "reference":
          const standardCode = (
            (mark.attrs?.standardCode as string) || ""
          ).toLowerCase();
          const chapterCode = mark.attrs?.chapterCode as string;
          const subsectionNumber = mark.attrs?.subsectionNumber as string;

          // Build URL with optional subsection anchor
          let url = `/regmaps/${standardCode}`;
          if (chapterCode) {
            url += `/${chapterCode}`;
            if (subsectionNumber) {
              // The subsection ID format is {standardCode}{chapterCode}.{number}
              url += `#${standardCode.toUpperCase()}${chapterCode}.${subsectionNumber}`;
            }
          }

          element = (
            <Link
              href={url}
              className="text-[#355189] hover:underline font-medium"
            >
              {element}
            </Link>
          );
          break;
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
