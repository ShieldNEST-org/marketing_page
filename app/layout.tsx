import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"]
});

// Primary SEO Keywords
const primaryKeywords = [
  "Coreum",
  "tokenization", 
  "RWA",
  "real world assets",
  "NFT",
  "NFTs",
  "passive income",
  "crypto staking",
  "Sologenic",
  "Solotex",
  "earn to learn",
  "blockchain",
  "DeFi",
  "decentralized finance",
  "crypto portfolio",
  "digital assets",
  "web3",
  "cryptocurrency",
  "staking rewards",
  "validator",
  "private tier",
  "crypto security",
  "portfolio tracker",
  "Shield NFT",
  "COREUM blockchain",
  "XRP ledger",
  "ISO 20022"
];

// Site Configuration
const siteConfig = {
  name: "ShieldNest",
  title: "ShieldNest - Secure Crypto Portfolio on Coreum | Tokenization, RWAs, NFTs & Passive Income",
  description: "Track, analyze, and protect your digital assets on Coreum blockchain. Enterprise-grade security for tokenization, RWAs, NFTs, and passive income through staking. Built for Sologenic, Solotex, and the future of decentralized finance. Earn to learn with exclusive Shield NFT benefits.",
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
    { media: "(prefers-color-scheme: light)", color: "#25d695" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0e0e" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  
  // Primary Meta Tags
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: primaryKeywords,
  authors: [{ name: "ShieldNest", url: siteConfig.url }],
  creator: "ShieldNest",
  publisher: "ShieldNest",
  
  // Favicon & Icons
  icons: {
    icon: [
      { url: "/shieldmarketingfavicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    shortcut: "/shieldmarketingfavicon.svg",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" },
    ],
  },

  // Manifest for PWA
  manifest: "/manifest.json",

  // Open Graph / Facebook
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
        alt: "ShieldNest - Secure Your Crypto Portfolio on Coreum",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    site: siteConfig.twitterHandle,
    creator: siteConfig.twitterHandle,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },

  // Robots & Indexing
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Verification Tags (Add your IDs here)
  verification: {
    google: "YOUR_GOOGLE_SEARCH_CONSOLE_VERIFICATION_ID", // Replace with actual ID
    // yandex: "YOUR_YANDEX_ID",
    // bing: "YOUR_BING_ID",
  },

  // Additional Meta
  alternates: {
    canonical: siteConfig.url,
  },

  // Category
  category: "Cryptocurrency",

  // Classification
  classification: "Blockchain, Cryptocurrency, DeFi, Portfolio Management",

  // App-specific
  applicationName: siteConfig.name,
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

// JSON-LD Structured Data for Rich Snippets
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      url: siteConfig.url,
      name: siteConfig.name,
      description: siteConfig.description,
      publisher: {
        "@id": `${siteConfig.url}/#organization`,
      },
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteConfig.url}/?s={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/shld_dark.svg`,
        width: 512,
        height: 512,
      },
      sameAs: [
        "https://x.com/shieldnest_org",
        "https://github.com/ShieldNEST-org",
      ],
      description: siteConfig.description,
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        url: siteConfig.url,
      },
    },
    {
      "@type": "SoftwareApplication",
      name: siteConfig.name,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web Browser",
      description: "Secure crypto portfolio management application built for Coreum blockchain. Track tokenized assets, RWAs, NFTs, and earn passive income through staking.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        ratingCount: "150",
      },
      featureList: [
        "Real-time portfolio tracking",
        "Coreum blockchain integration",
        "NFT management",
        "RWA tokenization support",
        "Passive income through staking",
        "Enterprise-grade security",
        "Multi-wallet support",
        "Advanced analytics",
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is ShieldNest?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "ShieldNest is a secure crypto portfolio management platform built specifically for the Coreum blockchain. It allows users to track, analyze, and protect their digital assets including tokenized real-world assets (RWAs), NFTs, and earn passive income through staking.",
          },
        },
        {
          "@type": "Question",
          name: "How can I earn passive income with ShieldNest?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "ShieldNest enables passive income through secure staking on the Coreum blockchain. By delegating your CORE tokens to our enterprise-grade validator infrastructure, you can earn staking rewards while maintaining full custody of your assets.",
          },
        },
        {
          "@type": "Question",
          name: "What is the Shield NFT?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Shield NFT is an exclusive membership token that unlocks premium features including advanced analytics, exclusive content, priority support, and governance access within the ShieldNest ecosystem.",
          },
        },
        {
          "@type": "Question",
          name: "Does ShieldNest support tokenized real-world assets (RWAs)?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, ShieldNest fully supports tokenized real-world assets (RWAs) on the Coreum blockchain. Track and manage your tokenized assets alongside cryptocurrencies and NFTs in one unified dashboard.",
          },
        },
      ],
    },
  ],
};

// Google Analytics Measurement ID
const GA_MEASUREMENT_ID = "G-55YH7B73MC";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <head>
        {/* Preconnect to important third-party origins */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      
      <body className={`${inter.className} ${spaceGrotesk.variable}`}>
        {children}
        
        {/* Google Analytics 4 */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_title: document.title,
              page_location: window.location.href,
            });
          `}
        </Script>

        {/* Google Tag Manager (Optional - add your GTM ID) */}
        {/* 
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-XXXXXXX');
          `}
        </Script>
        */}
      </body>
    </html>
  );
}
