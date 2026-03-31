"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Mountain,
  Clock3,
  Users,
  ArrowRight,
  CheckCircle2,
  XCircle,
  PlaneTakeoff,
  BedDouble,
  Footprints,
  BadgeDollarSign,
} from "lucide-react";
import type { TrekPackage } from "@/lib/packages-data";

interface PackageDetailsProps {
  item: TrekPackage;
  locale?: string;
}

const SECTION_IDS = ["overview", "itinerary", "costs"] as const;

const imagePool = [
  "/backgrounds/bg2.jpeg",
  "/backgrounds/bg4.jpeg",
  "/backgrounds/bg6.jpeg",
  "/gallery/image3.jpeg",
  "/gallery/image6.jpeg",
];

const itineraryImageByPackage: Record<string, string[]> = {
  "langtang-valley": [
    "/gallery/image8.jpeg",
    "/gallery/image6.jpeg",
    "/gallery/image5.jpeg",
    "/gallery/image4.jpeg",
    "/gallery/image3.jpeg",
    "/gallery/image9.jpeg",
    "/backgrounds/bg5.jpeg",
    "/backgrounds/bg2.jpeg",
  ],
  "annapurna-circuit": [
    "/abc/1.jpg",
    "/abc/2.jpg",
    "/abc/3.jpg",
    "/abc/4.jpg",
    "/abc/5.jpg",
    "/abc/6.jpg",
    "/abc/7.jpg",
    "/abc/8.jpg",
    "/abc/9.jpg",
    "/abc/10.jpg",
  ],
  "annapurna-semi-circuit": [
    "/abc/1.jpg",
    "/abc/3.jpg",
    "/abc/4.jpg",
    "/abc/5.jpg",
    "/abc/6.jpg",
    "/abc/7.jpg",
    "/abc/8.jpg",
    "/abc/9.jpg",
  ],
  "everest-gokyo-cho-la": [
    "/ebc/1.jpg",
    "/ebc/2.jpg",
    "/ebc/3.jpg",
    "/ebc/4.jpg",
    "/ebc/5.jpg",
    "/ebc/6.jpg",
    "/ebc/7.jpg",
    "/ebc/8.jpg",
    "/ebc/9.jpg",
  ],
  "lower-dolpo-trek": [
    "/backgrounds/bg2.jpeg",
    "/backgrounds/bg3.jpeg",
    "/backgrounds/bg5.jpeg",
    "/backgrounds/bg7.jpeg",
    "/backgrounds/bg8.jpeg",
    "/backgrounds/bg9.jpeg",
    "/gallery/image3.jpeg",
    "/gallery/image6.jpeg",
    "/gallery/image9.jpeg",
    "/gallery/image11.jpeg",
  ],
  "nar-phu-valley-jomsom": [
    "/backgrounds/bg2.jpeg",
    "/backgrounds/bg3.jpeg",
    "/backgrounds/bg4.jpeg",
    "/backgrounds/bg5.jpeg",
    "/backgrounds/bg6.jpeg",
    "/backgrounds/bg7.jpeg",
    "/backgrounds/bg8.jpeg",
    "/backgrounds/bg9.jpeg",
    "/gallery/image2.jpeg",
    "/gallery/image4.jpeg",
  ],
  "sacred-valley-ruby-valley": [
    "/backgrounds/bg2.jpeg",
    "/backgrounds/bg4.jpeg",
    "/backgrounds/bg5.jpeg",
    "/backgrounds/bg7.jpeg",
    "/backgrounds/bg8.jpeg",
    "/gallery/image2.jpeg",
    "/gallery/image3.jpeg",
    "/gallery/image4.jpeg",
    "/gallery/image6.jpeg",
    "/gallery/image9.jpeg",
  ],
  "everest-base-camp": [
    "/ebc/1.jpg",
    "/ebc/2.jpg",
    "/ebc/3.jpg",
    "/ebc/4.jpg",
    "/ebc/5.jpg",
    "/ebc/6.jpg",
    "/ebc/7.jpg",
    "/ebc/8.jpg",
    "/ebc/9.jpg",
  ],
  "upper-mustang": [
    "/upper-mustang/ktm-pokhara.jpg",
    "/upper-mustang/jomsom.jpg",
    "/upper-mustang/kagbeni.jpg",
    "/upper-mustang/chele.png",
    "/upper-mustang/ghami.jpg",
    "/upper-mustang/tsarang.jpg",
    "/upper-mustang/lomanthang.jpg",
    "/upper-mustang/geling.jpg",
    "/upper-mustang/chuksang.jpg",
  ],
};

