"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, List } from "lucide-react";
import { regMapsList } from "@/lib/regmapsList";

const PAGE_SIZE = 20;

export default function RegMapsList() {
  const [open, setOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const total = regMapsList.length;
  const visible = regMapsList.slice(0, visibleCount);
  const remaining = total - visibleCount;

  return (
    <div className="bg-white rounded-2xl border border-[#E1E7EF] overflow-hidden">
      {/* Header / toggle */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <List className="w-5 h-5 text-[#355189]" />
          <span className="font-bold text-[#14213D]">Available RegMaps</span>
          <span className="text-xs font-semibold text-[#355189] bg-[#355189]/10 px-2 py-0.5 rounded-full">
            {total}
          </span>
        </div>
        {open ? (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {open && (
        <div className="border-t border-[#E1E7EF]">
          {/* List */}
          <ul className="max-h-[28rem] overflow-y-auto divide-y divide-gray-100">
            {visible.map((entry, i) => (
              <li
                key={`${entry.id}-${i}`}
                className="px-6 py-3 hover:bg-gray-50 transition-colors"
              >
                <p className="text-sm font-semibold text-[#14213D] break-words">
                  {entry.id}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500">
                  <span className="font-medium text-[#F48C25] uppercase tracking-wide">
                    {entry.type}
                  </span>
                  <span className="text-gray-300">·</span>
                  <span>{entry.year}</span>
                  <span className="text-gray-300">·</span>
                  <span>{entry.date}</span>
                </div>
              </li>
            ))}
          </ul>

          {/* Show more / less controls */}
          <div className="flex items-center gap-2 px-6 py-3 border-t border-[#E1E7EF] bg-gray-50">
            {remaining > 0 && (
              <button
                onClick={() =>
                  setVisibleCount((c) => Math.min(c + PAGE_SIZE, total))
                }
                className="flex-1 py-2 rounded-lg border border-[#E1E7EF] bg-white text-xs font-semibold text-[#355189] hover:bg-[#355189] hover:text-white transition-all"
              >
                Show more ({remaining} remaining)
              </button>
            )}
            {visibleCount > PAGE_SIZE && (
              <button
                onClick={() => setVisibleCount(PAGE_SIZE)}
                className="flex-1 py-2 rounded-lg border border-[#E1E7EF] bg-white text-xs font-semibold text-gray-500 hover:bg-gray-100 transition-all"
              >
                Show less
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
