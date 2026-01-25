"use client";

import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

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
                with confidence—strengthening both strategic decision‑making and
                organizational resilience.
              </motion.p>
            </div>
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
