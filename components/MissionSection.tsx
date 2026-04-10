"use client";

import { motion } from "framer-motion";

function BetterBankingsDiagram() {
  return (
    <svg
      viewBox="0 0 500 460"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* Connecting lines from center hub to each circle edge */}
      <line x1="250" y1="157" x2="250" y2="203" stroke="#CBD5E1" strokeWidth="2.5" strokeDasharray="5,3"/>
      <line x1="250" y1="247" x2="250" y2="293" stroke="#CBD5E1" strokeWidth="2.5" strokeDasharray="5,3"/>
      <line x1="147" y1="225" x2="228" y2="225" stroke="#CBD5E1" strokeWidth="2.5" strokeDasharray="5,3"/>
      <line x1="272" y1="225" x2="353" y2="225" stroke="#CBD5E1" strokeWidth="2.5" strokeDasharray="5,3"/>

      {/* Center hub */}
      <circle cx="250" cy="225" r="22" fill="#14213D"/>
      <circle cx="250" cy="225" r="13" fill="white" opacity="0.2"/>
      <circle cx="250" cy="225" r="6" fill="white" opacity="0.5"/>

      {/* ── TOP: Risk Practice (navy) ── cy=92, r=65 → spans y=27..157 */}
      <circle cx="250" cy="92" r="65" fill="#14213D"/>
      <circle cx="250" cy="92" r="58" fill="#1B294B"/>
      {/* Shield icon: centered at (250, 79), height ~30px */}
      <path
        d="M250 64 L237 70 V82 C237 93 243 100 250 103 C257 100 263 93 263 82 V70 Z"
        fill="none" stroke="white" strokeWidth="2.5" strokeLinejoin="round"
      />
      {/* Checkmark inside shield */}
      <path d="M244 85 L248 90 L257 79"
        fill="none" stroke="#F48C25" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      />
      <text x="250" y="117" textAnchor="middle" fill="white" fontSize="13" fontWeight="700" fontFamily="sans-serif">Risk</text>
      <text x="250" y="134" textAnchor="middle" fill="white" fontSize="13" fontWeight="700" fontFamily="sans-serif">Practice</text>

      {/* ── LEFT: Software & Services (orange) ── cx=82, cy=225, r=65 → spans x=17..147 */}
      <circle cx="82" cy="225" r="65" fill="#F48C25"/>
      <circle cx="82" cy="225" r="58" fill="#E07B18"/>
      {/* Gear: outer circle at (82,212), r=13 */}
      <circle cx="82" cy="212" r="13" fill="none" stroke="white" strokeWidth="2.5"/>
      <circle cx="82" cy="212" r="6" fill="white"/>
      {/* Gear teeth — 8 spokes extending beyond outer circle */}
      <line x1="82" y1="199" x2="82" y2="194" stroke="white" strokeWidth="3" strokeLinecap="round"/>
      <line x1="82" y1="225" x2="82" y2="230" stroke="white" strokeWidth="3" strokeLinecap="round"/>
      <line x1="69" y1="212" x2="64" y2="212" stroke="white" strokeWidth="3" strokeLinecap="round"/>
      <line x1="95" y1="212" x2="100" y2="212" stroke="white" strokeWidth="3" strokeLinecap="round"/>
      <line x1="73" y1="203" x2="69" y2="199" stroke="white" strokeWidth="3" strokeLinecap="round"/>
      <line x1="91" y1="203" x2="95" y2="199" stroke="white" strokeWidth="3" strokeLinecap="round"/>
      <line x1="73" y1="221" x2="69" y2="225" stroke="white" strokeWidth="3" strokeLinecap="round"/>
      <line x1="91" y1="221" x2="95" y2="225" stroke="white" strokeWidth="3" strokeLinecap="round"/>
      <text x="82" y="242" textAnchor="middle" fill="white" fontSize="12" fontWeight="700" fontFamily="sans-serif">Software &amp;</text>
      <text x="82" y="259" textAnchor="middle" fill="white" fontSize="12" fontWeight="700" fontFamily="sans-serif">Services</text>

      {/* ── RIGHT: Data & Research (blue navy) ── cx=418, cy=225, r=65 → spans x=353..483 */}
      <circle cx="418" cy="225" r="65" fill="#355189"/>
      <circle cx="418" cy="225" r="58" fill="#2A4070"/>
      {/* Database cylinder icon centered at (418, 212) */}
      <ellipse cx="418" cy="204" rx="16" ry="6" fill="none" stroke="white" strokeWidth="2.5"/>
      <line x1="402" y1="204" x2="402" y2="221" stroke="white" strokeWidth="2.5"/>
      <line x1="434" y1="204" x2="434" y2="221" stroke="white" strokeWidth="2.5"/>
      <ellipse cx="418" cy="221" rx="16" ry="6" fill="none" stroke="white" strokeWidth="2.5"/>
      {/* Magnifier accent */}
      <circle cx="431" cy="199" r="7" fill="none" stroke="#F48C25" strokeWidth="2.5"/>
      <line x1="436" y1="204" x2="441" y2="209" stroke="#F48C25" strokeWidth="2.5" strokeLinecap="round"/>
      <text x="418" y="242" textAnchor="middle" fill="white" fontSize="12" fontWeight="700" fontFamily="sans-serif">Data &amp;</text>
      <text x="418" y="259" textAnchor="middle" fill="white" fontSize="12" fontWeight="700" fontFamily="sans-serif">Research</text>

      {/* ── BOTTOM: Regulatory Consulting (dark navy) ── cy=358, r=65 → spans y=293..423 */}
      <circle cx="250" cy="358" r="65" fill="#14213D"/>
      <circle cx="250" cy="358" r="58" fill="#0E1B2E"/>
      {/* Document icon centered at (250, 345), 26×34px */}
      <rect x="237" y="331" width="26" height="34" rx="3" fill="none" stroke="white" strokeWidth="2.5"/>
      <line x1="242" y1="341" x2="258" y2="341" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <line x1="242" y1="349" x2="258" y2="349" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <line x1="242" y1="357" x2="252" y2="357" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      {/* Orange arrow accent */}
      <polyline points="255,356 262,356 262,363" fill="none" stroke="#F48C25" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <text x="250" y="381" textAnchor="middle" fill="white" fontSize="12" fontWeight="700" fontFamily="sans-serif">Regulatory</text>
      <text x="250" y="398" textAnchor="middle" fill="white" fontSize="12" fontWeight="700" fontFamily="sans-serif">Consulting</text>
    </svg>
  );
}

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
          <div className="relative w-full h-auto aspect-square bg-gradient-to-br from-[#E2ECFF] to-[#FEF6F0] rounded-2xl flex items-center justify-center p-4 md:p-6">
            <BetterBankingsDiagram />
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
            Our Vision
          </h2>
          <p className="text-[#535769] text-lg leading-normal">
            To empower Indonesia's banking sector with data-driven insights and
            innovative solutions that foster transparency, rigorous risk
            management, and sustainable growth.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
