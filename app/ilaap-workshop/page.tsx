"use client";

import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useState } from "react";
import { getApiUrl } from "@/lib/api";
import {
  BookOpen,
  Database,
  FileText,
  MessageSquare,
  CheckCircle2,
  Users,
  Loader2,
  ArrowRight,
  Shield,
  Target,
  Zap,
  Award,
} from "lucide-react";

const WORKSHOP_MODULES = [
  {
    number: "01",
    title: "Introduction to Liquidity Risk Management & SEOJK ILAAP",
    icon: BookOpen,
    color: "#F48C25",
    items: [
      "Understanding the scope, purpose and lifecycle of the ILAAP",
      "Best practices in measuring liquidity risks",
      "Comparative review of global standards and typical regulatory feedback regarding ILAAP documentation",
    ],
  },
  {
    number: "02",
    title: "Data Templates and Analysis",
    icon: Database,
    color: "#355189",
    items: [
      "Cashflow mismatch report; Funding Rollover; LCR by Significant Currency and Intraday liquidity",
      "Data requirements, sources, granularity and logic needed for completing the templates",
      "Analyzing ILAAP trial results and their subsequent impact on the Banks' compliance program and liquidity risk strategy",
    ],
  },
  {
    number: "03",
    title: "The Content and Format of the ILAAP Report",
    icon: FileText,
    color: "#F48C25",
    items: [
      "Overview of the key ILAAP qualitative requirements",
      "Roles of the Board and ALCO in the ILAAP oversight",
      "Liquidity risk stress testing: Designing forward-looking scenarios and interpreting results for management decision-making",
      "Risk appetite/tolerance limit within the ILAAP framework",
      "Intraday liquidity risk",
      "Funds transfer pricing",
      "Counterbalancing capacity and monetization",
      "Practical Tips in preparing the ILAAP document (ILAAP booklet)",
    ],
  },
  {
    number: "04",
    title: "Recap and Discussion",
    icon: MessageSquare,
    color: "#355189",
    items: ["Highlights and conclusion", "Next steps"],
  },
];

const HIGHLIGHTS = [
  {
    icon: Shield,
    title: "Regulatory Compliance",
    desc: "Ensure full alignment with OJK supervisory perspectives and global standards",
  },
  {
    icon: Target,
    title: "Hands-on Experience",
    desc: "Practical tips based on real-world ILAAP preparation experience",
  },
  {
    icon: Zap,
    title: "Comprehensive Coverage",
    desc: "From data templates to stress testing and risk appetite frameworks",
  },
  {
    icon: Award,
    title: "Industry Best Practices",
    desc: "Learn from proven methodologies in liquidity risk management",
  },
];

