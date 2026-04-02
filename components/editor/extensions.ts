import {
  Mark,
  Node,
  mergeAttributes,
  Extension,
  RawCommands,
} from "@tiptap/core";

import katex from "katex";
import "katex/dist/katex.min.css";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    indent: {
      /**
       * Increase the indentation of the selected nodes.
       */
      indent: () => ReturnType;
      /**
       * Decrease the indentation of the selected nodes.
       */
      outdent: () => ReturnType;
    };
  }
}

// Custom Tooltip Mark - for adding definitions/explanations to text
export const TooltipMark = Mark.create({
  name: "tooltip",

  addAttributes() {
    return {
      definition: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-definition"),
        renderHTML: (attributes) => {
          if (!attributes.definition) {
            return {};
          }
          return {
            "data-definition": attributes.definition,
            class: "tooltip-text",
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span[data-definition]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        class:
          "tooltip-text border-b border-dashed border-[#355189] cursor-help",
      }),
      0,
    ];
  },
});

// Custom Reference Mark - for linking to other Basel sections
export const ReferenceMark = Mark.create({
  name: "reference",

  addAttributes() {
    return {
      standardCode: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-standard"),
        renderHTML: (attributes) => ({
          "data-standard": attributes.standardCode,
        }),
      },
      chapterCode: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-chapter"),
        renderHTML: (attributes) => ({
          "data-chapter": attributes.chapterCode,
        }),
      },
      subsectionNumber: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-subsection"),
        renderHTML: (attributes) => ({
          "data-subsection": attributes.subsectionNumber,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span[data-standard]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        class:
          "reference-link text-[#355189] font-medium cursor-pointer hover:underline",
      }),
      0,
    ];
  },
});

// Custom Indent Extension
export const Indent = Extension.create({
  name: "indent",

  addOptions() {
    return {
      types: ["paragraph", "heading"],
      indentSize: 24,
      maxIndent: 8,
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          indent: {
            default: 0,
            parseHTML: (element) =>
              parseInt(element.style.marginLeft, 10) /
                this.options.indentSize || 0,
            renderHTML: (attributes) => {
              if (!attributes.indent) {
                return {};
              }
              return {
                style: `margin-left: ${attributes.indent * this.options.indentSize}px`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      indent:
        () =>
        ({ tr, state, dispatch }: { tr: any; state: any; dispatch: any }) => {
          const { selection } = state;
          tr = tr.setSelection(selection);
          tr.doc.nodesBetween(
            selection.from,
            selection.to,
            (node: any, pos: number) => {
              if (this.options.types.includes(node.type.name)) {
                const indent = Math.min(
                  (node.attrs.indent || 0) + 1,
                  this.options.maxIndent,
                );
                tr = tr.setNodeMarkup(pos, undefined, {
                  ...node.attrs,
                  indent,
                });
              }
            },
          );
          if (dispatch) dispatch(tr);
          return true;
        },
      outdent:
        () =>
        ({ tr, state, dispatch }: { tr: any; state: any; dispatch: any }) => {
          const { selection } = state;
          tr = tr.setSelection(selection);
          tr.doc.nodesBetween(
            selection.from,
            selection.to,
            (node: any, pos: number) => {
              if (this.options.types.includes(node.type.name)) {
                const indent = Math.max((node.attrs.indent || 0) - 1, 0);
                tr = tr.setNodeMarkup(pos, undefined, {
                  ...node.attrs,
                  indent,
                });
              }
            },
          );
          if (dispatch) dispatch(tr);
          return true;
        },
    } as any;
  },
});

// Custom Math Node
export const MathNode = Node.create({
  name: "math",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      latex: {
        default: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="math"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "math",
        class:
          "math-block p-4 my-4 bg-gray-50 border border-gray-200 rounded-lg text-center cursor-pointer hover:border-blue-400 transition-colors",
      }),
      0,
    ];
  },

  addNodeView() {
    return ({ node, HTMLAttributes }) => {
      const dom = document.createElement("div");
      dom.className =
        "math-block p-4 my-4 bg-gray-50 border border-gray-200 rounded-lg text-center cursor-pointer hover:border-blue-400 transition-colors";
      dom.setAttribute("data-type", "math");

      const renderMath = () => {
        try {
          katex.render(node.attrs.latex, dom, {
            displayMode: true,
            throwOnError: false,
          });
        } catch (e) {
          dom.textContent = node.attrs.latex;
        }
      };

      renderMath();

      return {
        dom,
        update: (updatedNode) => {
          if (updatedNode.type !== this.type) return false;
          node = updatedNode;
          renderMath();
          return true;
        },
      };
    };
  },
});
