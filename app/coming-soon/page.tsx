"use client";

import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row overflow-x-hidden">
      <Sidebar />

      <main className="w-full flex-1 lg:ml-[280px] relative flex flex-col">
        {/* Background decorations */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-orange-50 rounded-full blur-[100px] opacity-60"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-50 rounded-full blur-[100px] opacity-60"></div>
        </div>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            {/* Icon/Visual */}
            <div className="w-24 h-24 bg-gradient-to-br from-[#F48C25] to-[#E07A0B] rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-orange-200 rotate-3">
              <Clock className="w-12 h-12 text-white" />
            </div>

            {/* Content */}
            <h1 className="text-4xl lg:text-5xl font-bold text-[#14213D] mb-6">
              Something <span className="text-[#F48C25]">Exciting</span> is
              Coming
            </h1>
            <p className="text-gray-500 text-lg mb-10 leading-relaxed">
              We're working hard to bring you{" "}
              <span className="font-semibold text-[#14213D]">
                BetterBankings Angle
              </span>
              . This feature will be available soon with insightful
              conversations and expert analysis of the banking industry.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#1B2B4B] to-[#355189] text-white rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg shadow-blue-100"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
            </div>

            {/* Additional Info */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-4 rounded-2xl bg-white border border-[#E1E7EF] shadow-sm">
                <div className="text-[#F48C25] font-bold text-xl mb-1">
                  Coming Soon
                </div>
                <div className="text-gray-500 text-sm">
                  BetterBankings Angle
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#E1E7EF] shadow-sm">
                <div className="text-[#355189] font-bold text-xl mb-1">
                  Podcast
                </div>
                <div className="text-gray-500 text-sm">Industry Insights</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#E1E7EF] shadow-sm">
                <div className="text-green-600 font-bold text-xl mb-1">
                  Expertise
                </div>
                <div className="text-gray-500 text-sm">Banking Leaders</div>
              </div>
            </div>
          </motion.div>
        </div>

        <Footer />
      </main>
    </div>
  );
}
