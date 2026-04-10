"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const GLANCE_POINTS = [
  "Independent advisory and data platform for the banking sector",
  "Expertise in prudential regulation, risk management, and software implementation",
  "Indonesia-focused with regional reach",
  "Led by senior practitioners with deep experience across capital markets, regulation, and risk",
  "Trusted by banks, investors, and risk, treasury, and compliance professionals",
];

export default function WhySection() {
  return (
    <section className="z-10 w-full py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#14213D] mb-4">
            Better<span className="text-[#F48C25]">Bankings</span> at a Glance
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {GLANCE_POINTS.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-4 p-6 bg-white border border-[#E1E7EF] rounded-xl"
            >
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#F48C25]/10 flex items-center justify-center mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-[#F48C25]" />
              </div>
              <p className="text-[#14213D] font-medium text-lg leading-snug">{point}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
