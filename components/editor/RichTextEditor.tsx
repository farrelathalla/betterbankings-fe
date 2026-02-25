"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { Image } from "@tiptap/extension-image";
import { TooltipMark, ReferenceMark } from "./extensions";
import "./editor.css";
import { useState, useCallback, useEffect } from "react";
import { getApiUrl } from "@/lib/api";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Link as LinkIcon,
  Quote,
  MessageSquare,
  Bookmark,
  X,
  Table as TableIcon,
  ImageIcon,
  Plus,
  Minus,
  Trash2,
  Columns,
  Rows,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react";

// Extended interface to include full Basel hierarchy for reference picker
interface ReferenceStandard {
  id: string;
  code: string;
  name: string;
  chapters: Array<{
    id: string;
    code: string;
    title: string;
    sections?: Array<{
      id: string;
      title: string;
      subsections?: Array<{ id: string; number: string }>;
    }>;
  }>;
}

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  standards?: ReferenceStandard[];
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = "Start writing...",
  standards: propStandards = [],
}: RichTextEditorProps) {
  const [showTooltipModal, setShowTooltipModal] = useState(false);
  const [showReferenceModal, setShowReferenceModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showTableMenu, setShowTableMenu] = useState(false);
  const [tooltipDefinition, setTooltipDefinition] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [selectedStandard, setSelectedStandard] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedSubsection, setSelectedSubsection] = useState("");

  // Fetch full standards with sections/subsections for reference picker
  const [fullStandards, setFullStandards] = useState<ReferenceStandard[]>([]);
  const [loadingRefs, setLoadingRefs] = useState(false);

  // Use prop standards for basic data, but fetch full hierarchy when modal opens
  const standards = fullStandards.length > 0 ? fullStandards : propStandards;

  // Upload image file to the server (/var/www/uploads/images/)
  const uploadImageFile = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "images");

      const res = await fetch(getApiUrl("/upload/vps"), {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) {
        console.error("Image upload failed:", res.statusText);
        return null;
      }

      const data = await res.json();
      return data.url || null;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  // Parse initial content for the editor
  const parseContent = (contentStr: string) => {
    if (!contentStr) return "";
    try {
      const parsed =
        typeof contentStr === "string" ? JSON.parse(contentStr) : contentStr;
      if (parsed.type === "doc") {
        return parsed;
      }
      return contentStr;
    } catch {
      // Not valid JSON, treat as plain text
      return contentStr;
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
      TextAlign.configure({
        types: ["paragraph", "heading"],
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "tiptap-table",
        },
      }),
      TableRow,
      TableCell,
      TableHeader,
      Image.configure({
        HTMLAttributes: {
          class: "tiptap-image",
        },
        allowBase64: true,
      }),
      TooltipMark,
      ReferenceMark,
    ],
    content: parseContent(content),
    immediatelyRender: false, // Fix SSR hydration mismatch
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON() as unknown as string);
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[150px] px-4 py-3 focus:outline-none",
      },
      handlePaste: (view, event) => {
        // Handle image paste — upload to server
        const items = event.clipboardData?.items;
        if (items) {
          for (let i = 0; i < items.length; i++) {
            if (items[i].type.startsWith("image/")) {
              event.preventDefault();
              const file = items[i].getAsFile();
              if (file) {
                uploadImageFile(file).then((url) => {
                  if (url) {
                    view.dispatch(
                      view.state.tr.replaceSelectionWith(
                        view.state.schema.nodes.image.create({ src: url }),
                      ),
                    );
                  }
                });
              }
              return true;
            }
          }
        }

        // For HTML paste (Excel/Word tables), let Tiptap handle it natively
        // The table extension automatically parses <table> HTML from clipboard
        return false;
      },
      handleDrop: (view, event) => {
        // Handle image drop — upload to server
        const files = event.dataTransfer?.files;
        if (files && files.length > 0) {
          for (let i = 0; i < files.length; i++) {
            if (files[i].type.startsWith("image/")) {
              event.preventDefault();
              const droppedFile = files[i];
              uploadImageFile(droppedFile).then((url) => {
                if (url) {
                  const pos = view.posAtCoords({
                    left: event.clientX,
                    top: event.clientY,
                  });
                  if (pos) {
                    view.dispatch(
                      view.state.tr.insert(
                        pos.pos,
                        view.state.schema.nodes.image.create({ src: url }),
                      ),
                    );
                  }
                }
              });
              return true;
            }
          }
        }
        return false;
      },
    },
  });

  // Update content when prop changes (for editing different subsections)
  useEffect(() => {
    if (editor && content) {
      const parsed = parseContent(content);
      const currentContent = JSON.stringify(editor.getJSON());
      const newContent =
        typeof parsed === "object" ? JSON.stringify(parsed) : parsed;

      // Only update if content actually changed
      if (currentContent !== newContent) {
        editor.commands.setContent(parsed);
      }
    }
  }, [editor, content]);

  const addTooltip = useCallback(() => {
    if (!editor || !tooltipDefinition.trim()) return;

    editor
      .chain()
      .focus()
      .setMark("tooltip", { definition: tooltipDefinition })
      .run();

    setTooltipDefinition("");
    setShowTooltipModal(false);
  }, [editor, tooltipDefinition]);

  const addReference = useCallback(() => {
    if (!editor || !selectedStandard || !selectedChapter || !selectedSubsection)
      return;

    editor
      .chain()
      .focus()
      .setMark("reference", {
        standardCode: selectedStandard,
        chapterCode: selectedChapter,
        subsectionNumber: selectedSubsection,
      })
      .run();

    setSelectedStandard("");
    setSelectedChapter("");
    setSelectedSection("");
    setSelectedSubsection("");
    setShowReferenceModal(false);
  }, [editor, selectedStandard, selectedChapter, selectedSubsection]);

  const addImage = useCallback(() => {
    if (!editor || !imageUrl.trim()) return;
    editor.chain().focus().setImage({ src: imageUrl, alt: imageAlt }).run();
    setImageUrl("");
    setImageAlt("");
    setShowImageModal(false);
  }, [editor, imageUrl, imageAlt]);

  const handleImageFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !editor) return;
      setImageUploading(true);
      const url = await uploadImageFile(file);
      if (url) {
        editor
          .chain()
          .focus()
          .setImage({ src: url, alt: imageAlt || file.name })
          .run();
        setImageUrl("");
        setImageAlt("");
        setShowImageModal(false);
      }
      setImageUploading(false);
    },
    [editor, imageAlt],
  );

  const insertTable = useCallback(() => {
    if (!editor) return;
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
    setShowTableMenu(false);
  }, [editor]);

  const removeTooltip = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().unsetMark("tooltip").run();
  }, [editor]);

  const removeReference = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().unsetMark("reference").run();
  }, [editor]);

  if (!editor) {
    return (
      <div className="border border-gray-300 rounded-lg p-4 text-gray-400">
        Loading editor...
      </div>
    );
  }

  const selectedChapters =
    standards.find((s) => s.code === selectedStandard)?.chapters || [];

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-gray-50">
        {/* Basic formatting */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
          title="Underline"
        >
          <UnderlineIcon className="w-4 h-4" />
        </ToolbarButton>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        {/* Lists */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Quote"
        >
          <Quote className="w-4 h-4" />
        </ToolbarButton>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        {/* Table controls */}
        <div className="relative">
          <ToolbarButton
            onClick={() => setShowTableMenu(!showTableMenu)}
            active={editor.isActive("table")}
            title="Table"
          >
            <TableIcon className="w-4 h-4" />
          </ToolbarButton>
          {showTableMenu && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-50 min-w-[180px]">
              <button
                onClick={insertTable}
                className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 rounded flex items-center gap-2"
              >
                <Plus className="w-3 h-3" />
                Insert Table (3×3)
              </button>
              {editor.isActive("table") && (
                <>
                  <hr className="my-1 border-gray-200" />
                  <button
                    onClick={() => {
                      editor.chain().focus().addRowBefore().run();
                      setShowTableMenu(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 rounded flex items-center gap-2"
                  >
                    <Rows className="w-3 h-3" />
                    Add Row Before
                  </button>
                  <button
                    onClick={() => {
                      editor.chain().focus().addRowAfter().run();
                      setShowTableMenu(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 rounded flex items-center gap-2"
                  >
                    <Rows className="w-3 h-3" />
                    Add Row After
                  </button>
                  <button
                    onClick={() => {
                      editor.chain().focus().addColumnBefore().run();
                      setShowTableMenu(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 rounded flex items-center gap-2"
                  >
                    <Columns className="w-3 h-3" />
                    Add Column Before
                  </button>
                  <button
                    onClick={() => {
                      editor.chain().focus().addColumnAfter().run();
                      setShowTableMenu(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 rounded flex items-center gap-2"
                  >
                    <Columns className="w-3 h-3" />
                    Add Column After
                  </button>
                  <hr className="my-1 border-gray-200" />
                  <button
                    onClick={() => {
                      editor.chain().focus().deleteRow().run();
                      setShowTableMenu(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 rounded text-red-600 flex items-center gap-2"
                  >
                    <Minus className="w-3 h-3" />
                    Delete Row
                  </button>
                  <button
                    onClick={() => {
                      editor.chain().focus().deleteColumn().run();
                      setShowTableMenu(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 rounded text-red-600 flex items-center gap-2"
                  >
                    <Minus className="w-3 h-3" />
                    Delete Column
                  </button>
                  <button
                    onClick={() => {
                      editor.chain().focus().deleteTable().run();
                      setShowTableMenu(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 rounded text-red-600 flex items-center gap-2"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete Table
                  </button>
                  <hr className="my-1 border-gray-200" />
                  {/* Text Alignment */}
                  <p className="px-3 py-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                    Alignment
                  </p>
                  <div className="flex items-center gap-0.5 px-2 pb-1">
                    <button
                      onClick={() => {
                        editor.chain().focus().setTextAlign("left").run();
                        setShowTableMenu(false);
                      }}
                      className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${editor.isActive({ textAlign: "left" }) ? "bg-gray-200 text-[#14213D]" : "text-gray-500"}`}
                      title="Align Left"
                    >
                      <AlignLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        editor.chain().focus().setTextAlign("center").run();
                        setShowTableMenu(false);
                      }}
                      className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${editor.isActive({ textAlign: "center" }) ? "bg-gray-200 text-[#14213D]" : "text-gray-500"}`}
                      title="Align Center"
                    >
                      <AlignCenter className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        editor.chain().focus().setTextAlign("right").run();
                        setShowTableMenu(false);
                      }}
                      className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${editor.isActive({ textAlign: "right" }) ? "bg-gray-200 text-[#14213D]" : "text-gray-500"}`}
                      title="Align Right"
                    >
                      <AlignRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        editor.chain().focus().setTextAlign("justify").run();
                        setShowTableMenu(false);
                      }}
                      className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${editor.isActive({ textAlign: "justify" }) ? "bg-gray-200 text-[#14213D]" : "text-gray-500"}`}
                      title="Justify"
                    >
                      <AlignJustify className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <hr className="my-1 border-gray-200" />
                  <button
                    onClick={() => {
                      editor.chain().focus().mergeCells().run();
                      setShowTableMenu(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 rounded flex items-center gap-2"
                  >
                    Merge Cells
                  </button>
                  <button
                    onClick={() => {
                      editor.chain().focus().splitCell().run();
                      setShowTableMenu(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 rounded flex items-center gap-2"
                  >
                    Split Cell
                  </button>
                </>
              )}
            </div>
          )}
        </div>
        {/* Image */}
        <ToolbarButton
          onClick={() => setShowImageModal(true)}
          title="Insert Image"
        >
          <ImageIcon className="w-4 h-4" />
        </ToolbarButton>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        {/* Custom marks */}
        <ToolbarButton
          onClick={() => setShowTooltipModal(true)}
          active={editor.isActive("tooltip")}
          title="Add Tooltip Definition"
          className="text-purple-600"
        >
          <MessageSquare className="w-4 h-4" />
        </ToolbarButton>{" "}
        <ToolbarButton
          onClick={async () => {
            setShowReferenceModal(true);
            // Fetch full hierarchy if not already loaded
            if (fullStandards.length === 0) {
              setLoadingRefs(true);
              try {
                const res = await fetch(getApiUrl("/basel/references"), {
                  credentials: "include",
                });
                const data = await res.json();
                setFullStandards(data.standards || []);
              } catch (error) {
                console.error("Error fetching references:", error);
              } finally {
                setLoadingRefs(false);
              }
            }
          }}
          active={editor.isActive("reference")}
          title="Add Basel Reference"
          className="text-blue-600"
        >
          <Bookmark className="w-4 h-4" />
        </ToolbarButton>
        {/* Remove marks */}
        {editor.isActive("tooltip") && (
          <ToolbarButton
            onClick={removeTooltip}
            title="Remove Tooltip"
            className="text-red-500"
          >
            <X className="w-4 h-4" />
          </ToolbarButton>
        )}
        {editor.isActive("reference") && (
          <ToolbarButton
            onClick={removeReference}
            title="Remove Reference"
            className="text-red-500"
          >
            <X className="w-4 h-4" />
          </ToolbarButton>
        )}
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />

      {/* Tooltip Modal */}
      {showTooltipModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="font-bold text-[#14213D] mb-4">
              Add Tooltip Definition
            </h3>
            <p className="text-sm text-gray-500 mb-3">
              This definition will appear when users hover over the selected
              text.
            </p>
            <textarea
              value={tooltipDefinition}
              onChange={(e) => setTooltipDefinition(e.target.value)}
              placeholder="Enter the definition or explanation..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#355189] outline-none resize-none"
              rows={3}
              autoFocus
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={addTooltip}
                disabled={!tooltipDefinition.trim()}
                className="flex-1 py-2 bg-[#355189] text-white rounded-lg font-semibold hover:bg-[#1B2B4B] disabled:opacity-50"
              >
                Add Tooltip
              </button>
              <button
                onClick={() => {
                  setShowTooltipModal(false);
                  setTooltipDefinition("");
                }}
                className="flex-1 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="font-bold text-[#14213D] mb-4">Insert Image</h3>
            <p className="text-sm text-gray-500 mb-3">
              Upload an image file, enter a URL, or paste/drag an image directly
              into the editor.
            </p>

            {/* File upload */}
            <div className="mb-3">
              <label className="block text-sm font-semibold text-[#14213D] mb-1">
                Upload File
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileSelect}
                disabled={imageUploading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm file:mr-3 file:px-3 file:py-1 file:border-0 file:bg-[#355189] file:text-white file:rounded file:text-sm file:cursor-pointer"
              />
              {imageUploading && (
                <p className="text-xs text-[#F48C25] mt-1 animate-pulse">
                  Uploading image...
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 mb-3">
              <hr className="flex-1 border-gray-200" />
              <span className="text-xs text-gray-400">OR</span>
              <hr className="flex-1 border-gray-200" />
            </div>

            {/* URL input */}
            <label className="block text-sm font-semibold text-[#14213D] mb-1">
              Image URL
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.png"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#355189] outline-none mb-3"
            />
            <input
              type="text"
              value={imageAlt}
              onChange={(e) => setImageAlt(e.target.value)}
              placeholder="Alt text (optional)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#355189] outline-none"
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={addImage}
                disabled={!imageUrl.trim() || imageUploading}
                className="flex-1 py-2 bg-[#355189] text-white rounded-lg font-semibold hover:bg-[#1B2B4B] disabled:opacity-50"
              >
                Insert from URL
              </button>
              <button
                onClick={() => {
                  setShowImageModal(false);
                  setImageUrl("");
                  setImageAlt("");
                }}
                className="flex-1 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reference Modal */}
      {showReferenceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-[80vh] overflow-y-auto">
            <h3 className="font-bold text-[#14213D] mb-4">
              Add Basel Reference
            </h3>
            <p className="text-sm text-gray-500 mb-3">
              Link to a specific Basel Framework subsection.
            </p>

            {loadingRefs ? (
              <div className="text-center py-8 text-gray-500">
                Loading references...
              </div>
            ) : (
              <div className="space-y-4">
                {/* Standard Selection */}
                <div>
                  <label className="block text-sm font-semibold text-[#14213D] mb-1">
                    Standard *
                  </label>
                  <select
                    value={selectedStandard}
                    onChange={(e) => {
                      setSelectedStandard(e.target.value);
                      setSelectedChapter("");
                      setSelectedSection("");
                      setSelectedSubsection("");
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#355189] outline-none"
                  >
                    <option value="">Select a standard...</option>
                    {standards.map((std) => (
                      <option key={std.id} value={std.code}>
                        {std.code} - {std.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Chapter Selection */}
                {selectedStandard && (
                  <div>
                    <label className="block text-sm font-semibold text-[#14213D] mb-1">
                      Chapter *
                    </label>
                    <select
                      value={selectedChapter}
                      onChange={(e) => {
                        setSelectedChapter(e.target.value);
                        setSelectedSection("");
                        setSelectedSubsection("");
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#355189] outline-none"
                    >
                      <option value="">Select a chapter...</option>
                      {standards
                        .find((s) => s.code === selectedStandard)
                        ?.chapters.map((ch) => (
                          <option key={ch.id} value={ch.code}>
                            {selectedStandard}
                            {ch.code} - {ch.title}
                          </option>
                        ))}
                    </select>
                  </div>
                )}

                {/* Section Selection */}
                {selectedChapter &&
                  (() => {
                    const chapter = standards
                      .find((s) => s.code === selectedStandard)
                      ?.chapters.find((c) => c.code === selectedChapter);
                    const sections = chapter?.sections || [];

                    return sections.length > 0 ? (
                      <div>
                        <label className="block text-sm font-semibold text-[#14213D] mb-1">
                          Section *
                        </label>
                        <select
                          value={selectedSection}
                          onChange={(e) => {
                            setSelectedSection(e.target.value);
                            setSelectedSubsection("");
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#355189] outline-none"
                        >
                          <option value="">Select a section...</option>
                          {sections.map((sec) => (
                            <option key={sec.id} value={sec.id}>
                              {sec.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">
                        No sections in this chapter yet.
                      </p>
                    );
                  })()}

                {/* Subsection Selection */}
                {selectedSection &&
                  (() => {
                    const chapter = standards
                      .find((s) => s.code === selectedStandard)
                      ?.chapters.find((c) => c.code === selectedChapter);
                    const section = chapter?.sections?.find(
                      (s) => s.id === selectedSection,
                    );
                    const subsections = section?.subsections || [];

                    return subsections.length > 0 ? (
                      <div>
                        <label className="block text-sm font-semibold text-[#14213D] mb-1">
                          Subsection *
                        </label>
                        <select
                          value={selectedSubsection}
                          onChange={(e) =>
                            setSelectedSubsection(e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#355189] outline-none"
                        >
                          <option value="">Select a subsection...</option>
                          {subsections.map((sub) => (
                            <option key={sub.id} value={sub.number}>
                              {selectedStandard}
                              {selectedChapter}.{sub.number}
                            </option>
                          ))}
                        </select>
                        {selectedSubsection && (
                          <p className="text-xs text-[#355189] mt-2 font-medium">
                            → Will link to: {selectedStandard}
                            {selectedChapter}.{selectedSubsection}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">
                        No subsections in this section yet.
                      </p>
                    );
                  })()}
              </div>
            )}

            <div className="flex gap-2 mt-4">
              <button
                onClick={addReference}
                disabled={
                  !selectedStandard || !selectedChapter || !selectedSubsection
                }
                className="flex-1 py-2 bg-[#355189] text-white rounded-lg font-semibold hover:bg-[#1B2B4B] disabled:opacity-50"
              >
                Add Reference
              </button>
              <button
                onClick={() => {
                  setShowReferenceModal(false);
                  setSelectedStandard("");
                  setSelectedChapter("");
                  setSelectedSection("");
                  setSelectedSubsection("");
                }}
                className="flex-1 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Toolbar button component
function ToolbarButton({
  onClick,
  active,
  title,
  children,
  className = "",
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 rounded hover:bg-gray-200 transition-colors ${
        active ? "bg-gray-200 text-[#14213D]" : "text-gray-600"
      } ${className}`}
    >
      {children}
    </button>
  );
}
