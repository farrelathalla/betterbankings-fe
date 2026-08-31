"use client";

import { motion } from "framer-motion";
import {
  Chip,
  Connector,
  FooterBand,
  GroupLabel,
  NodeCard,
  Panel,
  TONES,
  type Tone,
  inView,
  rise,
  stagger,
} from "./Panel";

/* ------------------------------------------------------------------ */
/*  04  ILAAP Risk Cube: three dimensions                              */
/* ------------------------------------------------------------------ */

/**
 * Isometric cube drawn from three quadrilaterals sharing a centre vertex.
 * Only the dimension names live on the faces; the explanations sit in
 * markup beside it, which is what kept overflowing in the exported art.
 */
function IsoCube() {
  const faces = [
    { points: "130,30 206,74 130,118 54,74", fill: "#F48C25" },
    { points: "54,74 130,118 130,206 54,162", fill: "#355189" },
    { points: "130,118 206,74 206,162 130,206", fill: "#1B2B4B" },
  ];

  return (
    <motion.svg
      variants={rise}
      viewBox="0 0 260 236"
      role="img"
      aria-label="Isometric cube whose three faces are the Scenario, Time and Response dimensions, meeting at the SPM ILAAP core."
      className="h-auto w-full max-w-[260px]"
    >
      {faces.map((f, i) => (
        <motion.polygon
          key={f.points}
          points={f.points}
          fill={f.fill}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={inView}
          transition={{ duration: 0.5, delay: 0.1 * i }}
        />
      ))}

      <text
        x="130"
        y="66"
        textAnchor="middle"
        className="fill-white text-[11px] font-bold tracking-[0.1em]"
      >
        SCENARIO
      </text>
      <text
        x="92"
        y="152"
        textAnchor="middle"
        className="fill-white text-[9px] font-bold"
      >
        TIME
      </text>
      <text
        x="167"
        y="152"
        textAnchor="middle"
        className="fill-white text-[9px] font-bold"
      >
        RESPONSE
      </text>

      <circle
        cx="130"
        cy="118"
        r="29"
        fill="#ffffff"
        stroke="#F48C25"
        strokeWidth="2.5"
      />
      <text
        x="130"
        y="114"
        textAnchor="middle"
        className="fill-[#14213D] text-[11px] font-bold"
      >
        SPM
      </text>
      <text
        x="130"
        y="127"
        textAnchor="middle"
        className="fill-[#F48C25] text-[11px] font-bold"
      >
        ILAAP
      </text>
    </motion.svg>
  );
}

const CUBE_DIMENSIONS: {
  tone: Tone;
  name: string;
  body: string;
}[] = [
  {
    tone: "blue",
    name: "Time",
    body: "Day 1-30 granularity, selected outer horizons and a 365-day lens reveal early breaches and later cliff risks.",
  },
  {
    tone: "orange",
    name: "Scenario",
    body: "Dasar is the LCR anchor. Bank 1 is the official SPM view; Bank 2 is the primary analytical lane and Bank 3 is the optional comparator.",
  },
  {
    tone: "green",
    name: "Response",
    body: "CBC and monetisation show core stress capacity. Recovery actions sit in a separate comparison layer.",
  },
];

const CUBE_CHIPS = [
  "Source data",
  "Per-slot sources",
  "SFT",
  "CBC / HQLA",
  "Pillar 2",
  "Funding Rollover",
  "Recovery actions",
];

