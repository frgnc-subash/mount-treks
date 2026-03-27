import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import SiteChrome from "@/components/site-chrome";
import {
  absoluteUrl,
  DEFAULT_OG_IMAGE_PATH,
  SITE_EMAIL,
  SITE_NAME,
  SITE_PHONE,
  SITE_URL,
  SOCIAL_LINKS,
} from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans", // Defines the variable
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: `${SITE_NAME} | Guided Treks in Nepal`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Book guided Himalayan treks in Nepal with Altigo Himalayan Treks. Explore Everest Base Camp, Annapurna, Upper Mustang, Langtang, and more.",
  keywords: [
    "Nepal trekking",
    "Everest Base Camp trek",
    "Annapurna trek",
    "Upper Mustang trek",
    "Himalayan trekking packages",
    "guided treks Nepal",
  ],
  category: "travel",
  creator: SITE_NAME,
  publisher: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  alternates: {
    canonical: "/",
  },
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: `${SITE_NAME} | Guided Treks in Nepal`,
    description:
      "Guided trekking adventures across Nepal with certified local teams and transparent packages.",
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    images: [
      {
        url: absoluteUrl(DEFAULT_OG_IMAGE_PATH),
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} Himalayan trekking`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Guided Treks in Nepal`,
    description:
      "Guided trekking adventures across Nepal with certified local teams and transparent packages.",
    images: [absoluteUrl(DEFAULT_OG_IMAGE_PATH)],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/logo.webp"),
    email: SITE_EMAIL,
    telephone: SITE_PHONE,
    sameAs: SOCIAL_LINKS,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Thamel Area - Yapikhya Marg",
      addressLocality: "Kathmandu",
      addressCountry: "NP",
    },
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "en",
  };

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[3000] focus:rounded-md focus:bg-black focus:px-3 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
