"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BarChart3, Database, ArrowRight } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

const cards = [
  {
    title: "Individual Bank Data",
    description:
      "A comprehensive set of data and indicators reflecting the structure, performance, and risk profile of individual banks. This dataset covers key metrics across capital, liquidity, credit, market, and strategic risks, curated and standardized by Betterbankings.",
    href: "/b-foresight/individual-bank-data",
    icon: BarChart3,
    index: "01",
  },
  {
    title: "Industry Bank Data",
    description:
      "A consolidated view of aggregated banking industry data. This section presents indicators such as banking deposit, lending, market and exchange rate, offering essential context for understanding the prevailing banking industry environment.",
    href: "/b-foresight/industry-bank-data",
    icon: Database,
    index: "02",
  },
];

export default function BForesightPage() {
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
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: 60 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="h-1 bg-[#F48C25] rounded-full mb-6"
                />
                <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
                  B-<span className="text-[#F48C25]">FORESIGHT</span>
                </h1>
                <p className="text-white/60 text-lg max-w-xl">
                  Your gateway to comprehensive banking data and risk analytics
                </p>
              </motion.div>
            </div>
            {/* Curved bottom edge */}
            <div className="absolute bottom-0 left-0 right-0">
              <svg viewBox="0 0 1440 40" fill="none" className="w-full">
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
                {cards.map((card, index) => (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.15 + 0.3,
                      type: "spring",
                      stiffness: 100,
                    }}
                  >
                    <Link href={card.href} className="group block h-full">
                      <div className="relative h-full bg-white rounded-2xl border border-[#E1E7EF] overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-100/40 hover:-translate-y-1">
                        {/* Gradient accent bar */}
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#F48C25] to-[#355189] rounded-l-2xl" />

                        <div className="p-8 pl-10">
                          {/* Index number */}
                          <div className="flex items-start justify-between mb-6">
                            <div className="w-12 h-12 bg-[#355188] rounded-xl flex items-center justify-center text-white group-hover:bg-[#F48C25] transition-colors duration-300">
                              <card.icon className="w-6 h-6" />
                            </div>
                            <span className="text-5xl font-bold text-[#14213D]/[0.06] select-none">
                              {card.index}
                            </span>
                          </div>

                          <h2 className="text-2xl font-bold text-[#14213D] mb-3 group-hover:text-[#355189] transition-colors">
                            {card.title}
                          </h2>

                          <p className="text-[#535769] text-sm leading-relaxed mb-6">
                            {card.description}
                          </p>

                          <div className="flex items-center text-sm font-semibold text-[#F48C25] group-hover:text-[#E07A0B] transition-colors">
                            Explore Data
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
