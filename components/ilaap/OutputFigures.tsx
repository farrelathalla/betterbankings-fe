"use client";

import { motion } from "framer-motion";
import {
  Chip,
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
/*  07  Decision cockpit                                               */
/* ------------------------------------------------------------------ */

const HORIZONS = ["7d", "14d", "30d", "60d", "90d", "180d", "365d"];

/** Synthetic guide-case series, read off the asset kit's own chart. */
const BANK2 = [179.6, 148.1, 32.9, 40.0, 39.5, 65.5, 108.5];
const BANK3 = [91.3, 8.2, -169.1, -128.3, -145.7, -159.3, -145.7];

const PLOT = { left: 56, right: 620, top: 24, bottom: 268, zero: 146 };
const STEP = (PLOT.right - PLOT.left) / (HORIZONS.length - 1);
const xAt = (i: number) => PLOT.left + STEP * i;
const yAt = (v: number) => PLOT.zero - v * 0.61;
const toPoints = (series: number[]) =>
  series.map((v, i) => `${xAt(i)},${yAt(v)}`).join(" ");

/** Bank 3 crosses zero between the 14d and 30d readings. */
const BREACH_X = xAt(1) + STEP * 0.287;

function LiquidityPathChart() {
  return (
    <div className="min-w-0 rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
      <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="text-[13px] font-bold text-[#14213D]">
          Primary liquidity path by horizon
        </p>
        <div className="flex items-center gap-3 text-[11px] font-medium">
          <span className="flex items-center gap-1.5 text-[#1F6144]">
            <span className="h-2 w-2 rounded-full bg-[#2F7D59]" />
            Bank 2
          </span>
          <span className="flex items-center gap-1.5 text-[#8E2F2F]">
            <span className="h-2 w-2 rounded-full bg-[#B84040]" />
            Bank 3
          </span>
        </div>
      </div>
      <p className="mb-3 text-[11px] text-gray-400">
        IDR trillion; selected horizons
      </p>

      <svg
        viewBox="0 0 640 300"
        role="img"
        aria-label="Line chart of the synthetic guide case. Skenario Bank 2 stays positive across every horizon, while Skenario Bank 3 crosses zero around day 15 and reaches minus 169.1 trillion at day 30."
        className="h-auto w-full"
      >
        {/* Horizontal gridlines and value axis */}
        {[200, 100, 0, -100, -200].map((v) => (
          <g key={v}>
            <line
              x1={PLOT.left}
              x2={PLOT.right}
              y1={yAt(v)}
              y2={yAt(v)}
              stroke={v === 0 ? "#94a3b8" : "#e5e7eb"}
              strokeWidth={v === 0 ? 1.5 : 1}
            />
            <text
              x={PLOT.left - 10}
              y={yAt(v) + 4}
              textAnchor="end"
              className="fill-gray-400 text-[11px]"
            >
              {v}
            </text>
          </g>
        ))}

        {/* Day-15 breach marker */}
        <line
          x1={BREACH_X}
          x2={BREACH_X}
          y1={PLOT.top}
          y2={PLOT.bottom}
          stroke="#F48C25"
          strokeWidth="1.5"
          strokeDasharray="5 4"
        />
        <rect
          x={BREACH_X - 26}
          y={PLOT.top - 4}
          width="52"
          height="20"
          rx="10"
          fill="#F48C25"
        />
        <text
          x={BREACH_X}
          y={PLOT.top + 10}
          textAnchor="middle"
          className="fill-white text-[11px] font-bold"
        >
          Day 15
        </text>

        {/* Series */}
        {[
          { pts: toPoints(BANK2), color: "#2F7D59", data: BANK2 },
          { pts: toPoints(BANK3), color: "#B84040", data: BANK3 },
        ].map((s) => (
          <g key={s.color}>
            <motion.polyline
              points={s.pts}
              fill="none"
              stroke={s.color}
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={inView}
              transition={{ duration: 1.1, ease: "easeInOut" }}
            />
            {s.data.map((v, i) => (
              <motion.circle
                key={i}
                cx={xAt(i)}
                cy={yAt(v)}
                r="4"
                fill="#fff"
                stroke={s.color}
                strokeWidth="2.5"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={inView}
                transition={{ duration: 0.3, delay: 0.6 + i * 0.06 }}
              />
            ))}
          </g>
        ))}

        {/* Horizon axis */}
        {HORIZONS.map((h, i) => (
          <text
            key={h}
            x={xAt(i)}
            y={PLOT.bottom + 22}
            textAnchor="middle"
            className="fill-gray-400 text-[11px]"
          >
            {h}
          </text>
        ))}
      </svg>
    </div>
  );
}

const COCKPIT_TILES: { tone: Tone; label: string; value: string }[] = [
  { tone: "red", label: "Bank 3 first breach", value: "Day 15" },
  { tone: "red", label: "Day-30 final NLP", value: "-169.1T" },
  { tone: "green", label: "Remaining recognised CBC", value: "180.5T" },
  { tone: "orange", label: "Need-based monetisation", value: "80.1T" },
  { tone: "blue", label: "Recognised action capacity", value: "60.0T" },
  { tone: "orange", label: "Residual action shortfall", value: "119.1T" },
];

export function CockpitFigure() {
  return (
    <Panel
      title="One cockpit connects scenario choice, capacity and residual need"
      subtitle="Synthetic guide case: Bank 2 uses severe intensity; Bank 3 uses extreme intensity. Not a bank assessment."
      note="The 80.1T monetisation amount is a planning recommendation, not a separate scenario engine. Remaining CBC is capacity, not automatic cash."
    >
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={inView}
        className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]"
      >
        <motion.div variants={rise} className="min-w-0">
          <LiquidityPathChart />
        </motion.div>

        <div className="min-w-0 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {COCKPIT_TILES.map((t) => {
              const tone = TONES[t.tone];
              return (
                <motion.div
                  key={t.label}
                  variants={rise}
                  className={`min-w-0 rounded-xl border ${tone.border} ${tone.surface} p-3.5`}
                >
                  <p className="text-[11px] leading-snug text-gray-600">
                    {t.label}
                  </p>
                  <p
                    className={`mt-1 text-lg font-bold tabular-nums ${tone.heading}`}
                  >
                    {t.value}
                  </p>
                </motion.div>
              );
            })}
          </div>
          <motion.div
            variants={rise}
            className="rounded-xl bg-[#14213D] px-4 py-4 text-center"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#F9B269]">
              Management prompt
            </p>
            <p className="mt-1.5 text-[13px] font-semibold leading-relaxed text-white">
              When does stress bind, what is executable, and what remains after
              actions?
            </p>
          </motion.div>
        </div>
      </motion.div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/*  08  Analytics become a clear ILAAP narrative                       */
