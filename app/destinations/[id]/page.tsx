import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock3, Mountain, MapPin, ShieldCheck, CalendarDays } from "lucide-react";
import DestinationDetailMap from "@/components/destination-detail-map-client";
import DestinationWeather from "@/components/destination-weather";
import { getDestinationById } from "@/lib/content";
import { resolveLocale } from "@/lib/i18n";
import { absoluteUrl, SITE_NAME, SITE_URL } from "@/lib/seo";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ lang?: string }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const query = await searchParams;
  const locale = resolveLocale(query?.lang);
  const destination = await getDestinationById(id, locale);

  if (!destination) {
    return {
      title: "Destination Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${destination.name} Trek Guide`;
  const description = `${destination.desc} Region: ${destination.region}. Duration: ${destination.duration}. Best season: ${destination.bestSeason}.`;
  const canonicalPath = `/destinations/${destination.id}`;
  const image = absoluteUrl(destination.image);

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
          alt: destination.name,
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

const destinationGallery: Record<string, string[]> = {
  "everest-base-camp": [
    "/ebc/1.jpg",
    "/ebc/3.jpg",
    "/ebc/5.jpg",
    "/ebc/7.jpg",
    "/ebc/9.jpg",
  ],
  "annapurna-circuit": [
    "/abc/1.jpg",
    "/abc/3.jpg",
    "/abc/5.jpg",
    "/abc/7.jpg",
    "/abc/9.jpg",
  ],
  "annapurna-semi-circuit": [
    "/abc/2.jpg",
    "/abc/4.jpg",
    "/abc/6.jpg",
    "/abc/8.jpg",
    "/abc/10.jpg",
  ],
  "everest-gokyo-cho-la": [
    "/ebc/2.jpg",
    "/ebc/4.jpg",
    "/ebc/6.jpg",
    "/ebc/8.jpg",
    "/ebc/9.jpg",
  ],
  "lower-dolpo-trek": [
    "/backgrounds/bg2.jpeg",
    "/backgrounds/bg5.jpeg",
    "/backgrounds/bg7.jpeg",
    "/backgrounds/bg9.jpeg",
    "/gallery/image11.jpeg",
  ],
  "nar-phu-valley-jomsom": [
    "/backgrounds/bg2.jpeg",
    "/backgrounds/bg4.jpeg",
    "/backgrounds/bg6.jpeg",
    "/backgrounds/bg8.jpeg",
    "/gallery/image4.jpeg",
  ],
  "sacred-valley-ruby-valley": [
    "/backgrounds/bg3.jpeg",
    "/backgrounds/bg5.jpeg",
    "/backgrounds/bg7.jpeg",
    "/backgrounds/bg9.jpeg",
    "/gallery/image6.jpeg",
  ],
  "upper-mustang": [
    "/upper-mustang/jomsom.jpg",
    "/upper-mustang/kagbeni.jpg",
    "/upper-mustang/ghami.jpg",
    "/upper-mustang/lomanthang.jpg",
    "/upper-mustang/tsarang.jpg",
  ],
  "poon-hill": [
    "/gallery/image7.jpeg",
    "/gallery/image5.jpeg",
    "/backgrounds/bg3.jpeg",
    "/gallery/image6.jpeg",
    "/backgrounds/bg6.jpeg",
  ],
  "langtang-valley": [
    "/gallery/image8.jpeg",
    "/backgrounds/bg5.jpeg",
    "/gallery/image4.jpeg",
    "/backgrounds/bg4.jpeg",
    "/gallery/image2.jpeg",
  ],
};

export default async function DestinationDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const query = await searchParams;
  const locale = resolveLocale(query?.lang);
  const destination = await getDestinationById(id, locale);

  if (!destination) {
    notFound();
  }
  const galleryImages = destinationGallery[id] || [destination.image];
  const destinationJsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: destination.name,
    description: destination.desc,
    url: `${SITE_URL}/destinations/${destination.id}`,
    image: galleryImages.map((src) => absoluteUrl(src)),
    geo: {
      "@type": "GeoCoordinates",
      latitude: destination.lat,
      longitude: destination.lng,
    },
    touristType: destination.difficulty,
    containedInPlace: {
      "@type": "Country",
      name: "Nepal",
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
        name: "Destinations",
        item: `${SITE_URL}/destinations`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: destination.name,
        item: `${SITE_URL}/destinations/${destination.id}`,
      },
    ],
  };

  const travelAgencyJsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: SITE_NAME,
    url: SITE_URL,
  };

  const backHref = locale ? `/destinations?lang=${locale}` : "/destinations";
  const bookingHref = locale
    ? `/packages/${destination.id}?lang=${locale}`
    : `/packages/${destination.id}`;
  const copy =
    locale === "zh"
      ? {
          back: "返回地图",
          badge: "高端远征",
          intro:
            "此页面提供路线地图、天气概览、关键徒步信息与照片速览，帮助你快速了解线路。",
          region: "地区",
          duration: "行程天数",
          maxElevation: "最高海拔",
          difficulty: "难度",
          bestSeason: "最佳季节",
          permits: "许可",
          trailGallery: "路线相册",
          book: "立即预订",
        }
      : locale === "es"
        ? {
            back: "Volver al mapa",
            badge: "Expedición premium",
            intro:
              "Esta página ofrece un resumen rápido con mapa, clima y datos clave de la ruta en",
            region: "Región",
            duration: "Duración",
            maxElevation: "Altitud máxima",
            difficulty: "Dificultad",
            bestSeason: "Mejor temporada",
            permits: "Permisos",
            trailGallery: "Galería de ruta",
            book: "Reservar este viaje",
          }
        : {
            back: "Back to Map",
            badge: "Premium Expedition",
            intro:
              "This page gives you a quick trail overview with route map, weather snapshot, key trek facts, and photo glimpses from",
            region: "Region",
            duration: "Duration",
            maxElevation: "Max Elevation",
            difficulty: "Difficulty",
            bestSeason: "Best Season",
            permits: "Permits",
            trailGallery: "Trail Gallery",
            book: "Book This Trip",
          };

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(destinationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(travelAgencyJsonLd) }}
      />
      <section className="mx-auto w-full max-w-7xl px-5 pb-16 pt-28 sm:px-8">
        <Link
          href={backHref}
          className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-300 hover:text-white"
        >
          <ArrowLeft size={16} />
          {copy.back}
        </Link>

        <div className="rounded-[2rem] border border-white/10 bg-black/30 p-3 shadow-2xl backdrop-blur-sm sm:p-4">
          <DestinationDetailMap
            center={destination.mapCenter}
            zoom={destination.mapZoom}
            trailCoordinates={destination.trailCoordinates}
          />
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-black/25 p-6 sm:p-8">
          <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-primary uppercase">
            {copy.badge}
          </p>
          <h1 className="text-3xl font-black uppercase tracking-tight sm:text-5xl">
            {destination.name}
          </h1>
          <p className="mt-4 max-w-3xl whitespace-pre-line text-sm leading-relaxed text-zinc-300 sm:text-base">
            {destination.desc}
          </p>
          <p className="mt-3 max-w-3xl text-xs leading-relaxed text-zinc-400 sm:text-sm">
            {locale === "zh"
              ? `${copy.intro}${destination.name}。`
              : locale === "es"
                ? `${copy.intro} ${destination.name}.`
                : `${copy.intro} ${destination.name}.`}
          </p>

          <div className="mt-6">
            <DestinationWeather
              lat={destination.lat}
              lng={destination.lng}
              name={destination.name}
              locale={locale}
            />
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wide text-zinc-400">
                <MapPin size={14} className="text-primary" />
                {copy.region}
              </p>
              <p className="font-medium text-white">{destination.region}</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wide text-zinc-400">
                <Clock3 size={14} className="text-primary" />
                {copy.duration}
              </p>
              <p className="font-medium text-white">{destination.duration}</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wide text-zinc-400">
                <Mountain size={14} className="text-primary" />
                {copy.maxElevation}
              </p>
              <p className="font-medium text-white">{destination.elevation}</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wide text-zinc-400">
                <ShieldCheck size={14} className="text-primary" />
                {copy.difficulty}
              </p>
              <p className="font-medium text-white">{destination.difficulty}</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wide text-zinc-400">
                <CalendarDays size={14} className="text-primary" />
                {copy.bestSeason}
              </p>
              <p className="font-medium text-white">{destination.bestSeason}</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wide text-zinc-400">
                <ShieldCheck size={14} className="text-primary" />
                {copy.permits}
              </p>
              <p className="font-medium text-white">{destination.permits}</p>
            </div>
          </div>

          <div className="mt-8">
            <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-zinc-400 uppercase">
              {copy.trailGallery}
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {galleryImages.map((src, idx) => (
                <div key={`${src}-${idx}`} className="relative h-40 overflow-hidden rounded-xl">
                  <Image
                    src={src}
                    alt={`${destination.name} view ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <Link
            href={bookingHref}
            className="mt-8 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:bg-primary/90"
          >
            {copy.book}
          </Link>
        </div>
      </section>
    </main>
  );
}
