import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PackageDetails from "@/components/package-details";
import { getPackageById } from "@/lib/content";
import { resolveLocale } from "@/lib/i18n";
import { absoluteUrl, getPackageImagePath, SITE_NAME, SITE_URL } from "@/lib/seo";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ lang?: string }>;
}

const parsePrice = (value: string) => Number(value.replace(/[^0-9.]/g, "") || 0);

const getLowestPackagePrice = (prices: { label: string; price: string }[]) =>
  prices.reduce((min, tier) => {
    const amount = parsePrice(tier.price);
    return min === 0 || amount < min ? amount : min;
  }, 0);

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const query = await searchParams;
  const locale = resolveLocale(query?.lang);
  const item = await getPackageById(id, locale);

  if (!item) {
    return {
      title: "Package Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${item.name} in Nepal`;
  const description = `${item.summary} Duration: ${item.duration}. Max altitude: ${item.altitude}. Difficulty: ${item.difficulty}.`;
  const image = absoluteUrl(item.image || getPackageImagePath(item.id));
  const canonicalPath = `/packages/${item.id}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title,
      description,
      url: canonicalPath,
      type: "article",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: item.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function PackageDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const query = await searchParams;
  const locale = resolveLocale(query?.lang);
  const item = await getPackageById(id, locale);

  if (!item) {
    notFound();
  }

  const lowestPrice = getLowestPackagePrice(item.pricing);

  const packageJsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: item.name,
    description: item.summary,
    url: `${SITE_URL}/packages/${item.id}`,
    image: absoluteUrl(item.image || getPackageImagePath(item.id)),
    touristType: item.idealFor,
    provider: {
      "@type": "TravelAgency",
      name: SITE_NAME,
      url: SITE_URL,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: lowestPrice || undefined,
      url: `${SITE_URL}/packages/${item.id}`,
      availability: "https://schema.org/InStock",
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Packages",
        item: `${SITE_URL}/packages`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: item.name,
        item: `${SITE_URL}/packages/${item.id}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(packageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <PackageDetails item={item} locale={locale} />
    </>
  );
}
