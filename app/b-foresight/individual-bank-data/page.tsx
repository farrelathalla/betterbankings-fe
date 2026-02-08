"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Landmark,
  ShieldCheck,
  PiggyBank,
  Activity,
  ArrowRight,
  ChevronLeft,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";

const sections = [
  {
    title: "Capital and Solvency",
    description:
      "Assesses a bank's financial resilience and its capacity to absorb losses. This section includes capital adequacy ratios, capital structure, and risk‑weighted assets, providing insights into overall bank capital sufficiency.",
    href: "/b-foresight/individual-bank-data/capital-solvency",
    icon: Landmark,
    accent: "orange",
  },
  {
    title: "Credit and Market Risk",
    description:
      "Covers exposures arising from lending activities and market movements. These include data on loan quality, non-performing loans (NPLs), and Interest Rate Risk in Banking Book (IRRBB).",
    href: "/b-foresight/individual-bank-data/credit-market-risk",
    icon: ShieldCheck,
    accent: "blue",
  },
  {
    title: "Funding and Liquidity",
    description:
      "Examines a bank's funding structure and liquidity position. These include deposit composition, Liquidity Coverage Ratio (LCR), and Net Stable Funding Ratio (NSFR).",
    href: "/b-foresight/individual-bank-data/funding-liquidity",
    icon: PiggyBank,
    accent: "orange",
  },
  {
    title: "Performance and Risk Monitoring",
    description:
      "Monitors overall financial performance and emerging risk trends. This section includes profitability metrics, Betterbankings' proprietary bank scoring, and risk indicator heatmaps.",
    href: "/b-foresight/individual-bank-data/performance-monitoring",
    icon: Activity,
    accent: "blue",
  },
];

// Decorative hexagon
const Hexagon = ({
  className = "",
  filled = false,
}: {
  className?: string;
  filled?: boolean;
}) => (
  <svg viewBox="0 0 100 100" className={className}>
    <polygon
      points="50,2 95,25 95,75 50,98 5,75 5,25"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);

export default function IndividualBankDataPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main
        className="flex-1 lg:ml-[280px] relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #14213D 0%, #1a2a4a 50%, #0f1729 100%)",
        }}
      >
        {/* Decorative background shapes */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute top-[10%] right-[5%] text-blue-500/8"
        >
          <Hexagon className="w-52 h-52" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.2 }}
          className="absolute top-[15%] right-[2%] text-blue-400/12"
        >
          <Hexagon className="w-20 h-20" filled />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="absolute bottom-[20%] left-[5%] text-slate-500/8"
        >
          <Hexagon className="w-28 h-28" filled />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.4 }}
          className="absolute bottom-[40%] right-[15%] text-orange-400/10"
        >
          <Hexagon className="w-16 h-16" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="absolute top-[55%] left-[2%] text-blue-400/6"
        >
          <Hexagon className="w-20 h-20" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.6 }}
          className="absolute bottom-[5%] right-[30%] text-orange-400/8"
        >
          <div className="w-3 h-3 rounded-full bg-current" />
          <div className="w-2 h-2 rounded-full bg-current absolute top-4 left-4 opacity-60" />
        </motion.div>

        {/* Header */}
        <header className="relative z-10 pt-12 pb-8 px-8">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link
                href="/b-foresight"
                className="inline-flex items-center text-blue-400/70 hover:text-blue-300 text-sm font-medium mb-6 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                B-FORESIGHT
              </Link>

              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
                Individual Bank Data
              </h1>
              <p className="text-blue-100/50 text-lg max-w-2xl">
                Comprehensive metrics and risk indicators for specific banking
                institutions
              </p>
            </motion.div>
          </div>
        </header>

        {/* Content */}
        <section className="relative z-10 px-8 py-8 pb-24">
          <div className="max-w-5xl mx-auto">
            {/* Grid with generous spacing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-20">
              {sections.map((section, index) => {
                const isOrange = section.accent === "orange";
                const offsets = [
                  "md:translate-y-0",
                  "md:translate-y-12",
                  "md:translate-y-4",
                  "md:translate-y-16",
                ];

                return (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.12 }}
                    className={offsets[index]}
                  >
                    <Link href={section.href} className="group block">
                      <div className="relative">
                        {/* Soft blob background shape */}
                        <div
                          className={`absolute -inset-5 opacity-[0.06] ${isOrange ? "bg-orange-400" : "bg-blue-400"}`}
                          style={{
                            borderRadius:
                              index % 2 === 0
                                ? "55% 45% 60% 40% / 45% 55% 45% 55%"
                                : "45% 55% 40% 60% / 55% 45% 55% 45%",
                            transform: `rotate(${index % 2 === 0 ? "-5deg" : "5deg"})`,
                          }}
                        />

                        {/* Large rotated background icon */}
                        <div
                          className={`absolute -top-2 -right-4 ${isOrange ? "text-orange-400/8" : "text-blue-400/8"}`}
                        >
                          <section.icon
                            className="w-28 h-28"
                            style={{
                              transform: `rotate(${15 + index * 5}deg)`,
                            }}
                            strokeWidth={1}
                          />
                        </div>

                        {/* Content */}
                        <div className="relative z-10 py-4">
                          {/* Icon indicator */}
                          <div
                            className={`w-10 h-10 rounded-lg ${isOrange ? "bg-orange-500/20 text-orange-400" : "bg-blue-500/20 text-blue-400"} flex items-center justify-center mb-5`}
                          >
                            <section.icon className="w-5 h-5" />
                          </div>

                          <h2
                            className={`text-2xl font-bold text-white mb-3 transition-colors ${isOrange ? "group-hover:text-orange-300" : "group-hover:text-blue-300"}`}
                          >
                            {section.title}
                          </h2>

                          <p className="text-blue-100/50 text-sm leading-relaxed mb-5">
                            {section.description}
                          </p>

                          <div
                            className={`flex items-center text-sm font-medium ${isOrange ? "text-orange-400 group-hover:text-orange-300" : "text-blue-400 group-hover:text-blue-300"} transition-colors`}
                          >
                            View metrics
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0f1a] to-transparent" />
      </main>
    </div>
  );
}
