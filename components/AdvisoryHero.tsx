"use client";

import { motion } from "framer-motion";

export default function AdvisoryHero() {
  return (
    <section className="relative w-full bg-[#fcfaf9] py-20 lg:py-28 px-6 text-center">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#14213D] mb-6 tracking-tight"
        >
          Advisory <span className="text-[#F48C25]">Services</span> and{" "}
          <span className="text-[#F48C25]">Products</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
        >
          Expert consulting services to help banks navigate regulatory
          requirements, optimize operations, and strengthen risk management
          frameworks.
        </motion.p>
      </div>
    </section>
  );
}
