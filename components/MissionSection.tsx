"use client";

import { motion } from "framer-motion";
import Image from "next/image";
// Assuming the user put the image in public/mission.webp
import MissionImage from "@/public/mission.webp";
import { cn } from "@/lib/utils";

export default function MissionSection() {
  return (
    <section className="z-10 width-full py-16 px-6 md:px-12 xl:px-24 flex flex-col md:flex-row items-center">
      {/* Image Left */}
      <div className="flex flex-col xl:flex-row items-center gap-12 xl:gap-24 bg-white border border-[#E1E7EF] rounded-xl p-8">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full xl:w-1/2 flex justify-center"
        >
          <div className="relative w-full h-auto aspect-video bg-gradient-to-br from-[#E2ECFF] to-[#FEF6F0] rounded-2xl flex items-center justify-center p-4 md:p-8">
            {/* Using the user provided image */}
            <Image
              src={MissionImage}
              alt="Our Mission Graph"
              className="object-contain drop-shadow-lg"
            />
          </div>
        </motion.div>

        {/* Text Right */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full xl:w-1/2"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-[#14213D] mb-3 md:mb-6 tracking-tight">
            Our Mission
          </h2>
          <p className="text-[#535769] text-lg leading-normal">
            Our mission is to strengthen Indonesia's banking sector through
            data-driven insights and innovative solutions that promote
            transparency, efficiency, and sustainable growth.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