export default function ILAAPWorkshopPage() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    numPeople: 1,
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(getApiUrl("/workshop/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess(true);
        setFormData({
          name: "",
          company: "",
          phone: "",
          email: "",
          numPeople: 1,
        });
      } else {
        const data = await res.json();
        setError(data.error || "Registration failed. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfaf9] flex flex-col lg:flex-row overflow-x-hidden">
      <Sidebar />

      <main className="w-full flex-1 lg:ml-[280px] relative">
        {/* Background Gradients */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-orange-100 rounded-full blur-[100px] opacity-60"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-50 rounded-full blur-[100px] opacity-60"></div>
        </div>

        <div className="relative z-10 flex flex-col">
          {/* Hero Section */}
          <section className="relative w-full py-20 lg:py-28 px-6 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1B2B4B] via-[#355189] to-[#1B2B4B]"></div>
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-72 h-72 border border-white/20 rounded-full"></div>
              <div className="absolute bottom-10 right-10 w-96 h-96 border border-white/10 rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full"></div>
            </div>

            <div className="relative max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6 border border-white/10"
              >
                <BookOpen className="w-4 h-4" />
                Professional Advisory Workshop
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight leading-tight"
              >
                ILAAP Advisory <span className="text-[#F48C25]">Workshop</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-white/80 text-lg max-w-3xl mx-auto leading-relaxed"
              >
                A comprehensive overview of liquidity risk management and the
                Internal Liquidity Adequacy Assessment Process (ILAAP), covering
                scope, purpose, lifecycle, and best practices — aligned with
                global standards and OJK supervisory perspectives.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-8"
              >
                <a
                  href="#register"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#F48C25] text-white font-semibold rounded-lg hover:bg-[#e07d1a] transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30"
                >
                  Register Now
                  <ArrowRight className="w-4 h-4" />
                </a>
              </motion.div>
            </div>
          </section>

          {/* Overview Paragraph */}
          <section className="py-16 px-6 bg-[#fcfaf9]">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 lg:p-10 shadow-sm border border-gray-100"
              >
                <p className="text-gray-600 leading-relaxed text-lg">
                  Our ILAAP advisory workshop provides a comprehensive overview
                  of liquidity risk management and the Internal Liquidity
                  Adequacy Assessment Process (ILAAP). It covers the scope,
                  purpose, and lifecycle of ILAAP, as well as the best practices
                  for measuring liquidity risks. These practices include global
                  standards and OJK supervisory perspectives. The workshop
                  details data templates and analysis methods, such as cash flow
                  mismatch reports, funding rollover, the liquidity coverage
                  ratio by currency, and intraday liquidity. It also covers data
                  requirements and their impact on banks&apos; compliance
                  programs. We also discuss the content and format of the ILAAP
                  report, emphasizing qualitative requirements, the roles of the
                  board and ALCO, liquidity risk stress testing, risk appetite,
                  intraday liquidity risk, funds transfer pricing, and
                  counterbalancing capacity. The workshop provides practical
                  tips for preparing the ILAAP document based on hands-on
                  experience and ensures the delivery of all ILAAP components.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Highlights Grid */}
          <section className="py-4 px-6 bg-[#fcfaf9]">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {HIGHLIGHTS.map((h, i) => {
                  const Icon = h.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-center"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-[#F48C25]/10 to-[#F48C25]/5 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-6 h-6 text-[#F48C25]" />
                      </div>
                      <h3 className="font-bold text-[#14213D] mb-2">
                        {h.title}
                      </h3>
                      <p className="text-sm text-gray-500">{h.desc}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Workshop Modules */}
          <section className="py-16 px-6 bg-[#fcfaf9]">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-[#14213D] mb-4">
                  Workshop <span className="text-[#F48C25]">Modules</span>
                </h2>
                <p className="text-gray-500 max-w-2xl mx-auto">
                  Four comprehensive modules designed to equip your team with
                  ILAAP knowledge and practical implementation skills
                </p>
              </motion.div>

              <div className="space-y-6">
                {WORKSHOP_MODULES.map((mod, index) => {
                  const Icon = mod.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-white rounded-2xl p-8 lg:p-10 shadow-sm border border-gray-100 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-start gap-6">
                        <div className="flex-shrink-0">
                          <div
                            className="w-14 h-14 rounded-xl flex items-center justify-center relative"
                            style={{ backgroundColor: `${mod.color}15` }}
                          >
                            <Icon
                              className="w-7 h-7"
                              style={{ color: mod.color }}
                            />
                            <span
                              className="absolute -top-2 -right-2 text-xs font-bold px-2 py-0.5 rounded-full text-white"
                              style={{ backgroundColor: mod.color }}
                            >
                              {mod.number}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl md:text-2xl font-bold text-[#14213D] mb-4 group-hover:text-[#355189] transition-colors">
                            {mod.title}
                          </h3>
                          <ul className="space-y-3">
                            {mod.items.map((item, j) => (
                              <li key={j} className="flex items-start gap-3">
                                <CheckCircle2
                                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                                  style={{ color: mod.color }}
                                />
                                <span className="text-gray-600 leading-relaxed">
                                  {item}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* CTA Banner */}
          <section className="py-16 px-6 bg-[#fcfaf9]">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-[#1B2B4B] to-[#355189] rounded-2xl p-10 lg:p-14 text-center text-white relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#F48C25]/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
                <div className="relative">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">
                    Ensure Your Bank&apos;s ILAAP Readiness
                  </h2>
                  <p className="text-white/80 text-lg leading-relaxed mb-6 max-w-2xl mx-auto">
                    Equip your team with the knowledge and tools needed for
                    comprehensive ILAAP compliance. From data templates to
                    stress testing frameworks — we&apos;ve got you covered.
                  </p>
                  <a
                    href="#register"
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#F48C25] text-white font-semibold rounded-lg hover:bg-[#e07d1a] transition-all shadow-lg"
                  >
                    <Users className="w-5 h-5" />
                    Register Your Team
                  </a>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Registration Form */}
          <section id="register" className="py-20 px-6 bg-[#fcfaf9]">
            <div className="max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-10"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-[#14213D] mb-4">
                  Register for the{" "}
                  <span className="text-[#F48C25]">Workshop</span>
                </h2>
                <p className="text-gray-500">
                  Fill out the form below to secure your spot in our next ILAAP
                  Advisory Workshop
                </p>
              </motion.div>

              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-2xl p-10 shadow-sm border border-green-200 text-center"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#14213D] mb-2">
                    Registration Successful!
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Thank you for your interest. Our team will contact you
                    shortly with further details about the workshop.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="px-6 py-2.5 bg-[#355189] text-white font-semibold rounded-lg hover:bg-[#1B2B4B] transition-colors"
                  >
                    Register Another Person
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-8 lg:p-10 shadow-sm border border-gray-100"
                >
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                        {error}
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-semibold text-[#14213D] mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Enter your full name"
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#355189] focus:border-transparent outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#14213D] mb-1.5">
                        Company / Organization *
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) =>
                          setFormData({ ...formData, company: e.target.value })
                        }
                        placeholder="Enter your company name"
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#355189] focus:border-transparent outline-none transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-[#14213D] mb-1.5">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          placeholder="+62 xxx xxxx xxxx"
                          required
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#355189] focus:border-transparent outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[#14213D] mb-1.5">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          placeholder="you@company.com"
                          required
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#355189] focus:border-transparent outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#14213D] mb-1.5">
                        Number of Attendees *
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={formData.numPeople}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            numPeople: parseInt(e.target.value) || 1,
                          })
                        }
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#355189] focus:border-transparent outline-none transition-all"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        How many people from your organization will be
                        attending?
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full px-6 py-3.5 bg-gradient-to-r from-[#F48C25] to-[#e07d1a] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <ArrowRight className="w-5 h-5" />
                          Submit Registration
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              )}
            </div>
          </section>

          <Footer />
        </div>
      </main>
    </div>
  );
}
