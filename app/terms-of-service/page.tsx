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
import { SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read the Terms of Service for Altigo Himalayan Treks, including booking, payments, cancellations, liability, and traveler responsibilities.",
  alternates: {
    canonical: "/terms-of-service",
  },
  openGraph: {
    title: `${SITE_NAME} | Terms of Service`,
    description:
      "Read the Terms of Service for Altigo Himalayan Treks, including booking, payments, cancellations, liability, and traveler responsibilities.",
    url: "/terms-of-service",
    type: "website",
  },
};

type TermsSection = {
  title: string;
  paragraphs: string[];
};

const termsSections: TermsSection[] = [
  {
    title: "1. Acceptance of Terms",
    paragraphs: [
      "By accessing this website or booking any trip, consultation, or service from Altigo Himalayan Treks, you agree to these Terms of Service.",
      "If you do not agree with any part of these terms, please do not use our website or services.",
    ],
  },
  {
    title: "2. Eligibility and Account Use",
    paragraphs: [
      "You must provide accurate, complete, and current information when creating an account or submitting a booking request.",
      "You are responsible for safeguarding your account credentials and for all activities that occur under your account.",
    ],
  },
  {
    title: "3. Booking, Pricing, and Payment",
    paragraphs: [
      "Trip prices, inclusions, and availability are displayed as accurately as possible but may change due to permits, transport, weather, or supplier costs.",
      "A booking is confirmed only after we send confirmation and receive the required payment or deposit according to your itinerary terms.",
      "You are responsible for transaction fees, foreign exchange charges, and any taxes or duties imposed by your payment provider or local authority.",
    ],
  },
  {
    title: "4. Cancellations and Changes",
    paragraphs: [
      "Cancellation and refund terms may differ by package, season, and supplier commitments. The terms shared at booking time apply to your reservation.",
      "Requests to change dates, routes, accommodations, or group composition are handled case by case and may involve additional costs.",
      "Force majeure events, including weather disruptions, natural hazards, government restrictions, or transport shutdowns, may require itinerary adjustments without liability for indirect losses.",
    ],
  },
  {
    title: "5. Health, Safety, and Trekking Responsibility",
    paragraphs: [
      "High-altitude trekking and expedition travel involve inherent risks. You are responsible for choosing trips suitable for your fitness, health condition, and prior experience.",
      "You should obtain medical advice before travel, carry required medications, disclose relevant health conditions, and follow guide instructions throughout the trip.",
      "Travel insurance covering high-altitude trekking and emergency evacuation is strongly recommended and may be required for specific itineraries.",
    ],
  },
  {
    title: "6. Liability Limitations",
    paragraphs: [
      "To the maximum extent permitted by law, Altigo Himalayan Treks is not liable for indirect, incidental, special, or consequential damages arising from website use or trip participation.",
      "Our total liability for any claim related to a booking is limited to the amount paid directly to us for the affected service, except where local law requires otherwise.",
    ],
  },
  {
    title: "7. Intellectual Property",
    paragraphs: [
      "All content on this website, including text, media, branding, and layout, is owned by or licensed to Altigo Himalayan Treks and is protected by applicable intellectual property laws.",
      "You may not reproduce, distribute, republish, or commercially exploit website content without prior written permission.",
    ],
  },
  {
    title: "8. Privacy and Data Handling",
    paragraphs: [
      "Use of personal information is governed by our Privacy Policy. By using this site, you consent to collection and use of data as described there.",
      "If there is a conflict between these Terms and our Privacy Policy regarding data practices, the Privacy Policy controls for that topic.",
    ],
  },
  {
    title: "9. Security and Prohibited Use",
    paragraphs: [
      "You agree not to misuse the website, attempt unauthorized access, disrupt platform operations, or submit malicious code or fraudulent information.",
      "We may suspend access, cancel bookings, or take legal action if misuse, abuse, or violations of these terms are identified.",
    ],
  },
  {
    title: "10. Governing Law and Contact",
    paragraphs: [
      "These terms are governed by the laws of Nepal unless otherwise required by mandatory consumer law in your country of residence.",
      "For questions about these terms, contact us at info@altigohimalayantreks.com.",
    ],
  },
];

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

  const copy =
    locale === "zh"
      ? {
          heroBadge: "法律与条款",
          heroTitle: "服务条款",
          heroDesc:
            "请在预订徒步产品或使用网站服务前阅读本条款，了解预订、付款、改期、取消与责任范围。",
          sectionsLabel: "条款目录",
          lastUpdated: "最近更新",
          noteTitle: "重要提示",
          noteDesc:
            "高海拔徒步存在自然风险。请根据自身情况选择线路，并确保保险覆盖高海拔徒步和紧急撤离。",
          contactButton: "联系我们",
          privacyButton: "查看隐私政策",
          browseButton: "浏览目的地",
        }
      : locale === "es"
        ? {
            heroBadge: "Legal y Términos",
            heroTitle: "Términos del Servicio",
            heroDesc:
              "Revisa estos términos antes de reservar o usar nuestros servicios para conocer pagos, cambios, cancelaciones y límites de responsabilidad.",
            sectionsLabel: "Secciones",
            lastUpdated: "Última actualización",
            noteTitle: "Aviso Importante",
            noteDesc:
              "El trekking en altura implica riesgos naturales. Elige rutas según tu condición y usa seguro con cobertura de altura y evacuación.",
            contactButton: "Contactar",
            privacyButton: "Ver Política de Privacidad",
            browseButton: "Ver Destinos",
          }
        : {
            heroBadge: "Legal and Terms",
            heroTitle: "Terms of Service",
            heroDesc:
              "Please review these terms before booking or using our services. They explain bookings, payments, cancellations, and responsibilities.",
            sectionsLabel: "Terms Sections",
            lastUpdated: "Last updated",
            noteTitle: "Important Note",
            noteDesc:
              "High-altitude trekking involves natural risk. Choose routes based on your condition and maintain insurance that includes altitude trekking and evacuation.",
            contactButton: "Contact Us",
            privacyButton: "View Privacy Policy",
            browseButton: "Browse Destinations",
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
