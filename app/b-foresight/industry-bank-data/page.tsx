"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Wallet,
  DollarSign,
  ArrowLeftRight,
  GitCompare,
  Percent,
  ArrowRight,
  ChevronLeft,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";

const sections = [
  {
    title: "Deposit",
    description:
      "Provides insights into deposit composition, rates, and trends across the banking industry. These cover deposits grouping by bank category, maturity, and ownership, as well as IDR and USD deposit interest rates.",
    href: "/b-foresight/industry-bank-data/deposit",
    icon: Wallet,
    accent: "blue",
  },
  {
    title: "Lending",
    description:
      "Presents an overview of credit distribution and loan growth across sectors. It includes lending by economic sector and borrower segment, IDR and USD lending rates, and non-performing loans (NPLs).",
    href: "/b-foresight/industry-bank-data/lending",
    icon: DollarSign,
    accent: "orange",
  },
  {
    title: "Market and Exchange Rate",
    description:
      "Summarizes key market variables affecting the banking sector, including exchange rate movements, interbank market conditions, and selected financial market indicators relevant to banking operations.",
    href: "/b-foresight/industry-bank-data/market-exchange-rate",
    icon: ArrowLeftRight,
    accent: "blue",
  },
  {
    title: "Rate Comparison",
    description:
      "Compares key interest rates across the financial system, including policy rates, deposit and lending rates, LPS rates, and other benchmark rates. This section facilitates quick assessment of pricing competitiveness.",
    href: "/b-foresight/industry-bank-data/rate-comparison",
    icon: GitCompare,
    accent: "orange",
  },
  {
    title: "Pass Through Rate",
    description:
      "Analyzes the extent and speed at which changes in policy rates are transmitted to deposit and lending rates. This section supports evaluation of monetary policy transmission effectiveness.",
    href: "/b-foresight/industry-bank-data/pass-through-rate",
    icon: Percent,
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

export default function IndustryBankDataPage() {
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
          className="absolute top-[8%] right-[3%] text-blue-500/8"
        >
          <Hexagon className="w-56 h-56" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.15 }}
          className="absolute top-[12%] right-[1%] text-blue-400/12"
        >
          <Hexagon className="w-20 h-20" filled />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="absolute bottom-[35%] left-[3%] text-slate-500/8"
        >
          <Hexagon className="w-24 h-24" filled />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.45 }}
          className="absolute top-[50%] right-[8%] text-orange-400/10"
        >
          <Hexagon className="w-16 h-16" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.6 }}
          className="absolute bottom-[15%] left-[15%] text-blue-400/6"
        >
          <Hexagon className="w-20 h-20" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.75 }}
          className="absolute bottom-[8%] right-[20%] text-orange-400/10"
        >
          <div className="w-3 h-3 rounded-full bg-current" />
          <div className="w-2 h-2 rounded-full bg-current absolute top-5 left-5 opacity-50" />
          <div className="w-1.5 h-1.5 rounded-full bg-current absolute -top-3 left-3 opacity-70" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.9 }}
          className="absolute top-[75%] left-[6%] text-blue-400/8"
        >
          <Hexagon className="w-12 h-12" />
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
                Industry Bank Data
              </h1>
              <p className="text-blue-100/50 text-lg max-w-2xl">
                Consolidated view of aggregated banking industry data and macro
                indicators
              </p>
            </motion.div>
          </div>
        </header>

        {/* Content */}
        <section className="relative z-10 px-8 py-6 pb-24">
          <div className="max-w-5xl mx-auto">
            {/* First row - 2 items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-16 mb-16">
              {sections.slice(0, 2).map((section, index) => {
                const isOrange = section.accent === "orange";
                return (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={index === 1 ? "md:translate-y-10" : ""}
                  >
                    <Link href={section.href} className="group block">
                      <div className="relative">
                        {/* Soft blob background */}
                        <div
                          className={`absolute -inset-5 opacity-[0.06] ${isOrange ? "bg-orange-400" : "bg-blue-400"}`}
                          style={{
                            borderRadius: "50% 50% 55% 45% / 45% 55% 45% 55%",
                            transform: "rotate(-3deg)",
                          }}
                        />

                        {/* Large rotated background icon */}
                        <div
                          className={`absolute -top-3 -right-6 ${isOrange ? "text-orange-400/8" : "text-blue-400/8"}`}
                        >
                          <section.icon
                            className="w-24 h-24"
                            style={{
                              transform: `rotate(${12 + index * 8}deg)`,
                            }}
                            strokeWidth={1}
                          />
                        </div>

                        {/* Content */}
                        <div className="relative z-10 py-4">
                          <div
                            className={`w-10 h-10 rounded-lg ${isOrange ? "bg-orange-500/20 text-orange-400" : "bg-blue-500/20 text-blue-400"} flex items-center justify-center mb-5`}
                          >
                            <section.icon className="w-5 h-5" />
                          </div>

                          <h2
                            className={`text-xl font-bold text-white mb-3 transition-colors ${isOrange ? "group-hover:text-orange-300" : "group-hover:text-blue-300"}`}
                          >
                            {section.title}
                          </h2>

                          <p className="text-blue-100/50 text-sm leading-relaxed mb-4">
                            {section.description}
                          </p>

                          <div
                            className={`flex items-center text-sm font-medium ${isOrange ? "text-orange-400 group-hover:text-orange-300" : "text-blue-400 group-hover:text-blue-300"} transition-colors`}
                          >
                            View data
                            <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Second row - centered single item */}
            <div className="flex justify-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="max-w-md md:-translate-x-12"
              >
                {(() => {
                  const section = sections[2];
                  const isOrange = section.accent === "orange";
                  return (
                    <Link href={section.href} className="group block">
                      <div className="relative">
                        <div
                          className={`absolute -inset-5 opacity-[0.06] ${isOrange ? "bg-orange-400" : "bg-blue-400"}`}
                          style={{
                            borderRadius: "45% 55% 50% 50% / 55% 45% 55% 45%",
                            transform: "rotate(4deg)",
                          }}
                        />

                        <div
                          className={`absolute -top-2 -right-8 ${isOrange ? "text-orange-400/8" : "text-blue-400/8"}`}
                        >
                          <section.icon
                            className="w-24 h-24"
                            style={{ transform: "rotate(20deg)" }}
                            strokeWidth={1}
                          />
                        </div>

                        <div className="relative z-10 py-4">
                          <div
                            className={`w-10 h-10 rounded-lg ${isOrange ? "bg-orange-500/20 text-orange-400" : "bg-blue-500/20 text-blue-400"} flex items-center justify-center mb-5`}
                          >
                            <section.icon className="w-5 h-5" />
                          </div>

                          <h2
                            className={`text-xl font-bold text-white mb-3 transition-colors ${isOrange ? "group-hover:text-orange-300" : "group-hover:text-blue-300"}`}
                          >
                            {section.title}
                          </h2>

                          <p className="text-blue-100/50 text-sm leading-relaxed mb-4">
                            {section.description}
                          </p>

                          <div
                            className={`flex items-center text-sm font-medium ${isOrange ? "text-orange-400 group-hover:text-orange-300" : "text-blue-400 group-hover:text-blue-300"} transition-colors`}
                          >
                            View data
                            <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })()}
              </motion.div>
            </div>

            {/* Third row - 2 items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-16">
              {sections.slice(3, 5).map((section, index) => {
                const isOrange = section.accent === "orange";
                return (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: (index + 3) * 0.1 }}
                    className={index === 0 ? "" : "md:-translate-y-6"}
                  >
                    <Link href={section.href} className="group block">
                      <div className="relative">
                        <div
                          className={`absolute -inset-5 opacity-[0.06] ${isOrange ? "bg-orange-400" : "bg-blue-400"}`}
                          style={{
                            borderRadius:
                              index === 0
                                ? "55% 45% 50% 50% / 50% 50% 50% 50%"
                                : "48% 52% 45% 55% / 50% 55% 45% 50%",
                            transform: `rotate(${index === 0 ? "-5deg" : "6deg"})`,
                          }}
                        />

                        <div
                          className={`absolute -top-3 -right-5 ${isOrange ? "text-orange-400/8" : "text-blue-400/8"}`}
                        >
                          <section.icon
                            className="w-24 h-24"
                            style={{
                              transform: `rotate(${25 + index * 10}deg)`,
                            }}
                            strokeWidth={1}
                          />
                        </div>

                        <div className="relative z-10 py-4">
                          <div
                            className={`w-10 h-10 rounded-lg ${isOrange ? "bg-orange-500/20 text-orange-400" : "bg-blue-500/20 text-blue-400"} flex items-center justify-center mb-5`}
                          >
                            <section.icon className="w-5 h-5" />
                          </div>

                          <h2
                            className={`text-xl font-bold text-white mb-3 transition-colors ${isOrange ? "group-hover:text-orange-300" : "group-hover:text-blue-300"}`}
                          >
                            {section.title}
                          </h2>

                          <p className="text-blue-100/50 text-sm leading-relaxed mb-4">
                            {section.description}
                          </p>

                          <div
                            className={`flex items-center text-sm font-medium ${isOrange ? "text-orange-400 group-hover:text-orange-300" : "text-blue-400 group-hover:text-blue-300"} transition-colors`}
                          >
                            View data
                            <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
