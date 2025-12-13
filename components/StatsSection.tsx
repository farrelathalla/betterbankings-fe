"use client";

import { motion } from "framer-motion";

const STATS = [
  { value: "50+", label: "Banks Analyzed" },
  { value: "10Y+", label: "Historical Data" },
  { value: "99.9%", label: "Data Accuracy" },
  { value: "24/7", label: "Support" },
];

export default function StatsSection() {
  return (
    <section className="z-10 px-6 md:px-12 xl:px-24" id="learn-more">
      <div className="w-full bg-white py-4 rounded-xl border border-[#E1E7EF]">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 xl:grid-cols-4 gap-8">
          {STATS.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center justify-center text-center p-4 border-r last:border-r-0 border-[#E1E7EF]"
            >
              <h3 className="text-5xl lg:text-6xl font-bold bg-gradient-to-b from-[#82ACFF] to-[#F48C25] bg-clip-text text-transparent">
                {stat.value}
              </h3>
              <p className="text-[#535769] font-medium mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
