import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Re-delegate CORE Tokens | SHIELDNEST Validator - Earn Passive Income on Coreum",
  description: "Re-delegate your CORE tokens to SHIELDNEST validator for maximum staking rewards. Enterprise-grade infrastructure with 99.9% uptime. Earn passive income securely on the Coreum blockchain with our military-grade security.",
  keywords: [
    "re-delegate CORE",
    "Coreum staking",
    "CORE validator",
    "passive income crypto",
    "staking rewards",
    "SHIELDNEST validator",
    "Coreum validator",
    "crypto staking",
    "delegate CORE tokens",
    "blockchain staking",
    "DeFi staking",
    "earn CORE rewards",
    "Sologenic staking",
    "tokenization",
    "RWA staking"
  ],
  openGraph: {
    title: "Re-delegate CORE Tokens | SHIELDNEST Validator",
    description: "Earn maximum staking rewards by re-delegating to SHIELDNEST validator. Enterprise-grade security with 99.9% uptime.",
    type: "website",
    url: "https://shieldnest.org/re-delegate",
    images: [
      {
        url: "https://shieldnest.org/opengraph-image",
        width: 1200,
        height: 630,
        alt: "SHIELDNEST Re-delegate - Earn Passive Income on Coreum",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Re-delegate CORE Tokens | SHIELDNEST Validator",
    description: "Earn maximum staking rewards by re-delegating to SHIELDNEST validator.",
    images: ["https://shieldnest.org/twitter-image"],
  },
  alternates: {
    canonical: "https://shieldnest.org/re-delegate",
  },
};

export default function RedelegateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

