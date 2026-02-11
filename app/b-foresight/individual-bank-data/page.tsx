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
import Footer from "@/components/Footer";

const sections = [
  {
    title: "Capital and Solvency",
    description:
      "Assesses a bank's financial resilience and its capacity to absorb losses. This section includes capital adequacy ratios, capital structure, and risk‑weighted assets, providing insights into overall bank capital sufficiency.",
    href: "/b-foresight/individual-bank-data/capital-solvency",
    icon: Landmark,
    index: "01",
  },
  {
    title: "Credit and Market Risk",
    description:
      "Covers exposures arising from lending activities and market movements. These include data on loan quality, non-performing loans (NPLs), and Interest Rate Risk in Banking Book (IRRBB).",
    href: "/b-foresight/individual-bank-data/credit-market-risk",
    icon: ShieldCheck,
    index: "02",
  },
  {
    title: "Funding and Liquidity",
    description:
      "Examines a bank's funding structure and liquidity position. These include deposit composition, Liquidity Coverage Ratio (LCR), and Net Stable Funding Ratio (NSFR).",
    href: "/b-foresight/individual-bank-data/funding-liquidity",
    icon: PiggyBank,
    index: "03",
  },
  {
    title: "Performance and Risk Monitoring",
    description:
      "Monitors overall financial performance and emerging risk trends. This section includes profitability metrics, Betterbankings' proprietary bank scoring, and risk indicator heatmaps.",
    href: "/b-foresight/individual-bank-data/performance-monitoring",
    icon: Activity,
    index: "04",
  },
];

export default function IndividualBankDataPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row overflow-x-hidden">
      <Sidebar />

      <main className="w-full flex-1 lg:ml-[280px] relative flex flex-col">
        {/* Subtle background gradient blobs */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-orange-50 rounded-full blur-[100px] opacity-60" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-50 rounded-full blur-[100px] opacity-60" />
        </div>

        <div className="relative z-10 flex-1">
          {/* Hero Banner */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#14213D] via-[#1B2B4B] to-[#355189]" />
            <div
              className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage: `radial-gradient(circle at 20% 50%, #F48C25 0%, transparent 50%), radial-gradient(circle at 80% 20%, #F48C25 0%, transparent 40%)`,
              }}
            />
            <div className="relative z-10 px-6 lg:px-12 pt-24 pb-16">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl"
              >
                <Link
                  href="/b-foresight"
                  className="inline-flex items-center text-white/50 hover:text-[#F48C25] text-sm font-medium mb-6 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  B-FORESIGHT
                </Link>

                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: 60 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="h-1 bg-[#F48C25] rounded-full mb-6"
                />
                <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
                  Individual <span className="text-[#F48C25]">Bank Data</span>
                </h1>
                <p className="text-white/60 text-lg max-w-2xl">
                  Comprehensive metrics and risk indicators for specific banking
                  institutions
                </p>
              </motion.div>
            </div>
            {/* Curved bottom edge */}
            <div className="absolute -bottom-px left-0 right-0">
              <svg viewBox="0 0 1440 40" fill="none" className="w-full block">
                <path
                  d="M0 40V0c240 28 480 40 720 40S1200 28 1440 0v40H0z"
                  fill="#F8FAFC"
                />
              </svg>
            </div>
          </div>

          {/* Cards Section */}
          <section className="px-6 lg:px-12 py-12">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {sections.map((section, index) => (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1 + 0.3,
                      type: "spring",
                      stiffness: 100,
                    }}
                  >
                    <Link href={section.href} className="group block h-full">
                      <div className="relative h-full bg-white rounded-2xl border border-[#E1E7EF] overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-100/40 hover:-translate-y-1">
                        {/* Gradient accent bar */}
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#F48C25] to-[#355189] rounded-l-2xl" />

                        <div className="p-8 pl-10">
                          {/* Icon & Index */}
                          <div className="flex items-start justify-between mb-6">
                            <div className="w-12 h-12 bg-[#355188] rounded-xl flex items-center justify-center text-white group-hover:bg-[#F48C25] transition-colors duration-300">
                              <section.icon className="w-6 h-6" />
                            </div>
                            <span className="text-5xl font-bold text-[#14213D]/[0.06] select-none">
                              {section.index}
                            </span>
                          </div>

                          <h2 className="text-xl font-bold text-[#14213D] mb-3 group-hover:text-[#355189] transition-colors">
                            {section.title}
                          </h2>

                          <p className="text-[#535769] text-sm leading-relaxed mb-6">
                            {section.description}
                          </p>

                          <div className="flex items-center text-sm font-semibold text-[#F48C25] group-hover:text-[#E07A0B] transition-colors">
                            View Metrics
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <Footer />
      </main>
    </div>
  );
}
