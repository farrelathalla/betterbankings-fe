import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Advisory Products - Enterprise-Grade Risk Management Platform",
  description:
    "Betterbankings provides an integrated, enterprise-grade software platform engineered to elevate risk management across the banking sector.",
  keywords: [
    "risk management platform",
    "banking software",
    "market risk",
    "liquidity risk",
    "IRRBB",
    "counterparty credit risk",
    "fund transfer pricing",
    "FTP",
    "banking technology",
  ],
  openGraph: {
    title: "Advisory Products - Enterprise-Grade Risk Management Platform",
    description:
      "Integrated software platform for precision risk management in the banking sector.",
    images: ["https://betterbankings.com/og-image.png"],
  },
};

export default function AdvisoryProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
