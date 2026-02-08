"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Loader2, ArrowLeft, Mail } from "lucide-react";
import Image from "next/image";
import EllipseYellow2 from "@/public/ellipse-yellow2.svg";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" && window.location.hostname !== "localhost"
    ? "https://api.betterbankings.com/api"
    : "http://localhost:8080/api");

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage(
        "Verification token is missing. Please check your email link.",
      );
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(
          `${API_URL}/auth/verify-email?token=${token}`,
          {
            method: "GET",
            credentials: "include",
          },
        );
        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage(data.message || "Email verified successfully!");
        } else {
          setStatus("error");
          setMessage(data.error || "Failed to verify email. Please try again.");
        }
      } catch (error) {
        setStatus("error");
        setMessage("An unexpected error occurred. Please try again.");
      }
    };

    verifyEmail();
  }, [token]);

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
          className="text-center"
        >
          {status === "loading" && (
            <>
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-blue-50 rounded-full">
                <Loader2 className="w-10 h-10 text-[#355189] animate-spin" />
              </div>
              <h1 className="text-3xl font-bold text-[#14213D] mb-4">
                Verifying Your Email
              </h1>
              <p className="text-gray-500">
                Please wait while we verify your email address...
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-green-50 rounded-full">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h1 className="text-3xl font-bold text-[#14213D] mb-4">
                Email <span className="text-[#F48C25]">Verified!</span>
              </h1>
              <p className="text-gray-500 mb-8">{message}</p>
              <Link
                href="/auth"
                className="inline-block w-full py-4 bg-gradient-to-r from-[#1B2B4B] to-[#355189] text-white rounded-lg font-semibold text-lg hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
              >
                Sign In Now
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-red-50 rounded-full">
                <XCircle className="w-10 h-10 text-red-500" />
              </div>
              <h1 className="text-3xl font-bold text-[#14213D] mb-4">
                Verification <span className="text-red-500">Failed</span>
              </h1>
              <p className="text-gray-500 mb-8">{message}</p>
              <div className="space-y-4">
                <Link
                  href="/auth"
                  className="inline-block w-full py-4 bg-gradient-to-r from-[#1B2B4B] to-[#355189] text-white rounded-lg font-semibold text-lg hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
                >
                  Back to Sign In
                </Link>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-full flex items-center justify-center bg-white">
          <Loader2 className="w-8 h-8 animate-spin text-[#14213D]" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
