"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const SLIDES = [
  {
    id: 1,
    title: "Secure Banking",
    description:
      "Your security is our top priority. Advanced encryption standard.",
    image: "/1c.webp",
  },
  {
    id: 2,
    title: "Global Approach",
    description: "Access your funds from anywhere in the world with ease.",
    image: "/Group 70.webp",
  },
  {
    id: 3,
    title: "Future Ready",
    description: "Innovative tools to help you plan your financial future.",
    image: "/3c.webp",
  },
];

export default function Carousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-screen w-auto z-0 overflow-hidden">
      {/* Invisible spacer to maintain container width */}
      <Image
        src={SLIDES[current].image}
        alt="Spacer"
        width={0}
        height={0}
        sizes="100vh"
        className="h-full w-auto opacity-0 invisible"
        priority
      />

      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={current}
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 h-full w-auto"
        >
          <Image
            src={SLIDES[current].image}
            alt={SLIDES[current].title}
            width={0}
            height={0}
            sizes="100vh"
            className="h-full w-auto object-cover"
            priority
          />
        </motion.div>
      </AnimatePresence>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-20">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === current
                ? "bg-white w-6"
                : "bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
