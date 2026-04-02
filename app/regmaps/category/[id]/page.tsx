"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";
import {
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  FileText,
  Loader2,
} from "lucide-react";

interface Chapter {
  id: string;
  code: string;
  title: string;
  status: string;
}

interface Standard {
  id: string;
  code: string;
  name: string;
  description: string | null;
  chapters: Chapter[];
}

interface Category {
  id: string;
  name: string;
  standards: Standard[];
}

export default function CategoryStandardsPage() {
  const { id } = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedStandards, setExpandedStandards] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(getApiUrl(`/basel/categories/${id}`), {
          credentials: "include",
        });
        const data = await res.json();
        setCategory(data.category || null);
      } catch (error) {
        console.error("Error fetching category:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCategory();
  }, [id]);

  const toggleStandard = (id: string) => {
    setExpandedStandards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row overflow-x-hidden">
      <Sidebar />

      <main className="w-full flex-1 lg:ml-[280px] relative">
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-50 rounded-full blur-[100px] opacity-60"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-orange-50 rounded-full blur-[100px] opacity-60"></div>
        </div>

        <div className="relative z-10 px-6 lg:px-12 py-8 pt-24">
          {/* Breadcrumbs */}
          <Link
            href="/regmaps"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#355189] mb-6 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to RegMaps
          </Link>

          {/* Header */}
          <div className="mb-8">
            {loading ? (
              <div className="h-10 w-48 bg-gray-200 animate-pulse rounded-lg shadow-sm" />
            ) : (
              <h1 className="text-3xl lg:text-4xl font-bold text-[#14213D] mb-2">
                {category?.name}
              </h1>
            )}
            <p className="text-gray-500">
              Standards and regulations in this category
            </p>
          </div>

          <div className="max-w-4xl space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#355189]" />
              </div>
            ) : !category || category.standards.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#E1E7EF] p-8 text-center">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[#14213D] mb-2">
                  No Standards in this Category
                </h3>
              </div>
            ) : (
              category.standards.map((standard) => (
                <div
                  key={standard.id}
                  className="bg-white rounded-2xl border border-[#E1E7EF] overflow-hidden bg-white/70 backdrop-blur-sm"
                >
                  <div className="flex items-center">
                    <Link
                      href={`/regmaps/${standard.code.toLowerCase()}`}
                      className="flex-1 flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="text-left">
                        <h3 className="font-bold text-[#14213D]">
                          {standard.code} - {standard.name}
                        </h3>
                        {standard.description && (
                          <p className="text-sm text-gray-500 line-clamp-1">
                            {standard.description}
                          </p>
                        )}
                      </div>
                    </Link>
                    <button
                      onClick={() => toggleStandard(standard.id)}
                      className="px-4 py-4 hover:bg-gray-50 transition-colors border-l border-[#E1E7EF]"
                    >
                      {expandedStandards.has(standard.id) ? (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>

                  {expandedStandards.has(standard.id) && (
                    <div className="border-t border-[#E1E7EF] bg-gray-50/50">
                      {standard.chapters.length === 0 ? (
                        <p className="px-6 py-4 text-sm text-gray-500">
                          No chapters in this standard yet.
                        </p>
                      ) : (
                        standard.chapters.map((chapter) => (
                          <Link
                            key={chapter.id}
                            href={`/regmaps/${standard.code.toLowerCase()}/${
                              chapter.code
                            }`}
                            className="flex items-center gap-3 px-6 py-3 hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0"
                          >
                            <FileText className="w-4 h-4 text-[#355189]" />
                            <span className="font-medium text-[#14213D]">
                              {standard.code}
                              {chapter.code}
                            </span>
                            <span className="text-gray-500">
                              {chapter.title}
                            </span>
                            {chapter.status === "archived" && (
                              <span className="ml-auto text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                                Archived
                              </span>
                            )}
                          </Link>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
}
