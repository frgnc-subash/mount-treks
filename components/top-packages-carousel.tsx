"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Tag } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { TrekPackage } from "@/lib/packages-data";

const imageByPackageId: Record<string, string> = {
  "annapurna-circuit": "/abc/8.jpg",
  "annapurna-semi-circuit": "/abc/6.jpg",
  "everest-base-camp": "/ebc/9.jpg",
  "everest-gokyo-cho-la": "/ebc/8.jpg",
  "poon-hill": "/gallery/image7.jpeg",
  "langtang-valley": "/gallery/image8.jpeg",
  "upper-mustang": "/upper-mustang/lomanthang.jpg",
  "lower-dolpo-trek": "/backgrounds/bg9.jpeg",
  "nar-phu-valley-jomsom": "/backgrounds/bg4.jpeg",
  "sacred-valley-ruby-valley": "/backgrounds/bg7.jpeg",
};

const discountById: Record<string, number> = {
  "annapurna-circuit": 8,
  "annapurna-semi-circuit": 9,
  "everest-base-camp": 10,
  "everest-gokyo-cho-la": 12,
  "poon-hill": 8,
  "langtang-valley": 7,
  "upper-mustang": 11,
  "lower-dolpo-trek": 9,
  "nar-phu-valley-jomsom": 10,
  "sacred-valley-ruby-valley": 8,
};

const parsePrice = (value: string) => Number(value.replace(/[^0-9.]/g, "") || 0);
const getLowestPrice = (prices: { label: string; price: string }[]) =>
  prices.reduce((min, tier) => {
    const amount = parsePrice(tier.price);
    return min === 0 || amount < min ? amount : min;
  }, 0);

type TopPackagesCarouselProps = {
  packages: TrekPackage[];
  locale?: "en" | "es" | "zh";
};

export default function TopPackagesCarousel({
  packages,
  locale = "en",
}: TopPackagesCarouselProps) {
  const copy =
    locale === "zh"
      ? {
          prev: "上一组",
          next: "下一组",
          topChoice: "精选",
          featured: "推荐",
          save: "立省",
          original: "起价参考",
          discount: "下单可享优惠",
          duration: "行程",
          altitude: "海拔",
          difficulty: "难度",
          viewPackages: "查看产品",
        }
      : locale === "es"
        ? {
            prev: "Anterior",
            next: "Siguiente",
            topChoice: "Destacado",
            featured: "Recomendado",
            save: "Ahorra",
            original: "Precio inicial",
            discount: "Descuento disponible al reservar",
            duration: "Duración",
            altitude: "Altitud",
            difficulty: "Dificultad",
            viewPackages: "Ver paquetes",
          }
        : {
            prev: "Previous top packages",
            next: "Next top packages",
            topChoice: "Top Choice",
            featured: "Featured",
            save: "Save",
            original: "Original starting price",
            discount: "Discount available at booking",
            duration: "Duration",
            altitude: "Altitude",
            difficulty: "Difficulty",
            viewPackages: "View Packages",
          };
  const packagesHref = locale === "en" ? "/packages" : `/packages?lang=${locale}`;
  const [startIndex, setStartIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);

  useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth < 768) {
        setCardsPerView(1);
        return;
      }
      if (window.innerWidth < 1280) {
        setCardsPerView(2);
        return;
      }
      setCardsPerView(3);
    };

    updateCardsPerView();
    window.addEventListener("resize", updateCardsPerView);
    return () => window.removeEventListener("resize", updateCardsPerView);
  }, []);

  const maxStart = Math.max(0, packages.length - cardsPerView);
  const canPrev = startIndex > 0;
  const canNext = startIndex < maxStart;

  const visiblePackages = useMemo(
    () => packages.slice(startIndex, startIndex + cardsPerView),
    [cardsPerView, packages, startIndex],
  );

  useEffect(() => {
    setStartIndex((prev) => Math.min(prev, maxStart));
  }, [maxStart]);

  return (
    <div>
      <div className="mb-4 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => setStartIndex((prev) => Math.max(0, prev - 1))}
          disabled={!canPrev}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/[0.05] text-white transition enabled:hover:bg-white/[0.12] disabled:cursor-not-allowed disabled:opacity-35"
          aria-label={copy.prev}
        >
          <ChevronLeft className="h-4.5 w-4.5" />
        </button>
        <button
          type="button"
          onClick={() => setStartIndex((prev) => Math.min(maxStart, prev + 1))}
          disabled={!canNext}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/[0.05] text-white transition enabled:hover:bg-white/[0.12] disabled:cursor-not-allowed disabled:opacity-35"
          aria-label={copy.next}
        >
          <ChevronRight className="h-4.5 w-4.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:items-stretch md:gap-6 xl:grid-cols-3">
        {visiblePackages.map((packageData) => {
          const basePrice = getLowestPrice(packageData.pricing);
          const discountPct = discountById[packageData.id] ?? 8;
          const badge =
            packageData.id === "everest-base-camp" ? copy.topChoice : copy.featured;
          const highlighted = packageData.id === "everest-base-camp";

          return (
            <article
              key={packageData.id}
              className={`group flex h-full flex-col overflow-hidden rounded-2xl border bg-white/[0.03] ${
                highlighted ? "border-primary/70" : "border-white/10"
              }`}
            >
              <div className="relative h-48 shrink-0 overflow-hidden">
                <img
                  src={packageData.image || imageByPackageId[packageData.id] || "/backgrounds/bg1.jpeg"}
                  alt={packageData.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                <p
                  className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-[0.08em] uppercase ${
                    highlighted ? "bg-primary/90 text-white" : "bg-black/50 text-zinc-100"
                  }`}
                >
                  {badge}
                </p>
                <p className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-amber-200/70 bg-amber-300 px-2.5 py-1 text-[10px] font-bold tracking-[0.08em] text-zinc-900 uppercase shadow-[0_8px_20px_rgba(0,0,0,0.35)]">
                  <Tag className="h-3 w-3 text-zinc-900" />
                  {copy.save} {discountPct}%
                </p>
              </div>

              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <p className="text-base font-semibold text-white">{packageData.name}</p>
                <p className="mt-3 text-3xl font-black tracking-tight text-white">
                  ${basePrice.toLocaleString()}
                </p>
                <p className="mt-1 text-[11px] font-semibold tracking-[0.08em] text-zinc-400 uppercase">
                  {copy.original}
                </p>
                <p className="mt-1 text-xs font-semibold text-amber-300">
                  {copy.discount}
                </p>

                <div className="mt-5 space-y-2 text-sm text-zinc-300">
                  <p>
                    {copy.duration}: {packageData.duration}
                  </p>
                  <p>
                    {copy.altitude}: {packageData.altitude}
                  </p>
                  <p>
                    {copy.difficulty}: {packageData.difficulty}
                  </p>
                </div>
                <p className="mt-5 h-[92px] overflow-hidden text-sm leading-7 text-zinc-400">
                  {packageData.summary}
                </p>

                <div className="mt-auto pt-5">
                  <Link
                    href={packagesHref}
                    className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
                  >
                    {copy.viewPackages}
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
