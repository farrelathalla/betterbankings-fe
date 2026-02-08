"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import EllipseYellow2 from "@/public/ellipse-yellow2.svg";
import { useAuth } from "@/hooks/useAuth";

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const result = await forgotPassword(email);

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || "Failed to send reset email");
    }

    setIsSubmitting(false);
  };

  if (success) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white overflow-hidden relative">
        <Image
          src={EllipseYellow2}
          alt="Ellipse Yellow 2"
          className="absolute -top-[30%] -right-[15%]"
        />

        <div className="w-full max-w-md p-8 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-green-50 rounded-full">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-[#14213D] mb-4">
              Check Your <span className="text-[#F48C25]">Email</span>
            </h1>
            <p className="text-gray-500 mb-8">
              If an account with this email exists, we&apos;ve sent a password
              reset link. Please check your inbox and spam folder.
            </p>
            <Link
              href="/auth"
              className="inline-block w-full py-4 bg-gradient-to-r from-[#1B2B4B] to-[#355189] text-white rounded-lg font-semibold text-lg hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
            >
              Back to Sign In
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex items-center justify-center bg-white overflow-hidden relative">
      <Image
        src={EllipseYellow2}
        alt="Ellipse Yellow 2"
        className="absolute -top-[30%] -right-[15%]"
      />

      <div className="w-full max-w-md p-8 z-10">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href="/auth"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 text-[#14213D] hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-[#14213D] mb-2 tracking-tight">
            Forgot <span className="text-[#F48C25]">Password?</span>
          </h1>
          <p className="text-gray-500 mt-4 text-lg mb-8">
            Enter your email address and we&apos;ll send you a link to reset
            your password.
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-[#14213D] mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="john.anderson@bank.com"
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all hover:border-gray-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full cursor-pointer bg-gradient-to-r from-[#1B2B4B] to-[#355189] text-white py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>

          <p className="text-center text-gray-500 mt-6">
            Remember your password?{" "}
            <Link href="/auth" className="font-bold text-[#14213D] underline">
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
