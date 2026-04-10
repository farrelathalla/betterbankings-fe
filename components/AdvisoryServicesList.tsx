"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const SERVICES = [
  {
    title: "Liquidity Risk & Funding",
    subtitle:
      "Designing resilient liquidity frameworks that stand up to supervisory scrutiny and market stress.",
    checklist: [
      "LCR, NSFR, FTP, ILAAP, and intraday liquidity frameworks",
      "End-to-end ILAAP design aligned with regulatory expectations",
      "Clear definition of liquidity risk appetite and tolerance",
    ],
    impact:
      "Stronger regulatory outcomes, improved liquidity buffers, and clearer management action triggers",
  },
  {
    title: "Interest Rate Risk in the Banking Book (IRRBB)",
    subtitle:
      "Enhancing earnings stability and economic value through robust IRRBB frameworks.",
    checklist: [
      "Alignment with Basel IRRBB standards and local regulations",
      "Behavioural modelling of non-maturing deposits and prepayments",
    ],
    impact:
      "Reduced earnings volatility, more stable EVE profiles, and better pricing and hedging decisions",
  },
  {
    title: "Market & Counterparty Risk",
    subtitle:
      "Supporting banks in managing traded risks and meeting evolving regulatory standards.",
    checklist: [
      "FRTB implementation and market risk frameworks",
      "Counterparty credit risk and CVA",
    ],
    impact:
      "Improved capital efficiency and stronger alignment with trading and treasury strategies",
  },
  {
    title: "Credit Risk",
    subtitle: "Building practical, decision-useful credit risk models.",
    checklist: ["Credit risk modelling and analytics"],
    impact:
      "Better risk differentiation, improved portfolio insights, and enhanced capital allocation",
  },
  {
    title: "Risk Governance & Regulatory Reporting",
    subtitle: "Strengthening oversight and supervisory engagement.",
    checklist: [
      "Financial risk governance frameworks",
      "Regulatory reporting and submission processes",
    ],
    impact:
      "Clearer accountability, more consistent reporting, and stronger regulatory confidence",
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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

            <p className="text-sm text-[#535769] italic border-t border-gray-100 pt-4">
              <span className="font-semibold not-italic text-[#14213D]">Impact:</span>{" "}
              {service.impact}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
