"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { EASE } from "./ProductLanding";

/* ------------------------------------------------------------------ */
/*  ILAAP Risk Cube: Time, Scenario and Response                       */
/* ------------------------------------------------------------------ */

const FACES = [
  { points: "20,62 106,20 193,62 106,106", fill: "#B5D7E8", from: { y: -18 } },
  { points: "20,62 106,106 106,205 20,160", fill: "#287AA7", from: { x: -16 } },
  { points: "106,106 193,62 193,160 106,205", fill: "#173C5C", from: { x: 16 } },
];

const LABELS = [
  { x: 106, y: 65, fill: "#102d49", text: "Response" },
  { x: 62, y: 137, fill: "#fff", text: "Time" },
  { x: 151, y: 136, fill: "#fff", text: "Scenario" },
];

/** The cube assembles face by face, then drifts gently. */
export function RiskCube({ className }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 215 224"
      role="img"
      aria-labelledby="cube-title cube-desc"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "block h-auto w-full drop-shadow-[0_14px_18px_rgba(9,28,44,0.45)]",
        className,
      )}
      animate={{ y: [0, -7, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}
    >
      <title id="cube-title">The three dimensions of the ILAAP Risk Cube</title>
      <desc id="cube-desc">
        A conceptual cube showing time, scenario and response as connected
        dimensions of liquidity adequacy.
      </desc>
      {FACES.map((f, i) => (
        <motion.polygon
          key={f.points}
          points={f.points}
          fill={f.fill}
          stroke="#fff"
          strokeWidth={1.2}
          strokeLinejoin="round"
          initial={{ opacity: 0, x: 0, y: 0, ...f.from }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.25 + i * 0.15 }}
        />
      ))}
      <g
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight={700}
        fontSize={11}
        textAnchor="middle"
      >
        {LABELS.map((l, i) => (
          <motion.text
            key={l.text}
            x={l.x}
            y={l.y}
            fill={l.fill}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.95 + i * 0.1 }}
          >
            {l.text}
          </motion.text>
        ))}
      </g>
    </motion.svg>
  );
}

export function RiskCubeHeroArt() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="flex items-center justify-center gap-5 lg:flex-col lg:gap-0"
    >
      <RiskCube className="w-[150px] min-[381px]:w-[175px] lg:mx-auto lg:w-full lg:max-w-[310px]" />
      <p className="max-w-[170px] text-left text-xs leading-relaxed text-[#b8dff1] lg:mt-3 lg:max-w-none lg:text-center">
        Time, scenario and response.
        <br />
        Three connected views of liquidity adequacy.
      </p>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Counterparty Capital Calculator: SA-CCR, BA-CVA, CCP               */
/* ------------------------------------------------------------------ */

const MODULES = [
  { code: "SA-CCR", label: "Counterparty credit risk" },
  { code: "BA-CVA", label: "Reduced Basic Approach" },
  { code: "CCP", label: "Clearing exposures" },
];

/**
 * Three stacked modules on desktop, three columns on narrow screens.
 * `compact` keeps the stacked layout at every width for use inside cards.
 */
export function ModuleMap({
  compact = false,
  animateOnMount = true,
}: {
  compact?: boolean;
  animateOnMount?: boolean;
}) {
  const trigger = animateOnMount
    ? { animate: "show" }
    : { whileInView: "show", viewport: { once: true, margin: "-40px" } };

  return (
    <motion.div
      initial="hidden"
      {...trigger}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
      }}
      className={cn(
        "relative border-y border-[#547087]",
        compact
          ? "py-1"
          : "grid grid-cols-3 gap-3.5 py-[18px] lg:block lg:py-2.5",
      )}
    >
      {MODULES.map((m, i) => (
        <motion.div
          key={m.code}
          variants={{
            hidden: { opacity: 0, x: 18 },
            show: {
              opacity: 1,
              x: 0,
              transition: { duration: 0.6, ease: EASE },
            },
          }}
          className={cn(
            "group/module relative",
            compact
              ? "grid grid-cols-[34px_1fr] items-start gap-2 px-1 py-4"
              : "block lg:grid lg:grid-cols-[38px_1fr] lg:items-start lg:gap-2.5 lg:px-1 lg:py-6",
            i > 0 &&
              (compact
                ? "border-t border-[#35546d]"
                : "lg:border-t lg:border-[#35546d]"),
          )}
        >
          <span
            aria-hidden
            className={cn(
              "text-xs font-bold text-[#e9a261]",
              compact ? "mt-1.5" : "mb-2 block lg:mt-[7px] lg:mb-0",
            )}
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="min-w-0 transition-transform duration-300 group-hover/module:translate-x-1">
            <strong
              className={cn(
                "block font-bold leading-tight tracking-[-0.015em] text-white",
                compact
                  ? "text-2xl"
                  : "text-[20px] min-[381px]:text-[23px] lg:text-[28px]",
              )}
            >
              {m.code}
            </strong>
            <span
              className={cn(
                "mt-1.5 block text-[#b8dff1]",
                compact ? "text-[13px]" : "text-xs lg:text-sm",
              )}
            >
              {m.label}
            </span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

export function ModuleMapHeroArt() {
  return (
    <div aria-label="Three connected calculations" role="group">
      <ModuleMap />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.85 }}
        className="mt-3.5 text-xs text-[#b8dff1]"
      >
        One Excel-based calculator. Three connected calculations.
      </motion.p>
    </div>
  );
}
