import type { Metadata } from "next";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  Bell,
  CalendarDays,
  Cookie,
  Database,
  FileText,
  Lock,
  Mail,
  Share2,
  ShieldCheck,
  Users,
} from "lucide-react";
import { resolveLocale } from "@/lib/i18n";
import { SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read the Privacy Policy for Altigo Himalayan Treks, including how we collect, use, store, and protect your personal information.",
  alternates: {
    canonical: "/privacy-policy",
  },
  openGraph: {
    title: `${SITE_NAME} | Privacy Policy`,
    description:
      "Read the Privacy Policy for Altigo Himalayan Treks, including how we collect, use, store, and protect your personal information.",
    url: "/privacy-policy",
    type: "website",
  },
};

type PrivacySection = {
  title: string;
  paragraphs: string[];
};

const privacySections: PrivacySection[] = [
  {
    title: "1. Information We Collect",
    paragraphs: [
      "We collect information you submit directly, such as your name, email, phone number, travel preferences, and booking details.",
      "We may also collect technical data such as browser type, device information, pages visited, and cookie-based interaction data for service performance and analytics.",
    ],
  },
  {
    title: "2. How We Use Your Information",
    paragraphs: [
      "We use your data to process bookings, respond to inquiries, deliver trip support, send operational updates, and improve website experience.",
      "If you consent, we may send occasional marketing messages. You can opt out of promotional communication at any time.",
    ],
  },
  {
    title: "3. Legal Basis and Consent",
    paragraphs: [
      "We process personal information where necessary to perform requested services, comply with legal obligations, protect legitimate business interests, or based on your consent.",
      "When consent is used as the basis, you may withdraw it at any time, subject to legal or contractual limitations.",
    ],
  },
  {
    title: "4. Cookies and Tracking",
    paragraphs: [
      "We use essential cookies for core functionality and may use analytics cookies to understand site usage patterns.",
      "You can manage cookie preferences from our cookie banner and browser settings. Disabling some cookies may impact certain features.",
    ],
  },
  {
    title: "5. Information Sharing",
    paragraphs: [
      "We share data only when required to deliver services, such as with payment processors, accommodation providers, transport vendors, guides, and technical service providers.",
      "We may disclose information when legally required, to protect rights and safety, or in connection with business restructuring where permitted by law.",
    ],
  },
  {
    title: "6. Data Security",
    paragraphs: [
      "We apply reasonable administrative, technical, and organizational safeguards to protect personal information from unauthorized access, misuse, or disclosure.",
      "No internet transmission or storage system is perfectly secure. You share data at your own risk within the limits of applicable law.",
    ],
  },
  {
    title: "7. Data Retention",
    paragraphs: [
      "We keep personal information only for as long as needed for bookings, support, legal obligations, dispute handling, and legitimate business records.",
      "Retention periods may vary based on local legal requirements, tax rules, and operational needs.",
    ],
  },
  {
    title: "8. Your Rights",
    paragraphs: [
      "Depending on your jurisdiction, you may have rights to access, correct, delete, restrict, or object to certain processing of your personal data.",
      "To submit a request, contact us at info@altigohimalayantreks.com. We may require identity verification before fulfilling requests.",
    ],
  },
  {
    title: "9. Children's Privacy",
    paragraphs: [
      "Our website and services are not directed to children under the age required by applicable law for independent consent.",
      "If you believe a child has provided personal information without proper authorization, contact us so we can review and take appropriate action.",
    ],
  },
  {
    title: "10. Policy Updates and Contact",
    paragraphs: [
      "We may update this Privacy Policy from time to time. Changes become effective when posted on this page with an updated date.",
      "For privacy questions or requests, email us at info@altigohimalayantreks.com.",
    ],
  },
];

const sectionIcons: LucideIcon[] = [
  Database,
  Users,
  FileText,
  Cookie,
  Share2,
  ShieldCheck,
  CalendarDays,
  Lock,
  AlertTriangle,
  Mail,
];

const toId = (title: string, index: number) => {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return slug || `section-${index + 1}`;
};

export default async function PrivacyPolicyPage({
  searchParams,
}: {
  searchParams?: Promise<{ lang?: string }>;
}) {
  const query = await searchParams;
  const locale = resolveLocale(query?.lang);
  const withLang = (path: string) => (locale === "en" ? path : `${path}?lang=${locale}`);

  const copy =
    locale === "zh"
      ? {
          heroBadge: "隐私与数据",
          heroTitle: "隐私政策",
          heroDesc:
            "本政策说明我们如何收集、使用、共享和保护你的个人信息，以及你可行使的数据权利。",
          sectionsLabel: "政策目录",
          lastUpdated: "最近更新",
          noteTitle: "数据安全提醒",
          noteDesc:
            "我们会采取合理的安全措施保护信息，但任何网络传输都无法保证绝对安全。",
          termsButton: "查看服务条款",
          contactButton: "联系我们",
          guideButton: "查看徒步指南",
        }
      : locale === "es"
        ? {
            heroBadge: "Privacidad y Datos",
            heroTitle: "Política de Privacidad",
            heroDesc:
              "Esta política explica cómo recopilamos, usamos, compartimos y protegemos tus datos personales, y qué derechos puedes ejercer.",
            sectionsLabel: "Secciones",
            lastUpdated: "Última actualización",
            noteTitle: "Aviso de Seguridad",
            noteDesc:
              "Aplicamos medidas razonables de seguridad, pero ninguna transmisión por internet es totalmente segura.",
            termsButton: "Ver Términos del Servicio",
            contactButton: "Contactar",
            guideButton: "Ver Guía de Trekking",
          }
        : {
            heroBadge: "Privacy and Data",
            heroTitle: "Privacy Policy",
            heroDesc:
              "This policy explains how we collect, use, share, and protect your personal information, and the rights available to you.",
            sectionsLabel: "Policy Sections",
            lastUpdated: "Last updated",
            noteTitle: "Security Notice",
            noteDesc:
              "We apply reasonable data-protection safeguards, but no internet transmission or storage method is completely secure.",
            termsButton: "View Terms of Service",
            contactButton: "Contact Us",
            guideButton: "View Trek Guide",
          };

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
            {copy.lastUpdated}: March 27, 2026
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {privacySections.map((section, index) => (
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
                {privacySections.map((section, index) => (
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
            {privacySections.map((section, index) => {
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
            <Bell className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="text-lg font-semibold text-white">{copy.noteTitle}</h2>
              <p className="mt-1 text-sm leading-relaxed text-zinc-200">{copy.noteDesc}</p>
            </div>
          </div>
        </section>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={withLang("/terms-of-service")}
            className="inline-flex min-w-[180px] items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
          >
            {copy.termsButton}
          </Link>
          <Link
            href={withLang("/guide")}
            className="inline-flex min-w-[180px] items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
          >
            {copy.guideButton}
          </Link>
        </div>
      </section>
    </main>
  );
}
