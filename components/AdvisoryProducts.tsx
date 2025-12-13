"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import HomeImage from "@/public/home.webp";

const PRODUCTS = [
  {
    title: "B-Foresight",
    description:
      "Our comprehensive banking industry data platform providing insights from publicly available sources.",
    image: HomeImage, // Placeholder
  },
  {
    title: "RegsMap",
    description:
      "Navigate complex banking regulations with our regulatory mapping and analysis tools.",
    image: HomeImage, // Placeholder
  },
];

export default function AdvisoryProducts() {
  return (
    <section className="py-20 bg-[#fcfaf9] px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-[#14213D]">
            Our <span className="text-[#F48C25]">Products</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {PRODUCTS.map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col"
            >
              <div className="relative aspect-[16/9] w-full p-6 bg-gray-50 flex items-center justify-center">
                {/* Visual placeholder matching style */}
                <div className="relative w-full h-full rounded-lg overflow-hidden shadow-sm">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover object-top"
                  />
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col items-start">
                <h3 className="text-2xl font-bold text-[#14213D] mb-4">
                  {product.title}
                </h3>
                <p className="text-gray-600 mb-8 leading-relaxed flex-1">
                  {product.description}
                </p>

                <button className="flex items-center gap-2 px-6 py-3 bg-[#1B2B4B] text-white font-semibold rounded-lg hover:bg-[#2a4069] transition-colors">
                  Learn More
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
