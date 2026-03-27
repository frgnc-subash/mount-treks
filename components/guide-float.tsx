"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { resolveLocale } from "@/lib/i18n";

export default function GuideFloat() {
  const searchParams = useSearchParams();
  const locale = resolveLocale(searchParams.get("lang"));
  const href = locale === "en" ? "/guide" : `/guide?lang=${locale}`;
  const label = locale === "zh" ? "指南" : locale === "es" ? "Guía" : "Guide";

  return (
    <Link
      href={href}
      aria-label={label}
      className="group fixed bottom-5 right-5 z-[220] inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-blue-600 text-sm font-semibold text-white shadow-xl transition-all duration-300 hover:w-36 hover:justify-start hover:gap-2 hover:bg-blue-500 hover:px-4 focus-visible:w-36 focus-visible:justify-start focus-visible:gap-2 focus-visible:px-4"
    >
      <BookOpen size={18} />
      <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 group-hover:max-w-[90px] group-hover:opacity-100 group-focus-visible:max-w-[90px] group-focus-visible:opacity-100">
        {label}
      </span>
    </Link>
  );
}
