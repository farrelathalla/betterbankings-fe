"use client";

import { motion } from "framer-motion";
import { Share2, Database, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function ServicesSection() {
  return (
    <section className="z-10 w-full py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-[#14213D] tracking-tight">
            Our <span className="text-[#F48C25]">Services</span>
          </h2>
        </div>

        <div className="z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Advisory Services Card */}
          <motion.div
            whileHover={{ y: -10 }}
            className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-3xl font-bold text-[#14213D] mb-4">
                Advisory Services
              </h3>
              <p className="text-[#535769] mb-8 leading-relaxed">
                ICAAP, ILAAP, Funds Transfer Pricing, Counterparty Credit Risk
                (Standardized Approach, SACCR)
              </p>
            </div>

            <div className="flex items-end justify-between">
              <Link href="/advisory-services">
                <button className="flex items-center gap-2 bg-gradient-to-r from-[#1B2B4B] to-[#355189] text-white px-6 py-3 rounded-lg font-semibold text-normal hover:bg-[#2a3c5e] transition-colors">
                  Learn More
                  <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
              <Share2 className="w-24 h-24 text-[#F48C25] opacity-80" />
            </div>
          </motion.div>

          {/* B-Foresight Card */}
          <motion.div
            whileHover={{ y: -10 }}
            className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-3xl font-bold text-[#14213D] mb-4">
                B-Foresight
              </h3>
              <p className="text-[#535769] mb-8 leading-relaxed">
                Banking industry data and analytics platform for informed
                decision-making
              </p>
            </div>

            <div className="flex items-end justify-between">
              <Link href="/b-foresight">
                <button className="flex items-center gap-2 bg-gradient-to-r from-[#1B2B4B] to-[#355189] text-white px-6 py-3 rounded-lg font-semibold text-normal hover:bg-[#2a3c5e] transition-colors">
                  Learn More
                  <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
              <Database className="w-24 h-24 text-[#F48C25] opacity-80" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
