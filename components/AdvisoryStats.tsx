"use client";

import { motion } from "framer-motion";

const STATS = [
  { value: "15+", label: "Years Experience" },
  { value: "$2B+", label: "Assets Managed" },
  { value: "500+", label: "Trusted Clients" },
  { value: "24/7", label: "Expert Support" },
];

export default function AdvisoryStats() {
  return (
    <section className="py-12 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {STATS.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <h3 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#14213D] to-[#355189] mb-2">
                {stat.value}
              </h3>
              <p className="text-gray-500 font-medium text-sm md:text-base">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
