"use client";

import { Fragment } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import {
  AboutContact,
  BrochureButton,
  DefinitionTable,
  EASE,
  Heading,
  PrimaryButton,
  ProductHero,
  ProductLandingShell,
  References,
  Reveal,
  RuleCards,
  Section,
  SectionNav,
  WorkGrid,
  inView,
  mailto,
} from "@/components/product-landing/ProductLanding";
import { ModuleMapHeroArt } from "@/components/product-landing/ProductArt";
import { cn } from "@/lib/utils";

/* Copy follows the approved one-page sheet
   (BetterBankings_Counterparty_Capital_Calculator_Website.html). */

const SUBJECT = "Counterparty Capital Calculator demonstration";

const SECTIONS = [
  { id: "calculations", label: "Calculations" },
  { id: "coverage", label: "Coverage" },
  { id: "outputs", label: "Outputs" },
  { id: "about", label: "About us" },
];

const CALCULATIONS = [
  {
    title: "SA-CCR",
    label: "Standardised Approach for measuring Counterparty Credit Risk",
    body: "Measure derivative exposure for counterparty default risk using replacement cost and potential future exposure, with recognised netting, margin and collateral. Derive risk-weighted assets (RWA) and capital requirements.",
  },
  {
    title: "BA-CVA",
    label: "Basic Approach for Credit Valuation Adjustment",
    body: "CVA adjusts derivative values for counterparty credit risk. Calculate capital for changes in this adjustment using the reduced Basic Approach, or compare with the 100% CCR capital alternative where eligible.",
  },
  {
    title: "CCP",
    label: "Central Counterparty",
    body: "A clearing house between buyers and sellers. Calculate capital for own-account trades and default-fund contributions, distinguishing qualifying and non-qualifying CCPs and applying relevant capital caps.",
  },
];

const COVERAGE = [
  { term: "Foreign exchange", detail: "FX forwards and FX swaps" },
  {
    term: "Interest rates",
    detail: "Interest rate swaps, including overnight indexed swaps",
  },
  {
    term: "Cross-currency and basis",
    detail: "Cross-currency swaps and basis swaps",
  },
  {
    term: "Notional profiles",
    detail: "Constant, amortising and other varying-notional structures",
  },
  {
    term: "Central clearing",
    detail: "Own-account CCP-cleared derivatives and default-fund exposures",
  },
];

const OUTPUTS = [
  {
    title: "Reporting support",
    body: "Prepare relevant OJK derivative CCR and CVA reporting sections, supported by counterparty and risk-weight breakdowns. Keep CCP components visible within the reconciliation.",
  },
  {
    title: "Explain differences",
    body: "Compare with reference results and investigate the effects of classification, maturity, exposure measurement and portfolio changes using the available supporting detail.",
  },
  {
    title: "Independent validation",
    body: "Recalculate exposures and capital to validate existing systems and support internal audit reviews. Use the same framework for recurring calculations and portfolio analysis.",
  },
  {
    title: "Capacity building",
    body: "Capacity building is integral to implementation. Data mapping, reconciliation and practical training help bank teams operate the calculator and interpret results.",
  },
];

const REFERENCES = [
  {
    label: "SEOJK 48/2017",
    scope: "SA-CCR",
    href: "https://ojk.go.id/id/kanal/perbankan/regulasi/surat-edaran-ojk/Pages/Surat-Edaran-Otoritas-Jasa-Keuangan-Nomor-48-SEOJK.03-2017.aspx",
  },
  {
    label: "SEOJK 24/2021",
    scope: "credit RWA",
    href: "https://www.ojk.go.id/id/regulasi/Documents/Pages/Perhitungan-Aset-Tertimbang-Menurut-Risiko-Untuk-Risiko-Kredit-Dengan-Menggunakan-Pendekatan-Standar-Bagi-Bank-Umum/SEOJK%2024%20-%2003%20-%202021.pdf",
  },
  {
    label: "SEOJK 23/2022",
    scope: "CVA",
    href: "https://ojk.go.id/id/regulasi/Documents/Pages/Perhitungan-Aset-Tertimbang-Menurut-Risiko-untuk-Risiko-Pasar-Bagi-Bank-Umum/SEOJK%2023%20-%2003%20-%202022.pdf",
  },
  {
    label: "SEOJK 16/2023",
    scope: "CCP",
    href: "https://ojk.go.id/id/regulasi/Pages/Perhitungan-Permodalan-Untuk-Eksposur-Bank-Terhadap-Lembaga-Central-Counterparty.aspx",
  },
];

/* ------------------------------------------------------------------ */
/*  Calculation flow: inputs -> SA-CCR exposure -> CCR / CVA outputs   */
/* ------------------------------------------------------------------ */

const step = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

function FlowBox({
  title,
  body,
  result = false,
}: {
  title: string;
  body: string;
  result?: boolean;
}) {
  return (
    <motion.div
      variants={step}
      className={cn(
        "min-w-0 border-l-[3px] bg-[#eef5f9] transition-colors duration-300 hover:bg-[#e4eff5]",
        result ? "border-[#e9a261] px-[18px] py-3.5" : "border-[#96c9e1] p-5",
      )}
    >
      <strong className="block leading-snug text-[#102d49]">{title}</strong>
      <span className="mt-1.5 block text-[13px] leading-normal text-[#556c7d]">
        {body}
      </span>
    </motion.div>
  );
}

