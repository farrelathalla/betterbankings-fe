import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BetterBankings Angle - Banking & Finance Podcast",
  description:
    "Listen to conversations with industry leaders about banking regulation, risk management, and the future of finance in Southeast Asia. Expert insights on Basel compliance, regulatory trends, and banking best practices.",
  keywords: [
    "BetterBankings Angle",
    "banking podcast",
    "finance podcast",
    "risk management",
    "Basel compliance",
    "banking regulation podcast",
    "Southeast Asia banking",
    "Indonesia banking",
    "banking industry insights",
  ],
  openGraph: {
    title: "BetterBankings Angle - Expert Insights",
    description: "Deep analysis and expert opinions on banking regulations.",
    images: ["https://betterbankings.com/og-image.png"],
  },
};

export default function AngleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
