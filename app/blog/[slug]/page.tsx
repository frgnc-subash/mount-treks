import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock3 } from "lucide-react";
import { getAllBlogPosts, getAllBlogSlugs, getBlogPostBySlug } from "@/lib/blog";
import { resolveLocale } from "@/lib/i18n";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ lang?: string }>;
};

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const query = await searchParams;
  const locale = resolveLocale(query?.lang);
  const post = getBlogPostBySlug(slug, locale);

  if (!post) {
    return {
      title: "Article Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: post.title,
    description: post.seoDescription,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: `${SITE_NAME} | ${post.title}`,
      description: post.seoDescription,
      url: `/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author],
      images: [
        {
          url: absoluteUrl(post.image),
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${SITE_NAME} | ${post.title}`,
      description: post.seoDescription,
      images: [absoluteUrl(post.image)],
    },
  };
}

export default async function BlogPostPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const locale = resolveLocale(query?.lang);
  const post = getBlogPostBySlug(slug, locale);

  if (!post) {
    notFound();
  }

  const relatedPosts = getAllBlogPosts(locale)
    .filter((item) => item.slug !== post.slug)
    .slice(0, 2);

  const withLang = (path: string) => (locale === "en" ? path : `${path}?lang=${locale}`);

  const copy =
    locale === "zh"
      ? {
          back: "返回博客",
          related: "继续阅读",
        }
      : locale === "es"
        ? {
            back: "Volver al blog",
            related: "Seguir leyendo",
          }
        : {
            back: "Back to blog",
            related: "Keep reading",
          };

  return (
    <main className="min-h-screen bg-[#050505] pb-16 pt-28 text-white">
      <article className="mx-auto w-full max-w-5xl px-5 sm:px-8">
        <Link
          href={withLang("/blog")}
          className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-300 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          {copy.back}
        </Link>

        <header className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03]">
          <div className="relative h-[320px] sm:h-[420px]">
            <Image
              src={post.image}
              alt={post.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black via-black/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <span className="inline-flex rounded-full border border-white/12 bg-black/35 px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-zinc-200 uppercase">
                {post.category}
              </span>
              <h1 className="mt-4 max-w-3xl text-3xl font-black tracking-tight sm:text-5xl">{post.title}</h1>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-zinc-300">
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
                <span>{post.author}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <p className="max-w-3xl text-base leading-8 text-zinc-300">{post.excerpt}</p>

          <div className="mt-8 space-y-8">
            {post.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-2xl font-semibold tracking-tight text-white">{section.heading}</h2>
                <div className="mt-4 space-y-4 text-sm leading-8 text-zinc-300 sm:text-base">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>

        {relatedPosts.length > 0 ? (
          <section className="mt-10">
            <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-zinc-400 uppercase">{copy.related}</p>
            <div className="grid gap-4 md:grid-cols-2">
              {relatedPosts.map((item) => (
                <Link
                  key={item.slug}
                  href={withLang(`/blog/${item.slug}`)}
                  className="group overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.03] transition hover:-translate-y-1 hover:border-white/16"
                >
                  <div className="relative h-48">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-[11px] font-semibold tracking-[0.16em] text-zinc-400 uppercase">{item.category}</p>
                    <h2 className="mt-3 text-xl font-semibold tracking-tight text-white">{item.title}</h2>
                    <p className="mt-2 text-sm leading-7 text-zinc-300">{item.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </article>
    </main>
  );
}
