"use client";

import { useState, useEffect, use } from "react";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";
import {
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  FileText,
  Loader2,
  Calendar,
  Download,
} from "lucide-react";

interface StandardPDF {
  id: string;
  name: string;
  url: string;
  createdAt: string;
}

interface Chapter {
  id: string;
  code: string;
  title: string;
  status: string;
  effectiveDate: string | null;
  lastUpdate: string | null;
  sections: {
    id: string;
    title: string;
  }[];
}

interface Standard {
  id: string;
  code: string;
  name: string;
  description: string | null;
  chapters: Chapter[];
  pdfs?: StandardPDF[];
}

export default function StandardPage({
  params,
}: {
  params: Promise<{ standard: string }>;
}) {
  const resolvedParams = use(params);
  const standardCode = resolvedParams.standard.toUpperCase();

  const [standard, setStandard] = useState<Standard | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(
    new Set()
  );
  useEffect(() => {
    const fetchStandard = async () => {
      try {
        // First get all standards to find by code
        const res = await fetch(getApiUrl("/basel/standards"), {
          credentials: "include",
        });
        const data = await res.json();

        const found = data.standards?.find(
          (s: Standard) => s.code.toUpperCase() === standardCode
        );

        if (found) {
          // Fetch full standard with chapters
          const detailRes = await fetch(
            getApiUrl(`/basel/standards/${found.id}`),
            {
              credentials: "include",
            }
          );
          const detailData = await detailRes.json();
          setStandard(detailData.standard);
        }
      } catch (error) {
        console.error("Error fetching standard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStandard();
  }, [standardCode]);

  const toggleChapter = (id: string) => {
    setExpandedChapters((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row">
        <Sidebar />
        <main className="w-full flex-1 lg:ml-[280px] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#355189]" />
        </main>
      </div>
    );
  }

  if (!standard) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row">
        <Sidebar />
        <main className="w-full flex-1 lg:ml-[280px] relative">
          <div className="px-6 lg:px-12 py-8">
            <Link
              href="/regmaps"
              className="inline-flex items-center gap-2 text-[#355189] hover:underline mb-6"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to RegMaps
            </Link>
            <div className="bg-white rounded-2xl border border-[#E1E7EF] p-8 text-center">
              <h2 className="text-xl font-bold text-[#14213D] mb-2">
                Standard Not Found
              </h2>
              <p className="text-gray-500">
                The standard &quot;{standardCode}&quot; does not exist.
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row overflow-x-hidden">
      <Sidebar />

      <main className="w-full flex-1 lg:ml-[280px] relative">
        {/* Background Gradients */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-50 rounded-full blur-[100px] opacity-60"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-orange-50 rounded-full blur-[100px] opacity-60"></div>
        </div>

        <div className="relative z-10 px-6 lg:px-12 py-8 pt-24">
          {/* Breadcrumb */}
          <Link
            href="/regmaps"
            className="inline-flex items-center gap-2 text-[#355189] hover:underline mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to RegMaps
          </Link>{" "}
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              {/* <div className="w-16 h-16 bg-gradient-to-br from-[#1B2B4B] to-[#355189] rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">
                  {standard.code}
                </span>
              </div> */}
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-[#14213D]">
                  {standard.code} - {standard.name}
                </h1>
                {standard.description && (
                  <p className="text-gray-500 mt-1">{standard.description}</p>
                )}
              </div>
            </div>

            {/* PDF Documents for Standard */}
            {standard.pdfs && standard.pdfs.length > 0 && (
              <div className="bg-white rounded-2xl border border-[#E1E7EF] p-6 mt-4">
                <p className="text-sm font-semibold text-[#14213D] mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#355189]" />
                  Standard Documents
                </p>
                <div className="flex flex-wrap gap-2">
                  {standard.pdfs.map((pdf) => (
                    <a
                      key={pdf.id}
                      href={pdf.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg hover:bg-[#355189] hover:text-white hover:border-[#355189] transition-colors group"
                    >
                      <FileText className="w-4 h-4 text-red-500 group-hover:text-white" />
                      <span>{pdf.name}</span>
                      <Download className="w-3 h-3 opacity-50" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* Chapters List */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#14213D]">Chapters</h2>

            {standard.chapters.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#E1E7EF] p-8 text-center">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  No chapters in this standard yet.
                </p>
              </div>
            ) : (
              standard.chapters.map((chapter) => (
                <div
                  key={chapter.id}
                  className="bg-white rounded-2xl border border-[#E1E7EF] overflow-hidden"
                >
                  {/* Chapter Header */}
                  <div className="flex items-center">
                    <Link
                      href={`/regmaps/${standard.code.toLowerCase()}/${
                        chapter.code
                      }`}
                      className="flex-1 flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                    >
                      <FileText className="w-5 h-5 text-[#355189]" />
                      <div>
                        <h3 className="font-bold text-[#14213D]">
                          {standard.code}
                          {chapter.code} - {chapter.title}
                        </h3>
                        <div className="flex items-center gap-4 mt-1">
                          {chapter.lastUpdate && (
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Updated:{" "}
                              {new Date(
                                chapter.lastUpdate
                              ).toLocaleDateString()}
                            </span>
                          )}
                          {chapter.status === "archived" && (
                            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                              Archived
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>

                    {chapter.sections.length > 0 && (
                      <button
                        onClick={() => toggleChapter(chapter.id)}
                        className="px-4 py-4 hover:bg-gray-50 transition-colors border-l border-[#E1E7EF]"
                      >
                        {expandedChapters.has(chapter.id) ? (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Sections Preview */}
                  {expandedChapters.has(chapter.id) &&
                    chapter.sections.length > 0 && (
                      <div className="border-t border-[#E1E7EF] bg-gray-50 px-6 py-3">
                        <p className="text-xs text-gray-500 mb-2">Sections:</p>
                        <div className="flex flex-wrap gap-2">
                          {chapter.sections.map((section) => (
                            <Link
                              key={section.id}
                              href={`/regmaps/${standard.code.toLowerCase()}/${
                                chapter.code
                              }#${section.id}`}
                              className="text-sm text-[#355189] hover:underline"
                            >
                              {section.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
