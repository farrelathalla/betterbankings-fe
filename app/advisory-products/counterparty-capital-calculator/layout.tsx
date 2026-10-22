import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Counterparty Capital Calculator - SA-CCR, BA-CVA and CCP Capital",
  description:
    "Calculate SA-CCR exposure and capital, reduced Basic Approach CVA and CCP capital requirements in one Excel-based tool. Explore BetterBankings' Counterparty Capital Calculator.",
  keywords: [
    "Counterparty Capital Calculator",
    "SA-CCR",
    "BA-CVA",
    "CVA capital",
    "CCP capital",
    "counterparty credit risk",
    "derivative exposure",
    "exposure at default",
    "RWA",
    "SEOJK 48/2017",
    "OJK reporting",
    "Indonesia banking",
  ],
  alternates: {
    canonical:
      "https://betterbankings.com/advisory-products/counterparty-capital-calculator",
  },
  openGraph: {
    title: "Counterparty Capital Calculator - SA-CCR, BA-CVA and CCP Capital",
    description:
      "One Excel-based calculator for SA-CCR exposure, reduced Basic Approach CVA and CCP capital requirements.",
    url: "https://betterbankings.com/advisory-products/counterparty-capital-calculator",
    images: ["https://betterbankings.com/og-image.png"],
  },
};

export default function CounterpartyCapitalCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
