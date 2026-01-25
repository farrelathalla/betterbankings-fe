"use client";

import React from "react";
import { motion } from "framer-motion";
import Magazine from "./Magazine";

const BROCHURE_IMAGES = [
  "/brochure/1.webp",
  "/brochure/2.webp",
  "/brochure/3.webp",
  "/brochure/4.webp",
  "/brochure/5.webp",
  "/brochure/6.webp",
];

export default function AdvisoryMagazine() {
  return (
    <section className="py-16 bg-[#fcfaf9] px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#14213D] mb-4">
            Our <span className="text-[#F48C25]">Brochure</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our services and capabilities through our digital brochure
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Magazine allPageImages={BROCHURE_IMAGES} />
        </motion.div>
      </div>
    </section>
  );
}
