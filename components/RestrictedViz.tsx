"use client";

import { useAuth } from "@/hooks/useAuth";
import { Lock } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

interface RestrictedVizProps {
  isFirstTab: boolean;
  children: ReactNode;
}

export default function RestrictedViz({
  isFirstTab,
  children,
}: RestrictedVizProps) {
  const { user } = useAuth();

  // If user is logged in, or it's the first tab (e.g., Solvency), show the viz
  if (user || isFirstTab) {
    return <>{children}</>;
  }

  // Otherwise, show blurred effect with CTA
  return (
    <div className="relative w-full h-full min-h-[500px]">
      {/* Blurred background (placeholder of a dashboard) */}
      <div className="absolute inset-0 filter blur-lg opacity-30 select-none pointer-events-none">
        {children}
      </div>

      {/* Overlay CTA */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-white/40 backdrop-blur-md">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center text-center max-w-md mx-4 animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
            <Lock className="w-8 h-8 text-[#355189]" />
          </div>
          <h3 className="text-xl font-bold text-[#14213D] mb-3">
            Premium Insight Access
          </h3>
          <p className="text-gray-500 mb-8 leading-relaxed">
            This detailed visualization is available exclusively for registered
            members. Sign in to explore all metrics and download industry data.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Link
              href="/auth"
              className="flex-1 px-6 py-3 bg-linear-to-r from-[#1B2B4B] to-[#355189] text-white rounded-xl font-bold hover:shadow-lg transition-all duration-200"
            >
              Sign In
            </Link>
            <Link
              href="/auth?mode=signup"
              className="flex-1 px-6 py-3 bg-white text-[#14213D] border-2 border-[#E1E7EF] rounded-xl font-bold hover:bg-gray-50 transition-all duration-200"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
