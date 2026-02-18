"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Briefcase, GraduationCap } from "lucide-react";

const TEAM_MEMBERS = [
  {
    name: "Johanes W. Maslam",
    role: "Director & Co-Founder",
    image: "/jvm.jpeg",
    badges: ["20+ Years Experience", "Investment Banking", "Corporate Finance"],
    bio: "A senior finance professional with over two decades of experience across investment banking, private equity, capital markets and corporate finance. He currently serves as Director and Co-founder of Better Bankings Indonesia, overseeing finance and legal matters. His career spans senior advisory and leadership roles at Capsquare Asia, ING, Pandawa Capital Advisors, and several other institutions.",
    education: "Financial Economics — Erasmus Universiteit Rotterdam",
  },
  {
    name: "Emil Bambang Sumirat",
    role: "Co-Founder & CFO, Blu IQ Tech",
    image: "/emil.jpeg",
    badges: [
      "30+ Years Experience",
      "Banking & Capital Markets",
      "Technology Executive",
    ],
    bio: "A seasoned financial services and technology executive with over 30 years of experience across banking, capital markets, and IT. He co-founded Blu IQ Tech Pte. Ltd., a venture-backed marine tech company focused on sustainable fisheries. Previously, he served as Indonesia Country Director for FIS Global and held senior roles at IBM, Bank Central Asia, and multiple technology start-ups.",
    education:
      "MBA in Finance — Imperial College London (Chevening Scholar) · Mechanical Engineering — University of Indonesia",
  },
];

function TeamCard({
  member,
  index,
}: {
  member: (typeof TEAM_MEMBERS)[0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.15 }}
      whileHover={{ y: -4 }}
      className="bg-white border border-[#E1E7EF] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <div className="p-8 md:p-10 flex flex-col sm:flex-row gap-8 items-center sm:items-start">
        {/* Avatar */}
        <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden shadow-md shrink-0">
          <Image
            src={member.image}
            alt={member.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col text-center sm:text-left">
          <h3 className="text-xl md:text-2xl font-bold text-[#14213D] mb-1">
            {member.name}
          </h3>
          <p className="text-[#F48C25] font-semibold text-sm md:text-base mb-4">
            {member.role}
          </p>

          {/* Badges */}
          <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-4">
            {member.badges.map((badge, i) => (
              <motion.span
                key={badge}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-[#14213D]/5 text-[#14213D] border border-[#14213D]/10"
              >
                <Briefcase className="w-3 h-3 text-[#F48C25]" />
                {badge}
              </motion.span>
            ))}
          </div>

          {/* Bio */}
          <p className="text-[#535769] text-sm md:text-base leading-relaxed mb-3">
            {member.bio}
          </p>

          {/* Education */}
          <div className="flex items-start gap-2 text-sm text-[#535769]">
            <GraduationCap className="w-4 h-4 mt-0.5 text-[#F48C25] shrink-0" />
            <span>{member.education}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function TeamSection() {
  return (
    <section className="z-10 w-full py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#14213D] mb-4">
            The Leaders Behind <span className="text-[#F48C25]">Better</span>
            Bankings
          </h2>
          <p className="text-[#535769] max-w-2xl mx-auto">
            Driven by decades of expertise in finance, technology, and
            regulation — our founders bring unmatched depth to every solution.
          </p>
        </motion.div>

        {/* Team Cards */}
        <div className="flex flex-col gap-8">
          {TEAM_MEMBERS.map((member, index) => (
            <TeamCard key={member.name} member={member} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
