"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BarChart3, Database, ArrowRight } from "lucide-react";
import Sidebar from "@/components/Sidebar";

const cards = [
  {
    title: "Individual Bank Data",
    description:
      "A comprehensive set of data and indicators reflecting the structure, performance, and risk profile of individual banks. This dataset covers key metrics across capital, liquidity, credit, market, and strategic risks, curated and standardized by Betterbankings.",
    href: "/b-foresight/individual-bank-data",
    icon: BarChart3,
    accent: "orange",
  },
  {
    title: "Industry Bank Data",
    description:
      "A consolidated view of aggregated banking industry data. This section presents indicators such as banking deposit, lending, market and exchange rate, offering essential context for understanding the prevailing banking industry environment.",
    href: "/b-foresight/industry-bank-data",
    icon: Database,
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

// Decorative dots cluster
const DotsCluster = ({ className = "" }: { className?: string }) => (
  <div className={className}>
    <div className="w-2 h-2 rounded-full bg-current" />
    <div className="w-1.5 h-1.5 rounded-full bg-current absolute top-4 left-3 opacity-60" />
    <div className="w-1 h-1 rounded-full bg-current absolute top-1 left-5 opacity-40" />
  </div>
);

export default function BForesightPage() {
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
          className="absolute top-[5%] right-[15%] text-blue-500/10"
        >
          <Hexagon className="w-48 h-48" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.2 }}
          className="absolute top-[8%] right-[10%] text-blue-400/15"
        >
          <Hexagon className="w-20 h-20" filled />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="absolute bottom-[30%] left-[8%] text-slate-500/10"
        >
          <Hexagon className="w-32 h-32" filled />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.4 }}
          className="absolute bottom-[15%] right-[25%] text-orange-400/15"
        >
          <DotsCluster className="relative" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="absolute top-[40%] left-[3%] text-slate-400/8"
        >
          <Hexagon className="w-16 h-16" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.6 }}
          className="absolute bottom-[8%] left-[20%] text-blue-400/10"
        >
          <Hexagon className="w-24 h-24" />
        </motion.div>

        {/* Header */}
        <header className="relative z-10 pt-16 pb-12 px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight mb-4">
              B-FORESIGHT
            </h1>
            <p className="text-blue-100/50 text-lg max-w-xl">
              Your gateway to comprehensive banking data and risk analytics
            </p>
          </motion.div>
        </header>

        {/* Cards Section */}
        <section className="relative z-10 px-8 pb-24">
          <div className="max-w-5xl mx-auto space-y-16">
            {cards.map((card, index) => {
              const isOrange = card.accent === "orange";
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 + 0.3 }}
                  className={`${index === 1 ? "md:ml-auto md:mr-0" : "md:ml-0"} max-w-xl`}
                >
                  <Link href={card.href} className="group block">
                    {/* Card with soft background shape */}
                    <div className="relative">
                      {/* Soft blob background */}
                      <div
                        className={`absolute -inset-6 rounded-[2rem] opacity-[0.08] ${isOrange ? "bg-orange-400" : "bg-blue-400"}`}
                        style={{
                          borderRadius: "60% 40% 50% 50% / 50% 60% 40% 50%",
                          transform: "rotate(-3deg)",
                        }}
                      />

                      {/* Large background icon */}
                      <div
                        className={`absolute -top-4 -right-8 ${isOrange ? "text-orange-400/10" : "text-blue-400/10"}`}
                      >
                        <card.icon
                          className="w-32 h-32 rotate-12"
                          strokeWidth={1}
                        />
                      </div>

                      {/* Content */}
                      <div className="relative z-10 py-6 px-2">
                        {/* Small icon indicator */}
                        <div
                          className={`w-12 h-12 rounded-xl ${isOrange ? "bg-orange-500/20 text-orange-400" : "bg-blue-500/20 text-blue-400"} flex items-center justify-center mb-6`}
                        >
                          <card.icon className="w-6 h-6" />
                        </div>

                        <h2
                          className={`text-3xl md:text-4xl font-bold text-white mb-4 transition-colors ${isOrange ? "group-hover:text-orange-300" : "group-hover:text-blue-300"}`}
                        >
                          {card.title}
                        </h2>

                        <p className="text-blue-100/50 text-base leading-relaxed mb-6 max-w-md">
                          {card.description}
                        </p>

                        <div
                          className={`flex items-center font-medium ${isOrange ? "text-orange-400 group-hover:text-orange-300" : "text-blue-400 group-hover:text-blue-300"} transition-colors`}
                        >
                          Explore Data
                          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0f1a] to-transparent" />
      </main>
    </div>
  );
}
