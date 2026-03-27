import { prisma } from "@/lib/db";
import {
  destinations as staticDestinations,
  destinationsById,
  type Destination,
  type TrailPoint,
} from "@/lib/destinations-data";
import {
  localizeDestination,
  localizeDestinations,
  localizePackage,
  localizePackages,
  resolveLocale,
  type Locale,
} from "@/lib/i18n";
import {
  trekPackages as staticPackages,
  trekPackagesById,
  type TrekPackage,
} from "@/lib/packages-data";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function toPricing(value: unknown): { label: string; price: string }[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item): item is Record<string, unknown> => isObject(item))
    .map((item) => ({
      label: typeof item.label === "string" ? item.label : "",
      price: typeof item.price === "string" ? item.price : "",
    }))
    .filter((item) => item.label && item.price);
}

function toLatLngPair(value: unknown): [number, number] | null {
  if (!Array.isArray(value) || value.length !== 2) return null;
  const lat = value[0];
  const lng = value[1];
  if (typeof lat !== "number" || typeof lng !== "number") return null;
  return [lat, lng];
}

function toTrailPoints(value: unknown): TrailPoint[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item): item is Record<string, unknown> => isObject(item))
    .map((item) => {
      const name = typeof item.name === "string" ? item.name : "";
      const pos = toLatLngPair(item.pos);
      return name && pos ? { name, pos } : null;
    })
    .filter((item): item is TrailPoint => item !== null);
}

function mapDbPackageToPackage(
  record: {
    id: string;
    name: string;
    image: string | null;
    duration: string;
    altitude: string;
    difficulty: string;
    idealFor: string;
    summary: string;
    pricing: unknown;
    itinerary: unknown;
    includes: unknown;
    excludes: unknown;
  },
  fallback?: TrekPackage,
): TrekPackage {
  return {
    id: record.id,
    name: record.name,
    image: record.image ?? fallback?.image,
    duration: record.duration,
    altitude: record.altitude,
    difficulty: record.difficulty,
    idealFor: record.idealFor,
    summary: record.summary,
    pricing: toPricing(record.pricing).length
      ? toPricing(record.pricing)
      : (fallback?.pricing ?? []),
    itinerary: toStringArray(record.itinerary).length
      ? toStringArray(record.itinerary)
      : (fallback?.itinerary ?? []),
    includes: toStringArray(record.includes).length
      ? toStringArray(record.includes)
      : (fallback?.includes ?? []),
    excludes: toStringArray(record.excludes).length
      ? toStringArray(record.excludes)
      : (fallback?.excludes ?? []),
  };
}

function mapDbDestinationToDestination(
  record: {
    id: string;
    name: string;
    image: string;
    region: string;
    duration: string;
    elevation: string;
    lat: number;
    lng: number;
    desc: string;
    difficulty: string;
    bestSeason: string;
    permits: string;
    mapCenter: unknown;
    mapZoom: number;
    trailCoordinates: unknown;
  },
  fallback?: Destination,
): Destination {
  return {
    id: record.id,
    name: record.name,
    image: record.image,
    region: record.region,
    duration: record.duration,
    elevation: record.elevation,
    lat: record.lat,
    lng: record.lng,
    desc: record.desc,
    difficulty: record.difficulty,
    bestSeason: record.bestSeason,
    permits: record.permits,
    mapCenter: toLatLngPair(record.mapCenter) ?? fallback?.mapCenter ?? [record.lat, record.lng],
    mapZoom: Number.isInteger(record.mapZoom) ? record.mapZoom : (fallback?.mapZoom ?? 9),
    trailCoordinates: toTrailPoints(record.trailCoordinates).length
      ? toTrailPoints(record.trailCoordinates)
      : (fallback?.trailCoordinates ?? []),
  };
}

export async function getAllPackages(locale?: Locale | string | null): Promise<TrekPackage[]> {
  const resolvedLocale = resolveLocale(locale ?? undefined);
  const sortLocale = resolvedLocale === "zh" ? "zh" : resolvedLocale === "es" ? "es" : "en";
  try {
    const records = await prisma.package.findMany({
      orderBy: { name: "asc" },
    });

    if (records.length === 0) {
      return localizePackages(staticPackages, resolvedLocale).sort((a, b) =>
        a.name.localeCompare(b.name, sortLocale),
      );
    }

    const merged = new Map(staticPackages.map((item) => [item.id, item]));

    for (const record of records) {
      merged.set(record.id, mapDbPackageToPackage(record, trekPackagesById[record.id]));
    }

    return localizePackages([...merged.values()], resolvedLocale).sort((a, b) =>
      a.name.localeCompare(b.name, sortLocale),
    );
  } catch {
    return localizePackages(staticPackages, resolvedLocale).sort((a, b) =>
      a.name.localeCompare(b.name, sortLocale),
    );
  }
}

export async function getPackageById(
  id: string,
  locale?: Locale | string | null,
): Promise<TrekPackage | null> {
  const resolvedLocale = resolveLocale(locale ?? undefined);
  try {
    const record = await prisma.package.findUnique({
      where: { id },
    });

    if (record) {
      return localizePackage(mapDbPackageToPackage(record, trekPackagesById[id]), resolvedLocale);
    }

    return trekPackagesById[id]
      ? localizePackage(trekPackagesById[id], resolvedLocale)
      : null;
  } catch {
    return trekPackagesById[id]
      ? localizePackage(trekPackagesById[id], resolvedLocale)
      : null;
  }
}

export async function getAllDestinations(
  locale?: Locale | string | null,
): Promise<Destination[]> {
  const resolvedLocale = resolveLocale(locale ?? undefined);
  const sortLocale = resolvedLocale === "zh" ? "zh" : resolvedLocale === "es" ? "es" : "en";
  try {
    const records = await prisma.destination.findMany({
      orderBy: { name: "asc" },
    });

    if (records.length === 0) {
      return localizeDestinations(staticDestinations, resolvedLocale).sort((a, b) =>
        a.name.localeCompare(b.name, sortLocale),
      );
    }

    const merged = new Map(staticDestinations.map((item) => [item.id, item]));

    for (const record of records) {
      merged.set(record.id, mapDbDestinationToDestination(record, destinationsById[record.id]));
    }

    return localizeDestinations([...merged.values()], resolvedLocale).sort((a, b) =>
      a.name.localeCompare(b.name, sortLocale),
    );
  } catch {
    return localizeDestinations(staticDestinations, resolvedLocale).sort((a, b) =>
      a.name.localeCompare(b.name, sortLocale),
    );
  }
}

export async function getDestinationById(
  id: string,
  locale?: Locale | string | null,
): Promise<Destination | null> {
  const resolvedLocale = resolveLocale(locale ?? undefined);
  try {
    const record = await prisma.destination.findUnique({
      where: { id },
    });

    if (record) {
      return localizeDestination(
        mapDbDestinationToDestination(record, destinationsById[id]),
        resolvedLocale,
      );
    }

    return destinationsById[id]
      ? localizeDestination(destinationsById[id], resolvedLocale)
      : null;
  } catch {
    return destinationsById[id]
      ? localizeDestination(destinationsById[id], resolvedLocale)
      : null;
  }
}
