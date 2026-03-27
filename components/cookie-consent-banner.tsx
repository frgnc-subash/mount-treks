"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Cookie } from "lucide-react";
import { useEffect, useState } from "react";
import { resolveLocale } from "@/lib/i18n";

const CONSENT_STORAGE_KEY = "altigo-cookie-consent-v1";
const CONSENT_COOKIE_KEY = "altigo_cookie_consent";
const CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

type ConsentChoice = "accepted" | "essential";

function persistConsent(choice: ConsentChoice) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {
    // Ignore storage errors so the app remains usable.
  }

  document.cookie = `${CONSENT_COOKIE_KEY}=${choice}; path=/; max-age=${CONSENT_MAX_AGE_SECONDS}; samesite=lax`;
}

export default function CookieConsentBanner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = resolveLocale(searchParams.get("lang"));
  const [visible, setVisible] = useState(false);

  const withLang = (path: string) => {
    if (locale === "en") return path;
    const separator = path.includes("?") ? "&" : "?";
    return `${path}${separator}lang=${locale}`;
  };

  const copy =
    locale === "zh"
      ? {
          title: "我们使用 Cookie",
          message:
            "为提升浏览体验，我们使用必要 Cookie，并在你同意后启用分析 Cookie。",
          accept: "全部接受",
          essentialOnly: "仅必要",
          policy: "隐私政策",
        }
      : locale === "es"
        ? {
            title: "Usamos cookies",
            message:
              "Usamos cookies esenciales para el sitio y cookies analíticas solo con tu consentimiento.",
            accept: "Aceptar todo",
            essentialOnly: "Solo esenciales",
            policy: "Política de privacidad",
          }
        : {
            title: "We Use Cookies",
            message:
              "We use essential cookies for core site functions and analytics cookies only with your consent.",
            accept: "Accept All",
            essentialOnly: "Essential Only",
            policy: "Privacy Policy",
          };

  useEffect(() => {
    try {
      const existing = localStorage.getItem(CONSENT_STORAGE_KEY) as ConsentChoice | null;
      setVisible(!existing);
    } catch {
      setVisible(true);
    }
  }, [pathname]);

  if (!visible) return null;

  return (
    <section className="pointer-events-none fixed inset-x-0 bottom-3 z-[2400] px-3 sm:bottom-4 sm:px-5">
      <div className="pointer-events-auto mx-auto w-full max-w-3xl rounded-2xl border border-white/15 bg-[#0a0b0d]/95 p-4 text-white shadow-[0_18px_44px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-white">
              <Cookie className="h-4 w-4 text-primary" />
              {copy.title}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-zinc-300">
              {copy.message}{" "}
              <Link href={withLang("/privacy-policy")} className="text-primary hover:underline">
                {copy.policy}
              </Link>
            </p>
          </div>

          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                persistConsent("essential");
                setVisible(false);
              }}
              className="inline-flex h-9 items-center justify-center rounded-lg border border-white/20 bg-white/[0.03] px-4 text-sm font-medium text-zinc-200 transition hover:bg-white/[0.08] hover:text-white"
            >
              {copy.essentialOnly}
            </button>
            <button
              type="button"
              onClick={() => {
                persistConsent("accepted");
                setVisible(false);
              }}
              className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary/90"
            >
              {copy.accept}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
