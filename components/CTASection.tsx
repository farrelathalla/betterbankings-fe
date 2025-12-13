"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Mail } from "lucide-react";

export default function CTASection() {
  return (
    <section className="z-10 w-full py-12 bg-gradient-to-b from-[#1B294B] to-[#355189] text-white text-center px-6">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        className="mx-auto"
      >
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
          Ready to transform your banking insights?
        </h2>
        <p className="text-[#D5D5D5] text-lg mb-10 max-w-2xl mx-auto">
          Get access to comprehensive banking data and analytics
        </p>

        <a href="mailto:info@betterbankings.com">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-[#F48C25] to-[#BA6715] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#e09210] transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            <Mail className="w-5 h-5" />
            Contact Us
          </motion.button>
        </a>
      </motion.div>
    </section>
  );
}
