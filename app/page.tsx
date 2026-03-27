import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ShieldCheck, Users, Mountain, Star } from "lucide-react";
import BackgroundAni from "@/components/backgroundAni";
import HomeGallery from "@/components/home-gallery";
import TopPackagesCarousel from "@/components/top-packages-carousel";
import { Button } from "@/components/ui/button";
import { getAllPackages } from "@/lib/content";
import type { TrekPackage } from "@/lib/packages-data";
import { resolveLocale } from "@/lib/i18n";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Himalayan Trekking in Nepal",
  description:
    "Plan your Himalayan trek in Nepal with expert local guides. Compare featured routes, trekking packages, and start your custom trip with Altigo Himalayan Treks.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${SITE_NAME} | Himalayan Trekking in Nepal`,
    description:
      "Plan your Himalayan trek in Nepal with expert local guides and transparent packages.",
    url: "/",
    type: "website",
    images: [
      {
        url: absoluteUrl("/backgrounds/bg9.jpeg"),
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} trekking routes in Nepal`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Himalayan Trekking in Nepal`,
    description:
      "Plan your Himalayan trek in Nepal with expert local guides and transparent packages.",
    images: [absoluteUrl("/backgrounds/bg9.jpeg")],
  },
};

function SectionHeader({
  eyebrow,
  title,
  description,
  shadowText,
}: {
  eyebrow: string;
  title: string;
  description: string;
  shadowText: string;
}) {
  return (
    <div className="relative isolate mb-8 text-center md:mb-10">
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 w-full -translate-x-1/2 -translate-y-1/2 text-center text-4xl font-black tracking-[0.16em] text-white/10 uppercase drop-shadow-[0_8px_18px_rgba(0,0,0,0.25)] sm:text-7xl md:text-8xl lg:text-9xl"
      >
        {shadowText}
      </span>
      <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-xs leading-relaxed text-zinc-300 sm:text-base">
        {description}
      </p>
    </div>
  );
}

