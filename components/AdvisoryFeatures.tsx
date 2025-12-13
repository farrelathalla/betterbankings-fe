"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  ShieldCheck,
  PieChart,
  Globe,
  Briefcase,
  Coins,
} from "lucide-react";

const FEATURES = [
  {
    icon: TrendingUp,
    title: "Wealth Management",
    description:
      "Comprehensive strategies to grow and preserve your wealth over generations.",
  },
  {
    icon: ShieldCheck,
    title: "Risk Assessment",
    description:
      "Identify and mitigate potential financial risks with our expert analysis.",
  },
  {
    icon: PieChart,
    title: "Portfolio Diversification",
    description:
      "Optimize your investment portfolio across various asset classes for stability.",
  },
  {
    icon: Globe,
    title: "Global Investment",
    description:
      "Access international markets and emerging opportunities worldwide.",
  },
  {
    icon: Briefcase,
    title: "Business Advisory",
    description:
      "Strategic financial guidance for business owners and entrepreneurs.",
  },
  {
    icon: Coins,
    title: "Retirement Planning",
    description:
      "Secure your future with tailored retirement income strategies.",
  },
];

export default function AdvisoryFeatures() {
  return (
    <section className="py-20 bg-[#f8f9fa]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#14213D] mb-4">
            Comprehensive{" "}
            <span className="text-[#FCA311]">Advisory Solutions</span>
          </h2>
          <p className="text-gray-600">
            We offer a wide range of specialized services designed to meet your
            unique financial needs and help you navigate complex markets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 group"
            >
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#14213D] transition-colors duration-300">
                <feature.icon className="w-7 h-7 text-[#14213D] group-hover:text-[#FCA311] transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-[#14213D] mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-500 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
