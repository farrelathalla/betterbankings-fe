"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ExternalLink, Search, X } from "lucide-react";
import { regInventory, type RegInventoryEntry } from "@/lib/regInventory";

// Rows are appended in batches as the user scrolls — the full inventory is a
// few hundred wide rows and mounting them all at once is a noticeable stall.
const BATCH_SIZE = 40;

const STATUS_STYLES: Record<string, string> = {
  Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Amended: "bg-amber-50 text-amber-700 border-amber-200",
  Update: "bg-blue-50 text-blue-700 border-blue-200",
  Revoked: "bg-gray-100 text-gray-500 border-gray-200",
};

const COLUMNS = [
  "Status",
  "ID",
  "Type",
  "Applicability",
  "Date",
  "Title",
  "Category",
  "Code",
  "Revokes",
  "Amended By",
  "Replaced By",
];

function uniqueValues(pick: (entry: RegInventoryEntry) => string) {
  return Array.from(new Set(regInventory.map(pick).filter(Boolean))).sort();
}

/** Reference lists run up to seven entries — show two, reveal the rest on demand. */
function RefList({ items }: { items: string[] }) {
  const [expanded, setExpanded] = useState(false);

  if (items.length === 0) {
    return <span className="text-gray-300">—</span>;
  }

  const visible = expanded ? items : items.slice(0, 2);

  return (
    <div className="space-y-1">
      {visible.map((item, i) => (
        <p key={i} className="text-xs text-gray-600 leading-snug">
          {item}
        </p>
      ))}
      {items.length > 2 && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="text-xs font-semibold text-[#355189] hover:underline"
        >
          {expanded ? "Show less" : `+${items.length - 2} more`}
        </button>
      )}
    </div>
  );
}

/**
 * The regulation ID doubles as the row's link, following the workbook's legend:
 * orange when the regulation already lives on RegMaps (internal navigation),
 * blue when it only exists as an official OJK document (external tab).
 */
function RegLink({ entry }: { entry: RegInventoryEntry }) {
  if (entry.linkType === "regmaps") {
    return (
      <Link
        href={entry.link}
        className="font-semibold text-[#F48C25] hover:underline"
      >
        {entry.id}
      </Link>
    );
  }

  if (entry.linkType === "ojk") {
    return (
      <a
        href={entry.link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-start gap-1 font-semibold text-[#355189] hover:underline"
      >
        {entry.id}
        <ExternalLink className="w-3 h-3 mt-0.5 shrink-0" />
      </a>
    );
  }

  return <span className="font-semibold text-[#14213D]">{entry.id}</span>;
}

export default function RegInventoryTable() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [applicability, setApplicability] = useState("");
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const statuses = useMemo(() => uniqueValues((e) => e.status), []);
  const types = useMemo(() => uniqueValues((e) => e.type), []);
  const applicabilities = useMemo(() => uniqueValues((e) => e.applicability), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return regInventory.filter((entry) => {
      if (status && entry.status !== status) return false;
      if (type && entry.type !== type) return false;
      if (applicability && entry.applicability !== applicability) return false;
      if (!q) return true;
      return (
        entry.id.toLowerCase().includes(q) ||
        entry.title.toLowerCase().includes(q) ||
        entry.code.toLowerCase().includes(q) ||
        entry.category.toLowerCase().includes(q)
      );
    });
  }, [query, status, type, applicability]);

  // Any filter change restarts the batching from the top of the new result set.
  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [query, status, type, applicability]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  useEffect(() => {
    if (!hasMore) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((c) => c + BATCH_SIZE);
        }
      },
      { rootMargin: "400px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore]);

  const hasFilters = Boolean(query || status || type || applicability);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by number, title, code or category..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E1E7EF] bg-white text-sm focus:ring-2 focus:ring-[#355189] focus:border-transparent outline-none transition-all"
          />
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-3 py-2 rounded-xl border border-[#E1E7EF] bg-white text-sm text-[#14213D] outline-none focus:ring-2 focus:ring-[#355189]"
        >
          <option value="">All statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="px-3 py-2 rounded-xl border border-[#E1E7EF] bg-white text-sm text-[#14213D] outline-none focus:ring-2 focus:ring-[#355189]"
        >
          <option value="">All types</option>
          {types.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <select
          value={applicability}
          onChange={(e) => setApplicability(e.target.value)}
          className="px-3 py-2 rounded-xl border border-[#E1E7EF] bg-white text-sm text-[#14213D] outline-none focus:ring-2 focus:ring-[#355189]"
        >
          <option value="">All banks</option>
          {applicabilities.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>

        {hasFilters && (
          <button
            onClick={() => {
              setQuery("");
              setStatus("");
              setType("");
              setApplicability("");
            }}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-[#E1E7EF] bg-white text-sm text-gray-500 hover:text-[#14213D] transition-colors"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>

      {/* Legend + count */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500">
        <div className="flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F48C25]" />
            Available on RegMaps
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#355189]" />
            Official OJK document
          </span>
        </div>
        <span>
          Showing {visible.length} of {filtered.length} regulations
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#E1E7EF] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1400px] border-collapse text-sm">
            <thead className="sticky top-0 z-10 bg-[#14213D] text-white">
              <tr>
                {COLUMNS.map((column) => (
                  <th
                    key={column}
                    className="px-4 py-3 text-left font-semibold whitespace-nowrap"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr>
                  <td
                    colSpan={COLUMNS.length}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    No regulations match these filters.
                  </td>
                </tr>
              ) : (
                visible.map((entry, i) => (
                  <tr
                    key={`${entry.id}-${i}`}
                    className="border-t border-[#E1E7EF] hover:bg-gray-50/70 transition-colors align-top"
                  >
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full border text-xs font-semibold whitespace-nowrap ${
                          STATUS_STYLES[entry.status] ??
                          "bg-gray-100 text-gray-600 border-gray-200"
                        }`}
                      >
                        {entry.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 min-w-[150px]">
                      <RegLink entry={entry} />
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {entry.type}
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {entry.applicability}
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {entry.date}
                    </td>
                    <td className="px-4 py-3 text-[#14213D] min-w-[320px]">
                      {entry.title}
                    </td>
                    <td className="px-4 py-3 text-gray-600 min-w-[160px]">
                      {entry.category || <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {entry.code ? (
                        <span className="font-semibold text-[#355189]">
                          {entry.code}
                        </span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 min-w-[260px]">
                      <RefList items={entry.revokes} />
                    </td>
                    <td className="px-4 py-3 min-w-[220px]">
                      <RefList items={entry.amendedBy} />
                    </td>
                    <td className="px-4 py-3 min-w-[220px]">
                      <RefList items={entry.replacedBy} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {hasMore && (
          <div
            ref={sentinelRef}
            className="flex items-center justify-center py-4 text-sm text-gray-400 border-t border-[#E1E7EF]"
          >
            Loading more regulations...
          </div>
        )}
      </div>
    </div>
  );
}