const packageHeroImage: Record<string, string> = {
  "langtang-valley": "/gallery/image8.jpeg",
  "annapurna-circuit": "/abc/8.jpg",
  "annapurna-semi-circuit": "/abc/6.jpg",
  "everest-gokyo-cho-la": "/ebc/8.jpg",
  "lower-dolpo-trek": "/backgrounds/bg9.jpeg",
  "nar-phu-valley-jomsom": "/backgrounds/bg4.jpeg",
  "sacred-valley-ruby-valley": "/backgrounds/bg7.jpeg",
  "everest-base-camp": "/ebc/9.jpg",
  "poon-hill": "/gallery/image7.jpeg",
  "upper-mustang": "/upper-mustang/lomanthang.jpg",
};

const packageFeatureImage: Record<string, string> = {
  "everest-base-camp": "/ebc/6.jpg",
  "upper-mustang": "/upper-mustang/kagbeni.jpg",
};

function inferItineraryMeta(text: string) {
  const lower = text.toLowerCase();
  const isChinese = /[\u4e00-\u9fff]/.test(text);

  const hasFlight =
    /fly|flight/i.test(lower) || /航班|飞行|乘机|飞往/.test(text);
  const hasDrive =
    /drive|jeep|bus|transfer|return/i.test(lower) ||
    /车程|乘车|巴士|大巴|越野车|包车|转车|公路|行车|返回/.test(text);
  const hasAcclimatization =
    /acclimatization|rest|recovery/i.test(lower) ||
    /适应|休整|休息|调整|适应日/.test(text);
  const hasHighSection =
    /pass|base camp|summit/i.test(lower) ||
    /垭口|大本营|峰顶|观景台|观景点|日出/.test(text);
  const hasDescend =
    /descend|down/i.test(lower) || /下撤|下降|下山|下行|回撤/.test(text);

  if (hasFlight) {
    return isChinese
      ? {
          hours: "交通 2-4 小时",
          terrain: "航班 + 转场",
          focus: "天气窗口与衔接",
          detail:
            "当日以交通衔接为主，请预留机场与行李时间，保持轻装状态为徒步热身。",
        }
      : {
          hours: "2-4 hrs travel",
          terrain: "Flight + transfer day",
          focus: "Weather window and logistics",
          detail:
            "Expect a shorter active day focused on transport coordination, check-ins, and light movement to stay fresh for the trail ahead.",
        };
  }

  if (hasDrive) {
    return isChinese
      ? {
          hours: "交通 5-8 小时",
          terrain: "公路转场",
          focus: "节奏与休整",
          detail:
            "行车时间较长，途中会安排休息与餐点，注意补水与保暖以减少疲劳。",
        }
      : {
          hours: "5-8 hrs travel",
          terrain: "Road transfer segment",
          focus: "Transit comfort and pacing",
          detail:
            "This segment prioritizes efficient route movement with planned breaks for hydration, meals, and reducing travel fatigue before the next trekking block.",
        };
  }

  if (hasAcclimatization) {
    return isChinese
      ? {
          hours: "活动 2-4 小时",
          terrain: "适应日",
          focus: "高海拔适应",
          detail:
            "以轻装上坡、回落休息为原则，帮助身体适应稀薄空气并降低高反风险。",
        }
      : {
          hours: "2-4 hrs active",
          terrain: "Acclimatization day",
          focus: "Altitude adaptation",
          detail:
            "A lighter schedule with controlled elevation gain and return descent to support oxygen adaptation and lower altitude-related risk.",
        };
  }

  if (hasHighSection) {
    return isChinese
      ? {
          hours: "徒步 6-8 小时",
          terrain: "高海拔路段",
          focus: "早出发与稳步节奏",
          detail:
            "这是较具挑战的一天，需按向导节奏稳步推进并关注天气变化。",
        }
      : {
          hours: "6-8 hrs trek",
          terrain: "High alpine section",
          focus: "Early start and steady pace",
          detail:
            "This is one of the more demanding days; your guide will manage a conservative pace, frequent checks, and weather-aware timing on exposed terrain.",
        };
  }

  if (hasDescend) {
    return isChinese
      ? {
          hours: "徒步 5-7 小时",
          terrain: "下撤路段",
          focus: "缓解关节压力",
          detail:
            "整体海拔降低，步伐可稍缓，注意膝盖保护与补给。",
        }
      : {
          hours: "5-7 hrs trek",
          terrain: "Descending trail day",
          focus: "Knee-friendly downhill rhythm",
          detail:
            "The route trends lower in elevation with a smoother pace, helping recovery while maintaining steady progress through villages and valley trails.",
        };
  }

  return isChinese
    ? {
        hours: "徒步 5-7 小时",
        terrain: "山地综合路段",
        focus: "景观与村落体验",
        detail:
          "均衡的行程强度与观景停靠，向导根据队伍状态调整节奏。",
      }
    : {
        hours: "5-7 hrs trek",
        terrain: "Mixed mountain trail",
        focus: "Scenic route progression",
        detail:
          "A balanced trekking day combining elevation gain, scenic viewpoints, and cultural stops, with guide-led pacing adjusted to the group.",
      };
}

