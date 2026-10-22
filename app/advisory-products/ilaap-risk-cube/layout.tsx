import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ILAAP Risk Cube - Liquidity Analytics and ILAAP Submission Support",
  description:
    "Liquidity analytics and practical ILAAP submission support from BetterBankings. Assess stress, survival and usable liquidity, and prepare a clear submission within a tight timeline.",
  keywords: [
    "ILAAP",
    "ILAAP Risk Cube",
    "OJK ILAAP",
    "liquidity risk analytics",
    "SPM reporting",
    "ILAAP submission support",
    "SEOJK 26/2025",
    "counterbalancing capacity",
    "CBC",
    "HQLA",
    "liquidity stress testing",
    "LCR",
    "Indonesia banking",
  ],
  alternates: {
    canonical: "https://betterbankings.com/advisory-products/ilaap-risk-cube",
  },
  openGraph: {
    title: "ILAAP Risk Cube - Liquidity Analytics and ILAAP Submission Support",
    description:
      "An Excel-based ILAAP tool connecting SPM, funding data and bank-specific assumptions, with practical support for a clear submission.",
    url: "https://betterbankings.com/advisory-products/ilaap-risk-cube",
    images: ["https://betterbankings.com/og-image.png"],
  },
};

export default function IlaapRiskCubeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
