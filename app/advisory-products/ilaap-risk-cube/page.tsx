"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import {
  ArchitectureFigure,
  WhyNowFigure,
} from "@/components/ilaap/ContextFigures";
import {
  CapabilityModulesFigure,
  RiskCubeFigure,
  ScenarioRoutingFigure,
  UserJourneyFigure,
} from "@/components/ilaap/FrameworkFigures";
import {
  CockpitFigure,
  FundingRolloverFigure,
  NarrativeFigure,
  ServiceJourneyFigure,
} from "@/components/ilaap/OutputFigures";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Info,
  LineChart,
  Lock,
  Mail,
  Repeat,
  ShieldCheck,
  Waves,
  X,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Motion system                                                      */
/*  One easing curve and one travel distance across the whole page so  */
/*  every reveal reads as the same gesture rather than a grab bag.     */
/* ------------------------------------------------------------------ */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const rise = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const inView = { once: true, margin: "-80px" } as const;

/* ------------------------------------------------------------------ */
/*  Content                                                            */
/*  Copy is taken from the approved BetterBankings ILAAP asset kit.    */
/*  The qualifications attached to the market-experience statement,    */
/*  the decision cockpit and the submission boundary are mandatory     */
/*  and must not be edited out.                                        */
/* ------------------------------------------------------------------ */

const ASSETS = "/ilaap";

const SECTIONS = [
  { id: "why", label: "Why now" },
  { id: "architecture", label: "Architecture" },
  { id: "framework", label: "Framework" },
  { id: "scenarios", label: "Scenarios" },
  { id: "workflow", label: "Workflow" },
  { id: "capabilities", label: "Capabilities" },
  { id: "cockpit", label: "Cockpit" },
  { id: "funding", label: "Funding" },
  { id: "engagement", label: "Engagement" },
];

const SCENARIO_LANES = [
  {
    code: "Skenario Dasar",
    role: "LCR anchor",
    body: "The regulatory benchmark every other lane is read against.",
  },
  {
    code: "Skenario Bank 1",
    role: "Official SPM view",
    body: "The bank's reported position, left untouched by analytical exploration.",
  },
  {
    code: "Skenario Bank 2",
    role: "Primary analytical lane",
    body: "Independently selects Manual Bobot, a Scenario Library profile or a Scenario Studio profile.",
    primary: true,
  },
  {
    code: "Skenario Bank 3",
    role: "Optional comparator",
    body: "An optional comparison lane with a source choice of its own.",
  },
];

const CAPABILITIES = [
  {
    icon: ClipboardCheck,
    title: "Reporting assurance",
    body: "Validate SPM and Funding Rollover mapping, completeness and reconciliation.",
  },
  {
    icon: LineChart,
    title: "Scenario analytics",
    body: "Choose sources by lane, apply tenorisation and calculate daily liquidity, low point and survival.",
  },
  {
    icon: Waves,
    title: "Executable liquidity",
    body: "Connect CBC and HQLA usability, SFT, monetisation, Pillar 2 and residual need.",
  },
  {
    icon: ShieldCheck,
    title: "Reporting outputs",
    body: "Use copy-ready charts, tables and structured narrative inputs.",
  },
];

const COCKPIT_READINGS = [
  {
    label: "Skenario Bank 2",
    body: "Primary analytical lane with a positive illustrative Day-30 liquidity position.",
  },
  {
    label: "Skenario Bank 3",
    body: "Optional comparison lane with a Day-15 first breach in the synthetic guide case.",
  },
  {
    label: "Separate recovery layer",
    body: "Recognised action capacity is compared after core results and does not rewrite them.",
  },
];

const NARRATIVE_POINTS = [
  "Explain when liquidity turns negative and which drivers bind.",
  "Connect rollover concentration to funding sustainability and market access.",
  "Distinguish gross CBC from timely executable liquidity.",
  "Describe residual need after separately assessed management actions.",
];

const FUNDING_POINTS = [
  "Validate source mapping, completeness and reconciliation.",
  "Measure rollover direction, weighted maturity and cliff days.",
  "Identify new-money dependence and concentration.",
  "Use the profile to inform scenario assumptions and funding strategy.",
];

