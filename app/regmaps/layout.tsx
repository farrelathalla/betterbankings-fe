import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RegMaps - Basel Framework & Regulatory Standards",
  description:
    "Explore the complete Basel Framework including Basel III and Basel IV standards. Comprehensive coverage of capital requirements, credit risk, operational risk, and liquidity regulations for banks.",
  keywords: [
    "Basel Framework",
    "Basel III",
    "Basel IV",
    "Basel standards",
    "capital requirements",
    "credit risk",
    "operational risk",
    "liquidity risk",
    "bank regulation",
    "SCO",
    "CAP",
    "CRE",
    "RBC",
  ],
  openGraph: {
    title: "RegMaps - Basel Framework & Regulatory Standards",
    description:
      "Explore the complete Basel Framework including Basel III and Basel IV standards for bank regulation.",
    images: ["https://betterbankings.com/og-image.png"],
  },
};

export default function BaselCenterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
