"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Beaker,
  Boxes,
  CheckCircle2,
  Gauge,
  GraduationCap,
  Landmark,
  Layers,
  LayoutDashboard,
  Mail,
  Repeat,
  Scale,
  Shield,
  SlidersHorizontal,
  Sparkles,
  Waves,
} from "lucide-react";

/* The section below is lifted verbatim from the Software Products overview
   page, where the client signed off on this exact presentation. It now lives
   on its own route; the overview links to it with a summary card instead of
   rendering the whole thing inline. */

const SIM_PANELS = [
  {
    key: "cockpit",
    label: "Simulation Cockpit",
    icon: Gauge,
    image: "/visuals/betterbankings_panel_01_simulation_cockpit_v4.png",
    caption:
      "Scenario controls, risk‑appetite thresholds and signed EVE/NII impacts brought together in one management view.",
  },
  {
    key: "alco",
    label: "ALCO Dashboard",
    icon: LayoutDashboard,
    image: "/visuals/betterbankings_panel_02_alco_dashboard_v4.png",
    caption:
      "Signed scenario sensitivities, appetite breaches and ready‑made ALCO challenge points for senior‑management briefings.",
  },
  {
    key: "engine",
    label: "Scenario & Behaviour Engine",
    icon: SlidersHorizontal,
    image: "/visuals/betterbankings_panel_03_scenario_engine_v4.png",
    caption:
      "Rate shocks, curve inputs and behavioural scalars such as NMD beta, prepayment and withdrawal that participants can challenge.",
  },
  {
    key: "actions",
    label: "Action Simulator",
    icon: Beaker,
    image: "/visuals/betterbankings_panel_04_action_simulator_v4.png",
    caption:
      "Test growth, funding, hedging, NMD pricing and de‑risking levers and trace each one into EVE/NII outcomes before ALCO decides.",
  },
  {
    key: "training",
    label: "ALM Training Lab",
    icon: GraduationCap,
    image: "/visuals/betterbankings_panel_05_training_lab_v4.png",
    caption:
      "A progressive pathway from core repricing concepts to ALCO‑style optimisation challenge, with guided classroom cases.",
  },
];

const SIMULATE_ITEMS = [
  { icon: Waves, text: "Interest‑rate shocks and yield‑curve scenarios" },
  { icon: Scale, text: "EVE and NII sensitivity" },
  { icon: Layers, text: "Repricing gaps across detailed time buckets" },
  { icon: Boxes, text: "Product‑level contribution to ALM risk" },
  {
    icon: Landmark,
    text: "NMD behaviour, deposit beta and core balance assumptions",
  },
  {
    icon: Repeat,
    text: "Mortgage prepayment and time‑deposit early‑withdrawal behaviour",
  },
  {
    icon: SlidersHorizontal,
    text: "Funding‑tenor changes, balance‑sheet growth and de‑risking actions",
  },
  { icon: Shield, text: "Hedge overlays and management response strategies" },
  { icon: Gauge, text: "Risk‑appetite status and ALCO decision implications" },
];

const WHY_HELPS = [
  "Turn ALM concepts into practical simulation exercises",
  "Strengthen ALCO discussion and management challenge",
  "Compare earnings impact with economic value impact",
  "Test whether proposed actions improve or weaken the balance sheet",
  "Link behavioural assumptions to measurable risk outcomes",
  "Build stronger understanding across different expertise levels",
  "Support training, internal workshops and management briefings",
];

const LEARNING_LEVELS = [
  {
    level: "Foundation",
    tag: "Core mechanics",
    description:
      "Understand repricing gaps, interest‑rate shocks, EVE, NII and basic ALM trade‑offs.",
  },
  {
    level: "Intermediate",
    tag: "Applied analysis",
    description:
      "Analyse behavioural assumptions, scenario design, product contribution and ALCO interpretation.",
  },
  {
    level: "Advanced",
    tag: "Strategic optimisation",
    description:
      "Simulate management actions, optimise balance‑sheet strategy, challenge assumptions and assess risk‑return trade‑offs.",
  },
];

