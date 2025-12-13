"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
// Assuming the user put the image in public/home.webp
import HomeImage from "@/public/home.webp";
import HomeImage2 from "@/public/home2.webp";

export default function Hero() {
  return (
    <section className="z-10 width-full px-6 pt-24 pb-12 md:px-12 md:py-24 xl:pl-24 xl:pr-0 flex flex-col xl:flex-row items-center justify-between md:gap-12 overflow-hidden">
      {/* Text Content */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full xl:w-1/2"
      >
        <h1 className="text-5xl md:text-6xl xl:text-7xl font-bold text-[#14213D] leading-none tracking-tight mb-6">
          For A <span className="text-[#F48C25]">Better</span> <br />
          Banking Sector
        </h1>
        <p className="text-lg md:text-xl text-[#555555] mb-8 leading-normal">
          We support banks and financial authorities in the development of a
          sound, sustainable and competitive banking industry.
        </p>

        <Link href="#learn-more">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-gradient-to-r from-[#1B2B4B] to-[#355189] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#1e2f52] transition-colors shadow-lg"
          >
            Learn More
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </Link>
      </motion.div>

      {/* Image Content */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="w-full xl:w-1/2 flex justify-center lg:justify-end relative"
      >
        {/* Decorative elements could be added here */}
        <div className="relative w-full aspect-[4/3]">
          <picture>
            <source
              srcSet={HomeImage2.src}
              media="(min-width: 1024px)" // lg
            />
            <Image
              src={HomeImage}
              alt="Better Banking Dashboard"
              fill
              className="object-contain lg:object-right"
              priority
            />
          </picture>
        </div>
      </motion.div>
    </section>
  );
}
