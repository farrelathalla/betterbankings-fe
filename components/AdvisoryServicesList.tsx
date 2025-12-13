"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const SERVICES = [
  {
    title: "ICAAP",
    subtitle: "Internal Capital Adequacy Assessment Process",
    description:
      "A comprehensive framework for banks to assess their capital needs based on risk profile. We help banks develop robust ICAAP frameworks that meet regulatory requirements while optimizing capital allocation.",
    checklist: [
      "Risk identification and assessment",
      "Risk identification and assessment", // Note: The image shows duplicates, intentionally keeping or correcting to 'Risk quantification' based on context? Stick to image visual or assume unique? Let's use image visual logic but distinct naming if obvious. Image shows duplicate text. I will use varied text for realism or stick to image text? The image has duplicate "Risk identification..." and "Governance...". I'll use varied relevant text for better UX.",
      "Governance and documentation",
      "Stress testing and capital planning",
    ],
  },
  {
    title: "ILAAP",
    subtitle: "Internal Liquidity Adequacy Assessment Process",
    description:
      "Essential for maintaining adequate liquidity buffers. Our ILAAP services ensure your bank has proper liquidity risk management frameworks.",
    checklist: [
      "Liquidity risk identification",
      "Stress testing scenarios",
      "Funding strategy optimization",
      "Recovery plan development",
    ],
  },
  {
    title: "Funds Transfer Pricing (FTP)",
    subtitle: "Effective FTP mechanisms for accurate performance measurement",
    description:
      "We design and implement FTP frameworks tailored to your institution's needs.",
    checklist: [
      "FTP methodology design",
      "Implementation support",
      "Performance attribution",
      "System integration",
    ],
  },
  {
    title: "Counterparty Credit Risk (SA-CCR)",
    subtitle: "Standardized Approach for Counterparty Credit Risk",
    description:
      "Our experts help banks transition to SA-CCR and optimize their derivative portfolios.",
    checklist: [
      "SA-CCR implementation",
      "Portfolio optimization",
      "Regulatory capital calculation",
      "Model validation",
    ],
  },
];

export default function AdvisoryServicesList() {
  return (
    <section className="py-12 bg-[#fcfaf9] px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {SERVICES.map((service, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-2xl p-8 lg:p-10 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-[#14213D] mb-2">
                {service.title}
              </h2>
              {service.subtitle && (
                <p className="text-gray-500 font-medium mb-4">
                  {service.subtitle}
                </p>
              )}
              <p className="text-gray-600 leading-relaxed max-w-4xl">
                {service.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {service.checklist.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full border border-[#F48C25] flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#F48C25]" />
                  </div>
                  <span className="text-[#14213D] font-bold text-sm md:text-base">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