function WhyChooseUs({
  locale,
  copy,
}: {
  locale: "en" | "es" | "zh";
  copy: {
    eyebrow: string;
    title: string;
    description: string;
    shadow: string;
    badgeNote: string;
    points: { title: string; desc: string }[];
  };
}) {
  const heroImages = [
    "/gallery/image9.jpeg",
    "/gallery/image11.jpeg",
    "/gallery/image13.jpeg",
    "/backgrounds/bg9.jpeg",
  ];
  const heroSlides = [...heroImages, heroImages[0]];

  const points = [
    {
      title: copy.points[0]?.title ?? "Expertly Curated Routes",
      desc:
        copy.points[0]?.desc ??
        "Balanced trail plans built for scenery, comfort, and safe altitude progression.",
      icon: Mountain,
    },
    {
      title: copy.points[1]?.title ?? "Certified Local Team",
      desc:
        copy.points[1]?.desc ??
        "Experienced guides and support crew who know each route in real conditions.",
      icon: ShieldCheck,
    },
    {
      title: copy.points[2]?.title ?? "Small Group Quality",
      desc:
        copy.points[2]?.desc ??
        "Fewer trekkers per group means smoother pacing and better on-trail support.",
      icon: Users,
    },
  ];

  return (
    <section className="w-full">
      <SectionHeader
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
        shadowText={copy.shadow}
      />

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="relative overflow-hidden rounded-3xl border border-white/10 shadow-[0_20px_42px_rgba(0,0,0,0.28)]">
          <div className="why-slide-track">
            {heroSlides.map((src, idx) => (
              <img
                key={`${src}-${idx}`}
                src={src}
                alt="Trek experience"
                className="why-slide-image"
              />
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
          <p className="absolute bottom-4 left-4 rounded-full border border-white/20 bg-black/30 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm sm:left-5 sm:bottom-5 sm:px-3 sm:text-[11px]">
            {copy.badgeNote}
          </p>
          <div className="h-[300px] sm:h-[360px] md:h-[420px]" />
        </article>

        <div className="grid gap-3">
          {points.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-white/10 bg-linear-to-br from-[#0b0b0c] via-[#09090a] to-[#070708] p-4 shadow-[0_12px_28px_rgba(0,0,0,0.45)] transition-colors hover:border-white/20 sm:p-5"
            >
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.04]">
                <item.icon className="h-4.5 w-4.5 text-zinc-100" />
              </div>
              <h3 className="mt-3 text-base font-semibold text-white">
                {item.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-300">
                {item.desc}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CustomerSay({
  copy,
  comments,
}: {
  copy: { eyebrow: string; title: string; description: string; shadow: string };
  comments: Array<{ name: string; initials: string; rating: number; text: string }>;
}) {

  const loopComments = [...comments, ...comments];
  const row1 = loopComments;
  const row2 = [
    ...comments.slice(2),
    ...comments.slice(0, 2),
    ...comments.slice(2),
    ...comments.slice(0, 2),
  ];

  return (
    <section className="w-full">
      <SectionHeader
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
        shadowText={copy.shadow}
      />

      <div className="space-y-4">
        <div className="testimonial-marquee">
          <div className="testimonial-track">
            {row1.map((item, idx) => (
              <article
                key={`row1-${item.name}-${idx}`}
                className="w-[170px] shrink-0 rounded-2xl bg-white/5 p-4 backdrop-blur-sm sm:w-[190px] md:w-[220px] lg:w-[250px] xl:w-[268px]"
              >
                <div className="mb-3 flex items-center gap-1 text-yellow-400">
                  {Array.from({ length: item.rating }).map((_, starIdx) => (
                    <Star
                      key={starIdx}
                      className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 sm:h-4 sm:w-4"
                    />
                  ))}
                </div>
                <p className="text-xs leading-relaxed text-zinc-300 sm:text-sm">
                  &quot;{item.text}&quot;
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/85 text-[11px] font-semibold text-white sm:h-9 sm:w-9 sm:text-xs">
                    {item.initials}
                  </div>
                  <p className="text-xs font-semibold text-white sm:text-sm">
                    {item.name}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="hidden md:block testimonial-marquee">
          <div className="testimonial-track testimonial-track-reverse">
            {row2.map((item, idx) => (
              <article
                key={`row2-${item.name}-${idx}`}
                className="w-[170px] shrink-0 rounded-2xl bg-white/5 p-4 backdrop-blur-sm sm:w-[190px] md:w-[220px] lg:w-[250px] xl:w-[268px]"
              >
                <div className="mb-3 flex items-center gap-1 text-yellow-400">
                  {Array.from({ length: item.rating }).map((_, starIdx) => (
                    <Star
                      key={starIdx}
                      className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 sm:h-4 sm:w-4"
                    />
                  ))}
                </div>
                <p className="text-xs leading-relaxed text-zinc-300 sm:text-sm">
                  &quot;{item.text}&quot;
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/85 text-[11px] font-semibold text-white sm:h-9 sm:w-9 sm:text-xs">
                    {item.initials}
                  </div>
                  <p className="text-xs font-semibold text-white sm:text-sm">
                    {item.name}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedPackages({
  packages,
  copy,
  locale,
}: {
  packages: TrekPackage[];
  copy: { eyebrow: string; title: string; description: string; shadow: string };
  locale: "en" | "es" | "zh";
}) {
  return (
    <section className="w-full">
      <SectionHeader
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
        shadowText={copy.shadow}
      />
      <TopPackagesCarousel packages={packages} locale={locale} />
    </section>
  );
}

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ lang?: string }>;
}) {
  const query = await searchParams;
  const locale = resolveLocale(query?.lang);
  const year = new Date().getFullYear();
  const packages = await getAllPackages(locale);
  const copy =
    locale === "zh"
      ? {
          heroBadge: `尼泊尔 ${year}`,
          heroTitleTop: "征服",
          heroTitleBottom: "喜马拉雅",
          heroDesc:
            "与持证向导一起体验高海拔徒步。从珠峰大本营到安娜普尔纳环线，我们带你向更高处前进。",
          heroPrimary: "寻找线路",
          heroSecondary: "定制行程",
          why: {
            eyebrow: "为什么选择我们",
            title: "值得信赖的徒步规划",
            description: "安全优先、在地经验与全程顺畅支持。",
            shadow: "安全",
            badgeNote: "不同路线，同一可信团队",
            points: [
              {
                title: "路线专业策划",
                desc: "兼顾景观、舒适度与稳健海拔适应。",
              },
              {
                title: "本地认证团队",
                desc: "经验丰富的向导与后勤团队熟悉真实路况。",
              },
              {
                title: "小团高品质",
                desc: "更少人数带来更稳定节奏与更好支持。",
              },
            ],
          },
          testimonials: {
            eyebrow: "口碑",
            title: "徒步者的选择",
            description: "来自真实徒步者的反馈与推荐。",
            shadow: "评价",
            comments: [
              {
                name: "Aarav Shah",
                initials: "AS",
                rating: 5,
                text: "安排非常到位，向导团队让我们的安娜普尔纳之旅安全又难忘。",
              },
              {
                name: "Sophie Turner",
                initials: "ST",
                rating: 5,
                text: "沟通清晰、住宿不错、线路震撼，强烈推荐。",
              },
              {
                name: "Nima Dorje",
                initials: "ND",
                rating: 5,
                text: "从始至终都很专业，适应计划做得很好。",
              },
              {
                name: "Elena Rossi",
                initials: "ER",
                rating: 5,
                text: "珠峰大本营之旅顺畅而壮丽，每天都被照顾得很好。",
              },
              {
                name: "Rohan Mehta",
                initials: "RM",
                rating: 5,
                text: "本地经验很强，团队友好，这是我最棒的一次徒步。",
              },
            ],
          },
          featured: {
            eyebrow: "精选产品",
            title: "热门行程",
            description: "精选线路与透明价格，含完整行程与向导支持。",
            shadow: "产品",
          },
        }
      : locale === "es"
        ? {
            heroBadge: `VISITA NEPAL ${year}`,
            heroTitleTop: "CONQUISTA",
            heroTitleBottom: "LOS HIMAlayas",
            heroDesc:
              "Vive el trekking de altura con guías certificados. De Everest Base Camp a Annapurna Circuit, te llevamos más alto.",
            heroPrimary: "Encuentra tu ruta",
            heroSecondary: "Personalizar viaje",
            why: {
              eyebrow: "Por qué elegirnos",
              title: "Planificación de confianza",
              description: "Seguridad primero, experiencia local y soporte continuo.",
              shadow: "Seguridad",
              badgeNote: "Diferentes rutas, un solo equipo confiable",
              points: [
                {
                  title: "Rutas bien diseñadas",
                  desc: "Equilibrio entre paisaje, confort y adaptación segura.",
                },
                {
                  title: "Equipo local certificado",
                  desc: "Guías y soporte con experiencia real en cada ruta.",
                },
                {
                  title: "Grupos pequeños",
                  desc: "Menos personas, mejor ritmo y apoyo en el camino.",
                },
              ],
            },
            testimonials: {
              eyebrow: "Testimonios",
              title: "Trekkers satisfechos",
              description: "Opiniones reales de quienes recorrieron Nepal con Altigo.",
              shadow: "Reseñas",
              comments: [
                {
                  name: "Aarav Shah",
                  initials: "AS",
                  rating: 5,
                  text: "Todo estuvo perfecto. El equipo hizo nuestro trek en Annapurna seguro e inolvidable.",
                },
                {
                  name: "Sophie Turner",
                  initials: "ST",
                  rating: 5,
                  text: "Comunicación clara, alojamiento excelente y rutas increíbles. Muy recomendado.",
                },
                {
                  name: "Nima Dorje",
                  initials: "ND",
                  rating: 5,
                  text: "Soporte profesional de inicio a fin. Excelente plan de aclimatación.",
                },
                {
                  name: "Elena Rossi",
                  initials: "ER",
                  rating: 5,
                  text: "Nuestro viaje a Everest Base Camp fue fluido y bien organizado cada día.",
                },
                {
                  name: "Rohan Mehta",
                  initials: "RM",
                  rating: 5,
                  text: "Gran conocimiento local y un equipo muy amable. Mi mejor experiencia de trekking.",
                },
              ],
            },
            featured: {
              eyebrow: "Paquetes destacados",
              title: "Mejores paquetes",
              description: "Paquetes seleccionados con itinerarios claros y precios transparentes.",
              shadow: "Paquetes",
            },
          }
        : {
            heroBadge: `VISIT NEPAL ${year}`,
            heroTitleTop: "CONQUER THE",
            heroTitleBottom: "HIMALAYAS",
            heroDesc:
              "Experience the thrill of high-altitude trekking with certified guides. From Everest Base Camp to the Annapurna Circuit, we take you higher.",
            heroPrimary: "Find Your Trek",
            heroSecondary: "Customize Trip",
            why: {
              eyebrow: "Why Choose Us",
              title: "Trusted Trek Planning",
              description:
                "Safety-first planning, local expertise, and smooth support from arrival to return.",
              shadow: "Safety",
              badgeNote: "Different locations, one trusted team",
              points: [
                {
                  title: "Expertly Curated Routes",
                  desc:
                    "Balanced trail plans built for scenery, comfort, and safe altitude progression.",
                },
                {
                  title: "Certified Local Team",
                  desc:
                    "Experienced guides and support crew who know each route in real conditions.",
                },
                {
                  title: "Small Group Quality",
                  desc: "Fewer trekkers per group means smoother pacing and better on-trail support.",
                },
              ],
            },
            testimonials: {
              eyebrow: "Testimonials",
              title: "Loved by Trekkers",
              description: "Real feedback from trekkers who explored Nepal with Altigo.",
              shadow: "Reviews",
              comments: [
                {
                  name: "Aarav Shah",
                  initials: "AS",
                  rating: 5,
                  text: "Everything was perfectly organized. The guide team made our Annapurna trek safe and unforgettable.",
                },
                {
                  name: "Sophie Turner",
                  initials: "ST",
                  rating: 5,
                  text: "Clear communication, great accommodations, and breathtaking routes. Highly recommend Altigo.",
                },
                {
                  name: "Nima Dorje",
                  initials: "ND",
                  rating: 5,
                  text: "Professional support from start to finish. The acclimatization plan was excellent.",
                },
                {
                  name: "Elena Rossi",
                  initials: "ER",
                  rating: 5,
                  text: "Our Everest Base Camp trip was smooth, scenic, and well managed every day.",
                },
                {
                  name: "Rohan Mehta",
                  initials: "RM",
                  rating: 5,
                  text: "Great local knowledge and very friendly team. This was my best trekking experience.",
                },
              ],
            },
            featured: {
              eyebrow: "Featured Packages",
              title: "Top Packages",
              description:
                "Handpicked packages with complete itineraries, transparent pricing, and guided support.",
              shadow: "Packages",
            },
          };

  return (
    <main className="flex w-full flex-col bg-[#050505]">
      <section className="relative flex h-[84vh] min-h-[480px] w-full flex-col overflow-hidden sm:h-[90vh] sm:min-h-[520px] md:h-screen">
        <BackgroundAni />

        <div className="relative z-20 mx-auto flex h-full w-full max-w-5xl flex-col items-center justify-center px-5 pt-14 text-center sm:px-6 sm:pt-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-md sm:mb-8">
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-[9px] font-bold tracking-[0.2em] text-gray-200 uppercase md:text-xs">
              {copy.heroBadge}
            </span>
          </div>

          <h1 className="mb-4 text-2xl font-black leading-[1.1] tracking-tight text-white uppercase sm:text-6xl md:mb-6 md:text-7xl lg:text-8xl">
            {copy.heroTitleTop} <br />
            <span className="text-transparent bg-clip-text bg-linear-to-b from-white to-zinc-500">
              {copy.heroTitleBottom}
            </span>
          </h1>

          <p className="mb-6 max-w-xl text-sm leading-relaxed font-light text-zinc-300 sm:max-w-2xl sm:text-lg lg:text-xl md:mb-10">
            {copy.heroDesc}
          </p>

          <div className="flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:w-auto sm:flex-row">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-primary text-white hover:bg-primary/90"
            >
              <Link href={locale === "en" ? "/destinations" : `/destinations?lang=${locale}`}>
                {copy.heroPrimary}
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-white/30 bg-white/5 text-white hover:bg-white/15 hover:text-white"
            >
              <Link href={locale === "en" ? "/packages" : `/packages?lang=${locale}`}>
                {copy.heroSecondary}
              </Link>
            </Button>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-white/40">
          <ArrowDown size={16} />
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-5 py-8 sm:px-8 md:gap-28 md:py-16">
        <WhyChooseUs locale={locale} copy={copy.why} />
        <FeaturedPackages packages={packages} copy={copy.featured} locale={locale} />
        <HomeGallery locale={locale} />
        <CustomerSay copy={copy.testimonials} comments={copy.testimonials.comments} />
      </div>
    </main>
  );
}