function parseItineraryText(text: string) {
  const withoutDay = text
    .replace(/^Day\s*\d+\s*:\s*/i, "")
    .replace(/^第\s*\d+\s*天[:：]?\s*/i, "")
    .trim();
  const parts = withoutDay.split(/\s[-–—]\s/);
  const route = (parts.shift() || withoutDay).trim();
  const detail = parts.join(" - ").trim();

  return {
    title: route || "Route segment",
    desc:
      detail ||
      "Guided trekking day with balanced pace, planned hydration breaks, and acclimatization-aware progression.",
  };
}

function inferItineraryHighlights(route: string, detail: string) {
  const source = `${route} ${detail}`;
  const isChinese = /[\u4e00-\u9fff]/.test(source);
  const highlights: string[] = [];

  const durationMatch = source.match(
    /(\d+\s*-\s*\d+\s*(?:hour|hours|hrs|小时)|\d+\s*(?:hour|hours|hrs|小时))/i,
  );
  if (durationMatch) {
    const duration = durationMatch[1].replace(/\s+/g, " ").trim();
    highlights.push(isChinese ? `预计时长：${duration}` : `Estimated duration: ${duration}`);
  }

  const altitudeMatches = [
    ...source.matchAll(/(\d{1,2}(?:,\d{3})?|\d{3,4})\s*(?:m|米)/g),
  ].map((match) => Number(match[1].replace(/,/g, "")));
  if (altitudeMatches.length) {
    const maxAltitude = Math.max(...altitudeMatches);
    highlights.push(
      isChinese
        ? `当日最高点：${maxAltitude.toLocaleString()}m`
        : `Highest point of the day: ${maxAltitude.toLocaleString()}m`,
    );
  }

  if (/fly|flight|航班|飞行|乘机|飞往/i.test(source)) {
    highlights.push(
      isChinese
        ? "航班受天气影响，请将证件与必需品随身携带。"
        : "Weather windows can affect departures; keep key documents and essentials accessible.",
    );
  } else if (/drive|jeep|bus|transfer|车程|乘车|巴士|大巴|越野车|包车|转车|公路|行车/i.test(source)) {
    highlights.push(
      isChinese
        ? "路况随季节变化，请备好保暖与饮水。"
        : "Road conditions vary by season; keep water and warm layers in your daypack.",
    );
  } else if (/pass|base camp|summit|垭口|大本营|峰顶|观景台|观景点|日出/i.test(source)) {
    highlights.push(
      isChinese
        ? "建议早出发，稳定节奏，注意高海拔反应。"
        : "Start early for safer crossing conditions and maintain a conservative high-altitude pace.",
    );
  } else if (/acclimatization|rest|适应|休整|休息|调整|适应日/i.test(source)) {
    highlights.push(
      isChinese
        ? "适应日以轻装上坡、回落休息为主。"
        : "Use this day for active recovery, hydration, and controlled altitude adaptation.",
    );
  } else {
    highlights.push(
      isChinese
        ? "向导带队稳步前进，保持补水与节奏。"
        : "A steady guided pace with regular hydration and acclimatization checks.",
    );
  }

  if (/(monastery|寺|寺院|修道院)/i.test(source) && highlights.length < 3) {
    highlights.push(
      isChinese
        ? "可安排寺院或文化停留点。"
        : "Opportunity for a cultural stop at monastery sites along the route.",
    );
  } else if (/(lake|湖)/i.test(source) && highlights.length < 3) {
    highlights.push(
      isChinese
        ? "沿途可见湖景或水域视野。"
        : "Expect scenic lake viewpoints during this segment.",
    );
  }

  return highlights.slice(0, 3);
}

