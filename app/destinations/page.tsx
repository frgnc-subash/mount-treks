"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Mountain,
  MapPin,
  Clock3,
  ArrowRight,
  BookOpen,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  Check,
  Heart,
} from "lucide-react";
import DestinationMap from "@/components/destination-map-client";
import SearchField from "@/components/search-field";
import { localizeDestinations, resolveLocale } from "@/lib/i18n";
import { destinations, type Destination } from "@/lib/destinations-data";

type DropdownOption = {
  value: string;
  label: string;
};

function FilterDropdown({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((opt) => opt.value === value);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="h-12 w-full rounded-lg border-0 bg-[#060607] px-3 pr-10 text-left text-sm text-zinc-100 outline-none shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition hover:bg-[#101012] focus-visible:bg-[#101012] focus-visible:shadow-[0_0_0_2px_rgba(255,255,255,0.18)]"
      >
        <span className={selected ? "text-zinc-100" : "text-zinc-500"}>
          {selected?.label || placeholder}
        </span>
        <ChevronDown
          className={`pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 transition ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-[140] overflow-hidden rounded-xl bg-[#0a0a0c] p-1 shadow-[0_16px_34px_rgba(0,0,0,0.55)]">
          <div className="max-h-56 overflow-auto">
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                    isSelected ? "bg-white/[0.12] text-white" : "text-zinc-200 hover:bg-white/[0.06]"
                  }`}
                >
                  <span>{opt.label}</span>
                  {isSelected && <Check className="h-4 w-4" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function DestinationsPage({
  embeddedInDashboard = false,
}: {
  embeddedInDashboard?: boolean;
}) {
  const searchParams = useSearchParams();
  const locale = resolveLocale(searchParams.get("lang"));
  const withLang = (path: string) => {
    if (locale === "en") return path;
    const separator = path.includes("?") ? "&" : "?";
    return `${path}${separator}lang=${locale}`;
  };
  const sortByLocale = (items: Destination[]) => {
    const sortLocale = locale === "zh" ? "zh" : locale === "es" ? "es" : "en";
    return [...items].sort((a, b) => a.name.localeCompare(b.name, sortLocale));
  };
  const [destinationsData, setDestinationsData] = useState<Destination[]>(() =>
    sortByLocale(localizeDestinations(destinations, locale)),
  );
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [season, setSeason] = useState("all");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const guideHref = withLang("/guide");

  const copy =
    locale === "zh"
      ? {
          refine: "筛选目的地",
          guide: "指南",
          favorites: "收藏",
          clear: "清除",
          search: "搜索",
          searchPlaceholder: "搜索目的地或区域（如：珠峰、安娜普尔纳、马南）",
          difficulty: "难度",
          season: "季节",
          allDifficulties: "全部难度",
          moderate: "中等",
          challenging: "困难",
          allSeasons: "全部季节",
          spring: "春季（3-5月）",
          autumn: "秋季（10-11月）",
          lateMonsoon: "后季风/秋季（9-11月）",
          maxElevation: "最高海拔",
          viewInfo: "查看详情",
        }
      : locale === "es"
        ? {
            refine: "Filtrar destinos",
            guide: "Guía",
            favorites: "Favoritos",
            clear: "Limpiar",
            search: "Buscar",
            searchPlaceholder: "Busca destino o región (ej. Everest, Annapurna, Manang)",
            difficulty: "Dificultad",
            season: "Temporada",
            allDifficulties: "Todas las dificultades",
            moderate: "Moderado",
            challenging: "Difícil",
            allSeasons: "Todas las temporadas",
            spring: "Primavera (mar-may)",
            autumn: "Otoño (oct-nov)",
            lateMonsoon: "Posmonzón / Otoño (sep-nov)",
            maxElevation: "Altitud máxima",
            viewInfo: "Ver info",
          }
        : {
            refine: "Refine Destinations",
            guide: "Guide",
            favorites: "Favorites",
            clear: "Clear",
            search: "Search",
            searchPlaceholder: "Search destination or region (e.g., Everest, Annapurna, Manang)",
            difficulty: "Difficulty",
            season: "Season",
            allDifficulties: "All Difficulties",
            moderate: "Moderate",
            challenging: "Challenging",
            allSeasons: "All Seasons",
            spring: "Spring (Mar-May)",
            autumn: "Autumn (Oct-Nov)",
            lateMonsoon: "Late Monsoon / Autumn (Sep-Nov)",
            maxElevation: "Max elevation",
            viewInfo: "View Info",
          };

  useEffect(() => {
    try {
      const stored = localStorage.getItem("altigo-favorite-destinations");
      if (!stored) return;
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        setFavorites(parsed.filter((item) => typeof item === "string"));
      }
    } catch {
      // Ignore malformed storage values.
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("altigo-favorite-destinations", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    setDestinationsData(sortByLocale(localizeDestinations(destinations, locale)));
  }, [locale]);

  useEffect(() => {
    let canceled = false;

    const loadDestinations = async () => {
      try {
        const response = await fetch(`/api/public/destinations?lang=${locale}`, {
          cache: "no-store",
        });
        if (!response.ok) return;
        const payload = (await response.json()) as { destinations: Destination[] };
        if (!canceled && Array.isArray(payload.destinations)) {
          setDestinationsData(payload.destinations);
        }
      } catch {
        // Keep static fallback on request failures.
      }
    };

    loadDestinations();

    return () => {
      canceled = true;
    };
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const normalizedDifficulty = (value: string) => {
    const lower = value.toLowerCase();
    if (/challenging|偏难|困难|dif[ií]cil/.test(value) || lower.includes("challenging")) {
      return "challenging";
    }
    if (/moderate|中等|轻松|easy|moderado/.test(value) || lower.includes("moderate")) {
      return "moderate";
    }
    return "moderate";
  };

  const filteredDestinations = useMemo(() => {
    return destinationsData.filter((item) => {
      const matchesQuery =
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.region.toLowerCase().includes(query.toLowerCase());
      const matchesDifficulty =
        difficulty === "all" || normalizedDifficulty(item.difficulty) === difficulty;
      const matchesSeason =
        season === "all" ||
        item.bestSeason.toLowerCase().includes(season.toLowerCase());
      const matchesFavorites = !favoritesOnly || favorites.includes(item.id);

      return matchesQuery && matchesDifficulty && matchesSeason && matchesFavorites;
    });
  }, [query, difficulty, season, favoritesOnly, favorites, destinationsData]);
  const hasActiveFilters =
    Boolean(query.trim()) || difficulty !== "all" || season !== "all" || favoritesOnly;

  const resetFilters = () => {
    setQuery("");
    setDifficulty("all");
    setSeason("all");
    setFavoritesOnly(false);
  };

  return (
    <main className={embeddedInDashboard ? "overflow-x-hidden text-foreground" : "overflow-x-hidden bg-background text-foreground"}>
      <section
        className={
          embeddedInDashboard
            ? "mx-auto w-full max-w-6xl overflow-x-hidden px-0 pb-4 pt-0"
            : "mx-auto w-full max-w-7xl overflow-x-hidden px-5 pb-16 pt-0 sm:px-8"
        }
      >
        {embeddedInDashboard ? (
          <div className="overflow-hidden rounded-2xl border border-border bg-card/35 shadow-[0_14px_34px_rgba(0,0,0,0.25)]">
            <DestinationMap
              locations={hasActiveFilters ? filteredDestinations : destinationsData}
              className="h-[52vh] min-h-[360px] w-full rounded-none border-0 shadow-none"
            />
          </div>
        ) : (
          <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden">
            <DestinationMap
              locations={hasActiveFilters ? filteredDestinations : destinationsData}
              className="h-[68vh] min-h-[440px] w-full rounded-none border-0 shadow-none"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background via-background/70 to-transparent blur-md" />
          </div>
        )}

        <div className="relative z-[120] mt-7 rounded-2xl bg-card/45 p-4 shadow-[0_12px_28px_rgba(0,0,0,0.28)] backdrop-blur-sm sm:p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
              <SlidersHorizontal size={16} className="text-primary" />
              {copy.refine}
            </div>
            <div className="w-full sm:w-auto">
              <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:justify-end sm:gap-3">
                <Link
                  href={guideHref}
                  className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-md px-3 text-xs font-medium text-muted-foreground ring-1 ring-white/12 transition hover:text-foreground sm:h-8 sm:w-auto"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  {copy.guide}
                </Link>
                <button
                  type="button"
                  onClick={() => setFavoritesOnly((prev) => !prev)}
                  className={`inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-md px-3 text-xs font-medium transition sm:h-8 sm:w-auto ${
                    favoritesOnly
                      ? "bg-white/[0.12] text-white"
                      : "text-muted-foreground ring-1 ring-white/12 hover:text-foreground"
                  }`}
                >
                  <Heart className={`h-3.5 w-3.5 ${favoritesOnly ? "fill-white" : ""}`} />
                  {copy.favorites} {favorites.length ? `(${favorites.length})` : ""}
                </button>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="col-span-2 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-md px-3 text-xs font-medium text-muted-foreground ring-1 ring-white/12 hover:text-foreground sm:col-span-1 sm:h-8 sm:w-auto"
                >
                  <RotateCcw size={12} />
                  {copy.clear}
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-3 lg:grid-cols-[1.8fr_1fr_1fr]">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                {copy.search}
              </span>
              <SearchField
                value={query}
                onChange={setQuery}
                placeholder={copy.searchPlaceholder}
                ariaLabel="Search destinations"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                {copy.difficulty}
              </span>
              <FilterDropdown
                value={difficulty}
                onChange={setDifficulty}
                placeholder={copy.allDifficulties}
                options={[
                  { value: "all", label: copy.allDifficulties },
                  { value: "moderate", label: copy.moderate },
                  { value: "challenging", label: copy.challenging },
                ]}
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                {copy.season}
              </span>
              <FilterDropdown
                value={season}
                onChange={setSeason}
                placeholder={copy.allSeasons}
                options={[
                  { value: "all", label: copy.allSeasons },
                  { value: "mar", label: copy.spring },
                  { value: "oct", label: copy.autumn },
                  { value: "sep", label: copy.lateMonsoon },
                ]}
              />
            </label>
          </div>
        </div>

        <div className="mt-8 space-y-5">
          {filteredDestinations.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-2xl bg-card/35 shadow-[0_14px_34px_rgba(0,0,0,0.25)]"
            >
              <div className="grid md:grid-cols-[1.2fr_1fr]">
                <div className="relative h-44 md:col-start-2 md:row-start-1 md:h-[250px]">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <p className="absolute bottom-3 left-3 text-sm font-semibold text-white">
                    {item.name}
                  </p>
                </div>

                <div className="flex h-full flex-col p-4 sm:p-5 md:col-start-1 md:row-start-1">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="text-xl font-semibold leading-tight">{item.name}</h2>
                      <span className="mt-1 inline-flex max-w-full items-center rounded-md bg-primary/12 px-2 py-1 text-[10px] leading-tight font-medium text-primary sm:whitespace-nowrap">
                        {item.difficulty}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleFavorite(item.id)}
                      aria-label={favorites.includes(item.id) ? "Remove favorite" : "Add favorite"}
                      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition ${
                        favorites.includes(item.id)
                          ? "bg-white/[0.12] text-white"
                          : "bg-white/[0.05] text-zinc-400 hover:bg-white/[0.1] hover:text-zinc-200"
                      }`}
                    >
                      <Heart
                        className={`h-4 w-4 ${favorites.includes(item.id) ? "fill-white" : ""}`}
                      />
                    </button>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.desc}
                  </p>

                  <div className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      {item.region}
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock3 className="h-4 w-4 text-primary" />
                      {item.duration}
                    </p>
                    <p className="flex items-center gap-2 sm:col-span-2">
                      <Mountain className="h-4 w-4 text-primary" />
                      {copy.maxElevation}: {item.elevation}
                    </p>
                  </div>

                  <div className="pt-4">
                    <Link
                      href={withLang(`/destinations/${item.id}`)}
                      className="inline-flex h-10 items-center justify-center gap-1 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                      {copy.viewInfo}
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredDestinations.length === 0 && (
          <div className="mt-6 rounded-xl bg-card/35 p-5 text-sm text-muted-foreground shadow-[0_12px_30px_rgba(0,0,0,0.2)]">
            No destinations matched your filters. Try adjusting search, season, or difficulty.
          </div>
        )}
      </section>
    </main>
  );
}
