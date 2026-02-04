import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Banking Industry Data - Financial Analytics Dashboard",
  description:
    "Interactive banking industry data and analytics dashboard. Explore deposit trends, lending metrics, solvency ratios, and key performance indicators for banks in Indonesia and Southeast Asia.",
  keywords: [
    "banking data",
    "banking analytics",
    "financial dashboard",
    "deposit data",
    "lending metrics",
    "bank solvency",
    "Indonesia banking data",
    "Southeast Asia banking",
    "banking KPIs",
    "banking industry trends",
  ],
  openGraph: {
    title: "Credit & Market Risk - B-Foresight",
    description:
      "Analysis of credit and market risk across the banking sector.",
    images: ["https://betterbankings.com/og-image.png"],
  },
};

export default function BankingDataLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
