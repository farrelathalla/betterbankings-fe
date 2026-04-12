"use client";

import { motion } from "framer-motion";
import {
  Share2,
  Database,
  ChevronRight,
  Briefcase,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";

export default function ServicesSection() {
  return (
    <section className="z-10 w-full py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-[#14213D] tracking-tight">
            Our <span className="text-[#F48C25]">Products and Services</span>
          </h2>
        </div>

        <div className="z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* I. Professional Services in Data and Software */}
          <motion.div
            whileHover={{ y: -10 }}
            className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-[#F48C25]/10 text-[#F48C25] font-bold px-3 py-1 rounded text-sm">
                  I
                </span>
                <h3 className="text-3xl font-bold text-[#14213D]">
                  Professional Services in Data and Software
                </h3>
              </div>
              <p className="text-[#535769] mb-8 leading-relaxed">
                We enable banks to fully leverage their software investments
                across balance sheet management, market risk, and liquidity risk
                reporting—transforming systems into powerful tools that
                strengthen risk management rigor, and improve the quality of
                regulatory reporting.
              </p>
            </div>

            <div className="flex items-end justify-between">
              <Link href="/advisory-products">
                <button className="flex items-center gap-2 bg-gradient-to-r from-[#1B2B4B] to-[#355189] text-white px-6 py-3 rounded-lg font-semibold text-normal hover:bg-[#2a3c5e] transition-colors">
                  Learn More
                  <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
              <ShoppingBag className="w-24 h-24 text-[#F48C25] opacity-80" />
            </div>
          </motion.div>

          {/* II. Risk Practices and Advisories */}
          <motion.div
            whileHover={{ y: -10 }}
            className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-[#F48C25]/10 text-[#F48C25] font-bold px-3 py-1 rounded text-sm">
                  II
                </span>
                <h3 className="text-3xl font-bold text-[#14213D]">
                  Risk Practices and Advisories
                </h3>
              </div>
              <p className="text-[#535769] mb-8 leading-relaxed">
                Boutique expertise in financial risk management. We help banks
                navigate complex regulatory requirements through practical,
                implementation-focused solutions—bridging regulatory
                expectations with real-world balance sheet management.
              </p>
            </div>

            <div className="flex items-end justify-between">
              <Link href="/advisory-services">
                <button className="flex items-center gap-2 bg-gradient-to-r from-[#1B2B4B] to-[#355189] text-white px-6 py-3 rounded-lg font-semibold text-normal hover:bg-[#2a3c5e] transition-colors">
                  Learn More
                  <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
              <Briefcase className="w-24 h-24 text-[#F48C25] opacity-80" />
            </div>
          </motion.div>

          {/* III. Industry Data & Analytics */}
          <motion.div
            whileHover={{ y: -10 }}
            className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-[#F48C25]/10 text-[#F48C25] font-bold px-3 py-1 rounded text-sm">
                  III
                </span>
                <h3 className="text-3xl font-bold text-[#14213D]">
                  Industry Data & Analytics
                </h3>
              </div>
              <p className="text-[#535769] mb-8 leading-relaxed">
                Transforming publicly available banking data into structured
                insights that support benchmarking, peer analysis, and strategic
                decision-making. Industry Data & Analytics are delivered under
                our B-foresights brand.
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

          {/* IV. Regulatory Consulting (Regsmap) */}
          <motion.div
            whileHover={{ y: -10 }}
            className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-[#F48C25]/10 text-[#F48C25] font-bold px-3 py-1 rounded text-sm">
                  IV
                </span>
                <h3 className="text-3xl font-bold text-[#14213D]">
                  Regulatory Consulting (Regsmap)
                </h3>
              </div>
              <p className="text-[#535769] mb-8 leading-relaxed">
                Helping banks interpret, track, and implement financial risk
                regulations with clarity and confidence. Delivered through our
                Regsmap platform, supporting banks in understanding and
                complying with complex financial risk regulations.
              </p>
            </div>

            <div className="flex items-end justify-between">
              <Link href="/regmaps">
                <button className="flex items-center gap-2 bg-gradient-to-r from-[#1B2B4B] to-[#355189] text-white px-6 py-3 rounded-lg font-semibold text-normal hover:bg-[#2a3c5e] transition-colors">
                  Learn More
                  <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
              <Share2 className="w-24 h-24 text-[#F48C25] opacity-80" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
