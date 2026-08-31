"use client";

import { motion } from "framer-motion";

/**
 * Shared primitives for the ILAAP figures.
 *
 * These replace the flat SVG exports from the asset kit. The exported
 * artwork positions its text at fixed coordinates, so longer labels ran
 * outside their boxes and panel titles clipped at the frame edge. Rebuilding
 * the figures in markup lets the text wrap, keeps it selectable and
 * searchable, and matches the kit's own instruction to keep content as
 * accessible HTML rather than baking it into images.
 */

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const rise = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

export const inView = { once: true, margin: "-60px" } as const;

export type Tone = "blue" | "orange" | "green" | "red" | "navy";

/** Palette lifted from the asset kit so the rebuilt figures stay on-brand. */
export const TONES: Record<
  Tone,
  { surface: string; border: string; heading: string; marker: string }
> = {
  blue: {
    surface: "bg-[#EAF1FA]",
    border: "border-[#B9CFE8]",
    heading: "text-[#1B4B82]",
    marker: "bg-[#355189]",
  },
  orange: {
    surface: "bg-[#FFF4E7]",
    border: "border-[#F3C89A]",
    heading: "text-[#9A5A12]",
    marker: "bg-[#F48C25]",
  },
  green: {
    surface: "bg-[#E9F4EE]",
    border: "border-[#A8D5BE]",
    heading: "text-[#1F6144]",
    marker: "bg-[#2F7D59]",
  },
  red: {
    surface: "bg-[#FBEDED]",
    border: "border-[#EBB9B9]",
    heading: "text-[#8E2F2F]",
    marker: "bg-[#B84040]",
  },
  navy: {
    surface: "bg-[#EEF2F8]",
    border: "border-[#C3CFE0]",
    heading: "text-[#14213D]",
    marker: "bg-[#14213D]",
  },
};

/** The outer frame every figure sits in. */
export function Panel({
  title,
  subtitle,
  children,
  note,
  className = "",
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  note?: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.figure
      variants={rise}
      initial="hidden"
      whileInView="show"
      viewport={inView}
      className={`min-w-0 overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(20,33,61,0.04),0_12px_32px_-16px_rgba(20,33,61,0.14)] sm:p-7 lg:p-8 ${className}`}
    >
      <header className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#355189]/70">
          BetterBankings <span className="text-[#F48C25]">|</span> Prudential
          Technology
        </p>
        <h3 className="mt-2 text-lg font-bold leading-snug tracking-tight text-[#14213D] sm:text-xl lg:text-[1.4rem]">
          {title}
        </h3>
        {subtitle ? (
          <p className="mt-1.5 max-w-3xl text-[13px] leading-relaxed text-gray-500">
            {subtitle}
          </p>
        ) : null}
      </header>

      {children}

      {note ? (
        <figcaption className="mt-6 border-t border-gray-100 pt-4 text-[12px] leading-relaxed text-gray-400">
          {note}
        </figcaption>
      ) : null}
    </motion.figure>
  );
}

/** A tinted box: heading plus optional supporting meta line. */
export function NodeCard({
  tone = "navy",
  label,
  meta,
  index,
  className = "",
}: {
  tone?: Tone;
  label: string;
  meta?: string;
  index?: string | number;
  className?: string;
}) {
  const t = TONES[tone];
  return (
    <motion.div
      variants={rise}
      className={`flex min-w-0 gap-3 rounded-xl border ${t.border} ${t.surface} p-4 ${className}`}
    >
      {index !== undefined ? (
        <span
          className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full ${t.marker} text-[11px] font-bold text-white`}
        >
          {index}
        </span>
      ) : null}
      <div className="min-w-0">
        <p className={`text-[13px] font-bold leading-snug ${t.heading}`}>
          {label}
        </p>
        {meta ? (
          <p className="mt-1 text-[12px] leading-relaxed text-gray-600">
            {meta}
          </p>
        ) : null}
      </div>
    </motion.div>
  );
}

/** Small pill used for the capability and attribute strips. */
export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <motion.span
      variants={rise}
      className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-medium text-[#355189]"
    >
      {children}
    </motion.span>
  );
}

/** The dark summary band that closes several of the figures. */
export function FooterBand({
  children,
  tone = "navy",
}: {
  children: React.ReactNode;
  tone?: "navy" | "soft";
}) {
  if (tone === "soft") {
    return (
      <motion.div
        variants={rise}
        className="rounded-xl border border-[#F3C89A] bg-[#FFF4E7] px-5 py-3 text-center text-[12px] font-semibold leading-relaxed text-[#9A5A12]"
      >
        {children}
      </motion.div>
    );
  }
  return (
    <motion.div
      variants={rise}
      className="rounded-xl bg-[#14213D] px-5 py-3.5 text-center text-[12px] font-semibold leading-relaxed text-white"
    >
      {children}
    </motion.div>
  );
}

/**
 * Directional connector. Points right on wide screens where the figures lay
 * out in columns, and down once they stack.
 */
export function Connector({ className = "" }: { className?: string }) {
  return (
    <motion.div
      variants={rise}
      aria-hidden="true"
      className={`flex items-center justify-center ${className}`}
    >
      <span className="hidden h-px w-full flex-1 bg-gradient-to-r from-[#355189]/30 to-[#355189]/60 lg:block" />
      <svg
        viewBox="0 0 12 12"
        className="h-3 w-3 flex-shrink-0 rotate-90 fill-[#355189] lg:rotate-0"
      >
        <path d="M2 1l7 5-7 5z" />
      </svg>
      <span className="h-6 w-px bg-gradient-to-b from-[#355189]/30 to-[#355189]/60 lg:hidden" />
    </motion.div>
  );
}

/** Section label inside a figure. */
export function GroupLabel({
  children,
  tone = "navy",
}: {
  children: React.ReactNode;
  tone?: Tone;
}) {
  return (
    <p
      className={`mb-3 text-[10px] font-bold uppercase tracking-[0.14em] ${TONES[tone].heading}`}
    >
      {children}
    </p>
  );
}