export default function PackageDetails({ item, locale }: PackageDetailsProps) {
  const resolvedLocale = locale === "zh" ? "zh" : locale === "es" ? "es" : "en";
  const copy =
    resolvedLocale === "zh"
      ? {
          badge: "行程详情",
          tabs: {
            overview: "概览",
            itinerary: "行程",
            costs: "费用",
          },
          experience: "行程亮点",
          experienceNote:
            "此行程兼顾风景、适应与舒适度，保持专业向导带队与合理节奏。",
          logisticsTitle: "高效后勤",
          logisticsDesc: "交通与许可衔接清晰，减少疲劳并提升徒步效率。",
          staysTitle: "舒适住宿",
          staysDesc: "精选茶馆与旅舍，保证更好的休息与恢复。",
          dailyItinerary: "每日行程",
          investment: "费用",
          priceByGroup: "按人数定价",
          included: "包含",
          excluded: "不含",
          discountedFrom: "原价",
          startingFrom: "起价",
          finalCost: "最终费用取决于人数与服务选择。",
          bookNow: "立即预订",
          whatsapp: "WhatsApp 咨询",
          needCustomization: "需要定制？",
          customizeDesc: "我们可根据体能、时间与舒适度需求定制行程。",
          contactSpecialist: "联系顾问 →",
          dayLabel: (day: number) => `第${day < 10 ? `0${day}` : day}天`,
          keyDetails: "要点",
        }
      : resolvedLocale === "es"
        ? {
            badge: "Detalles del paquete",
            tabs: {
              overview: "Resumen",
              itinerary: "Itinerario",
              costs: "Costos",
            },
            experience: "La experiencia",
            experienceNote:
              "Itinerario equilibrado entre paisaje, adaptación y comodidad con guía profesional.",
            logisticsTitle: "Logística eficiente",
            logisticsDesc: "Traslados y permisos coordinados para reducir fatiga y optimizar la ruta.",
            staysTitle: "Mejores alojamientos",
            staysDesc:
              "Tea houses seleccionadas para descanso cómodo y recuperación más rápida.",
            dailyItinerary: "Itinerario diario",
            investment: "Costos",
            priceByGroup: "Precio por tamaño de grupo",
            included: "Incluye",
            excluded: "No incluye",
            discountedFrom: "Antes",
            startingFrom: "Desde",
            finalCost: "El costo final depende del tamaño del grupo y servicios elegidos.",
            bookNow: "Reservar ahora",
            whatsapp: "Chat en WhatsApp",
            needCustomization: "¿Necesitas personalización?",
            customizeDesc:
              "Podemos ajustar el itinerario a tu condición física, horario y nivel de confort.",
            contactSpecialist: "Contactar especialista →",
            dayLabel: (day: number) => `Día ${day < 10 ? `0${day}` : day}`,
            keyDetails: "Detalles clave",
          }
        : {
            badge: "Package Details",
            tabs: {
              overview: "Overview",
              itinerary: "Itinerary",
              costs: "Costs",
          },
          experience: "The Experience",
          experienceNote:
            "This itinerary is designed to balance scenery, acclimatization, and comfort while keeping the adventure authentic and professionally guided.",
          logisticsTitle: "Smart Logistics",
          logisticsDesc:
            "Transfers, permits, and route transitions are planned to reduce fatigue and maximize trail time.",
          staysTitle: "Better Stays",
          staysDesc:
            "Carefully chosen tea houses and lodges for cleaner stays, better rest, and smoother recovery.",
          dailyItinerary: "Daily Itinerary",
          investment: "Investment",
          priceByGroup: "Price by Group Size",
          included: "Included",
          excluded: "Excluded",
          discountedFrom: "Discounted From",
          startingFrom: "Starting From",
          finalCost: "Final cost depends on group size and selected services.",
          bookNow: "Book Now",
          whatsapp: "Chat on WhatsApp",
          needCustomization: "Need Customization?",
          customizeDesc:
            "We can tailor this itinerary to your fitness, schedule, and comfort level.",
          contactSpecialist: "Contact Specialist →",
          dayLabel: (day: number) => `Day ${day < 10 ? `0${day}` : day}`,
          keyDetails: "Key Details",
        };
  const [activeTab, setActiveTab] = useState<(typeof SECTION_IDS)[number]>("overview");

  useEffect(() => {
    window.scrollTo(0, 0);

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;
      const current = SECTION_IDS.find((section) => {
        const element = document.getElementById(section);
        if (!element) return false;
        const { offsetTop, offsetHeight } = element;
        return scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight;
      });

      if (current) setActiveTab(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const itineraryDays = useMemo(
    () =>
      item.itinerary.map((text, i) => {
        const parsed = parseItineraryText(text);
        return {
          ...parsed,
          highlights: inferItineraryHighlights(parsed.title, parsed.desc),
          meta: inferItineraryMeta(text),
          image:
            item.id !== "poon-hill" && itineraryImageByPackage[item.id]
              ? itineraryImageByPackage[item.id][i % itineraryImageByPackage[item.id].length]
              : imagePool[i % imagePool.length],
        };
      }),
    [item],
  );

  const scrollToSection = (sectionId: (typeof SECTION_IDS)[number]) => {
    const element = document.getElementById(sectionId);
    if (!element) return;
    const offset = window.innerWidth < 640 ? 124 : 112;
    const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: "smooth" });
    setActiveTab(sectionId);
  };

  const basePrice = item.pricing[item.pricing.length - 1]?.price || item.pricing[0]?.price;
  const bookingUrl = locale
    ? `/booking?package=${item.id}&lang=${locale}`
    : `/booking?package=${item.id}`;
  const parsePriceValue = (price: string) => Number(price.replace(/[^0-9.]/g, ""));
  const highestPriceEntry = item.pricing.reduce<{ label: string; price: string } | null>(
    (max, current) => {
      const currentValue = parsePriceValue(current.price);
      const maxValue = max ? parsePriceValue(max.price) : -1;
      return currentValue > maxValue ? current : max;
    },
    null,
  );
  const showDiscountFrom = Boolean(
    highestPriceEntry && parsePriceValue(highestPriceEntry.price) > parsePriceValue(basePrice),
  );

  return (
    <div className="min-h-screen bg-[#050505] pb-24 font-sans text-zinc-200 md:pb-20">
      <div className="group relative h-[58vh] w-full overflow-hidden md:h-[68vh]">
        <img
          src={item.image || packageHeroImage[item.id] || "/backgrounds/bg8.jpeg"}
          alt={item.name}
          className="h-full w-full object-cover transition-transform duration-[2s] group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/45 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 z-10 p-6 md:p-12">
          <div className="mx-auto w-full max-w-7xl px-0 sm:px-0">
            <div className="mb-3 flex items-center gap-2 text-xs font-bold tracking-widest text-blue-400 uppercase">
              <MapPin size={14} />
              {copy.badge}
            </div>
            <h1 className="mb-6 text-4xl leading-tight font-black tracking-tighter text-white uppercase md:text-7xl">
              {item.name}
            </h1>
            <div className="flex flex-wrap gap-4 text-xs font-bold tracking-wider text-white/90 uppercase md:text-sm">
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md">
                <Clock3 className="text-blue-500" size={14} />
                {item.duration}
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md">
                <Mountain className="text-blue-500" size={14} />
                {item.altitude}
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md">
                <Users className="text-blue-500" size={14} />
                {item.idealFor}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky top-[64px] z-[900] border-b border-white/6 bg-[#050505]/78 backdrop-blur-sm">
        <div className="mx-auto w-full max-w-7xl px-4 py-1.5 sm:px-8 sm:py-2">
          <div className="grid grid-cols-3 gap-[3px] rounded-lg bg-white/[0.03] p-[3px]">
            {SECTION_IDS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => scrollToSection(tab)}
                className={`inline-flex h-7 w-full items-center justify-center rounded-md px-1.5 text-[10px] font-medium transition-colors sm:h-8 sm:text-[11px] ${
                  activeTab === tab
                    ? "bg-white/[0.14] text-white"
                    : "text-zinc-400 hover:bg-white/[0.07] hover:text-zinc-200"
                }`}
              >
                <span className="truncate">{copy.tabs[tab]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-5 pt-14 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="flex-1 space-y-20">
            <section id="overview" className="scroll-mt-52">
              <h3 className="mb-7 flex items-center gap-4 text-3xl font-black tracking-tighter text-white uppercase">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-600/10 text-sm font-bold text-blue-500">
                  01
                </span>
                {copy.experience}
              </h3>
              <p className="max-w-3xl whitespace-pre-line text-base leading-relaxed font-light text-zinc-400">
                {item.summary}
              </p>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-500">
                {copy.experienceNote}
              </p>

              <div className="mt-10 grid gap-6 md:grid-cols-2">
                <div className="rounded-3xl border border-white/5 bg-zinc-900/30 p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
                    <PlaneTakeoff size={20} />
                  </div>
                  <h4 className="mb-2 text-sm font-bold tracking-wider text-white uppercase">
                    {copy.logisticsTitle}
                  </h4>
                  <p className="text-xs leading-relaxed text-zinc-500">
                    {copy.logisticsDesc}
                  </p>
                </div>
                <div className="rounded-3xl border border-white/5 bg-zinc-900/30 p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-500">
                    <BedDouble size={20} />
                  </div>
                  <h4 className="mb-2 text-sm font-bold tracking-wider text-white uppercase">
                    {copy.staysTitle}
                  </h4>
                  <p className="text-xs leading-relaxed text-zinc-500">
                    {copy.staysDesc}
                  </p>
                </div>
              </div>
            </section>

            <section id="itinerary" className="scroll-mt-52">
              <h3 className="mb-10 flex items-center gap-4 text-3xl font-black tracking-tighter text-white uppercase">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-600/10 text-sm font-bold text-blue-500">
                  02
                </span>
                {copy.dailyItinerary}
              </h3>
              <div className="relative ml-5 space-y-8 border-l border-dashed border-white/10">
                {itineraryDays.map((day, i) => (
                  <ItineraryItem
                    key={`${item.id}-day-${i}`}
                    day={i + 1}
                    item={day}
                    locale={resolvedLocale}
                  />
                ))}
              </div>
            </section>

            <section id="costs" className="scroll-mt-52">
              <h3 className="mb-10 flex items-center gap-4 text-3xl font-black tracking-tighter text-white uppercase">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-600/10 text-sm font-bold text-blue-500">
                  03
                </span>
                {copy.investment}
              </h3>

              <div className="mb-10 rounded-3xl border border-white/5 bg-zinc-900/20 p-6">
                <h4 className="mb-4 flex items-center gap-2 text-[11px] font-black tracking-widest text-blue-400 uppercase">
                  <BadgeDollarSign size={14} />
                  {copy.priceByGroup}
                </h4>
                <div className="space-y-2">
                  {item.pricing.map((price) => (
                    <div
                      key={price.label}
                      className="flex items-center justify-between rounded-xl border border-white/8 bg-black/20 px-4 py-3"
                    >
                      <span className="text-sm text-zinc-400">{price.label}</span>
                      <span className="text-sm font-bold text-white">{price.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-3xl border border-white/5 bg-zinc-900/20 p-6">
                  <h4 className="mb-5 flex items-center gap-2 border-b border-white/5 pb-4 text-[11px] font-black tracking-widest text-green-400 uppercase">
                    <CheckCircle2 size={14} />
                    {copy.included}
                  </h4>
                  <ul className="space-y-3">
                    {item.includes.map((inc) => (
                      <li key={inc} className="flex items-start gap-3 text-sm text-zinc-300">
                        <CheckCircle2 className="mt-0.5 shrink-0 text-green-500/60" size={14} />
                        {inc}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-3xl border border-white/5 bg-zinc-900/20 p-6">
                  <h4 className="mb-5 flex items-center gap-2 border-b border-white/5 pb-4 text-[11px] font-black tracking-widest text-red-400 uppercase">
                    <XCircle size={14} />
                    {copy.excluded}
                  </h4>
                  <ul className="space-y-3">
                    {item.excludes.map((exc) => (
                      <li key={exc} className="flex items-start gap-3 text-sm text-zinc-400">
                        <XCircle className="mt-0.5 shrink-0 text-red-500/60" size={14} />
                        {exc}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          </div>

          <section className="space-y-4 lg:sticky lg:top-32 lg:self-start">
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/40">
              <img
                src={packageFeatureImage[item.id] || "/gallery/image13.jpeg"}
                alt={`${item.name} feature`}
                className="h-36 w-full object-cover"
              />
              <div className="p-5">
                <p className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                  {showDiscountFrom ? copy.discountedFrom : copy.startingFrom}
                </p>
                {showDiscountFrom && highestPriceEntry && (
                  <p className="mt-1 text-sm font-semibold text-zinc-500 line-through">
                    {highestPriceEntry.price}
                  </p>
                )}
                <p className="mt-1 text-2xl font-black text-white">{basePrice}</p>
                <p className="mt-2 text-xs text-zinc-500">
                  {copy.finalCost}
                </p>
                <div className="mt-4 flex flex-col gap-2">
                  <Link
                    href={bookingUrl}
                    className="inline-flex items-center justify-center gap-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
                  >
                    {copy.bookNow}
                    <ArrowRight size={14} />
                  </Link>
                  <Link
                    href="https://wa.me/9779707921000"
                    target="_blank"
                    className="inline-flex items-center justify-center rounded-lg border border-white/15 px-4 py-2.5 text-sm font-semibold text-zinc-200 hover:bg-white/5"
                  >
                    {copy.whatsapp}
                  </Link>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-blue-600/20 bg-blue-600/10 p-4 text-center">
              <p className="mb-1.5 text-[9px] font-bold tracking-widest text-blue-400 uppercase">
                {copy.needCustomization}
              </p>
              <p className="mb-3 text-xs text-zinc-300">
                {copy.customizeDesc}
              </p>
              <Link
                href={resolvedLocale === "en" ? "/contact" : `/contact?lang=${resolvedLocale}`}
                className="text-[10px] font-bold tracking-wider text-white uppercase hover:text-blue-300"
              >
                {copy.contactSpecialist}
              </Link>
            </div>
          </section>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-[1200] border-t border-white/10 bg-[#050505]/90 p-4 pb-7 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-1">
          <div>
            <p className="mb-1 text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
              {showDiscountFrom ? copy.discountedFrom : copy.startingFrom}
            </p>
            {showDiscountFrom && highestPriceEntry && (
              <p className="text-[11px] font-semibold text-zinc-500 line-through">
                {highestPriceEntry.price}
              </p>
            )}
            <p className="text-xl font-black text-white">{basePrice}</p>
          </div>
          <Link
            href={bookingUrl}
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-3 text-[10px] font-black tracking-widest text-white uppercase shadow-lg shadow-blue-600/20 hover:bg-blue-500"
          >
            {copy.bookNow}
          </Link>
        </div>
      </div>
    </div>
  );
}

function ItineraryItem({
  item,
  day,
  locale,
}: {
  item: {
    title: string;
    desc: string;
    image: string;
    highlights: string[];
    meta: { hours: string; terrain: string; focus: string; detail: string };
  };
  day: number;
  locale: "en" | "zh" | "es";
}) {
  const dayLabel =
    locale === "zh"
      ? `第${day < 10 ? `0${day}` : day}天`
      : locale === "es"
        ? `Día ${day < 10 ? `0${day}` : day}`
        : `Day ${day < 10 ? `0${day}` : day}`;
  const keyDetailsLabel =
    locale === "zh" ? "要点" : locale === "es" ? "Detalles clave" : "Key Details";
  return (
    <div className="relative pl-8 md:pl-12">
      <div className="absolute top-6 -left-1.5 z-10 h-3 w-3 rounded-full border-2 border-blue-500 bg-[#050505] shadow-[0_0_15px_rgba(59,130,246,1)]" />

      <div className="overflow-hidden rounded-3xl border border-blue-500/30 bg-zinc-900">
        <div className="flex items-center justify-between p-6 md:p-8">
          <div>
            <span className="mb-1 block text-[10px] font-black tracking-widest text-blue-500 uppercase">
              {dayLabel}
            </span>
            <h4 className="text-lg font-bold text-white md:text-xl">
              {item.title}
            </h4>
          </div>
        </div>

        <div className="px-6 pb-8 md:px-8">
          <div className="mb-6 aspect-[21/9] w-full overflow-hidden rounded-2xl border border-white/5 shadow-2xl">
            <img src={item.image} alt={item.title} className="h-full w-full object-cover transition-transform duration-[2s] hover:scale-105" />
          </div>
          <p className="mb-5 text-sm leading-relaxed font-light text-zinc-400 md:text-base">{item.desc}</p>
          <div className="mb-5 rounded-2xl border border-white/5 bg-black/20 p-4">
            <p className="mb-2 text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
              {keyDetailsLabel}
            </p>
            <ul className="space-y-2">
              {item.highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-2 text-xs text-zinc-300 md:text-sm">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
          <p className="mb-5 text-sm leading-relaxed text-zinc-500">{item.meta.detail}</p>
          <div className="flex flex-wrap gap-3 border-t border-white/5 pt-4">
            <span className="flex items-center gap-2 rounded-lg border border-white/5 bg-black/20 px-3 py-2 text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
              <Footprints className="text-blue-500" size={12} /> {item.meta.hours}
            </span>
            <span className="flex items-center gap-2 rounded-lg border border-white/5 bg-black/20 px-3 py-2 text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
              <Mountain className="text-blue-500" size={12} /> {item.meta.terrain}
            </span>
            <span className="flex items-center gap-2 rounded-lg border border-white/5 bg-black/20 px-3 py-2 text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
              <MapPin className="text-blue-500" size={12} /> {item.meta.focus}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
