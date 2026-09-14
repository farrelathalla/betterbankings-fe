import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Balance Sheet Management Simulation Tool - ALM Training and Scenario Testing",
  description:
    "A practical training and simulation platform for balance sheet management: interest-rate shocks, EVE and NII sensitivity, behavioural assumptions, management actions and ALCO decision support.",
  keywords: [
    "balance sheet management",
    "ALM simulation",
    "ALM training",
    "ALCO dashboard",
    "EVE",
    "NII",
    "IRRBB",
    "repricing gap",
    "deposit beta",
    "NMD behaviour",
    "scenario testing",
    "Indonesia banking",
  ],
  alternates: {
    canonical:
      "https://betterbankings.com/advisory-products/balance-sheet-simulation",
  },
  openGraph: {
    title:
      "Balance Sheet Management Simulation Tool - ALM Training and Scenario Testing",
    description:
      "From ALM training to live balance-sheet strategy simulation: rate shocks, EVE and NII sensitivity, behavioural assumptions and management actions.",
    url: "https://betterbankings.com/advisory-products/balance-sheet-simulation",
    images: ["https://betterbankings.com/og-image.png"],
  },
};

export default function BalanceSheetSimulationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
