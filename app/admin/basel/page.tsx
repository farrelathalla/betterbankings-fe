"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { getApiUrl } from "@/lib/api";
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  FileText,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Shield,
  Clock,
} from "lucide-react";

interface Standard {
  id: string;
  code: string;
  name: string;
  description: string | null;
  order: number;
  categoryId: string | null;
  chapters: {
    id: string;
    code: string;
    title: string;
  }[];
}

interface Category {
  id: string;
  name: string;
  order: number;
  standards: Standard[];
}

interface Update {
  id: string;
  title: string;
  date: string;
}

export default function AdminBaselPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [standards, setStandards] = useState<Standard[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<string | null>(null);
  const [reordering, setReordering] = useState(false);

  // New category form
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);

  // New standard form
  const [showNewStandard, setShowNewStandard] = useState(false);
  const [newStandard, setNewStandard] = useState({
    code: "",
    name: "",
    description: "",
    categoryId: "",
  });
  const [creating, setCreating] = useState(false);

  // New update form
  const [showNewUpdate, setShowNewUpdate] = useState(false);
  const [newUpdate, setNewUpdate] = useState({
    title: "",
    description: "",
    link: "",
  });
  const [creatingUpdate, setCreatingUpdate] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.role === "admin") {
      fetchData();
    }
  }, [user]);
  const fetchData = async () => {
    try {
      const [standardsRes, categoriesRes, updatesRes] = await Promise.all([
        fetch(getApiUrl("/basel/standards"), { credentials: "include" }),
        fetch(getApiUrl("/basel/categories"), { credentials: "include" }),
        fetch(getApiUrl("/basel/updates?limit=10"), { credentials: "include" }),
      ]);
      const standardsData = await standardsRes.json();
      const categoriesData = await categoriesRes.json();
      const updatesData = await updatesRes.json();
      setStandards(standardsData.standards || []);
      setCategories(categoriesData.categories || []);
      setUpdates(updatesData.updates || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setCreatingCategory(true);

    try {
      const res = await fetch(getApiUrl("/basel/categories"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: newCategoryName }),
      });

      if (res.ok) {
        setNewCategoryName("");
        setShowNewCategory(false);
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to create category");
      }
    } catch (error) {
      console.error("Error creating category:", error);
    } finally {
      setCreatingCategory(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (
      !confirm(
        "Delete this category? Standards will remain but become uncategorized.",
      )
    ) {
      return;
    }

    setDeletingCategory(id);
    try {
      const res = await fetch(getApiUrl(`/basel/categories/${id}`), {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        fetchData();
      } else {
        alert("Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    } finally {
      setDeletingCategory(null);
    }
  };

  const handleReorderCategory = async (
    index: number,
    direction: "up" | "down",
  ) => {
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= categories.length) return;

    setReordering(true);
    const newList = [...categories];
    [newList[index], newList[swapIndex]] = [newList[swapIndex], newList[index]];
    const items = newList.map((c, i) => ({ id: c.id, order: i }));
    setCategories(newList);

    try {
      await fetch(getApiUrl("/basel/reorder"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ type: "category", items }),
      });
    } catch (error) {
      console.error("Error reordering categories:", error);
      fetchData();
    } finally {
      setReordering(false);
    }
  };

  const handleCreateStandard = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const res = await fetch(getApiUrl("/basel/standards"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newStandard),
      });

      if (res.ok) {
        setNewStandard({ code: "", name: "", description: "", categoryId: "" });
        setShowNewStandard(false);
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to create standard");
      }
    } catch (error) {
      console.error("Error creating standard:", error);
    } finally {
      setCreating(false);
    }
  };
  const handleDeleteStandard = async (id: string) => {
    if (
      !confirm(
        "Delete this standard and all its chapters? This cannot be undone.",
      )
    ) {
      return;
    }

    setDeleting(id);
    try {
      const res = await fetch(getApiUrl(`/basel/standards/${id}`), {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        fetchData();
      } else {
        alert("Failed to delete standard");
      }
    } catch (error) {
      console.error("Error deleting standard:", error);
    } finally {
      setDeleting(null);
    }
  };

  const handleReorderStandard = async (
    index: number,
    direction: "up" | "down",
  ) => {
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= standards.length) return;

    setReordering(true);
    const newList = [...standards];
    [newList[index], newList[swapIndex]] = [newList[swapIndex], newList[index]];
    const items = newList.map((s, i) => ({ id: s.id, order: i }));
    setStandards(newList);

    try {
      await fetch(getApiUrl("/basel/reorder"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ type: "standard", items }),
      });
    } catch (error) {
      console.error("Error reordering standards:", error);
      fetchData();
    } finally {
      setReordering(false);
    }
  };

  const handleCreateUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingUpdate(true);

    try {
      const res = await fetch(getApiUrl("/basel/updates"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newUpdate),
      });

      if (res.ok) {
        setNewUpdate({ title: "", description: "", link: "" });
        setShowNewUpdate(false);
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to create update");
      }
    } catch (error) {
      console.error("Error creating update:", error);
    } finally {
      setCreatingUpdate(false);
    }
  };

  const handleDeleteUpdate = async (id: string) => {
    try {
      await fetch(getApiUrl(`/basel/updates/${id}`), {
        method: "DELETE",
        credentials: "include",
      });
      fetchData();
    } catch (error) {
      console.error("Error deleting update:", error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row">
        <Sidebar />
        <main className="w-full flex-1 lg:ml-[280px] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#355189]" />
        </main>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  const StandardCard = ({
    standard,
    onDelete,
    onReorder,
    idx,
    totalCount,
    deleting,
    reordering,
  }: {
    standard: Standard;
    onDelete: () => void;
    onReorder: (dir: "up" | "down") => void;
    idx: number;
    totalCount: number;
    deleting: boolean;
    reordering: boolean;
  }) => (
    <div className="bg-white rounded-2xl border border-[#E1E7EF] p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex flex-col gap-0.5">
            <button
              onClick={() => onReorder("up")}
              disabled={idx === 0 || reordering}
              className="p-0.5 text-gray-400 hover:text-[#355189] hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Move up"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              onClick={() => onReorder("down")}
              disabled={idx === totalCount - 1 || reordering}
              className="p-0.5 text-gray-400 hover:text-[#355189] hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Move down"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-[#1B2B4B] to-[#355189] rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {standard.code}
            </span>
          </div>
          <div>
            <h3 className="font-bold text-[#14213D]">
              {standard.code} - {standard.name}
            </h3>
            <p className="text-sm text-gray-500">
              {standard.chapters.length} chapters
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/basel/standards/${standard.id}`}
            className="p-2 text-[#355189] hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </Link>
          <button
            onClick={onDelete}
            disabled={deleting}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
          >
            {deleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
          <Link
            href={`/admin/basel/standards/${standard.id}`}
            className="p-2 text-gray-400 hover:text-[#355189]"
          >
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row overflow-x-hidden">
      <Sidebar />

      <main className="w-full flex-1 lg:ml-[280px] relative">
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-50 rounded-full blur-[100px] opacity-60"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-50 rounded-full blur-[100px] opacity-60"></div>
        </div>

        <div className="relative z-10 px-6 lg:px-12 py-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-[#14213D]">
                Basel Framework <span className="text-purple-600">Admin</span>
              </h1>
              <p className="text-gray-500 text-sm">
                Manage standards, chapters, and content
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Standards & Categories Management */}
            <div className="xl:col-span-2 space-y-8">
              {/* Category Management */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-[#14213D]">
                    Categories
                  </h2>
                  <button
                    onClick={() => setShowNewCategory(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Category
                  </button>
                </div>

                {showNewCategory && (
                  <form
                    onSubmit={handleCreateCategory}
                    className="bg-white rounded-2xl border border-[#E1E7EF] p-6 mb-4"
                  >
                    <h3 className="font-bold text-[#14213D] mb-4">
                      New Category
                    </h3>
                    <div className="flex gap-4">
                      <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Category Name"
                        required
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none"
                      />
                      <button
                        type="submit"
                        disabled={creatingCategory}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 disabled:opacity-50"
                      >
                        {creatingCategory ? "Creating..." : "Create"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowNewCategory(false)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-3">
                  {categories.map((category, idx) => (
                    <div
                      key={category.id}
                      className="bg-white rounded-2xl border border-[#E1E7EF] p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col gap-0.5">
                          <button
                            onClick={() => handleReorderCategory(idx, "up")}
                            disabled={idx === 0 || reordering}
                            className="p-0.5 text-gray-400 hover:text-purple-600 rounded disabled:opacity-30 transition-colors"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleReorderCategory(idx, "down")}
                            disabled={
                              idx === categories.length - 1 || reordering
                            }
                            className="p-0.5 text-gray-400 hover:text-purple-600 rounded disabled:opacity-30 transition-colors"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        </div>
                        <h3 className="font-bold text-[#14213D]">
                          {category.name}
                        </h3>
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                          {
                            standards.filter(
                              (s) => s.categoryId === category.id,
                            ).length
                          }{" "}
                          standards
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        disabled={deletingCategory === category.id}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {deletingCategory === category.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Standards List */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-[#14213D]">
                    Standards
                  </h2>
                  <button
                    onClick={() => setShowNewStandard(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#355189] text-white rounded-lg text-sm font-semibold hover:bg-[#1B2B4B] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Standard
                  </button>
                </div>

                {/* New Standard Form */}
                {showNewStandard && (
                  <form
                    onSubmit={handleCreateStandard}
                    className="bg-white rounded-2xl border border-[#E1E7EF] p-6 mb-4"
                  >
                    <h3 className="font-bold text-[#14213D] mb-4">
                      New Standard
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-semibold text-[#14213D] mb-1">
                          Code *
                        </label>
                        <input
                          type="text"
                          value={newStandard.code}
                          onChange={(e) =>
                            setNewStandard({
                              ...newStandard,
                              code: e.target.value,
                            })
                          }
                          placeholder="SCO"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#355189] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[#14213D] mb-1">
                          Name *
                        </label>
                        <input
                          type="text"
                          value={newStandard.name}
                          onChange={(e) =>
                            setNewStandard({
                              ...newStandard,
                              name: e.target.value,
                            })
                          }
                          placeholder="Scope of application"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#355189] outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-semibold text-[#14213D] mb-1">
                          Description
                        </label>
                        <input
                          type="text"
                          value={newStandard.description}
                          onChange={(e) =>
                            setNewStandard({
                              ...newStandard,
                              description: e.target.value,
                            })
                          }
                          placeholder="Optional description"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#355189] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[#14213D] mb-1">
                          Category
                        </label>
                        <select
                          value={newStandard.categoryId}
                          onChange={(e) =>
                            setNewStandard({
                              ...newStandard,
                              categoryId: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#355189] outline-none bg-white"
                        >
                          <option value="">Uncategorized</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={creating}
                        className="px-4 py-2 bg-[#355189] text-white rounded-lg text-sm font-semibold hover:bg-[#1B2B4B] disabled:opacity-50"
                      >
                        {creating ? "Creating..." : "Create Standard"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowNewStandard(false)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-6">
                  {/* Categorized Standards */}
                  {categories.map((category) => {
                    const categoryStandards = standards.filter(
                      (s) => s.categoryId === category.id,
                    );
                    if (categoryStandards.length === 0) return null;

                    return (
                      <div key={category.id} className="space-y-3">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider px-2">
                          {category.name}
                        </h3>
                        {categoryStandards.map((standard) => (
                          <StandardCard
                            key={standard.id}
                            standard={standard}
                            onDelete={() => handleDeleteStandard(standard.id)}
                            onReorder={(dir) =>
                              handleReorderStandard(
                                standards.indexOf(standard),
                                dir,
                              )
                            }
                            idx={standards.indexOf(standard)}
                            totalCount={standards.length}
                            deleting={deleting === standard.id}
                            reordering={reordering}
                          />
                        ))}
                      </div>
                    );
                  })}

                  {/* Uncategorized Standards */}
                  {standards.filter((s) => !s.categoryId).length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider px-2">
                        Uncategorized
                      </h3>
                      {standards
                        .filter((s) => !s.categoryId)
                        .map((standard) => (
                          <StandardCard
                            key={standard.id}
                            standard={standard}
                            onDelete={() => handleDeleteStandard(standard.id)}
                            onReorder={(dir) =>
                              handleReorderStandard(
                                standards.indexOf(standard),
                                dir,
                              )
                            }
                            idx={standards.indexOf(standard)}
                            totalCount={standards.length}
                            deleting={deleting === standard.id}
                            reordering={reordering}
                          />
                        ))}
                    </div>
                  )}

                  {standards.length === 0 && (
                    <div className="bg-white rounded-2xl border border-[#E1E7EF] p-8 text-center">
                      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">
                        No standards yet. Create your first one!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Updates Management */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-[#14213D]">Updates</h2>
                <button
                  onClick={() => setShowNewUpdate(true)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-[#F48C25] text-white rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>

              {/* New Update Form */}
              {showNewUpdate && (
                <form
                  onSubmit={handleCreateUpdate}
                  className="bg-white rounded-2xl border border-[#E1E7EF] p-4 mb-4"
                >
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={newUpdate.title}
                      onChange={(e) =>
                        setNewUpdate({ ...newUpdate, title: e.target.value })
                      }
                      placeholder="Update title *"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#355189] outline-none"
                    />
                    <input
                      type="text"
                      value={newUpdate.description}
                      onChange={(e) =>
                        setNewUpdate({
                          ...newUpdate,
                          description: e.target.value,
                        })
                      }
                      placeholder="Description (optional)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#355189] outline-none"
                    />
                    <input
                      type="text"
                      value={newUpdate.link}
                      onChange={(e) =>
                        setNewUpdate({ ...newUpdate, link: e.target.value })
                      }
                      placeholder="Link (optional)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#355189] outline-none"
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={creatingUpdate}
                        className="px-3 py-1.5 bg-[#F48C25] text-white rounded-lg text-sm font-semibold disabled:opacity-50"
                      >
                        {creatingUpdate ? "..." : "Add"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowNewUpdate(false)}
                        className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              )}

              <div className="bg-white rounded-2xl border border-[#E1E7EF] overflow-hidden">
                {updates.length === 0 ? (
                  <p className="p-4 text-sm text-gray-500 text-center">
                    No updates yet.
                  </p>
                ) : (
                  updates.map((update) => (
                    <div
                      key={update.id}
                      className="flex items-center justify-between px-4 py-3 border-b border-gray-100 last:border-b-0"
                    >
                      <div>
                        <p className="font-medium text-[#14213D] text-sm">
                          {update.title}
                        </p>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(update.date).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteUpdate(update.id)}
                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
