"use client";

import { CalendarClock } from "lucide-react";
import {
  AboutContact,
  BrochureButton,
  DefinitionTable,
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
  mailto,
} from "@/components/product-landing/ProductLanding";
import { RiskCubeHeroArt } from "@/components/product-landing/ProductArt";
import VideoIntro from "@/components/product-landing/VideoIntro";

/* Copy follows the approved one-page sheet
   (BetterBankings_ILAAP_Risk_Cube_Website.html). */

const SUBJECT = "ILAAP Risk Cube and submission support";

const SECTIONS = [
  { id: "video", label: "Video" },
  { id: "analytics", label: "Analytics" },
  { id: "submission", label: "Submission support" },
  { id: "about", label: "About us" },
];

const DIMENSIONS = [
  {
    title: "Time",
    body: "Daily cash-flow paths identify the liquidity low point, first shortfall and survival horizon.",
  },
  {
    title: "Scenario",
    body: "Compare the Liquidity Coverage Ratio (LCR) benchmark, the bank's adopted stress and additional scenarios.",
  },
  {
    title: "Response",
    body: "Assess usable liquidity and monetisation, then evaluate management actions and residual needs separately.",
  },
];

const CAPABILITIES = [
  {
    term: "Data checks",
    detail: "SPM and funding-profile mapping, completeness and reconciliation.",
  },
  {
    term: "Stress and survival",
    detail:
      "Cash-flow timing, daily liquidity and sensitivity to scenario assumptions.",
  },
  {
    term: "Usable liquidity",
    detail:
      "Counterbalancing capacity (CBC), liquid assets, repos and other securities financing transactions.",
  },
  {
    term: "Funding insights",
    detail:
      "Rollover, tenor migration, new funding and concentration through connected funding analytics.",
  },
  {
    term: "Management outputs",
    detail:
      "Scenario comparisons, charts, residual needs and inputs for the ILAAP narrative.",
  },
];

const STEPS = [
  {
    title: "Mobilise quickly",
    body: "Agree scope, data owners and milestones. Establish a focused request list and start from existing SPM, funding reports and supporting policies.",
  },
  {
    title: "Strengthen the assessment",
    body: "Check key inputs and results. Link the formally adopted stress scenario to the bank's risk appetite, target survival horizon and executable response.",
  },
  {
    title: "Draft the submission",
    body: "Prepare the ILAAP narrative, analytical exhibits and supporting working papers. Explain funding vulnerabilities, liquidity capacity, management actions and remaining gaps.",
  },
  {
    title: "Complete management review",
    body: "Support challenge sessions, resolve key comments and refresh reporting-date figures. Align the final package for the bank's approval and submission.",
  },
];

export default function IlaapRiskCubePage() {
  return (
    <ProductLandingShell>
      <ProductHero
        eyebrow="Software and advisory"
        title="ILAAP Risk Cube"
        subtitle="Liquidity analytics and ILAAP submission support"
        lead="An Excel-based tool for the Internal Liquidity Adequacy Assessment Process (ILAAP), connecting Survival Period Monitoring (SPM), funding data and bank-specific assumptions."
        actions={
          <>
            <PrimaryButton href={mailto(SUBJECT)}>
              Discuss your ILAAP timeline
            </PrimaryButton>
            <BrochureButton
              href="/brochure/BetterBankings_ILAAP_Risk_Cube.pdf"
              fileName="BetterBankings_ILAAP_Risk_Cube.pdf"
            />
          </>
        }
        art={<RiskCubeHeroArt />}
      />

      <SectionNav items={SECTIONS} />

      {/* Video introduction */}
      <Section id="video">
        <Heading id="video-title" eyebrow="Video introduction" className="mb-8">
          See the ILAAP Risk Cube in action
        </Heading>
        <VideoIntro
          videoId="eDbmCicwGeY"
          title="ILAAP Risk Cube"
          caption="A short walkthrough of the ILAAP Risk Cube and its outputs."
        />
      </Section>

      {/* Analytics */}
      <Section id="analytics" tinted>
        <Heading id="analytics-title" className="mb-7">
          Three dimensions of liquidity adequacy
        </Heading>
        <RuleCards items={DIMENSIONS} />

        <div className="mt-12 sm:mt-14">
          <Heading className="mb-7">From bank data to practical outputs</Heading>
          <DefinitionTable
            label="ILAAP Risk Cube capabilities"
            rows={CAPABILITIES}
            onTint
          />
          <Reveal>
            <p className="mt-6 text-[#556c7d]">
              Use as a working tool or an independent validator of liquidity
              calculations and assumptions, supporting internal audit reviews.
            </p>
          </Reveal>
        </div>
      </Section>

      {/* Submission support */}
      <Section id="submission">
        <Heading id="submission-title" eyebrow="Submission support">
          ILAAP submission support for tight timelines
        </Heading>
        <Reveal>
          <p className="mt-6 max-w-[880px] text-base leading-relaxed sm:text-[17px]">
            BetterBankings helps banks prepare a coherent ILAAP package under
            demanding deadlines. We reuse available reports and policies,
            prioritise material gaps and progress data review, analysis and
            drafting in parallel.
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-6 flex items-start gap-4 border-l-4 border-[#e9a261] bg-[#e8f0f5] px-[18px] py-3.5">
            <CalendarClock
              aria-hidden
              className="mt-0.5 h-5 w-5 shrink-0 text-[#287aa7]"
            />
            <div>
              <strong className="text-[#102d49]">
                An accelerated plan built around your submission date.
              </strong>
              <p className="mt-1 text-sm text-[#556c7d]">
                Milestones reflect data readiness and the availability of the
                bank team for review.
              </p>
            </div>
          </div>
        </Reveal>

        <WorkGrid items={STEPS} />

        <Reveal>
          <p className="mt-8 border-t border-[#cbdce7] pt-6 font-bold text-[#102d49]">
            Typical outputs: configured analytics, an editable ILAAP report,
            supporting exhibits and a prioritised action plan.
          </p>
          <p className="mt-4 text-[15px] text-[#556c7d]">
            Capacity building is integral to delivery, with practical training
            to help teams operate the tool and interpret results. Optional
            automation supports recurring reporting.
          </p>
        </Reveal>
      </Section>

      <AboutContact
        title="Specialist expertise behind the solution"
        body="BetterBankings is a specialist boutique firm in financial risk management and regulatory technology, with a focus on prudential requirements for banks. Our products have been implemented in banks, combining transparent analytical tools with practical support and knowledge transfer."
        contactTitle="Discuss your ILAAP timeline"
        subject={SUBJECT}
      />

      <References>
        Framework reference:{" "}
        <a
          href="https://ojk.go.id/id/regulasi/Pages/SEOJK-26-SEOJK03-2025-Proses-Asesmen-Kecukupan-Likuiditas-Secara-Internal-Bagi-Bank-Umum.aspx"
          target="_blank"
          rel="noopener noreferrer"
        >
          SEOJK 26/SEOJK.03/2025
        </a>{" "}
        on the Internal Liquidity Adequacy Assessment Process.
      </References>
    </ProductLandingShell>
  );
}
