"use client";

import { motion } from "framer-motion";
import { FileText, TrendingUp, ShieldCheck, Globe } from "lucide-react";

const FEATURES = [
  {
    icon: FileText,
    title: "Banking Data",
    description:
      "Comprehensive banking industry data from publicly available sources",
  },
  {
    icon: TrendingUp,
    title: "Risk Analysis",
    description: "Advanced risk indicators and performance metrics for banks",
  },
  {
    icon: ShieldCheck,
    title: "Regulatory Compliance",
    description: "Basel framework implementation and regulatory guidance",
  },
  // {
  //   icon: Globe,
  //   title: "Market Insights",
  //   description: "Real-time market and exchange rate analysis",
  // },
];

export default function WhySection() {
  return (
    <section className="z-10 w-full py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#14213D] mb-4">
            Why Better<span className="text-[#F48C25]">Bankings</span>
          </h2>
          <p className="text-[#535769]">
            Comprehensive tools and data to support banking excellence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 bg-white border border-[#E1E7EF] rounded-xl hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-[#355188] rounded-lg flex items-center justify-center text-white mb-6 group-hover:bg-[#F48C25] transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#14213D] md:mb-3">
                  {feature.title}
                </h3>
                <p className="text-normal text-[#535769] leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
