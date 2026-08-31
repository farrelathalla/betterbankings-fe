"use client";

import { motion } from "framer-motion";
import {
  Chip,
  Connector,
  FooterBand,
  GroupLabel,
  NodeCard,
  Panel,
  inView,
  rise,
  stagger,
} from "./Panel";

/* ------------------------------------------------------------------ */
/*  02  Why an analytical layer is needed                              */
/* ------------------------------------------------------------------ */

const OJK_FRAMEWORK = [
  {
    label: "Formal ILAAP process",
    meta: "proportionate to size, characteristics and complexity",
  },
  {
    label: "Linked reports",
    meta: "SPM, Funding Profile, intraday and significant-currency LCR",
  },
  {
    label: "Supervisory use",
    meta: "results inform liquidity-risk profile, bank soundness and LSREP",
  },
  {
    label: "Bank judgement",
    meta: "methodology, scenarios, assumptions and conservatism remain bank-owned",
  },
];

const BANKS_MUST_BUILD = [
  {
    label: "One analytical chain",
    meta: "reconcile SPM, funding data, assumptions and scenario results",
  },
  {
    label: "Binding-stress explanation",
    meta: "show when liquidity turns, the low point and the main drivers",
  },
  {
    label: "Executable liquidity",
    meta: "test eligibility, encumbrance, haircuts, settlement and routes",
  },
  {
    label: "Decision-ready outputs",
    meta: "translate results into dashboards, report exhibits and clear conclusions",
  },
];

export function WhyNowFigure() {
  return (
    <Panel
      title="Why an analytical layer is needed"
      subtitle="The regulatory framework is clear on the ILAAP obligation, while methodology and integration remain bank-specific."
    >
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={inView}
        className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6"
      >
        <div className="min-w-0 rounded-xl border border-[#B9CFE8] bg-[#F6FAFE] p-5">
          <GroupLabel tone="blue">OJK framework</GroupLabel>
          <div className="space-y-3">
            {OJK_FRAMEWORK.map((item, i) => (
              <NodeCard
                key={item.label}
                tone="blue"
                index={i + 1}
                label={item.label}
                meta={item.meta}
              />
            ))}
          </div>
        </div>

        <div className="min-w-0 rounded-xl border border-[#F3C89A] bg-[#FFFBF6] p-5">
          <GroupLabel tone="orange">What banks must build</GroupLabel>
          <div className="space-y-3">
            {BANKS_MUST_BUILD.map((item, i) => (
              <NodeCard
                key={item.label}
                tone="orange"
                index={i + 1}
                label={item.label}
                meta={item.meta}
              />
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={inView}
        className="mt-6"
      >
        <FooterBand>A repeatable source-to-decision workflow.</FooterBand>
      </motion.div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/*  03  One ILAAP story from connected data and analytics              */
/* ------------------------------------------------------------------ */

const EVIDENCE_INPUTS = [
  {
    tone: "blue" as const,
    label: "SPM overlay analytics",
    meta: "daily path • low point • survival • CBC • monetisation",
  },
  {
    tone: "orange" as const,
    label: "Funding Rollover Analytics",
    meta: "maturing funds • validation • destination tenor • new money • concentration",
  },
  {
    tone: "green" as const,
    label: "CBC / HQLA and SFT",
    meta: "eligibility • haircuts • settlement • mobilisation",
  },
  {
    tone: "navy" as const,
    label: "Bank assumptions and actions",
    meta: "Bobot • scenarios • constraints • recovery capacity",
  },
];

const SUBMISSION_SECTIONS = [
  {
    label: "Executive conclusion",
    meta: "liquidity adequacy and key qualifications",
  },
  {
    label: "Risk appetite and scenarios",
    meta: "LCR anchor • Bank 1 • Bank 2 • Bank 3",
  },
  {
    label: "Stress results and drivers",
    meta: "when vulnerability emerges and why",
  },
  {
    label: "Funding profile and market access",
    meta: "rollover, concentration and strategy",
  },
  {
    label: "CBC and monetisation",
    meta: "what is eligible, executable and timely",
  },
  {
    label: "Recovery actions and residual risk",
    meta: "separate action layer • timing • remaining gap",
  },
];

/** The analytics hub the inputs converge on. */
function AnalyticsHub() {
  return (
    <motion.div
      variants={rise}
      className="flex flex-col items-center justify-center gap-3 py-2"
    >
      <div className="relative flex h-28 w-28 items-center justify-center">
        <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#F48C25] to-[#e07d19] rotate-6" />
        <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#1B2B4B] to-[#355189]" />
        <span className="relative text-center text-[11px] font-bold uppercase leading-tight tracking-wide text-white">
          SPM
          <br />
          ILAAP
          <br />
          <span className="text-[#F9B269]">Analytics</span>
        </span>
      </div>
    </motion.div>
  );
}

export function ArchitectureFigure() {
  return (
    <Panel
      title="One ILAAP story from connected data and analytics"
      subtitle="SPM, funding data, analytical outputs and bank judgement converge in the bank-owned submission."
    >
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={inView}
        className="grid grid-cols-1 items-center gap-5 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-6"
      >
        <div className="min-w-0 space-y-3">
          {EVIDENCE_INPUTS.map((item) => (
            <NodeCard key={item.label} {...item} />
          ))}
        </div>

        <div className="flex flex-col items-center gap-2">
          <Connector className="w-full lg:w-16" />
          <AnalyticsHub />
          <Connector className="w-full lg:w-16" />
        </div>

        <div className="min-w-0 rounded-xl border border-[#1B2B4B]/25 bg-[#F7F9FC] p-5">
          <span className="mb-4 inline-block rounded-full bg-[#14213D] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
            Bank-owned ILAAP submission
          </span>
          <div className="space-y-2.5">
            {SUBMISSION_SECTIONS.map((s, i) => (
              <motion.div
                key={s.label}
                variants={rise}
                className="flex min-w-0 gap-3"
              >
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#F48C25]/15 text-[10px] font-bold text-[#9A5A12]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <p className="text-[13px] font-bold leading-snug text-[#14213D]">
                    {s.label}
                  </p>
                  <p className="text-[12px] leading-relaxed text-gray-600">
                    {s.meta}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={inView}
        className="mt-6"
      >
        <FooterBand tone="soft">
          BetterBankings supports analytics, assurance, report exhibits and
          drafting. Final judgement and approval remain with the bank.
        </FooterBand>
      </motion.div>
    </Panel>
  );
}

/* Re-exported so figure files share one import surface. */
export { Chip };
