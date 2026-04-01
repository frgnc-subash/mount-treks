import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3 } from "lucide-react";
import { getAllBlogPosts, getFeaturedBlogPost } from "@/lib/blog";
import { resolveLocale } from "@/lib/i18n";
import { SITE_NAME } from "@/lib/seo";

type PageProps = {
  searchParams?: Promise<{ lang?: string }>;
};

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const query = await searchParams;
  const locale = resolveLocale(query?.lang);

  const copy =
    locale === "zh"
      ? {
          title: "徒步博客",
          description: "阅读 Altigo Himalayan Treks 的尼泊尔徒步文章，了解路线选择、季节、许可、安全与行程规划。",
        }
      : locale === "es"
        ? {
            title: "Blog de Trekking en Nepal",
            description: "Lee artículos de Altigo Himalayan Treks sobre rutas, temporadas, permisos, seguridad y planificación para Nepal.",
          }
        : {
            title: "Nepal Trek Blog",
            description:
              "Read trekking articles from Altigo Himalayan Treks on routes, seasons, permits, safety, and practical planning for Nepal adventures.",
          };

  return {
    title: copy.title,
    description: copy.description,
    openGraph: {
      title: `${SITE_NAME} | ${copy.title}`,
      description: copy.description,
      url: "/blog",
      type: "website",
    },
  };
}

export default async function BlogPage({ searchParams }: PageProps) {
  const query = await searchParams;
  const locale = resolveLocale(query?.lang);
  const posts = getAllBlogPosts(locale);
  const featuredPost = getFeaturedBlogPost(locale);
  const withLang = (path: string) => (locale === "en" ? path : `${path}?lang=${locale}`);

  const copy =
    locale === "zh"
      ? {
          badge: "Altigo Journal",
          title: "尼泊尔徒步博客",
          description:
            "围绕路线选择、季节判断、后勤准备与高海拔安全，整理真正对出发有帮助的内容。",
          featured: "精选文章",
          latest: "最新文章",
          readArticle: "阅读文章",
          explore: "继续阅读",
        }
      : locale === "es"
        ? {
            badge: "Altigo Journal",
            title: "Blog de trekking en Nepal",
            description:
              "Artículos prácticos sobre selección de rutas, temporadas, logística y seguridad en altura para viajar mejor preparado.",
            featured: "Artículo destacado",
            latest: "Últimos artículos",
            readArticle: "Leer artículo",
            explore: "Seguir leyendo",
          }
        : {
            badge: "Altigo Journal",
            title: "Nepal trekking stories and planning notes",
            description:
              "Practical articles on route selection, seasons, permits, logistics, and altitude safety for trekkers planning Nepal the smart way.",
            featured: "Featured article",
            latest: "Latest articles",
            readArticle: "Read article",
            explore: "Keep reading",
          };

  return (
    <main className="min-h-screen bg-[#050505] pb-16 pt-28 text-white">
      <section className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(120%_140%_at_0%_0%,rgba(8,78,168,0.24),rgba(8,8,8,0.98)_52%,rgba(5,5,5,1)_100%)] p-6 shadow-[0_18px_48px_rgba(0,0,0,0.4)] sm:p-8">
          <div className="absolute right-[-80px] top-[-20px] h-48 w-48 rounded-full bg-primary/16 blur-3xl" />
          <div className="relative max-w-3xl">
            <p className="text-xs font-semibold tracking-[0.24em] text-primary uppercase">{copy.badge}</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">{copy.title}</h1>
            <p className="mt-4 text-sm leading-7 text-zinc-300 sm:text-base">{copy.description}</p>
          </div>
        </div>

        {featuredPost ? (
          <section className="mt-8">
            <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-zinc-400 uppercase">{copy.featured}</p>
            <article className="grid overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] shadow-[0_18px_40px_rgba(0,0,0,0.32)] lg:grid-cols-[1.1fr_0.9fr]">
              <div className="relative min-h-[280px]">
                <Image
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 56vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
              </div>
              <div className="flex flex-col justify-between p-6 sm:p-8">
                <div>
                  <span className="inline-flex rounded-full border border-white/12 bg-white/[0.05] px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-zinc-300 uppercase">
                    {featuredPost.category}
                  </span>
                  <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">{featuredPost.title}</h2>
                  <p className="mt-4 text-sm leading-7 text-zinc-300 sm:text-base">{featuredPost.excerpt}</p>
                </div>

                <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5 text-primary" />
                      {new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : locale === "es" ? "es-ES" : "en-US", {
                        dateStyle: "medium",
                      }).format(new Date(featuredPost.publishedAt))}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 className="h-3.5 w-3.5 text-primary" />
                      {featuredPost.readTime}
                    </span>
                  </div>

                  <Link
                    href={withLang(`/blog/${featuredPost.slug}`)}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary/90"
                  >
                    {copy.readArticle}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </article>
          </section>
        ) : null}

        <section className="mt-10">
          <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-zinc-400 uppercase">{copy.latest}</p>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="group overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/[0.03] transition hover:-translate-y-1 hover:border-white/16 hover:bg-white/[0.045]"
              >
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 sm:p-6">
                  <span className="inline-flex rounded-full border border-white/12 bg-white/[0.05] px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-zinc-300 uppercase">
                    {post.category}
                  </span>
                  <h2 className="mt-4 text-xl font-semibold tracking-tight text-white">{post.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-zinc-300">{post.excerpt}</p>
                  <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-zinc-400">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5 text-primary" />
                      {new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : locale === "es" ? "es-ES" : "en-US", {
                        dateStyle: "medium",
                      }).format(new Date(post.publishedAt))}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 className="h-3.5 w-3.5 text-primary" />
                      {post.readTime}
                    </span>
                  </div>
                  <Link
                    href={withLang(`/blog/${post.slug}`)}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-white"
                  >
                    {copy.explore}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
