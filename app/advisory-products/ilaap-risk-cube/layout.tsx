import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ILAAP Risk Cube - Liquidity Analytics and Reporting Assurance",
  description:
    "Turn OJK ILAAP reporting data into liquidity insight, foresight and action. A transparent analytical and assurance layer linking SPM, scenario choice, funding profile, executable liquidity and report-ready outputs.",
  keywords: [
    "ILAAP",
    "ILAAP Risk Cube",
    "OJK ILAAP",
    "liquidity risk analytics",
    "SPM reporting",
    "Funding Rollover Analytics",
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
    title: "ILAAP Risk Cube - Liquidity Analytics and Reporting Assurance",
    description:
      "A transparent analytical and assurance layer linking SPM, scenario choice, funding profile, executable liquidity and report-ready outputs.",
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
