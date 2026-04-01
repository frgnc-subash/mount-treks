import type { Metadata } from "next";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Nepal Trek Blog",
  description:
    "Read trekking articles from Altigo Himalayan Treks on routes, seasons, permits, safety, and practical planning for Nepal adventures.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: `${SITE_NAME} | Nepal Trek Blog`,
    description:
      "Trekking articles on routes, seasons, permits, safety, and planning for Nepal adventures.",
    url: "/blog",
    type: "website",
    images: [
      {
        url: absoluteUrl("/backgrounds/bg8.jpeg"),
        width: 1200,
        height: 630,
        alt: "Altigo Himalayan Treks blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Nepal Trek Blog`,
    description:
      "Trekking articles on routes, seasons, permits, safety, and planning for Nepal adventures.",
    images: [absoluteUrl("/backgrounds/bg8.jpeg")],
  },
};

export default function BlogLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
