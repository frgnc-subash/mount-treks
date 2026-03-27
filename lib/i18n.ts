import type { Destination } from "@/lib/destinations-data";
import type { TrekPackage } from "@/lib/packages-data";
import { destinationTranslations } from "@/lib/destinations-i18n";
import { packageTranslations } from "@/lib/packages-i18n";

export type Locale = "en" | "zh" | "es";
export const DEFAULT_LOCALE: Locale = "en";

export function resolveLocale(input?: string | null): Locale {
  if (!input) return DEFAULT_LOCALE;
  const normalized = input.trim().toLowerCase();
  if (normalized.startsWith("zh")) return "zh";
  if (normalized.startsWith("es")) return "es";
  return DEFAULT_LOCALE;
}

export function localizePackage(pkg: TrekPackage, locale: Locale): TrekPackage {
  if (locale === "en") return pkg;
  const localeMap = packageTranslations[locale as keyof typeof packageTranslations];
  if (!localeMap) return pkg;
  const overrides = localeMap[pkg.id];
  return overrides ? { ...pkg, ...overrides } : pkg;
}

export function localizePackages(packages: TrekPackage[], locale: Locale): TrekPackage[] {
  return packages.map((pkg) => localizePackage(pkg, locale));
}

export function localizeDestination(destination: Destination, locale: Locale): Destination {
  if (locale === "en") return destination;
  const localeMap = destinationTranslations[locale as keyof typeof destinationTranslations];
  if (!localeMap) return destination;
  const overrides = localeMap[destination.id];
  return overrides ? { ...destination, ...overrides } : destination;
}

export function localizeDestinations(
  destinations: Destination[],
  locale: Locale,
): Destination[] {
  return destinations.map((item) => localizeDestination(item, locale));
}
