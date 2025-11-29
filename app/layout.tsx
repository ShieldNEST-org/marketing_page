import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: "ShieldNest - Secure Your Crypto Portfolio on Coreum",
  description: "Track, analyze, and protect your digital assets with enterprise-grade security and real-time insights. Built for the Coreum blockchain.",
  keywords: ["crypto", "portfolio", "coreum", "blockchain", "security", "NFT", "DeFi"],
  authors: [{ name: "ShieldNest" }],
  icons: {
    icon: "/shieldmarkteingfavicon.svg",
    shortcut: "/shieldmarkteingfavicon.svg",
    apple: "/shieldmarkteingfavicon.svg",
  },
  openGraph: {
    title: "ShieldNest - Secure Your Crypto Portfolio",
    description: "Track, analyze, and protect your digital assets on Coreum blockchain",
    type: "website",
    url: "https://shieldnest.org",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShieldNest - Secure Your Crypto Portfolio",
    description: "Track, analyze, and protect your digital assets on Coreum blockchain",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${spaceGrotesk.variable}`}>
        {children}
      </body>
    </html>
  );
}
