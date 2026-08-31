"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  Gauge,
  LayoutDashboard,
  SlidersHorizontal,
  Beaker,
  GraduationCap,
  Waves,
  Scale,
  Layers,
  Boxes,
  Repeat,
  Landmark,
  Shield,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const RISK_DISCIPLINES = [
  {
    title: "Market Risk",
    description:
      "Robust analytics for assessing exposure to fluctuations in interest rates, foreign exchange movements, and other market variables.",
  },
  {
    title: "Liquidity Risk",
    description:
      "Comprehensive tools to evaluate liquidity buffers, monitor funding stability, and simulate stress events.",
  },
  {
    title: "Interest Rate Risk in the Banking Book (IRRBB)",
    description:
      "Advanced modelling to quantify earnings-at-risk and economic value impacts arising from interest rate changes.",
  },
  {
    title: "Counterparty Credit Risk",
    description:
      "Frameworks to measure and manage exposures associated with counterparties, ensuring effective credit risk mitigation.",
  },
  {
    title: "Fund Transfer Pricing (FTP)",
    description:
      "A transparent and accurate FTP engine that supports profitability assessment, performance measurement, and optimized balance sheet management.",
  },
];

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
    <section id="software-products" className="py-16 lg:py-24 px-6">
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

export default function AdvisoryProducts() {
  return (
    <div className="min-h-screen bg-[#fcfaf9] flex flex-col lg:flex-row overflow-x-hidden">
      {/* Sidebar - Fixed */}
      <Sidebar />

      {/* Main Content - Offset by Sidebar Width on Desktop */}
      <main className="w-full flex-1 lg:ml-[280px] relative">
        {/* Background Gradients - Subtle */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-orange-100 rounded-full blur-[100px] opacity-60"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-50 rounded-full blur-[100px] opacity-60"></div>
        </div>

        <div className="relative z-10 flex flex-col">
          {/* Hero Section */}
          <section className="relative w-full bg-[#fcfaf9] py-20 lg:py-28 px-6 text-center">
            <div className="max-w-4xl mx-auto">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#14213D] mb-6 tracking-tight"
              >
                Our <span className="text-[#F48C25]">Product</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-gray-600 max-w-3xl mx-auto leading-relaxed"
              >
                Betterbankings provides an integrated, enterprise‑grade software
                platform engineered to elevate risk management across the
                banking sector. Designed for precision, transparency, and
                regulatory alignment, our solution empowers financial
                institutions to identify, measure, monitor, and manage risks
                with confidence, strengthening both strategic decision‑making and
                organizational resilience.
              </motion.p>
            </div>
          </section>

          {/* Featured product: ILAAP Risk Cube */}
          <section className="px-6 pb-4">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-6xl mx-auto"
            >
              <Link
                href="/advisory-products/ilaap-risk-cube"
                className="group grid grid-cols-1 items-center gap-8 rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-[#F48C25]/35 hover:shadow-xl hover:shadow-[#14213D]/[0.08] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F48C25] focus-visible:ring-offset-2 lg:grid-cols-[1fr_1.1fr] lg:p-8"
              >
                <div className="order-2 min-w-0 lg:order-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[#F48C25]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#F48C25]">
                      New
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#355189]/70">
                      ILAAP Overlay Analytics
                    </span>
                  </div>
                  <h3 className="mt-4 text-2xl font-bold tracking-tight text-[#14213D] lg:text-3xl">
                    ILAAP <span className="text-[#F48C25]">Risk Cube</span>
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-gray-600">
                    Turn OJK ILAAP reporting data into liquidity insight,
                    foresight and action. A transparent analytical and assurance
                    layer linking SPM, scenario choice, funding profile,
                    executable liquidity and report-ready outputs.
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#14213D]">
                    Explore the framework
                    <ArrowRight className="h-4 w-4 text-[#F48C25] transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
                <div className="order-1 min-w-0 overflow-hidden rounded-xl bg-[#F5F8FC] p-3 lg:order-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/ilaap/01_Hero_ILAAP_Risk_Cube_Light.svg"
                    alt="ILAAP Risk Cube connecting SPM data, Funding Rollover, CBC and HQLA with scenario choice, time, survival and low point."
                    loading="lazy"
                    decoding="async"
                    className="w-full h-auto transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                </div>
              </Link>
            </motion.div>
          </section>

          {/* Risk Disciplines Section */}
          <section className="py-12 bg-[#fcfaf9] px-6">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-[#14213D] mb-4">
                  Key Banking{" "}
                  <span className="text-[#F48C25]">Risk Disciplines</span>
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Our platform encompasses the full spectrum of key banking risk
                  disciplines
                </p>
              </motion.div>

              <div className="space-y-6">
                {RISK_DISCIPLINES.map((discipline, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-8 lg:p-10 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#F48C25]/10 flex items-center justify-center mt-1">
                        <CheckCircle2 className="w-5 h-5 text-[#F48C25]" />
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-[#14213D] mb-3">
                          {discipline.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {discipline.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Bottom Section */}
          <section className="py-16 bg-[#fcfaf9] px-6">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-[#1B2B4B] to-[#355189] rounded-2xl p-10 lg:p-14 text-center text-white"
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                  Unified Risk Environment
                </h2>
                <p className="text-white/90 text-lg leading-relaxed">
                  Engineered for scalability and accuracy, Betterbankings'
                  platform delivers a unified risk environment where
                  institutions can enhance governance, streamline processes, and
                  act decisively amid an increasingly complex financial
                  landscape. Through actionable insights and seamless
                  integration, we enable banks to operate with greater agility,
                  foresight, and control.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Software Products: Balance Sheet Management Simulation Tool */}
          <SimulationToolSection />

          {/* CTA Section */}
          <section className="py-24 bg-[#fcfaf9] px-6 text-center">
            <div className="max-w-3xl mx-auto">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold text-[#14213D] mb-4"
              >
                Interested in our products?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-gray-500 mb-8"
              >
                Contact us to learn how our platform can transform your risk
                management
              </motion.p>

              <motion.button
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="px-8 py-3 bg-gradient-to-r from-[#1B2B4B] to-[#355189] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-lg flex items-center gap-2 mx-auto"
              >
                <span
                  className="transform rotate-45 inline-block border-t-2 border-r-2 border-white w-2 h-2 mr-2"
                  style={{ transform: "rotate(45deg)" }}
                ></span>
                Contact Us
              </motion.button>
            </div>
          </section>

          <Footer />
        </div>
      </main>
    </div>
  );
}
