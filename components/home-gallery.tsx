"use client";

import { useEffect, useState } from "react";
import { Camera, ChevronLeft, ChevronRight, X } from "lucide-react";

const items = [
  "/gallery/image2.jpeg",
  "/gallery/image3.jpeg",
  "/gallery/image4.jpeg",
  "/gallery/image5.jpeg",
  "/gallery/image6.jpeg",
  "/gallery/image7.jpeg",
  "/gallery/image8.jpeg",
  "/gallery/image9.jpeg",
  "/gallery/image13.jpeg",
  "/gallery/image11.jpeg",
];

export default function HomeGallery({
  locale = "en",
}: {
  locale?: "en" | "es" | "zh";
}) {
  const copy =
    locale === "zh"
      ? {
          gallery: "相册",
          title: "徒步故事",
          desc: "快速浏览山景、线路与徒步生活瞬间。",
          trailLabel: "喜马拉雅徒步",
          showMore: "查看更多",
          showLess: "收起",
          openImage: (idx: number) => `打开徒步相册图片 ${idx + 1}`,
          close: "关闭相册",
          prev: "上一张",
          next: "下一张",
        }
      : locale === "es"
        ? {
            gallery: "Galería",
            title: "Historias del sendero",
            desc: "Una mirada rápida a paisajes, rutas y momentos de expedición.",
            trailLabel: "Ruta Himalaya",
            showMore: "Ver más",
            showLess: "Ver menos",
            openImage: (idx: number) => `Abrir imagen ${idx + 1} de la galería`,
            close: "Cerrar galería",
            prev: "Imagen anterior",
            next: "Imagen siguiente",
          }
        : {
            gallery: "Gallery",
            title: "Trail Stories",
            desc: "A quick glimpse of mountain views, trail life, and expedition moments.",
            trailLabel: "Himalayan Trail",
            showMore: "Show More",
            showLess: "Show Less",
            openImage: (idx: number) => `Open trek gallery image ${idx + 1}`,
            close: "Close gallery",
            prev: "Previous image",
            next: "Next image",
          };
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);
  const visibleItems = expanded ? items : items.slice(0, 6);

  useEffect(() => {
    if (activeIndex === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveIndex(null);
      if (e.key === "ArrowRight") {
        setActiveIndex((prev) => (prev === null ? 0 : (prev + 1) % items.length));
      }
      if (e.key === "ArrowLeft") {
        setActiveIndex((prev) =>
          prev === null ? 0 : (prev - 1 + items.length) % items.length,
        );
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex]);

  return (
    <section className="w-full">
      <div className="relative isolate mb-8 text-center md:mb-10">
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 w-full -translate-x-1/2 -translate-y-1/2 text-center text-5xl font-black tracking-[0.16em] text-white/5 uppercase sm:text-7xl md:text-8xl lg:text-9xl"
        >
          {copy.gallery}
        </span>
        <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
          {copy.gallery}
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
          {copy.title}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-xs leading-relaxed text-zinc-300 sm:text-base">
          {copy.desc}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3">
        {visibleItems.map((src, idx) => (
          <button
            key={src}
            type="button"
            onClick={() => setActiveIndex(items.indexOf(src))}
            className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 text-left sm:aspect-[4/5] sm:rounded-2xl"
            aria-label={copy.openImage(idx)}
          >
            <img
              src={src}
              alt={`Trek gallery ${idx + 1}`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/45 px-2.5 py-1 text-[10px] text-zinc-200 sm:bottom-3 sm:left-3 sm:gap-2 sm:px-3 sm:text-[11px]">
              <Camera className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              {copy.trailLabel}
            </div>
          </button>
        ))}
      </div>

      {items.length > 6 && (
        <div className="mt-5 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex h-10 items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 text-xs font-semibold tracking-[0.12em] text-zinc-200 uppercase transition hover:bg-white/10"
          >
            {expanded ? copy.showLess : copy.showMore}
          </button>
        </div>
      )}

      {activeIndex !== null && (
        <div
          className="fixed inset-0 z-[2500] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setActiveIndex(null)}
        >
          <button
            type="button"
            onClick={() => setActiveIndex(null)}
            className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white hover:bg-black/70"
            aria-label={copy.close}
          >
            <X size={18} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveIndex((prev) => (prev === null ? 0 : (prev - 1 + items.length) % items.length));
            }}
            className="absolute left-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white hover:bg-black/70"
            aria-label={copy.prev}
          >
            <ChevronLeft size={18} />
          </button>

          <img
            src={items[activeIndex]}
            alt={`Trek gallery ${activeIndex + 1}`}
            className="max-h-[88vh] max-w-[94vw] rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveIndex((prev) => (prev === null ? 0 : (prev + 1) % items.length));
            }}
            className="absolute right-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white hover:bg-black/70"
            aria-label={copy.next}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </section>
  );
}
