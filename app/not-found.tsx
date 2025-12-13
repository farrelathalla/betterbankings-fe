"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Home } from "lucide-react";
import Image from "next/image";
import EllipseBlue from "@/public/ellipse-blue.svg";
import EllipseYellow from "@/public/ellipse-yellow.svg";

export default function NotFound() {
  return (
    <div className="relative h-screen w-full bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center overflow-hidden">
      <Image
        src={EllipseBlue}
        alt="Ellipse Blue"
        className="absolute -top-[15%] -left-[15%] opacity-70"
      />
      <Image
        src={EllipseYellow}
        alt="Ellipse Yellow"
        className="absolute -bottom-[15%] -right-[15%]"
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full z-10"
      >
        <h1 className="z-10 text-9xl font-bold bg-gradient-to-b from-[#82ACFF] to-[#F48C25] bg-clip-text text-transparent mb-4">
          404
        </h1>
        <h2 className="z-10 text-3xl font-bold text-[#14213D] mb-4">
          Page Not Found
        </h2>
        <p className="z-10 text-[#535769] text-lg mb-8 leading-relaxed">
          The page you are looking for doesn't exist or has been moved. Let's
          get you back to banking better.
        </p>

        <Link href="/" className="z-10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-2 bg-linear-to-r from-[#1B2B4B] to-[#355189] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#1e2f52] transition-all shadow-lg mx-auto"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back Home
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
