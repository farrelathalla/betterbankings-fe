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
            Our <span className="text-[#F48C25]">Services</span>
          </h2>
        </div>

        <div className="z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* RegMaps Card */}
          <motion.div
            whileHover={{ y: -10 }}
            className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-3xl font-bold text-[#14213D] mb-4">
                RegMaps
              </h3>
              <p className="text-[#535769] mb-8 leading-relaxed">
                RegMaps is the brandname representing Betterbankings' initiative
                to provide an efficient and effective way to navigate through
                complex banking regulations. Regmaps is also supported by our
                Betterbankings advisory team with a focus on tracking,
                interpreting and analysing the Indonesian financial sector
                regulations.
                <br></br> <br></br>
                Development of reliable RegMaps is taking time. In the interim
                we have started with a special section in this website called
                "Basel Center" with the purpose to provide readers with key
                transposition of the Basel Framework into Indonesian regulatory
                framework
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
                B-foresight is the brand name representing BetterBankings'
                initiative to collect and curate accounting, prudential and
                financial industry data diligently. We will make some of our
                data and reports publicly available to enhance quality of banks'
                disclosure to stakeholders and bolster market discipline. The
                vastness and uniqueness of our data also enable customised
                analysis of individual bank counterparties
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
                Expert guidance on Basel Framework implementation, risk
                management, and regulatory compliance. Our specialist team
                provides deep insights into ICAAP, ILAAP, SA-CCR, and FTP,
                helping financial institutions navigate complex regulatory
                landscapes with confidence and precision.
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

          {/* Software Products Card */}
          <motion.div
            whileHover={{ y: -10 }}
            className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-3xl font-bold text-[#14213D] mb-4">
                Software Products
              </h3>
              <p className="text-[#535769] mb-8 leading-relaxed">
                Enterprise-grade risk management software engineered to elevate
                banking operations. From credit risk to market analysis, our
                integrated platform provides precision tools for financial
                institutions to manage risk effectively and meet modern
                regulatory standards.
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
        </div>
      </div>
    </section>
  );
}
