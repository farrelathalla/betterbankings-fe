"use client";

import {
  useCallback,
  useEffect,
  useId,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { motion, MotionConfig, type Variants } from "framer-motion";
import { ArrowLeft, ArrowRight, Download, Mail } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";

/**
 * Building blocks for the single-product landing pages under
 * /advisory-products (ILAAP Risk Cube, Counterparty Capital Calculator).
 *
 * Layout, copy order and palette follow the client's approved one-page
 * product sheets: navy hero, short editorial sections, a definition table,
 * a numbered work grid and a navy about/contact band. Everything here is
 * shared so the product pages stay short and visually identical.
 */

/* ------------------------------------------------------------------ */
/*  Motion                                                             */
/* ------------------------------------------------------------------ */

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const rise: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const drawRule: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.8, ease: EASE } },
};

export const inView = { once: true, margin: "-70px" } as const;

/** Content column: 1120px of content, with the sheet's side gutters. */
export const WRAP = "mx-auto w-full max-w-[1184px] px-5 sm:px-8";

export const mailto = (subject: string) =>
  `mailto:info@betterbankings.com?subject=${encodeURIComponent(subject)}`;

/* ------------------------------------------------------------------ */
/*  Shell                                                              */
/* ------------------------------------------------------------------ */

export function ProductLandingShell({ children }: { children: ReactNode }) {
  return (
    // reducedMotion="user" turns every transform animation below into a
    // plain fade for visitors who ask their OS for less motion.
    <MotionConfig reducedMotion="user">
      {/* overflow-x-clip rather than hidden: hidden would make this div a
          scroll container and stop the section nav from sticking. */}
      <div className="flex min-h-screen flex-col overflow-x-clip bg-white text-[#263d50] lg:flex-row">
        <Sidebar />
        <main className="relative w-full min-w-0 flex-1 lg:ml-[280px]">
          {children}
          <Footer />
        </main>
      </div>
    </MotionConfig>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */

export function ProductHero({
  eyebrow,
  title,
  subtitle,
  lead,
  actions,
  art,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  lead: string;
  actions: ReactNode;
  art: ReactNode;
}) {
  return (
    <section
      aria-labelledby="product-title"
      className="relative isolate overflow-hidden bg-[#102d49] text-white"
    >
      <HeroBackdrop />

      <div
        className={cn(
          WRAP,
          "relative grid grid-cols-1 items-center gap-10 pt-20 pb-12 lg:grid-cols-[minmax(0,1.65fr)_minmax(250px,1fr)] lg:gap-14 lg:pt-14 lg:pb-16",
        )}
      >
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="min-w-0"
        >
          <motion.div variants={rise}>
            <Link
              href="/advisory-products"
              className="group inline-flex items-center gap-1.5 text-[13px] font-medium text-white/50 transition-colors hover:text-white/85"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
              Software Products
            </Link>
          </motion.div>

          <motion.p
            variants={rise}
            className="mt-7 text-xs font-bold uppercase tracking-[0.12em] text-[#b8dff1]"
          >
            {eyebrow}
          </motion.p>

          <motion.h1
            id="product-title"
            variants={rise}
            className="mt-4 text-[clamp(2.25rem,4.6vw,3.7rem)] font-bold leading-[1.06] tracking-[-0.035em]"
          >
            {title}
          </motion.h1>

          <motion.p
            variants={rise}
            className="mt-5 max-w-[660px] text-xl leading-snug text-[#b8dff1] sm:text-[23px]"
          >
            {subtitle}
          </motion.p>

          <motion.p
            variants={rise}
            className="mt-5 max-w-[720px] text-base leading-relaxed text-white/90 sm:text-[17px]"
          >
            {lead}
          </motion.p>

          <motion.div variants={rise} className="mt-8 flex flex-wrap gap-3">
            {actions}
          </motion.div>
        </motion.div>

        <div className="min-w-0">{art}</div>
      </div>
    </section>
  );
}

/** Low-contrast light and grid, so the hero reads as depth, not decoration. */
function HeroBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <motion.div
        className="absolute -top-1/3 right-[-12%] h-[560px] w-[560px] rounded-full bg-[#287aa7]/30 blur-[120px]"
        animate={{ x: [0, -30, 0], y: [0, 24, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-45%] left-[-12%] h-[520px] w-[520px] rounded-full bg-[#e9a261]/10 blur-[120px]"
        animate={{ x: [0, 36, 0], y: [0, -18, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse 75% 70% at 70% 30%, #000 30%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 75% 70% at 70% 30%, #000 30%, transparent 100%)",
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Buttons                                                            */
/* ------------------------------------------------------------------ */

const BUTTON =
  "group inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-5 py-3 text-center text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e9a261] focus-visible:ring-offset-2 focus-visible:ring-offset-[#102d49] max-[380px]:w-full";

export function PrimaryButton({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className={cn(
        BUTTON,
        "bg-[#e9a261] text-[#102d49] shadow-lg shadow-black/15 hover:bg-[#f2b779] hover:shadow-xl hover:shadow-[#e9a261]/20",
      )}
    >
      {children}
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
    </a>
  );
}

export function BrochureButton({
  href,
  fileName,
}: {
  href: string;
  fileName: string;
}) {
  return (
    <a
      href={href}
      download={fileName}
      className={cn(
        BUTTON,
        "border border-[#88adc6] text-white hover:border-[#b8dff1] hover:bg-[#1e4565]",
      )}
    >
      <Download className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
      Download brochure
    </a>
  );
}

/* ------------------------------------------------------------------ */
/*  Sticky in-page navigation                                          */
/* ------------------------------------------------------------------ */

export function SectionNav({
  items,
}: {
  items: { id: string; label: string }[];
}) {
  const [activeId, setActiveId] = useState(items[0]?.id);
  const pillId = useId();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -55% 0px", threshold: 0 },
    );
    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  const go = useCallback((id: string) => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }, []);

  return (
    <div className="sticky top-0 z-30 border-b border-[#e0e8ee] bg-white/85 backdrop-blur-md">
      {/* pl-16 below lg keeps clear of the sidebar's floating menu button. */}
      <nav
        aria-label="On this page"
        className="mx-auto flex w-full max-w-[1184px] items-center gap-1 overflow-x-auto py-2.5 pr-5 pl-16 [scrollbar-width:none] sm:pr-8 lg:px-8 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((s) => {
          const isActive = s.id === activeId;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => go(s.id)}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "relative shrink-0 rounded-md px-3.5 py-1.5 text-[13px] font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e9a261]",
                isActive
                  ? "text-[#102d49]"
                  : "text-[#556c7d] hover:text-[#102d49]",
              )}
            >
              {isActive ? (
                <motion.span
                  layoutId={pillId}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="absolute inset-0 rounded-md bg-[#eef5f9] ring-1 ring-[#cbdce7]"
                />
              ) : null}
              <span className="relative">{s.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sections                                                           */
/* ------------------------------------------------------------------ */

export function Section({
  id,
  tinted = false,
  children,
}: {
  id: string;
  tinted?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn(
        "scroll-mt-14 py-12 sm:py-16",
        tinted && "border-y border-[#e0e8ee] bg-[#f4f7f9]",
      )}
    >
      <div className={WRAP}>{children}</div>
    </section>
  );
}

export function Heading({
  id,
  eyebrow,
  children,
  className,
}: {
  id?: string;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={rise}
      initial="hidden"
      whileInView="show"
      viewport={inView}
      className={className}
    >
      {eyebrow ? (
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-[#556c7d]">
          {eyebrow}
        </p>
      ) : null}
      <h2
        id={id}
        className="text-[clamp(1.7rem,3vw,2.25rem)] font-bold leading-tight tracking-[-0.02em] text-[#102d49]"
      >
        {children}
      </h2>
    </motion.div>
  );
}

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={inView}
      transition={{ duration: 0.6, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Cards with an orange top rule (dimensions, calculations)           */
/* ------------------------------------------------------------------ */

export type RuleCardItem = {
  title: string;
  label?: string;
  body: string;
};

export function RuleCards({
  items,
  numbered = false,
}: {
  items: RuleCardItem[];
  numbered?: boolean;
}) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={inView}
      className="grid grid-cols-1 gap-7 md:grid-cols-3 md:gap-8"
    >
      {items.map((item, i) => (
        <motion.article
          key={item.title}
          variants={rise}
          className="group relative pt-5"
        >
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-[3px] bg-[#e0e8ee]"
          />
          <motion.span
            aria-hidden
            variants={drawRule}
            className="absolute inset-x-0 top-0 h-[3px] origin-left bg-[#e9a261]"
          />
          {numbered ? (
            <span className="mb-2.5 block text-xs font-bold tracking-[0.06em] text-[#287aa7]">
              {String(i + 1).padStart(2, "0")}
            </span>
          ) : null}
          <h3
            className={cn(
              "font-bold leading-snug text-[#102d49] transition-colors duration-300 group-hover:text-[#287aa7]",
              item.label ? "mb-1 text-[25px]" : "mb-3 text-lg",
            )}
          >
            {item.title}
          </h3>
          {item.label ? (
            <p className="mb-4 text-sm font-bold text-[#556c7d]">
              {item.label}
            </p>
          ) : null}
          <p className="leading-relaxed">{item.body}</p>
        </motion.article>
      ))}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Definition table (capabilities, coverage)                          */
/* ------------------------------------------------------------------ */

export function DefinitionTable({
  label,
  rows,
  onTint = false,
}: {
  label: string;
  rows: { term: string; detail: string }[];
  onTint?: boolean;
}) {
  return (
    <motion.table
      aria-label={label}
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={inView}
      className="w-full border-collapse overflow-hidden rounded-lg text-sm sm:text-base"
    >
      <tbody>
        {rows.map((row, i) => (
          <motion.tr
            key={row.term}
            variants={{
              hidden: { opacity: 0, x: -14 },
              show: {
                opacity: 1,
                x: 0,
                transition: { duration: 0.5, ease: EASE },
              },
            }}
            className={cn(
              "group transition-colors duration-300",
              i % 2 === 0
                ? onTint
                  ? "bg-[#e7eff5] hover:bg-[#dde9f1]"
                  : "bg-[#eef5f9] hover:bg-[#e4eff5]"
                : onTint
                  ? "bg-white hover:bg-[#f6f9fb]"
                  : "bg-[#f6f8fa] hover:bg-[#eef3f6]",
            )}
          >
            <th
              scope="row"
              className="w-[33%] border-l-[3px] border-transparent px-3.5 py-4 text-left align-top font-bold text-[#102d49] transition-colors duration-300 group-hover:border-[#e9a261] sm:w-[28%] sm:px-[22px] sm:py-[18px]"
            >
              {row.term}
            </th>
            <td className="px-3.5 py-4 text-left align-top sm:px-[22px] sm:py-[18px]">
              {row.detail}
            </td>
          </motion.tr>
        ))}
      </tbody>
    </motion.table>
  );
}

/* ------------------------------------------------------------------ */
/*  Numbered work grid (submission steps, outputs)                     */
/* ------------------------------------------------------------------ */

export function WorkGrid({
  items,
}: {
  items: { title: string; body: string }[];
}) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={inView}
      className="mt-9 grid grid-cols-1 gap-7 md:grid-cols-2 md:gap-x-12 md:gap-y-9"
    >
      {items.map((item, i) => (
        <motion.article key={item.title} variants={rise} className="group">
          <span className="mb-2.5 flex items-center gap-3 text-xs font-bold tracking-[0.06em] text-[#287aa7]">
            {String(i + 1).padStart(2, "0")}
            <span
              aria-hidden
              className="h-px w-8 bg-[#287aa7]/40 transition-all duration-500 group-hover:w-16 group-hover:bg-[#e9a261]"
            />
          </span>
          <h3 className="mb-3 text-lg font-bold leading-snug text-[#102d49]">
            {item.title}
          </h3>
          <p className="max-w-[500px] leading-relaxed">{item.body}</p>
        </motion.article>
      ))}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  About + contact band                                               */
/* ------------------------------------------------------------------ */

export function AboutContact({
  title,
  body,
  contactTitle,
  contactNote,
  subject,
}: {
  title: string;
  body: string;
  contactTitle: string;
  contactNote?: string;
  subject: string;
}) {
  const href = mailto(subject);
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="relative isolate scroll-mt-14 overflow-hidden bg-[#102d49] py-12 text-white sm:py-14"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -bottom-40 -z-10 h-[420px] w-[420px] rounded-full bg-[#287aa7]/25 blur-[110px]"
      />
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={inView}
        className={cn(
          WRAP,
          "grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-14",
        )}
      >
        <motion.div variants={rise}>
          <h2
            id="about-title"
            className="mb-5 text-[26px] font-bold leading-tight sm:text-[29px]"
          >
            {title}
          </h2>
          <p className="text-base leading-[1.7] text-white/90">{body}</p>
        </motion.div>

        <motion.div
          variants={rise}
          className="border-t border-[#547087] pt-7 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10"
        >
          <h3 className="mb-4 text-[25px] font-bold leading-snug">
            {contactTitle}
          </h3>
          {contactNote ? (
            <p className="mb-3 text-white/90">{contactNote}</p>
          ) : null}
          <a
            href={href}
            className="group inline-flex items-center gap-2 break-all text-[#b8dff1] underline-offset-4 hover:underline"
          >
            <Mail className="h-4 w-4 shrink-0" />
            info@betterbankings.com
          </a>
          <div className="mt-6 flex flex-wrap gap-3">
            <PrimaryButton href={href}>Arrange a discussion</PrimaryButton>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Framework references (sits just above the site footer)             */
/* ------------------------------------------------------------------ */

export function References({ children }: { children: ReactNode }) {
  return (
    <div className="border-b border-[#e0e8ee] bg-white py-6">
      <p
        className={cn(
          WRAP,
          "text-xs leading-relaxed text-[#556c7d] [&_a]:underline [&_a]:underline-offset-[3px] [&_a]:transition-colors [&_a:hover]:text-[#102d49]",
        )}
      >
        {children}
      </p>
    </div>
  );
}
