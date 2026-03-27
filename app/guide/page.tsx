import type { Metadata } from "next";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  Backpack,
  BadgeCheck,
  CalendarDays,
  Compass,
  FileBadge2,
  HeartPulse,
  Plane,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { SITE_NAME } from "@/lib/seo";
import { resolveLocale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Nepal Trek Planner",
  description:
    "Comprehensive Nepal trekking guide covering visas, gear, seasons, grade selection, insurance, health preparation, and route planning.",
  alternates: {
    canonical: "/guide",
  },
  openGraph: {
    title: `${SITE_NAME} | Nepal Trek Planner`,
    description:
      "Comprehensive Nepal trekking guide covering visas, gear, seasons, grade selection, insurance, health preparation, and route planning.",
    url: "/guide",
    type: "website",
  },
};

type GuideTopic = {
  title: string;
  icon: LucideIcon;
  summary: string;
  quickTips: string[];
};

const topicIcons: LucideIcon[] = [
  FileBadge2,
  Backpack,
  Compass,
  Plane,
  CalendarDays,
  BadgeCheck,
  ShieldCheck,
  Stethoscope,
  Plane,
  HeartPulse,
];

const toId = (title: string, index: number) => {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return slug || `topic-${index + 1}`;
};

export default async function GuidePage({
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
          heroBadge: "徒步规划中心",
          heroTitle: "尼泊尔徒步全攻略",
          heroDesc:
            "出发前必读：签证、路线难度、季节天气、航班安排、保险与徒步安全。",
          highlights: [
            {
              title: "路线策略",
              desc: "根据天数、海拔史与舒适度选择路线与节奏。",
            },
            {
              title: "高海拔安全",
              desc: "循序适应、补水与天气判断是关键。",
            },
            {
              title: "后勤准备",
              desc: "许可、航班、装备、保险与急救包提前确认。",
            },
          ],
          topics: [
            {
              title: "尼泊尔入境签证",
              summary:
                "多数国家可落地签。请确保护照有效期与资料齐全，避免机场延误。",
              quickTips: [
                "护照有效期至少 6 个月。",
                "准备护照照片与签证费用支付方式。",
                "核对签证时长与行程及缓冲日。",
              ],
            },
            {
              title: "徒步装备要点",
              summary:
                "分层穿搭与合适鞋靴比堆叠装备更重要，需结合海拔与季节。",
              quickTips: [
                "速干内层 + 可靠防水外套。",
                "提前磨合登山鞋，备好防磨用品。",
                "携带充电宝、头灯、水壶与常备药。",
              ],
            },
            {
              title: "尼泊尔概览",
              summary:
                "气候与地形变化大，海拔越高变化越明显，需随时关注情况。",
              quickTips: [
                "低海拔温暖，高海拔早晚寒冷。",
                "道路与航班受天气影响较大。",
                "预留 1-2 天游程缓冲。",
              ],
            },
            {
              title: "航班延误与中断",
              summary:
                "山地机场（如卢卡拉）常受天气影响，需灵活规划。",
              quickTips: [
                "关键衔接至少留 1 天缓冲。",
                "尽量选择早班机。",
                "重要物品放随身行李。",
              ],
            },
            {
              title: "最佳徒步季节",
              summary:
                "秋季与春季通常视野最好、稳定性强，但不同区域略有差异。",
              quickTips: [
                "秋季（9-11月）：晴朗但人多。",
                "春季（3-5月）：气候好，花季美。",
                "冬季/雨季适合低海拔或雨影区。",
              ],
            },
            {
              title: "线路难度选择",
              summary:
                "难度取决于日行时间、海拔与恢复能力，而非仅凭意志。",
              quickTips: [
                "以持续强度评估，不只看单日强度。",
                "优先选择有适应日结构的行程。",
                "不确定时先选中等难度。",
              ],
            },
            {
              title: "高海拔旅行保险",
              summary:
                "需明确包含高海拔徒步与直升机救援。",
              quickTips: [
                "确认保险最高海拔覆盖。",
                "保存紧急电话与保单号。",
                "若改线或有症状及时告知保险方。",
              ],
            },
            {
              title: "急救与健康包",
              summary:
                "轻量但完整的急救包可应对常见问题与轻度高反。",
              quickTips: [
                "水泡处理、补液盐与常用止痛药。",
                "高反药请遵医嘱。",
                "处方药请带原包装。",
              ],
            },
            {
              title: "机票规划建议",
              summary:
                "尽量选择可改签机票，避免山地航段后紧接国际航班。",
              quickTips: [
                "国内段选可退改机票。",
                "回加德满都至少预留 1 天游程。",
                "保留电子与纸质票据。",
              ],
            },
            {
              title: "尼泊尔徒步安全吗",
              summary:
                "在持证向导与合理节奏下，尼泊尔徒步整体安全。",
              quickTips: [
                "高山/偏远路线建议配向导。",
                "出现症状及时减速或下撤。",
                "每天与向导与住宿确认行程。",
              ],
            },
          ],
          checklistTitle: "出发前清单",
          checklistDesc: "出发前的快速核对，减少临出发的压力与变动。",
          quickTips: "要点",
          askTopic: "咨询该主题",
          backTop: "回到顶部",
          safetyTitle: "安全提醒",
          safetyDesc:
            "本指南为实用信息，不构成医疗建议。如有基础疾病或高海拔相关问题，请在出发前咨询医生。",
          guideSections: "指南目录",
          planButton: "规划我的行程",
          browseDestinations: "浏览目的地",
          comparePackages: "对比产品",
          planTrek: "开始规划",
          checklist: [
            "护照、签证与旅行保险确认",
            "体能训练完成",
            "装备测试完毕，登山鞋已磨合",
            "紧急联系人与保单号离线保存",
            "山地航班后至少预留 1 天游程",
          ],
        }
      : locale === "es"
        ? {
            heroBadge: "Centro de planificación",
            heroTitle: "Guía completa de trekking en Nepal",
            heroDesc:
              "Todo lo que necesitas antes de reservar: visados, niveles de ruta, temporada, vuelos, seguros y seguridad.",
            highlights: [
              {
                title: "Estrategia de ruta",
                desc: "Elige ritmo y ruta según días, historial de altura y comodidad.",
              },
              {
                title: "Seguridad en altura",
                desc: "Aclimatación conservadora, hidratación y decisiones según clima.",
              },
              {
                title: "Logística lista",
                desc: "Permisos, vuelos, equipo, seguro y botiquín antes de salir.",
              },
            ],
            topics: [
              {
                title: "Visa de entrada a Nepal",
                summary:
                  "La visa turística suele estar disponible al llegar. Ten documentación lista para evitar retrasos.",
                quickTips: [
                  "Pasaporte con al menos 6 meses de validez.",
                  "Fotos de pasaporte y forma de pago para la visa.",
                  "Confirma la duración de la visa con tu itinerario.",
                ],
              },
              {
                title: "Equipo esencial",
                summary:
                  "La vestimenta por capas y buen calzado son clave. Ajusta tu kit a altura y temporada.",
                quickTips: [
                  "Capas transpirables y una buena chaqueta impermeable.",
                  "Ablanda las botas antes del viaje.",
                  "Lleva batería externa, linterna y botiquín personal.",
                ],
              },
              {
                title: "Panorama de Nepal",
                summary:
                  "El clima y el terreno varían mucho por región y altura.",
                quickTips: [
                  "Valles cálidos y noches frías en altura.",
                  "Carreteras y vuelos cambian por clima.",
                  "Reserva 1-2 días de margen.",
                ],
              },
              {
                title: "Retrasos de vuelos",
                summary:
                  "Los sectores de montaña pueden sufrir retrasos, especialmente en Lukla.",
                quickTips: [
                  "Deja al menos un día de margen.",
                  "Prefiere vuelos temprano por la mañana.",
                  "Lleva esenciales en equipaje de mano.",
                ],
              },
              {
                title: "Mejor época para trekking",
                summary:
                  "Otoño y primavera ofrecen mejor visibilidad y estabilidad.",
                quickTips: [
                  "Otoño (sep-nov): cielos claros, rutas más concurridas.",
                  "Primavera (mar-may): clima estable y bosques en flor.",
                  "Invierno/monzón solo en rutas específicas.",
                ],
              },
              {
                title: "Niveles de dificultad",
                summary:
                  "La dificultad depende de horas de caminata, altura y recuperación.",
                quickTips: [
                  "Evalúa el esfuerzo sostenido, no un solo día duro.",
                  "Elige itinerarios con días de aclimatación.",
                  "Si dudas, empieza con nivel moderado.",
                ],
              },
              {
                title: "Seguro de alta montaña",
                summary:
                  "Debe cubrir trekking en altura y evacuación en helicóptero.",
                quickTips: [
                  "Confirma el límite de altura de la póliza.",
                  "Guarda números de emergencia offline.",
                  "Informa cambios de ruta o síntomas.",
                ],
              },
              {
                title: "Botiquín y salud",
                summary:
                  "Un botiquín compacto ayuda con molestias comunes y altura.",
                quickTips: [
                  "Kit de ampollas y sales de rehidratación.",
                  "Medicinas de altura solo con consejo médico.",
                  "Recetas en su envase original.",
                ],
              },
              {
                title: "Consejos de vuelos",
                summary:
                  "Evita conexiones internacionales el mismo día tras vuelos de montaña.",
                quickTips: [
                  "Elige tickets reembolsables para tramos internos.",
                  "Regresa a Katmandú con al menos un día de margen.",
                  "Guarda copias digitales e impresas.",
                ],
              },
              {
                title: "¿Es Nepal seguro para trekkers?",
                summary:
                  "Con apoyo local y ritmo realista, Nepal es seguro para trekking.",
                quickTips: [
                  "Guías locales en rutas remotas o de pasos altos.",
                  "No fuerces el ascenso si hay síntomas.",
                  "Comparte el plan diario con guía y alojamientos.",
                ],
              },
            ],
            checklistTitle: "Checklist antes de salir",
            checklistDesc:
              "Revisa estos puntos antes de confirmar para evitar estrés de última hora.",
            quickTips: "Consejos rápidos",
            askTopic: "Consultar este tema",
            backTop: "Volver arriba",
            safetyTitle: "Aviso de seguridad",
            safetyDesc:
              "Esta guía es información práctica, no consejo médico. Consulta a un profesional antes de viajar si tienes condiciones previas.",
            guideSections: "Secciones",
            planButton: "Planear mi trekking",
            browseDestinations: "Ver destinos",
            comparePackages: "Comparar paquetes",
            planTrek: "Planear trekking",
            checklist: [
              "Pasaporte, visa y seguro verificados",
              "Preparación física completada",
              "Equipo probado y botas ablandadas",
              "Contactos de emergencia guardados",
              "Al menos 1 día de margen tras vuelos de montaña",
            ],
          }
        : {
            heroBadge: "Trek Planning Hub",
            heroTitle: "Complete Nepal Trek Planner",
            heroDesc:
              "Everything you need before booking: visa basics, route-grade decisions, weather timing, flight planning, insurance readiness, and trail safety practices.",
            highlights: [
              {
                title: "Route Strategy",
                desc: "Choose route and pace based on days, altitude history, and comfort preferences.",
              },
              {
                title: "Altitude Safety",
                desc: "Use conservative acclimatization, hydration routine, and weather-aware decisions.",
              },
              {
                title: "Logistics Readiness",
                desc: "Handle permits, flights, gear checks, insurance, and medical kit before departure.",
              },
            ],
            topics: [
              {
                title: "Nepal Entry Visa",
                summary:
                  "Tourist visas are available for many travelers on arrival. Keep passport validity and documentation ready to avoid airport delays.",
                quickTips: [
                  "Carry at least 6 months passport validity before entry.",
                  "Bring passport photos and prepare payment options for visa fee.",
                  "Double-check visa duration against your full trip and buffer days.",
                ],
              },
              {
                title: "Trek Gear Essentials",
                summary:
                  "Layering and proper footwear matter more than heavy packing. Build your kit around altitude, season, and route remoteness.",
                quickTips: [
                  "Use moisture-wicking base layers and one reliable waterproof shell.",
                  "Break in trekking boots before the trip and carry blister care.",
                  "Pack power bank, headlamp, water bottles, and personal meds.",
                ],
              },
              {
                title: "Nepal Snapshot",
                summary:
                  "Nepal has huge variation in climate, terrain, and access. Conditions can change quickly by altitude and region.",
                quickTips: [
                  "Expect warm valleys and cold mornings/evenings at higher elevations.",
                  "Road and flight conditions can shift by weather and season.",
                  "Keep 1 to 2 spare days in your itinerary for smoother logistics.",
                ],
              },
              {
                title: "Flight Delays and Disruptions",
                summary:
                  "Mountain sectors can face weather delays, especially around Lukla and remote airstrips. Flexible planning is essential.",
                quickTips: [
                  "Book critical onward connections with at least one safety day.",
                  "Prefer early morning mountain flights when possible.",
                  "Keep essentials in cabin baggage in case checked bags are delayed.",
                ],
              },
              {
                title: "Best Time to Trek",
                summary:
                  "Autumn and spring are generally the best seasons for visibility and stable trail conditions, though each region differs.",
                quickTips: [
                  "Autumn (Sep-Nov): clear skies, busier trails, cooler nights.",
                  "Spring (Mar-May): good weather and blooming forests.",
                  "Winter/monsoon can still work on specific lower or rain-shadow routes.",
                ],
              },
              {
                title: "Trek Difficulty Levels",
                summary:
                  "Trip grade should reflect walking hours, altitude profile, and recovery capacity, not just your motivation.",
                quickTips: [
                  "Choose by sustained effort level, not single hard-day capability.",
                  "Prioritize itineraries with acclimatization/rest structure.",
                  "If unsure, start moderate and extend later routes progressively.",
                ],
              },
              {
                title: "High-Altitude Travel Insurance",
                summary:
                  "Insurance should explicitly include high-altitude trekking and emergency helicopter evacuation coverage.",
                quickTips: [
                  "Confirm max altitude limit in policy wording before departure.",
                  "Save emergency hotline and policy number offline.",
                  "Keep insurer informed early if route changes or symptoms appear.",
                ],
              },
              {
                title: "First-Aid and Health Kit",
                summary:
                  "A compact, focused medical kit improves response time for common trail issues and minor altitude discomfort.",
                quickTips: [
                  "Carry blister kit, oral rehydration salts, and basic pain relief.",
                  "Pack altitude-related meds only with medical advice beforehand.",
                  "Bring personal prescriptions in original labeled packaging.",
                ],
              },
              {
                title: "Flight Planning Tips",
                summary:
                  "Pick flexible flight options where possible and avoid tight same-day international connections after mountain sectors.",
                quickTips: [
                  "Use refundable or change-friendly tickets for internal segments.",
                  "Schedule return to Kathmandu with at least one buffer day.",
                  "Keep digital and printed copies of all flight details.",
                ],
              },
              {
                title: "Is Nepal Safe for Trekkers",
                summary:
                  "Nepal is generally safe for trekkers when you use licensed support, realistic pacing, and weather-aware decision making.",
                quickTips: [
                  "Trek with local guidance on less-traveled or high-pass routes.",
                  "Avoid pushing altitude gain when symptoms worsen.",
                  "Share daily route plans with your guide and accommodation hosts.",
                ],
              },
            ],
            checklistTitle: "Before You Go Checklist",
            checklistDesc:
              "Use this quick checklist before final confirmation. Completing these points early prevents last-minute stress and itinerary disruptions.",
            quickTips: "Quick Tips",
            askTopic: "Ask About This Topic",
            backTop: "Back to top",
            safetyTitle: "Safety Note",
            safetyDesc:
              "This guide is practical information, not medical advice. For pre-existing conditions or altitude-related concerns, consult a licensed medical professional before your trek.",
            guideSections: "Guide Sections",
            planButton: "Plan My Trek",
            browseDestinations: "Browse Destinations",
            comparePackages: "Compare Packages",
            planTrek: "Plan My Trek",
            checklist: [
              "Passport, visa, and travel insurance verified",
              "Fitness build-up completed for route grade",
              "Gear tested and boots already broken in",
              "Emergency contacts and policy numbers saved offline",
              "At least 1 buffer day reserved after mountain flights",
            ],
          };

  const guideHighlights = [
    { ...copy.highlights[0], icon: Compass },
    { ...copy.highlights[1], icon: ShieldCheck },
    { ...copy.highlights[2], icon: BadgeCheck },
  ];

  const travelGuideTopics: GuideTopic[] = copy.topics.map((topic, index) => ({
    ...topic,
    icon: topicIcons[index] ?? Compass,
  }));

  const preTrekChecklist = copy.checklist;
  return (
    <main id="top" className="min-h-screen bg-[#050505] pb-16 pt-28">
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
          <div className="mt-5 flex flex-wrap gap-2">
            {travelGuideTopics.map((topic, idx) => (
              <a
                key={topic.title}
                href={`#${toId(topic.title, idx)}`}
                className="rounded-full border border-white/12 bg-black/25 px-3 py-1.5 text-xs font-medium text-zinc-200 transition hover:border-white/25 hover:bg-white/[0.06] hover:text-white"
              >
                {topic.title}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {guideHighlights.map((item) => (
            <article key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.05]">
                <item.icon className="h-5 w-5 text-zinc-100" />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-white">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-300">{item.desc}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-28 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <p className="text-xs font-semibold tracking-[0.14em] text-zinc-400 uppercase">
                {copy.guideSections}
              </p>
              <nav className="mt-3 space-y-1">
                {travelGuideTopics.map((topic, idx) => (
                  <a
                    key={topic.title}
                    href={`#${toId(topic.title, idx)}`}
                    className="block rounded-md px-2.5 py-2 text-sm text-zinc-300 transition hover:bg-white/[0.06] hover:text-white"
                  >
                    {topic.title}
                  </a>
                ))}
              </nav>
              <div className="mt-4 h-px bg-white/10" />
              <Link
                href={withLang("/booking")}
                className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-lg bg-primary px-3 text-sm font-semibold text-white hover:bg-primary/90"
              >
                {copy.planButton}
              </Link>
            </div>
          </aside>

          <section className="space-y-4">
            <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
              <h2 className="text-xl font-semibold text-white">{copy.checklistTitle}</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                {copy.checklistDesc}
              </p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {preTrekChecklist.map((item) => (
                  <li
                    key={item}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-zinc-200"
                  >
                    <BadgeCheck className="h-4 w-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>

            {travelGuideTopics.map((topic, idx) => (
              <article
                id={toId(topic.title, idx)}
                key={topic.title}
                className="scroll-mt-28 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6"
              >
                <div className="flex items-start gap-3">
                  <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.05]">
                    <topic.icon className="h-5 w-5 text-zinc-100" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-white sm:text-xl">{topic.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-300">{topic.summary}</p>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs font-semibold tracking-[0.12em] text-zinc-400 uppercase">
                    {copy.quickTips}
                  </p>
                  <ul className="mt-2 space-y-2">
                    {topic.quickTips.map((tip) => (
                      <li key={tip} className="flex items-start gap-2 text-sm text-zinc-200">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <Link
                    href={withLang("/contact")}
                    className="inline-flex h-9 items-center justify-center rounded-lg border border-white/15 bg-white/[0.04] px-3 text-xs font-semibold text-zinc-200 transition hover:bg-white/[0.1] hover:text-white"
                  >
                    {copy.askTopic}
                  </Link>
                  <a href="#top" className="text-xs font-semibold text-zinc-400 hover:text-zinc-200">
                    {copy.backTop}
                  </a>
                </div>
              </article>
            ))}
          </section>
        </div>

        <section className="mt-10 rounded-2xl border border-amber-300/25 bg-amber-500/10 p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="text-lg font-semibold text-white">{copy.safetyTitle}</h2>
              <p className="mt-1 text-sm leading-relaxed text-zinc-200">
                {copy.safetyDesc}
              </p>
            </div>
          </div>
        </section>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={withLang("/destinations")}
            className="inline-flex min-w-[180px] items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
          >
            {copy.browseDestinations}
          </Link>
          <Link
            href={withLang("/packages")}
            className="inline-flex min-w-[180px] items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
          >
            {copy.comparePackages}
          </Link>
          <Link
            href={withLang("/booking")}
            className="inline-flex min-w-[180px] items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
          >
            {copy.planTrek}
          </Link>
        </div>
      </section>
    </main>
  );
}