export function RiskCubeFigure() {
  return (
    <Panel
      title="ILAAP Risk Cube: three dimensions of liquidity adequacy"
      subtitle="A reusable analytical frame for website, white paper and management discussion."
    >
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={inView}
        className="grid grid-cols-1 items-center gap-7 md:grid-cols-[auto_minmax(0,1fr)] md:gap-10"
      >
        <div className="flex justify-center">
          <IsoCube />
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-3">
          {CUBE_DIMENSIONS.map((d) => (
            <NodeCard key={d.name} tone={d.tone} label={d.name} meta={d.body} />
          ))}
        </div>
      </motion.div>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={inView}
        className="mt-6 flex flex-wrap gap-2"
      >
        {CUBE_CHIPS.map((c) => (
          <Chip key={c}>{c}</Chip>
        ))}
      </motion.div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/*  13  Scenario source routing                                        */
/* ------------------------------------------------------------------ */

const SOURCE_OPTIONS = [
  { tone: "navy" as const, label: "Manual Bobot", meta: "Bank-entered assumptions" },
  {
    tone: "orange" as const,
    label: "Scenario Library",
    meta: "Named reference profiles",
  },
  {
    tone: "green" as const,
    label: "Scenario Studio",
    meta: "Bespoke working profiles",
  },
];

const DOWNSTREAM = [
  "Tenorisation",
  "Daily path",
  "CBC",
  "SFT",
  "Monetisation",
  "Survival",
  "Pillar 2",
  "Report exhibits",
];

export function ScenarioRoutingFigure() {
  return (
    <Panel
      title="One anchor, one official scenario and two analytical lanes"
      subtitle="Scenario choice is explicit, independent by lane and protected from unintended Bobot writeback."
      note="Valid assignments recalculate the selected lane. Invalid assignments suppress only that lane; exploration never writes back to Bobot."
    >
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={inView}
        className="space-y-6"
      >
        {/* Fixed reference lanes */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <motion.div
            variants={rise}
            className="min-w-0 rounded-xl border border-[#B9CFE8] bg-[#EAF1FA] p-5"
          >
            <GroupLabel tone="blue">Reference anchor</GroupLabel>
            <p className="text-[15px] font-bold text-[#14213D]">
              Skenario Dasar (LCR)
            </p>
            <p className="mt-1 text-[12px] leading-relaxed text-gray-600">
              Benchmark for interpreting bank-specific stresses
            </p>
          </motion.div>
          <motion.div
            variants={rise}
            className="min-w-0 rounded-xl border border-[#F3C89A] bg-[#FFF4E7] p-5"
          >
            <GroupLabel tone="orange">Official SPM view</GroupLabel>
            <p className="text-[15px] font-bold text-[#14213D]">
              Skenario Bank 1
            </p>
            <p className="mt-1 text-[12px] leading-relaxed text-gray-600">
              Mandatory bank Bobot; unchanged during analytical exploration
            </p>
          </motion.div>
        </div>

        {/* Source options feeding the bridge, feeding the two lanes */}
        <div className="grid grid-cols-1 items-center gap-4 lg:grid-cols-[minmax(0,1.15fr)_auto_minmax(0,1fr)]">
          <motion.div
            variants={rise}
            className="min-w-0 rounded-xl border border-gray-200 bg-[#fcfaf9] p-5"
          >
            <GroupLabel>Analytical source options</GroupLabel>
            <p className="-mt-1.5 mb-4 text-[12px] text-gray-500">
              Chosen independently for Skenario Bank 2 and Skenario Bank 3
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {SOURCE_OPTIONS.map((o) => (
                <NodeCard
                  key={o.label}
                  tone={o.tone}
                  label={o.label}
                  meta={o.meta}
                  className="flex-col"
                />
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={rise}
            className="flex flex-col items-center gap-2 lg:flex-row lg:gap-3"
          >
            <Connector className="w-full lg:w-10" />
            <div className="rounded-xl bg-[#14213D] px-4 py-3.5 text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#F9B269]">
                Effective-source
              </p>
              <p className="text-[13px] font-bold text-white">Bridge</p>
              <p className="mt-1.5 text-[11px] leading-relaxed text-white/60">
                validates the profile
                <br />
                assigns it by slot
                <br />
                protects Bobot
              </p>
            </div>
            <Connector className="w-full lg:w-10" />
          </motion.div>

          <div className="min-w-0 space-y-3">
            <motion.div
              variants={rise}
              className="min-w-0 rounded-xl border border-[#B9CFE8] bg-[#EAF1FA] p-4"
            >
              <GroupLabel tone="blue">Skenario Bank 2</GroupLabel>
              <p className="text-[14px] font-bold text-[#14213D]">
                Primary analytical scenario
              </p>
              <p className="mt-1 text-[12px] text-gray-600">
                Default lane for advanced analysis
              </p>
            </motion.div>
            <motion.div
              variants={rise}
              className="min-w-0 rounded-xl border border-[#F3C89A] bg-[#FFF4E7] p-4"
            >
              <GroupLabel tone="orange">Skenario Bank 3</GroupLabel>
              <p className="text-[14px] font-bold text-[#14213D]">
                Optional comparison scenario
              </p>
              <p className="mt-1 text-[12px] text-gray-600">
                Independent source and calibration
              </p>
            </motion.div>
          </div>
        </div>

        {/* Downstream */}
        <motion.div
          variants={rise}
          className="rounded-xl border border-[#A8D5BE] bg-[#E9F4EE] p-5"
        >
          <GroupLabel tone="green">Downstream analytics</GroupLabel>
          <div className="flex flex-wrap gap-2">
            {DOWNSTREAM.map((d) => (
              <Chip key={d}>{d}</Chip>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/*  05  Guided user journey                                            */
/* ------------------------------------------------------------------ */

const JOURNEY_STEPS: { tone: Tone; label: string; meta: string }[] = [
  {
    tone: "blue",
    label: "Populate SPM",
    meta: "Input Bank • Bobot • Bank 1 official view",
  },
  {
    tone: "orange",
    label: "Validate & map",
    meta: "SPM • CBC/HQLA • SFT • funding rollover",
  },
  {
    tone: "green",
    label: "Choose sources",
    meta: "Manual Bobot • Library • Studio by scenario slot",
  },
  {
    tone: "red",
    label: "Run analytics",
    meta: "Bank 2 primary • Bank 3 comparison • daily path and survival",
  },
  {
    tone: "navy",
    label: "Interpret results",
    meta: "low point • survival • CBC • monetisation • residual need",
  },
  {
    tone: "orange",
    label: "Report & explain",
    meta: "copy-ready exhibits • narrative • official export",
  },
];

const JOURNEY_CHIPS = [
  "Familiar interface",
  "Clear inputs",
  "Guided navigation",
  "Copy-ready exhibits",
  "Traceable sources",
  "Repeatable cycle",
];

export function UserJourneyFigure() {
  return (
    <Panel
      title="A guided user journey - from SPM inputs to decision-ready outputs"
      subtitle="Designed for Risk, Treasury, Finance, ALCO secretariat, Internal Audit and senior management."
    >
      <motion.ol
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={inView}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
      >
        {JOURNEY_STEPS.map((s, i) => {
          const t = TONES[s.tone];
          return (
            <motion.li
              key={s.label}
              variants={rise}
              className={`flex min-w-0 flex-col rounded-xl border ${t.border} ${t.surface} p-4`}
            >
              <span
                className={`mb-3 flex h-7 w-7 items-center justify-center rounded-full ${t.marker} text-[12px] font-bold text-white`}
              >
                {i + 1}
              </span>
              <p className={`text-[14px] font-bold leading-snug ${t.heading}`}>
                {s.label}
              </p>
              <p className="mt-1.5 text-[12px] leading-relaxed text-gray-600">
                {s.meta}
              </p>
            </motion.li>
          );
        })}
      </motion.ol>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={inView}
        className="mt-6 space-y-4"
      >
        <motion.div
          variants={rise}
          className="rounded-xl bg-[#14213D] px-5 py-4 text-center"
        >
          <p className="text-[13px] font-bold text-white">
            Designed for bank teams, with technical detail available when needed
          </p>
          <p className="mt-1.5 text-[12px] leading-relaxed text-white/60">
            A familiar Excel interface keeps the workflow clear while preserving
            traceable inputs, source choice and analytical detail.
          </p>
        </motion.div>
        <div className="flex flex-wrap justify-center gap-2">
          {JOURNEY_CHIPS.map((c) => (
            <Chip key={c}>{c}</Chip>
          ))}
        </div>
      </motion.div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/*  06  Core capabilities                                              */
/* ------------------------------------------------------------------ */

const CAPABILITY_MODULES: { tone: Tone; label: string; meta: string }[] = [
  {
    tone: "blue",
    label: "SPM analytics & assurance",
    meta: "Preserves OJK structure while validating inputs, mapping and key totals.",
  },
  {
    tone: "orange",
    label: "Scenario sources & tenorisation",
    meta: "Compares Manual Bobot, Library or Studio profiles with timing re-allocation.",
  },
  {
    tone: "red",
    label: "Daily low point & survival",
    meta: "Identifies first breach, lowest liquidity point and horizon profile.",
  },
  {
    tone: "green",
    label: "CBC / HQLA usability",
    meta: "Separates gross stock from eligible, unencumbered and timely liquidity.",
  },
  {
    tone: "blue",
    label: "Repo / SFT & monetisation",
    meta: "Links cash, collateral, haircut, settlement and capacity without double count.",
  },
  {
    tone: "orange",
    label: "Funding Rollover analytics & assurance",
    meta: "Validates reporting and explains maturity, retention, new money and concentration.",
  },
  {
    tone: "red",
    label: "Pillar 2 & residual need",
    meta: "Connects additional liquidity needs to risk drivers and unresolved gaps.",
  },
  {
    tone: "green",
    label: "Report exhibits & narrative",
    meta: "Turns results into copy-ready charts, tables and structured ILAAP drafting.",
  },
];

export function CapabilityModulesFigure() {
  return (
    <Panel
      title="Core capabilities - from SPM inputs to a complete liquidity decision chain"
      subtitle="Each module answers a practical analytical, assurance or reporting question."
    >
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={inView}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {CAPABILITY_MODULES.map((m) => {
          const t = TONES[m.tone];
          return (
            <motion.div
              key={m.label}
              variants={rise}
              className={`min-w-0 rounded-xl border ${t.border} ${t.surface} p-4 transition-transform duration-300 hover:-translate-y-1`}
            >
              <span className={`mb-3 block h-2 w-2 rounded-full ${t.marker}`} />
              <p className={`text-[13px] font-bold leading-snug ${t.heading}`}>
                {m.label}
              </p>
              <p className="mt-2 text-[12px] leading-relaxed text-gray-600">
                {m.meta}
              </p>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={inView}
        className="mt-6"
      >
        <FooterBand>
          One source chain • per-slot scenario choice • transparent calculations
          • copy-ready outputs
        </FooterBand>
      </motion.div>
    </Panel>
  );
}