function FlowArrow() {
  return (
    <motion.span
      aria-hidden
      variants={{
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.4 } },
      }}
      className="flex justify-center text-[#287aa7]"
    >
      {/* Points down when the flow stacks, right when it runs across. */}
      <span className="rotate-90 md:rotate-0">
        <motion.span
          className="block"
          animate={{ x: [0, 4, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowRight className="h-6 w-6" />
        </motion.span>
      </span>
    </motion.span>
  );
}

function CalculationFlow() {
  return (
    <motion.div
      role="group"
      aria-label="Calculation flow from portfolio inputs through SA-CCR exposure to CCR and CVA outputs"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.14 } },
      }}
      initial="hidden"
      whileInView="show"
      viewport={inView}
      className="grid grid-cols-1 items-center gap-2 md:grid-cols-[minmax(0,1fr)_24px_minmax(0,1fr)_24px_minmax(0,1.35fr)] md:gap-3.5"
    >
      <FlowBox
        title="Portfolio inputs"
        body="Trades, counterparties, agreements, collateral and currency data"
      />
      <FlowArrow />
      <FlowBox title="SA-CCR exposure" body="Exposure at default (EAD)" />
      <FlowArrow />
      <div className="grid gap-2.5 md:gap-3">
        <FlowBox
          result
          title="CCR RWA and capital"
          body="Including CCP fund and cap effects"
        />
        <FlowBox
          result
          title="CVA capital and RWA"
          body="Separate counterparty aggregation"
        />
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function CounterpartyCapitalCalculatorPage() {
  return (
    <ProductLandingShell>
      <ProductHero
        eyebrow="Software products"
        title="Counterparty Capital Calculator"
        subtitle="SA-CCR, Basic Approach CVA and CCP exposures"
        lead="An integrated Excel-based calculator for derivative exposures, risk-weighted assets and capital requirements. Built for banks seeking clear calculations and practical support for regulatory reporting."
        actions={
          <>
            <PrimaryButton href={mailto(SUBJECT)}>
              Request a demonstration
            </PrimaryButton>
            <BrochureButton
              href="/brochure/BetterBankings_Counterparty_Capital_Calculator.pdf"
              fileName="BetterBankings_Counterparty_Capital_Calculator.pdf"
            />
          </>
        }
        art={<ModuleMapHeroArt />}
      />

      <SectionNav items={SECTIONS} />

      {/* Calculations */}
      <Section id="calculations">
        <Heading id="calculations-title" className="mb-7">
          Three connected calculations
        </Heading>
        <RuleCards items={CALCULATIONS} numbered />

        <div className="mt-10 border-t border-[#cbdce7] pt-8 sm:pt-9">
          <Reveal>
            <h3 className="mb-3 text-[23px] font-bold leading-snug text-[#102d49]">
              Shared inputs. Traceable results.
            </h3>
            <p className="mb-6 max-w-[940px] leading-relaxed">
              Reuse portfolio data across CCR and CVA. Follow the calculation
              from source inputs to reported results, with counterparty detail
              and reconciliations that help explain the capital drivers.
            </p>
          </Reveal>
          <CalculationFlow />
        </div>
      </Section>

      {/* Coverage */}
      <Section id="coverage" tinted>
        <Heading id="coverage-title">Coverage and practical use</Heading>
        <Reveal>
          <p className="mt-6 mb-7 max-w-[800px] text-base leading-relaxed sm:text-[17px]">
            Apply a consistent framework across bilateral and centrally cleared
            derivative portfolios. Configure the calculation around the
            bank&apos;s products, legal agreements and reporting requirements.
          </p>
        </Reveal>
        <DefinitionTable
          label="Derivative and exposure coverage"
          rows={COVERAGE}
          onTint
        />
        <Reveal>
          <p className="mt-6 text-[15px] text-[#556c7d]">
            For Risk, Finance, Treasury and Internal Audit teams.
          </p>
        </Reveal>
      </Section>

      {/* Outputs */}
      <Section id="outputs">
        <Heading id="outputs-title" eyebrow="Practical implementation">
          Outputs that support the bank
        </Heading>
        <WorkGrid items={OUTPUTS} />
      </Section>

      <AboutContact
        title="Specialist expertise behind the calculator"
        body="BetterBankings is a specialist boutique firm in financial risk management and regulatory technology, with a focus on prudential requirements for banks. Our products have been implemented in banks, combining transparent analytical tools with practical support and knowledge transfer."
        contactTitle="Request a demonstration"
        contactNote="Explore the calculator with a portfolio relevant to your bank."
        subject={SUBJECT}
      />

      <References>
        Framework references:{" "}
        {REFERENCES.map((r, i) => (
          <Fragment key={r.label}>
            <a href={r.href} target="_blank" rel="noopener noreferrer">
              {r.label}
            </a>{" "}
            ({r.scope}){i < REFERENCES.length - 1 ? "; " : "."}
          </Fragment>
        ))}
      </References>
    </ProductLandingShell>
  );
}
