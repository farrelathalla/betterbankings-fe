"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import EllipseYellow2 from "@/public/ellipse-yellow2.svg";
import { useAuth } from "@/hooks/useAuth";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { resetPassword } = useAuth();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!token) {
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
            <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-red-50 rounded-full">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold text-[#14213D] mb-4">
              Invalid <span className="text-red-500">Link</span>
            </h1>
            <p className="text-gray-500 mb-8">
              Reset token is missing. Please request a new password reset link.
            </p>
            <Link
              href="/auth/forgot-password"
              className="inline-block w-full py-4 bg-gradient-to-r from-[#1B2B4B] to-[#355189] text-white rounded-lg font-semibold text-lg hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
            >
              Request New Link
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    const result = await resetPassword(token, password, confirmPassword);

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || "Failed to reset password");
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
              Password <span className="text-[#F48C25]">Reset!</span>
            </h1>
            <p className="text-gray-500 mb-8">
              Your password has been reset successfully. You can now sign in
              with your new password.
            </p>
            <Link
              href="/auth"
              className="inline-block w-full py-4 bg-gradient-to-r from-[#1B2B4B] to-[#355189] text-white rounded-lg font-semibold text-lg hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
            >
              Sign In Now
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
            Reset <span className="text-[#F48C25]">Password</span>
          </h1>
          <p className="text-gray-500 mt-4 text-lg mb-8">
            Enter your new password below. Make sure it&apos;s at least 6
            characters.
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
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all hover:border-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#14213D] mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all hover:border-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
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
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-full flex items-center justify-center bg-white">
          <Loader2 className="w-8 h-8 animate-spin text-[#14213D]" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
