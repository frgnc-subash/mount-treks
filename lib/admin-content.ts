import { prisma } from "@/lib/db";

export type PackagePayload = {
  id: string;
  name: string;
  image?: string;
  duration: string;
  altitude: string;
  difficulty: string;
  idealFor: string;
  summary: string;
  pricingLines: string;
  itineraryLines: string;
  includesLines: string;
  excludesLines: string;
};

export type DestinationPayload = {
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
  mapCenterLat: number;
  mapCenterLng: number;
  mapZoom: number;
  trailLines: string;
};

function toSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeParagraphs(value: string) {
  return value
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function parseLines(value: string, options?: { stripListMarkers?: boolean }) {
  return value
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => {
      let normalized = line.trim();

      if (options?.stripListMarkers) {
        normalized = normalized
          .replace(/^[-*•]\s+/, "")
          .replace(/^\d+[.)]\s+/, "")
          .trim();
      }

      return normalized;
    })
    .filter(Boolean);
}

function parseItineraryLines(value: string) {
  const lines = parseLines(value, { stripListMarkers: true });

  if (!lines.length) {
    throw new Error("At least one itinerary line is required.");
  }

  return lines.map((line, index) => {
    const dayMatch = line.match(/^day\s*(\d+)\s*[:\-–]?\s*(.*)$/i);

    if (!dayMatch) {
      return `Day ${index + 1}: ${line}`;
    }

    const dayNumber = Number(dayMatch[1]);
    const detail = dayMatch[2]?.trim();

    if (!detail) {
      throw new Error(`Itinerary line ${index + 1} is missing details after day number.`);
    }

    return `Day ${dayNumber}: ${detail}`;
  });
}

function parsePricingLines(value: string) {
  const lines = parseLines(value, { stripListMarkers: true });

  const pricing = lines.map((line, index) => {
    const [labelRaw, ...priceParts] = line.split("|");
    const label = labelRaw?.trim();
    const price = priceParts.join("|").trim();

    if (!label || !price) {
      throw new Error(
        `Invalid pricing line ${index + 1}: ${line}. Expected format: Label|Price`,
      );
    }

    return { label, price };
  });

  if (!pricing.length) {
    throw new Error("At least one pricing line is required.");
  }

  return pricing;
}

function parseTrailLines(value: string) {
  const lines = parseLines(value);

  const points = lines.map((line, index) => {
    const [nameRaw, latRaw, lngRaw] = line.split("|").map((part) => part?.trim());
    const lat = Number(latRaw);
    const lng = Number(lngRaw);

    if (!nameRaw || Number.isNaN(lat) || Number.isNaN(lng)) {
      throw new Error(
        `Invalid trail line ${index + 1}: ${line}. Expected format: Name|lat|lng`,
      );
    }

    return {
      name: nameRaw,
      pos: [lat, lng] as [number, number],
    };
  });

  if (!points.length) {
    throw new Error("At least one trail point is required.");
  }

  return points;
}

export async function upsertPackage(payload: PackagePayload) {
  const id = toSlug(payload.id);

  if (!id) {
    throw new Error("Valid package id is required.");
  }

  const name = payload.name.trim();
  const duration = payload.duration.trim();
  const altitude = payload.altitude.trim();
  const difficulty = payload.difficulty.trim();
  const idealFor = payload.idealFor.trim();
  const summary = normalizeParagraphs(payload.summary);
  const image = payload.image?.trim() || null;

  if (!name || !duration || !altitude || !difficulty || !idealFor || !summary) {
    throw new Error("All package text fields are required.");
  }

  return prisma.package.upsert({
    where: { id },
    create: {
      id,
      name,
      image,
      duration,
      altitude,
      difficulty,
      idealFor,
      summary,
      pricing: parsePricingLines(payload.pricingLines),
      itinerary: parseItineraryLines(payload.itineraryLines),
      includes: parseLines(payload.includesLines, { stripListMarkers: true }),
      excludes: parseLines(payload.excludesLines, { stripListMarkers: true }),
    },
    update: {
      name,
      image,
      duration,
      altitude,
      difficulty,
      idealFor,
      summary,
      pricing: parsePricingLines(payload.pricingLines),
      itinerary: parseItineraryLines(payload.itineraryLines),
      includes: parseLines(payload.includesLines, { stripListMarkers: true }),
      excludes: parseLines(payload.excludesLines, { stripListMarkers: true }),
    },
  });
}

export async function upsertDestination(payload: DestinationPayload) {
  const id = toSlug(payload.id);

  if (!id) {
    throw new Error("Valid destination id is required.");
  }

  const name = payload.name.trim();
  const image = payload.image.trim();
  const region = payload.region.trim();
  const duration = payload.duration.trim();
  const elevation = payload.elevation.trim();
  const desc = normalizeParagraphs(payload.desc);
  const difficulty = payload.difficulty.trim();
  const bestSeason = payload.bestSeason.trim();
  const permits = payload.permits.trim();

  if (!name || !image || !region || !duration || !elevation || !desc || !difficulty) {
    throw new Error("All destination text fields are required.");
  }

  if (
    Number.isNaN(payload.lat) ||
    Number.isNaN(payload.lng) ||
    Number.isNaN(payload.mapCenterLat) ||
    Number.isNaN(payload.mapCenterLng) ||
    Number.isNaN(payload.mapZoom)
  ) {
    throw new Error("Destination coordinates and map zoom must be valid numbers.");
  }

  return prisma.destination.upsert({
    where: { id },
    create: {
      id,
      name,
      image,
      region,
      duration,
      elevation,
      lat: payload.lat,
      lng: payload.lng,
      desc,
      difficulty,
      bestSeason,
      permits,
      mapCenter: [payload.mapCenterLat, payload.mapCenterLng],
      mapZoom: payload.mapZoom,
      trailCoordinates: parseTrailLines(payload.trailLines),
    },
    update: {
      name,
      image,
      region,
      duration,
      elevation,
      lat: payload.lat,
      lng: payload.lng,
      desc,
      difficulty,
      bestSeason,
      permits,
      mapCenter: [payload.mapCenterLat, payload.mapCenterLng],
      mapZoom: payload.mapZoom,
      trailCoordinates: parseTrailLines(payload.trailLines),
    },
  });
}