/* ------------------------------------------------------------------ */

const NARRATIVE_COLUMNS = [
  "Analytics signal",
  "Management interpretation",
  "Narrative direction",
  "Supporting input / action",
];

const NARRATIVE_ROWS = [
  [
    "Skenario Bank 3 first breach: Day 15",
    "Acute short-horizon vulnerability",
    "Explain when the position turns negative, the main drivers and trigger response.",
    "Scenario definition • driver bridge • risk appetite • CFP trigger",
  ],
  [
    "Rollover concentration in short tenors",
    "Dependency on rapid renewal and market confidence",
    "Explain funding sustainability, observed behaviour and planned tenor diversification.",
    "Funding plan • limits • WAM • concentration • market-access assumptions",
  ],
  [
    "Gross CBC exceeds timely executable CBC",
    "Not all reported liquidity can be mobilised in time",
    "Explain eligibility, encumbrance, haircuts, settlement routes and remaining buffer after use.",
    "Asset register • operational readiness • settlement tests",
  ],
  [
    "Actions cover only part of residual need",
    "Execution readiness matters more than headline capacity",
    "Explain which actions are recognised, when they settle and what risk remains.",
    "Named owners • approval • timeline • residual remediation",
  ],
];

export function NarrativeFigure() {
  return (
    <Panel
      title="Analytics become a clear ILAAP narrative - not disconnected charts"
      subtitle="BetterBankings helps the bank translate signals into interpretation, narrative direction and supporting actions."
    >
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={inView}
        className="space-y-3"
      >
        {/* Column headers only make sense once the rows sit side by side. */}
        <div className="hidden gap-3 xl:grid xl:grid-cols-4">
          {NARRATIVE_COLUMNS.map((c) => (
            <p
              key={c}
              className="px-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#355189]/70"
            >
              {c}
            </p>
          ))}
        </div>

        {NARRATIVE_ROWS.map((row) => (
          <motion.div
            key={row[0]}
            variants={rise}
            className="grid grid-cols-1 gap-3 rounded-xl border border-gray-200 bg-[#fcfaf9] p-4 sm:grid-cols-2 xl:grid-cols-4 xl:items-start xl:border-transparent xl:bg-transparent xl:p-0"
          >
            {row.map((cell, i) => (
              <div
                key={i}
                className={`min-w-0 xl:h-full xl:rounded-xl xl:border xl:p-4 ${
                  i === 0
                    ? "xl:border-[#EBB9B9] xl:bg-[#FBEDED]"
                    : i === 3
                      ? "xl:border-[#B9CFE8] xl:bg-[#EAF1FA]"
                      : "xl:border-gray-200 xl:bg-white"
                }`}
              >
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#355189]/60 xl:hidden">
                  {NARRATIVE_COLUMNS[i]}
                </p>
                <p
                  className={`text-[12.5px] leading-relaxed ${
                    i === 0
                      ? "font-bold text-[#8E2F2F]"
                      : i === 1
                        ? "font-semibold text-[#14213D]"
                        : "text-gray-600"
                  }`}
                >
                  {cell}
                </p>
              </div>
            ))}
          </motion.div>
        ))}

        <FooterBand>
          SPM analytics + Funding Rollover assurance + bank judgement = a clearer
          submission narrative
        </FooterBand>
      </motion.div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/*  09  Funding Rollover Analytics                                     */
/* ------------------------------------------------------------------ */

const ROLLOVER_DESTINATIONS: { tone: Tone; label: string }[] = [
  { tone: "green", label: "Rolled longer" },
  { tone: "blue", label: "Rolled same tenor" },
  { tone: "orange", label: "Rolled shorter" },
  { tone: "orange", label: "Moves to overnight" },
  { tone: "navy", label: "New money" },
  { tone: "red", label: "External exit" },
];

const ROLLOVER_METRICS = [
  "WAM",
  "Cliff days",
  "New money",
  "Concentration",
  "Seasonality",
];

const ADDS_TO_ILAAP = [
  "Validated funding profile and vulnerability by segment and tenor",
  "Rollover direction, weighted maturity and cliff-risk explanation",
  "New-money dependence and market-access assumptions",
  "Calibration input for stress scenarios and contingency actions",
  "Mapping, reconciliation and reporting consistency for SPM and Funding Rollover",
];

export function FundingRolloverFigure() {
  return (
    <Panel
      title="Funding Rollover Analytics and assurance test whether the funding profile is durable"
      subtitle="It validates reporting and connects funding behaviour, tenor, new money and concentration to ILAAP."
    >
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={inView}
        className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6"
      >
        {/* Where maturing funding goes */}
        <motion.div
          variants={rise}
          className="min-w-0 rounded-xl border border-gray-200 bg-[#fcfaf9] p-5"
        >
          <div className="mb-4 rounded-xl bg-[#14213D] px-4 py-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#F9B269]">
              Maturing funding
            </p>
            <p className="text-[13px] font-bold text-white">
              Where does it go next?
            </p>
          </div>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {ROLLOVER_DESTINATIONS.map((d) => {
              const t = TONES[d.tone];
              return (
                <motion.div
                  key={d.label}
                  variants={rise}
                  className={`flex min-w-0 items-center gap-2.5 rounded-lg border ${t.border} ${t.surface} px-3 py-2.5`}
                >
                  <span
                    className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${t.marker}`}
                  />
                  <span
                    className={`text-[12.5px] font-semibold ${t.heading}`}
                  >
                    {d.label}
                  </span>
                </motion.div>
              );
            })}
          </div>
          <div className="mt-4">
            <GroupLabel>Diagnostics</GroupLabel>
            <div className="flex flex-wrap gap-2">
              {ROLLOVER_METRICS.map((m) => (
                <Chip key={m}>{m}</Chip>
              ))}
            </div>
          </div>
        </motion.div>

        {/* What it contributes */}
        <motion.div
          variants={rise}
          className="min-w-0 rounded-xl border border-[#B9CFE8] bg-[#F6FAFE] p-5"
        >
          <GroupLabel tone="blue">What it adds to ILAAP</GroupLabel>
          <div className="space-y-3">
            {ADDS_TO_ILAAP.map((item, i) => (
              <NodeCard
                key={item}
                tone="blue"
                index={i + 1}
                label={item}
                className="bg-white"
              />
            ))}
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={inView}
        className="mt-6"
      >
        <FooterBand tone="soft">
          Validated funding data strengthens analysis
        </FooterBand>
      </motion.div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/*  11  Analytics-to-submission service journey                        */
/* ------------------------------------------------------------------ */

const SERVICE_JOURNEY: {
  tone: Tone;
  label: string;
  body: string;
  output: string;
}[] = [
  {
    tone: "blue",
    label: "Interpret & design",
    body: "Translate OJK requirements into a proportionate analytical and reporting approach.",
    output: "Design note",
  },
  {
    tone: "orange",
    label: "Validate & configure",
    body: "Check SPM and Funding Rollover data; map CBC/HQLA, SFT and scenario sources.",
    output: "Validated inputs",
  },
  {
    tone: "red",
    label: "Explore & compare",
    body: "Run Bank 2 primary and optional Bank 3 scenarios; test timing, liquidity and residual need.",
    output: "Analytics pack",
  },
  {
    tone: "green",
    label: "Report & draft",
    body: "Prepare copy-ready exhibits and support the bank-owned ILAAP narrative.",
    output: "Report pack",
  },
  {
    tone: "navy",
    label: "Review & refresh",
    body: "Support management interpretation, updates and repeatable future runs.",
    output: "Review cycle",
  },
];

export function ServiceJourneyFigure() {
  return (
    <Panel
      title="BetterBankings supports the full analytics-to-submission journey"
      subtitle="From reporting assurance and configuration to scenario analytics, report exhibits and a bank-owned submission."
    >
      <motion.ol
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={inView}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
      >
        {SERVICE_JOURNEY.map((s, i) => {
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
              <p className="mt-1.5 flex-1 text-[12px] leading-relaxed text-gray-600">
                {s.body}
              </p>
              <span
                className={`mt-4 inline-block self-start rounded-full ${t.marker} px-3 py-1 text-[11px] font-semibold text-white`}
              >
                {s.output}
              </span>
            </motion.li>
          );
        })}
      </motion.ol>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={inView}
        className="mt-6"
      >
        <FooterBand>
          BetterBankings supports the process; the bank retains judgement,
          ownership, approval and regulatory accountability.
        </FooterBand>
      </motion.div>
    </Panel>
  );
}