function SimulationToolSection() {
  const [active, setActive] = useState(0);
  const activePanel = SIM_PANELS[active];

  return (
    <section id="software-products" className="pt-10 pb-16 lg:pt-12 lg:pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#14213D]/5 border border-[#14213D]/10 mb-6">
            <Sparkles className="w-4 h-4 text-[#F48C25]" />
            <span className="text-sm font-semibold text-[#14213D] tracking-wide">
              Software Products
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#F48C25] bg-[#F48C25]/10 px-2 py-0.5 rounded-full">
              In Development
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#14213D] mb-5 tracking-tight max-w-4xl mx-auto">
            Balance Sheet Management{" "}
            <span className="text-[#F48C25]">Simulation Tool</span>
          </h2>
          <p className="text-lg text-[#355189] font-medium mb-6">
            From ALM training to live balance‑sheet strategy simulation
          </p>
          <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A practical training platform for balance sheet management, from
            foundational to advanced levels. It helps Treasury, Risk, Finance,
            ALCO, Internal Audit and senior management see how repricing
            behaviour, rate shocks, funding strategy and management actions
            affect earnings, economic value and risk appetite. Beyond training,
            it also acts as a simulation layer for scenario testing and
            management optimisation.
          </p>
        </motion.div>

        {/* Interactive panel showcase */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-6">
            {SIM_PANELS.map((panel, i) => {
              const Icon = panel.icon;
              const isActive = i === active;
              return (
                <button
                  key={panel.key}
                  onClick={() => setActive(i)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[#14213D] text-white shadow-lg shadow-[#14213D]/20"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-[#F48C25]/50 hover:text-[#14213D]"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-[#F48C25]" : "text-gray-400"
                    }`}
                  />
                  <span className="hidden sm:inline">{panel.label}</span>
                  <span className="sm:hidden">{panel.label.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Browser-style frame */}
          <div className="rounded-2xl overflow-hidden shadow-2xl shadow-[#14213D]/10 border border-gray-200 bg-white">
            <div className="flex items-center gap-2 px-4 py-3 bg-[#14213D] border-b border-white/10">
              <span className="w-3 h-3 rounded-full bg-red-400/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-400/80" />
              <span className="w-3 h-3 rounded-full bg-green-400/80" />
              <div className="ml-3 flex-1 text-center">
                <span className="inline-block px-4 py-1 rounded-md bg-white/10 text-white/70 text-xs font-medium">
                  betterbankings · {activePanel.label}
                </span>
              </div>
            </div>
            <div className="relative bg-[#fcfaf9]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePanel.key}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <Image
                    src={activePanel.image}
                    alt={activePanel.label}
                    width={1600}
                    height={1050}
                    className="w-full h-auto"
                    priority={active === 0}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Caption */}
          <div className="mt-4 flex items-start gap-3 max-w-3xl mx-auto text-center justify-center">
            <p className="text-sm text-gray-500 italic">{activePanel.caption}</p>
          </div>
          <p className="mt-2 text-center text-xs text-gray-400">
            Preview of the tool in development. Figures shown are illustrative.
          </p>
        </motion.div>

        {/* What users can simulate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-bold text-[#14213D] mb-3">
              What users can <span className="text-[#F48C25]">simulate</span>
            </h3>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Explore the full range of drivers behind balance‑sheet risk and
              return.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SIMULATE_ITEMS.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="group flex items-start gap-4 bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-[#F48C25]/30 transition-all"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-[#1B2B4B] to-[#355189] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed pt-1.5">
                    {item.text}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Why it matters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
        >
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-[#14213D] mb-4">
              Why it <span className="text-[#F48C25]">matters</span>
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Effective balance sheet management requires more than reporting
              numbers. Banks need to understand the drivers behind the numbers,
              test alternative actions, and explain the trade‑offs between
              income, value, liquidity, funding cost and regulatory expectations.
              The Betterbankings tool helps banks:
            </p>
          </div>
          <div className="space-y-3">
            {WHY_HELPS.map((help, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 border border-gray-100 shadow-sm"
              >
                <CheckCircle2 className="w-5 h-5 text-[#F48C25] flex-shrink-0" />
                <span className="text-sm text-gray-700">{help}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Progressive learning levels */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-bold text-[#14213D] mb-3">
              Designed for progressive{" "}
              <span className="text-[#F48C25]">ALM learning</span>
            </h3>
            <p className="text-gray-500 max-w-2xl mx-auto">
              One tool that grows with the participant, from core mechanics to
              strategic optimisation.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {LEARNING_LEVELS.map((lvl, i) => (
              <motion.div
                key={lvl.level}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="group relative bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#14213D] flex items-center justify-center group-hover:bg-[#F48C25] transition-colors">
                    <span className="text-lg font-bold text-[#F48C25] group-hover:text-white transition-colors">
                      {`0${i + 1}`}
                    </span>
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-[#F48C25]">
                      {lvl.tag}
                    </div>
                    <h4 className="text-xl font-bold text-[#14213D]">
                      {lvl.level}
                    </h4>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {lvl.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* From learning to decision support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="relative bg-gradient-to-br from-[#1B2B4B] to-[#355189] rounded-2xl p-10 lg:p-14 text-white overflow-hidden">
            <div className="absolute top-[-30%] right-[-10%] w-[400px] h-[400px] bg-[#F48C25]/10 rounded-full blur-[100px]" />
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 mb-4 text-[#F48C25]">
                <ArrowRight className="w-5 h-5" />
                <span className="text-sm font-semibold uppercase tracking-wider">
                  From learning to decision support
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-5">
                Make balance sheet management visible, explainable and
                actionable.
              </h3>
              <p className="text-white/85 leading-relaxed">
                Because the simulation is structured around realistic
                balance‑sheet behaviour and management choices, it can support
                banks well beyond training. It provides a practical layer for
                testing balance‑sheet strategies, comparing alternative actions,
                and preparing clearer ALCO or senior‑management briefings.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function BalanceSheetSimulationPage() {
  return (
    <div className="min-h-screen bg-[#fcfaf9] flex flex-col lg:flex-row overflow-x-hidden">
      <Sidebar />

      <main className="w-full flex-1 lg:ml-[280px] relative">
        {/* Background gradients, matching the Software Products overview. */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-orange-100 rounded-full blur-[100px] opacity-60" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-50 rounded-full blur-[100px] opacity-60" />
        </div>

        <div className="relative z-10 flex flex-col">
          <div className="px-6 pt-10 lg:pt-14">
            <div className="max-w-6xl mx-auto">
              <Link
                href="/advisory-products"
                className="group inline-flex items-center gap-1.5 text-[13px] font-medium text-gray-500 transition-colors hover:text-[#14213D]"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
                Software Products
              </Link>
            </div>
          </div>

          <SimulationToolSection />

          {/* Closing call to action */}
          <section className="px-6 pb-24 pt-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-[#14213D] via-[#1B2B4B] to-[#355189] px-8 py-14 text-center lg:px-16 lg:py-20"
            >
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-1/2 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#F48C25]/12 blur-[120px]" />
              </div>
              <div className="relative z-10 mx-auto max-w-2xl">
                <h2 className="text-[1.75rem] font-bold leading-tight tracking-tight text-white md:text-4xl">
                  Bring balance sheet management{" "}
                  <span className="text-[#F9B269]">into the room</span>
                </h2>
                <p className="mt-5 text-[15px] leading-relaxed text-white/70 md:text-base">
                  Talk to us about a guided session for Treasury, Risk, Finance
                  or ALCO, or about using the simulation for scenario testing
                  and management briefings.
                </p>
                <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <a
                    href="mailto:info@betterbankings.com?subject=Balance%20Sheet%20Management%20Simulation%20Tool"
                    className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#F48C25] px-7 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-black/20 transition-all duration-300 hover:bg-[#e07d19] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F48C25] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1B2B4B]"
                  >
                    <Mail className="h-4 w-4" />
                    info@betterbankings.com
                  </a>
                  <Link
                    href="/advisory-products"
                    className="group inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-7 py-3.5 text-[15px] font-semibold text-white/85 transition-all duration-300 hover:border-white/30 hover:bg-white/10"
                  >
                    All software products
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </section>

          <Footer />
        </div>
      </main>
    </div>
  );
}
