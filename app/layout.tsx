import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import ShieldChat from "@/components/ShieldChat";

// Site Configuration
const siteConfig = {
  name: "SHIELDNEST",
  title: "Shieldnest Development Team | Global Safety Stewards",
  description: "Self-funded engineering team building secure infrastructure on Coreum and Cosmos. Creators of TOKNS.FI, CLIQS.IO, and RIVO. Stewards of decentralized truth.",
  url: "https://shieldnest.org",
  ogImage: "https://shieldnest.org/og-image.png",
  twitterHandle: "@shieldnest_org",
  locale: "en_US",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ebeae6" },
    { media: "(prefers-color-scheme: dark)", color: "#1f1d1b" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["Coreum", "Cosmos", "Blockchain Security", "Infrastructure", "Treasury Management", "TOKNS", "CLIQS", "RIVO", "Global Stewards"],
  authors: [{ name: "Shieldnest Development Team", url: siteConfig.url }],
  creator: "Shieldnest",
  publisher: "House of Exegesis",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    shortcut: "/favicon.svg",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" },
    ],
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Shieldnest Development Team - Global Safety Stewards",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: siteConfig.twitterHandle,
    creator: siteConfig.twitterHandle,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
  },
};

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Shieldnest Development Team",
  "alternateName": "SHIELDNEST",
  "url": "https://shieldnest.org",
  "logo": "https://shieldnest.org/shld_dark.svg",
  "parentOrganization": {
    "@type": "Organization",
    "name": "House of Exegesis",
    "description": "PMCO dedicated to being global stewards"
  },
  "sameAs": [
    "https://x.com/shieldnest_org",
    "https://github.com/ShieldNEST-org"
  ],
  "description": siteConfig.description
};

const GA_MEASUREMENT_ID = "G-55YH7B73MC";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
        <ShieldChat />
        
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}
