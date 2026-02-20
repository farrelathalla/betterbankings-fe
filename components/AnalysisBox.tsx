"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { foresightAPI } from "@/lib/api";
import { FileText, Pencil, Trash2, Save, X, Plus, Loader2 } from "lucide-react";

interface AnalysisBoxProps {
  page: string;
  tabKey: string;
}

export default function AnalysisBox({ page, tabKey }: AnalysisBoxProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchAnalysis = useCallback(async () => {
    setLoading(true);
    try {
      const data = await foresightAPI.getAnalysisBox(page, tabKey);
      if (data && data.analysisBox) {
        setContent(data.analysisBox.content);
      } else {
        setContent(null);
      }
    } catch {
      setContent(null);
    } finally {
      setLoading(false);
    }
  }, [page, tabKey]);

  useEffect(() => {
    fetchAnalysis();
  }, [fetchAnalysis]);

  const handleSave = async () => {
    if (!editContent.trim()) return;
    setSaving(true);
    try {
      await foresightAPI.upsertAnalysisBox({
        page,
        tabKey,
        content: editContent.trim(),
      });
      setContent(editContent.trim());
      setEditing(false);
    } catch (error) {
      console.error("Failed to save analysis:", error);
      alert("Failed to save analysis. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this analysis?")) return;
    setDeleting(true);
    try {
      await foresightAPI.deleteAnalysisBox(page, tabKey);
      setContent(null);
      setEditing(false);
      setEditContent("");
    } catch (error) {
      console.error("Failed to delete analysis:", error);
      alert("Failed to delete analysis. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const startEditing = () => {
    setEditContent(content || "");
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    setEditContent("");
  };

  // Loading state
  if (loading) return null;

  // If no content and not admin, show nothing
  if (!content && !isAdmin) return null;

  // Admin: no content yet — show "Add Analysis" button
  if (!content && isAdmin && !editing) {
    return (
      <div className="mt-4">
        <button
          onClick={() => setEditing(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#355189] bg-white border-2 border-dashed border-[#E1E7EF] rounded-xl hover:border-[#355189] hover:bg-blue-50/50 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Analysis Box
        </button>
      </div>
    );
  }

  // Editing mode
  if (editing) {
    return (
      <div className="mt-4 bg-white rounded-2xl border border-[#E1E7EF] overflow-hidden shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-[#14213D] to-[#355189]">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#F48C25]" />
            <span className="text-sm font-semibold text-white">
              {content ? "Edit" : "Add"} Analysis Box
            </span>
          </div>
          <button
            onClick={cancelEditing}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Editor */}
        <div className="p-5">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="Write your analysis here..."
            className="w-full h-40 px-4 py-3 text-sm text-gray-700 bg-gray-50 border border-[#E1E7EF] rounded-xl resize-y focus:outline-none focus:ring-2 focus:ring-[#355189]/30 focus:border-[#355189] transition-all placeholder:text-gray-400"
          />
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-gray-400">
              This analysis will be visible to all users on this tab.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={cancelEditing}
                className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !editContent.trim()}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#1B2B4B] to-[#355189] rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Display mode with content
  return (
    <div className="mt-4 bg-white rounded-2xl border border-[#E1E7EF] overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-[#14213D] to-[#355189]">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#F48C25]" />
          <span className="text-sm font-semibold text-white">Analysis Box</span>
        </div>
        {isAdmin && (
          <div className="flex items-center gap-1">
            <button
              onClick={startEditing}
              className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Edit analysis"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="p-1.5 text-white/60 hover:text-red-300 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
              title="Delete analysis"
            >
              {deleting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-5 py-4">
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
          {content}
        </p>
      </div>
    </div>
  );
}