const SERVICE_STAGES = [
  {
    label: "Interpret",
    body: "Interpret the requirement and design the analytical approach.",
  },
  {
    label: "Validate",
    body: "Validate and configure SPM, Funding Rollover, CBC, HQLA and SFT inputs.",
  },
  {
    label: "Analyse",
    body: "Assign scenario sources and compare the analytical lanes.",
  },
  {
    label: "Report",
    body: "Prepare report exhibits and support the bank-owned narrative.",
  },
  { label: "Review", body: "Review, refresh and repeat the process." },
];

/* ------------------------------------------------------------------ */
/*  Building blocks                                                    */
/* ------------------------------------------------------------------ */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14213D]/5 border border-[#14213D]/10 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#355189]">
      <span className="w-1.5 h-1.5 rounded-full bg-[#F48C25]" />
      {children}
    </span>
  );
}

function SectionHeading({
  eyebrow,
  title,
  accent,
  lede,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  lede?: string;
  align?: "center" | "left";
}) {
  const centered = align === "center";
  return (
    <motion.div
      variants={rise}
      initial="hidden"
      whileInView="show"
      viewport={inView}
      className={centered ? "text-center max-w-3xl mx-auto" : "max-w-2xl"}
    >
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-5 text-[1.75rem] leading-[1.2] md:text-4xl lg:text-[2.75rem] font-bold text-[#14213D] tracking-tight text-balance">
        {title}
        {accent ? <span className="text-[#F48C25]"> {accent}</span> : null}
      </h2>
      {lede ? (
        <p className="mt-4 text-[15px] md:text-base text-gray-600 leading-relaxed">
          {lede}
        </p>
      ) : null}
    </motion.div>
  );
}

function Lightbox({
  item,
  onClose,
}: {
  item: { file: string; alt: string } | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!item) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [item, onClose]);

  return (
    <AnimatePresence>
      {item ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={item.alt}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0B1223]/90 p-4 md:p-10 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ duration: 0.32, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[1400px] max-h-full overflow-auto rounded-2xl bg-white p-2 md:p-4 shadow-2xl"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${ASSETS}/${item.file}`}
              alt={item.alt}
              className="w-full h-auto block"
            />
          </motion.div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close diagram"
            className="absolute top-4 right-4 md:top-6 md:right-6 rounded-full bg-white/10 p-2.5 text-white/80 transition-colors hover:bg-white/20 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F48C25]"
          >
            <X className="w-5 h-5" />
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/** Sticky in-page nav with scroll spy. Desktop only: the mobile viewport
 *  already carries the sidebar's floating menu button at top left. */
function SectionNav({ activeId }: { activeId: string }) {
  const go = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  return (
    <div className="sticky top-0 z-30 hidden md:block border-y border-gray-200/70 bg-[#fcfaf9]/85 backdrop-blur-md">
      <nav
        aria-label="On this page"
        className="max-w-6xl mx-auto flex items-center gap-1 overflow-x-auto px-6 py-2.5"
      >
        {SECTIONS.map((s) => {
          const isActive = s.id === activeId;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => go(s.id)}
              aria-current={isActive ? "true" : undefined}
              className={`relative shrink-0 rounded-lg px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                isActive
                  ? "text-[#14213D]"
                  : "text-gray-500 hover:text-[#14213D]"
              }`}
            >
              {isActive ? (
                <motion.span
                  layoutId="ilaap-nav-pill"
                  transition={{ duration: 0.35, ease: EASE }}
                  className="absolute inset-0 rounded-lg bg-white shadow-sm ring-1 ring-[#14213D]/8"
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
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function IlaapRiskCubePage() {
  const [lightbox, setLightbox] = useState<{
    file: string;
    alt: string;
  } | null>(null);
  const [activeId, setActiveId] = useState<string>(SECTIONS[0].id);
  const reduceMotion = useReducedMotion();

  const closeLightbox = useCallback(() => setLightbox(null), []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-88px 0px -55% 0px", threshold: 0 },
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

  return (
    <div className="min-h-screen bg-[#fcfaf9] flex flex-col lg:flex-row overflow-x-hidden">
      <Sidebar />

      <main className="w-full flex-1 lg:ml-[280px] relative">
        <Lightbox item={lightbox} onClose={closeLightbox} />

        {/* ---------------------------------------------------------- */}
        {/* Hero                                                        */}
        {/* ---------------------------------------------------------- */}
        <section className="relative overflow-hidden bg-[#0E1A31] px-6 pt-24 pb-20 lg:pt-28 lg:pb-24">
          {/* Ambient light, kept low contrast so the diagram stays the
              brightest thing in the frame. */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-1/3 right-[-10%] h-[620px] w-[620px] rounded-full bg-[#F48C25]/10 blur-[130px]" />
            <div className="absolute bottom-[-40%] left-[-15%] h-[640px] w-[640px] rounded-full bg-[#355189]/30 blur-[130px]" />
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.045) 1px, transparent 1px)",
                backgroundSize: "64px 64px",
                maskImage:
                  "radial-gradient(ellipse 80% 60% at 50% 0%, #000 40%, transparent 100%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 80% 60% at 50% 0%, #000 40%, transparent 100%)",
              }}
            />
          </div>

          {/* min-w-0 on every grid child: the diagrams carry a 1400px
              intrinsic width, which would otherwise set the track's
              min-content size and blow the layout out sideways. */}
          <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-[1.02fr_1fr] lg:gap-14">
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="order-2 min-w-0 lg:order-1"
            >
              <motion.div variants={rise}>
                <Link
                  href="/advisory-products"
                  className="group inline-flex items-center gap-1.5 text-[13px] font-medium text-white/45 transition-colors hover:text-white/80"
                >
                  <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
                  Software Products
                </Link>
              </motion.div>

              <motion.div variants={rise} className="mt-6">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#F9B269] backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#F48C25]" />
                  ILAAP Overlay Analytics
                </span>
              </motion.div>

              <motion.h1
                variants={rise}
                className="mt-6 text-[2.5rem] leading-[1.05] md:text-6xl lg:text-[4rem] font-bold tracking-tight text-white"
              >
                ILAAP{" "}
                <span className="bg-gradient-to-r from-[#F48C25] to-[#F9B269] bg-clip-text text-transparent">
                  Risk Cube
                </span>
              </motion.h1>

              <motion.p
                variants={rise}
                className="mt-6 max-w-xl text-[15px] md:text-lg leading-relaxed text-white/70"
              >
                Turn OJK ILAAP reporting data into liquidity insight, foresight
                and action. A transparent analytical and assurance layer linking
                SPM, scenario choice, funding profile, executable liquidity and
                report-ready outputs.
              </motion.p>

              <motion.div
                variants={rise}
                className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
              >
                <a
                  href="mailto:info@betterbankings.com?subject=ILAAP%20Risk%20Cube%20diagnostic"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#F48C25] px-6 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-[#F48C25]/20 transition-all duration-300 hover:bg-[#e07d19] hover:shadow-xl hover:shadow-[#F48C25]/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F48C25] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E1A31]"
                >
                  Discuss a diagnostic
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
                <button
                  type="button"
                  onClick={() => scrollTo("framework")}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-6 py-3.5 text-[15px] font-semibold text-white/85 backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:bg-white/[0.09] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                >
                  Explore the framework
                  <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>

              {/* Mandatory qualification on the market-experience claim. */}
              <motion.div
                variants={rise}
                className="mt-10 border-l-2 border-[#F48C25]/40 pl-4"
              >
                <p className="text-[13px] font-medium text-white/70">
                  Used and adapted in engagements with several leading banks.
                </p>
                <p className="mt-1 text-[12px] leading-relaxed text-white/40">
                  Client identities are confidential; engagement scope and
                  adoption stage vary by bank.
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
              className="order-1 min-w-0 lg:order-2"
            >
              <button
                type="button"
                onClick={() =>
                  setLightbox({
                    file: "01_Hero_ILAAP_Risk_Cube.svg",
                    alt: "ILAAP Risk Cube connecting SPM data, Funding Rollover, CBC and HQLA with scenario choice, time, survival, low point and a separate management-action planning overlay.",
                  })
                }
                aria-label="Enlarge the ILAAP Risk Cube diagram"
                className="group relative block w-full cursor-zoom-in rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F48C25] focus-visible:ring-offset-4 focus-visible:ring-offset-[#0E1A31]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${ASSETS}/01_Hero_ILAAP_Risk_Cube.svg`}
                  alt="ILAAP Risk Cube connecting SPM data, Funding Rollover, CBC and HQLA with scenario choice, time, survival, low point and a separate management-action planning overlay."
                  width={1400}
                  height={1000}
                  className="w-full h-auto drop-shadow-[0_24px_60px_rgba(0,0,0,0.45)] transition-transform duration-700 group-hover:scale-[1.015]"
                />
              </button>
            </motion.div>
          </div>
        </section>

        <SectionNav activeId={activeId} />

        {/* ---------------------------------------------------------- */}
        {/* Why now                                                     */}
        {/* ---------------------------------------------------------- */}
        <section id="why" className="scroll-mt-20 px-6 py-20 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              eyebrow="Why now"
              title="Guidance exists; implementation remains"
              accent="bank-specific and judgement-intensive"
              lede="OJK establishes the ILAAP framework and reporting components. Banks still need a repeatable way to validate data, compare scenarios, test executable liquidity and explain the resulting adequacy position."
            />
            <div className="mt-12">
              <WhyNowFigure />
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/* Architecture                                                */}
        {/* ---------------------------------------------------------- */}
        <section
          id="architecture"
          className="scroll-mt-20 border-y border-gray-200/70 bg-white px-6 py-20 lg:py-24"
        >
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              eyebrow="Architecture"
              title="One ILAAP story from"
              accent="connected data and analytics"
              lede="SPM, Funding Rollover Analytics, CBC and HQLA, SFT, bank assumptions and management judgement converge in a bank-owned adequacy conclusion."
            />
            <div className="mt-12">
              <ArchitectureFigure />
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/* Framework: the three dimensions                             */}
        {/* ---------------------------------------------------------- */}
        <section id="framework" className="scroll-mt-20 px-6 py-20 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              eyebrow="Framework"
              title="See liquidity adequacy in"
              accent="three dimensions"
              lede="Time shows when stress binds. Scenario makes the benchmark and bank-specific views explicit. Response distinguishes core liquidity capacity from separately assessed management actions."
            />

            <div className="mt-12">
              <RiskCubeFigure />
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/* Scenarios and source routing                                */}
        {/* ---------------------------------------------------------- */}
        <section
          id="scenarios"
          className="scroll-mt-20 border-y border-gray-200/70 bg-white px-6 py-20 lg:py-24"
        >
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              eyebrow="Scenarios"
              title="Scenario exploration without disturbing the"
              accent="official SPM view"
              lede="Skenario Bank 2 is the primary analytical lane and Skenario Bank 3 is an optional comparison. Each can independently use Manual Bobot, a named Scenario Library profile or a Scenario Studio profile."
            />

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={inView}
              className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
              {SCENARIO_LANES.map((lane, i) => (
                <motion.div
                  key={lane.code}
                  variants={rise}
                  className={`group relative flex flex-col rounded-2xl border p-6 transition-all duration-400 hover:-translate-y-1 ${
                    lane.primary
                      ? "border-[#F48C25]/35 bg-[#FFF8F1] shadow-md shadow-[#F48C25]/10"
                      : "border-gray-200/80 bg-[#fcfaf9] hover:border-[#355189]/25 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[11px] font-bold uppercase tracking-[0.12em] ${
                        lane.primary ? "text-[#F48C25]" : "text-[#355189]/70"
                      }`}
                    >
                      {lane.role}
                    </span>
                    <span
                      className={`font-mono text-[11px] tabular-nums ${
                        lane.primary ? "text-[#F48C25]/60" : "text-gray-300"
                      }`}
                    >
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="mt-3 text-[15px] font-bold text-[#14213D]">
                    {lane.code}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-gray-600">
                    {lane.body}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            <div className="mt-10">
              <ScenarioRoutingFigure />
            </div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={inView}
              className="mt-8 grid gap-4 md:grid-cols-2"
            >
              <motion.div
                variants={rise}
                className="flex gap-4 rounded-2xl border border-gray-200/80 bg-[#fcfaf9] p-6"
              >
                <Repeat className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#355189]" />
                <p className="text-sm leading-relaxed text-gray-600">
                  <span className="font-semibold text-[#14213D]">
                    Scenario routing.
                  </span>{" "}
                  Dasar is the LCR anchor; Bank 1 is the official SPM view; Bank
                  2 and Bank 3 independently select Manual Bobot, a Scenario
                  Library profile or a Scenario Studio profile. Valid choices
                  feed downstream analytics without writing back to Bobot.
                </p>
              </motion.div>
              <motion.div
                variants={rise}
                className="flex gap-4 rounded-2xl border border-gray-200/80 bg-[#fcfaf9] p-6"
              >
                <Lock className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#355189]" />
                <p className="text-sm leading-relaxed text-gray-600">
                  <span className="font-semibold text-[#14213D]">
                    Safe exploration.
                  </span>{" "}
                  A valid assignment recalculates the selected lane; an invalid
                  assignment suppresses only that lane. Scenario exploration does
                  not write back to Bobot.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/* Workflow                                                    */}
        {/* ---------------------------------------------------------- */}
        <section id="workflow" className="scroll-mt-20 px-6 py-20 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              eyebrow="Workflow"
              title="A guided user experience for"
              accent="bank teams"
              lede="The workflow moves from SPM population and data validation through source selection, analysis, interpretation and copy-ready reporting."
            />

            <div className="mt-12">
              <UserJourneyFigure />
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/* Capabilities                                                */}
        {/* ---------------------------------------------------------- */}
        <section
          id="capabilities"
          className="scroll-mt-20 border-y border-gray-200/70 bg-white px-6 py-20 lg:py-24"
        >
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              eyebrow="Capabilities"
              title="Core"
              accent="capabilities"
              lede="SPM and Funding Rollover assurance, per-slot scenario choice, daily survival, executable CBC, SFT, monetisation, Pillar 2 and report-ready exhibits form one transparent analytical chain."
            />

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={inView}
              className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
            >
              {CAPABILITIES.map((cap) => {
                const Icon = cap.icon;
                return (
                  <motion.div
                    key={cap.title}
                    variants={rise}
                    className="group rounded-2xl border border-gray-200/80 bg-[#fcfaf9] p-6 transition-all duration-400 hover:-translate-y-1.5 hover:border-[#F48C25]/30 hover:bg-white hover:shadow-lg hover:shadow-[#14213D]/[0.07]"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#14213D] transition-colors duration-400 group-hover:bg-[#F48C25]">
                      <Icon className="h-5 w-5 text-[#F48C25] transition-colors duration-400 group-hover:text-white" />
                    </div>
                    <h3 className="mt-5 text-[15px] font-bold text-[#14213D]">
                      {cap.title}
                    </h3>
                    <p className="mt-2 text-[13px] leading-relaxed text-gray-600">
                      {cap.body}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>

            <div className="mt-10">
              <CapabilityModulesFigure />
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/* Decision cockpit                                            */}
        {/* ---------------------------------------------------------- */}
        <section id="cockpit" className="scroll-mt-20 px-6 py-20 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              eyebrow="Decision cockpit"
              title="A decision cockpit, not"
              accent="another static report"
              lede="The illustrative guide case connects the Bank 2 and Bank 3 horizon profiles, first breach, final liquidity, remaining CBC, monetisation planning and separately assessed recovery capacity."
            />

            <div className="mt-12">
              <CockpitFigure />
            </div>

            {/* Mandatory synthetic-data caveat. The asset kit requires it
                to sit directly beside the cockpit visual. */}
            <motion.div
              variants={rise}
              initial="hidden"
              whileInView="show"
              viewport={inView}
              className="mt-5 flex gap-3.5 rounded-xl border border-[#F48C25]/25 bg-[#FFF8F1] px-5 py-4"
            >
              <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#F48C25]" />
              <p className="text-[13px] leading-relaxed text-[#7A5320]">
                All figures are synthetic guide-case amounts. Need-based
                monetisation is a planning recommendation, not a separate
                scenario engine; remaining CBC is capacity, not automatic cash.
              </p>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={inView}
              className="mt-8 grid gap-5 md:grid-cols-3"
            >
              {COCKPIT_READINGS.map((r) => (
                <motion.div
                  key={r.label}
                  variants={rise}
                  className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm transition-all duration-400 hover:-translate-y-1 hover:shadow-md"
                >
                  <h3 className="text-[15px] font-bold text-[#14213D]">
                    {r.label}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-gray-600">
                    {r.body}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* Analytics to narrative */}
            <div className="mt-20">
              <SectionHeading
                eyebrow="Narrative"
                title="From analytics to a clear"
                accent="ILAAP narrative"
                lede="BetterBankings helps the bank connect analytical signals with management interpretation, report exhibits, narrative direction and supporting actions."
              />
              <motion.ul
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={inView}
                className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-2"
              >
                {NARRATIVE_POINTS.map((p) => (
                  <motion.li
                    key={p}
                    variants={rise}
                    className="flex items-start gap-3 rounded-xl border border-gray-200/80 bg-white px-5 py-4"
                  >
                    <CheckCircle2 className="mt-0.5 h-[18px] w-[18px] flex-shrink-0 text-[#F48C25]" />
                    <span className="text-sm leading-relaxed text-gray-700">
                      {p}
                    </span>
                  </motion.li>
                ))}
              </motion.ul>
              <div className="mt-10">
                <NarrativeFigure />
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/* Funding rollover                                            */}
        {/* ---------------------------------------------------------- */}
        <section
          id="funding"
          className="scroll-mt-20 border-y border-gray-200/70 bg-white px-6 py-20 lg:py-24"
        >
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              eyebrow="Funding profile"
              title="Funding Rollover Analytics strengthens both"
              accent="assurance and insight"
              lede="The analysis validates mapping and reconciliation, distinguishes retained funding, tenor migration, new money and external exit, and converts the results into a funding vulnerability and strategy narrative."
            />

            <div className="mt-12">
              <FundingRolloverFigure />
            </div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={inView}
              className="mt-8 grid gap-4 sm:grid-cols-2"
            >
              {FUNDING_POINTS.map((p) => (
                <motion.div
                  key={p}
                  variants={rise}
                  className="flex items-start gap-3 rounded-xl border border-gray-200/80 bg-[#fcfaf9] px-5 py-4"
                >
                  <CheckCircle2 className="mt-0.5 h-[18px] w-[18px] flex-shrink-0 text-[#F48C25]" />
                  <span className="text-sm leading-relaxed text-gray-700">
                    {p}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/* Market experience. The qualification below is mandatory and  */}
        {/* must stay attached to the claim.                             */}
        {/* ---------------------------------------------------------- */}
        <section className="px-6 py-16 lg:py-20">
          <motion.div
            variants={rise}
            initial="hidden"
            whileInView="show"
            viewport={inView}
            className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl bg-[#0E1A31] px-8 py-10 lg:px-14 lg:py-12"
          >
            <div className="pointer-events-none absolute -right-[8%] -top-[60%] h-[420px] w-[420px] rounded-full bg-[#F48C25]/10 blur-[110px]" />
            <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#F9B269]">
                  Market experience
                </span>
                <p className="mt-4 text-xl font-semibold leading-snug text-white lg:text-2xl">
                  Used and adapted in engagements with several leading banks.
                </p>
                <p className="mt-3 text-[13px] leading-relaxed text-white/45">
                  Client identities are confidential; engagement scope and
                  adoption stage vary by bank.
                </p>
              </div>
              <div className="grid shrink-0 grid-cols-2 gap-x-8 gap-y-4 lg:gap-x-10">
                {[
                  "OJK architecture",
                  "Reporting assurance",
                  "Transparent analytics",
                  "Bank-ready outputs",
                ].map((t) => (
                  <div key={t} className="flex items-center gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#F48C25]" />
                    <span className="text-[13px] font-medium text-white/75">
                      {t}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/* Engagement model                                            */}
        {/* ---------------------------------------------------------- */}
        <section
          id="engagement"
          className="scroll-mt-20 border-y border-gray-200/70 bg-white px-6 py-20 lg:py-24"
        >
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              eyebrow="Engagement"
              title="Support across the full"
              accent="analytics-to-submission journey"
              lede="BetterBankings supports interpretation, reporting assurance, configuration, analysis, report exhibits, drafting and recurring review. The bank retains judgement, approval and regulatory accountability."
            />

            <div className="mt-12">
              <ServiceJourneyFigure />
            </div>

            {/* Stepper. The connector is drawn behind the markers so the
                five stages read as one continuous journey. */}
            <motion.ol
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={inView}
              className="relative mt-12 grid gap-8 md:grid-cols-5 md:gap-4"
            >
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={inView}
                transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
                className="absolute left-0 right-0 top-5 hidden h-px origin-left bg-gradient-to-r from-[#F48C25]/50 via-[#355189]/30 to-transparent md:block"
              />
              {SERVICE_STAGES.map((s, i) => (
                <motion.li key={s.label} variants={rise} className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#F48C25]/30 bg-[#fcfaf9] text-[13px] font-bold text-[#F48C25]">
                    0{i + 1}
                  </div>
                  <h3 className="mt-4 text-[15px] font-bold text-[#14213D]">
                    {s.label}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-gray-600">
                    {s.body}
                  </p>
                </motion.li>
              ))}
            </motion.ol>

            {/* Bank-ownership boundary. Required alongside the journey. */}
            <motion.div
              variants={rise}
              initial="hidden"
              whileInView="show"
              viewport={inView}
              className="mt-12 flex gap-4 rounded-2xl border border-[#355189]/20 bg-[#F5F8FC] p-6 lg:p-7"
            >
              <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#355189]" />
              <div>
                <h3 className="text-[15px] font-bold text-[#14213D]">
                  Where the boundary sits
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  BetterBankings supports SPM and Funding Rollover reporting
                  assurance, scenario analytics, report exhibits and drafting of
                  the bank-owned ILAAP submission using bank-approved inputs.
                  Final ownership, judgement and approval remain with the bank.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/* Closing call to action                                      */}
        {/* ---------------------------------------------------------- */}
        <section className="px-6 py-20 lg:py-28">
          <motion.div
            variants={rise}
            initial="hidden"
            whileInView="show"
            viewport={inView}
            className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-[#14213D] via-[#1B2B4B] to-[#355189] px-8 py-14 text-center lg:px-16 lg:py-20"
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-1/2 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#F48C25]/12 blur-[120px]" />
            </div>
            <div className="relative z-10 mx-auto max-w-2xl">
              <h2 className="text-[1.75rem] font-bold leading-tight tracking-tight text-white md:text-4xl">
                Use existing OJK ILAAP data{" "}
                <span className="text-[#F9B269]">more effectively</span>
              </h2>
              <p className="mt-5 text-[15px] leading-relaxed text-white/70 md:text-base">
                Start with a focused diagnostic, validate the current reporting,
                and build a transparent source-to-decision workflow.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href="mailto:info@betterbankings.com?subject=ILAAP%20Risk%20Cube%20diagnostic"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#F48C25] px-7 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-black/20 transition-all duration-300 hover:bg-[#e07d19] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F48C25] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1B2B4B]"
                >
                  <Mail className="h-4 w-4" />
                  info@betterbankings.com
                </a>
                <Link
                  href="/ilaap-workshop"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-7 py-3.5 text-[15px] font-semibold text-white/85 transition-all duration-300 hover:border-white/30 hover:bg-white/10"
                >
                  ILAAP Workshop
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
              <p className="mx-auto mt-10 max-w-xl border-t border-white/10 pt-6 text-[12px] leading-relaxed text-white/40">
                The ILAAP Risk Cube is an analytics and management-support layer,
                not an OJK submission system or compliance certification. The
                bank retains calibration, judgement, approval and regulatory
                accountability.
              </p>
            </div>
          </motion.div>
        </section>

        <Footer />
      </main>
    </div>
  );
}
