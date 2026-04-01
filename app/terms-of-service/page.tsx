import type { Metadata } from "next";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  BadgeCheck,
  CalendarDays,
  Compass,
  FileText,
  Lock,
  Mail,
  Scale,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { resolveLocale } from "@/lib/i18n";
import { getTermsPageContent } from "@/lib/legal-pages";
import { SITE_NAME } from "@/lib/seo";

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<{ lang?: string }>;
}): Promise<Metadata> {
  const query = await searchParams;
  const locale = resolveLocale(query?.lang);
  const content = getTermsPageContent(locale);

  return {
    title: content.metadataTitle,
    description: content.metadataDescription,
    alternates: {
      canonical: "/terms-of-service",
    },
    openGraph: {
      title: `${SITE_NAME} | ${content.metadataTitle}`,
      description: content.metadataDescription,
      url: "/terms-of-service",
      type: "website",
    },
  };
}

const sectionIcons: LucideIcon[] = [
  FileText,
  BadgeCheck,
  Wallet,
  CalendarDays,
  ShieldCheck,
  Scale,
  Compass,
  Lock,
  AlertTriangle,
  Mail,
];

const toId = (title: string, index: number) => {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return slug || `section-${index + 1}`;
};

export default async function TermsOfServicePage({
  searchParams,
}: {
  searchParams?: Promise<{ lang?: string }>;
}) {
  const query = await searchParams;
  const locale = resolveLocale(query?.lang);
  const withLang = (path: string) => (locale === "en" ? path : `${path}?lang=${locale}`);
  const copy = getTermsPageContent(locale);
  const termsSections = copy.sections;

  return (
    <main className="min-h-screen bg-[#050505] pb-16 pt-28">
      <section className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="rounded-3xl border border-white/10 bg-linear-to-b from-white/[0.05] to-white/[0.02] p-6 shadow-[0_18px_38px_rgba(0,0,0,0.34)] sm:p-8">
          <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
            {copy.heroBadge}
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-5xl">
            {copy.heroTitle}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-300 sm:text-base">
            {copy.heroDesc}
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/25 px-3 py-1.5 text-xs font-medium text-zinc-200">
            <CalendarDays className="h-3.5 w-3.5 text-primary" />
            {copy.lastUpdated}: {copy.lastUpdatedValue}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {termsSections.map((section, index) => (
              <a
                key={section.title}
                href={`#${toId(section.title, index)}`}
                className="rounded-full border border-white/12 bg-black/25 px-3 py-1.5 text-xs font-medium text-zinc-200 transition hover:border-white/25 hover:bg-white/[0.06] hover:text-white"
              >
                {section.title}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-28 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <p className="text-xs font-semibold tracking-[0.14em] text-zinc-400 uppercase">
                {copy.sectionsLabel}
              </p>
              <nav className="mt-3 space-y-1">
                {termsSections.map((section, index) => (
                  <a
                    key={section.title}
                    href={`#${toId(section.title, index)}`}
                    className="block rounded-md px-2.5 py-2 text-sm text-zinc-300 transition hover:bg-white/[0.06] hover:text-white"
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
              <div className="mt-4 h-px bg-white/10" />
              <Link
                href={withLang("/contact")}
                className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-lg bg-primary px-3 text-sm font-semibold text-white hover:bg-primary/90"
              >
                {copy.contactButton}
              </Link>
            </div>
          </aside>

          <section className="space-y-4">
            {termsSections.map((section, index) => {
              const Icon = sectionIcons[index] ?? FileText;

              return (
                <article
                  id={toId(section.title, index)}
                  key={section.title}
                  className="scroll-mt-28 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6"
                >
                  <div className="flex items-start gap-3">
                    <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.05]">
                      <Icon className="h-5 w-5 text-zinc-100" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-lg font-semibold text-white sm:text-xl">
                        {section.title}
                      </h2>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3 text-sm leading-relaxed text-zinc-300">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </article>
              );
            })}
          </section>
        </div>

        <section className="mt-10 rounded-2xl border border-amber-300/25 bg-amber-500/10 p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="text-lg font-semibold text-white">{copy.noteTitle}</h2>
              <p className="mt-1 text-sm leading-relaxed text-zinc-200">{copy.noteDesc}</p>
            </div>
          </div>
        </section>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={withLang("/privacy-policy")}
            className="inline-flex min-w-[180px] items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
          >
            {copy.privacyButton}
          </Link>
          <Link
            href={withLang("/destinations")}
            className="inline-flex min-w-[180px] items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
          >
            {copy.browseButton}
          </Link>
        </div>
      </section>
    </main>
  );
}
