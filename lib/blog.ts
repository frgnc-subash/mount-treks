import { resolveLocale, type Locale } from "@/lib/i18n";

export type BlogPostSection = {
  heading: string;
  paragraphs: string[];
};

type BlogLocaleContent = {
  title: string;
  excerpt: string;
  category: string;
  seoDescription: string;
  sections: BlogPostSection[];
};

type BlogPostRecord = {
  slug: string;
  image: string;
  author: string;
  publishedAt: string;
  readTime: string;
  featured?: boolean;
  locales: Record<Locale, BlogLocaleContent>;
};

export type BlogPost = {
  slug: string;
  image: string;
  author: string;
  publishedAt: string;
  readTime: string;
  featured: boolean;
  title: string;
  excerpt: string;
  category: string;
  seoDescription: string;
  sections: BlogPostSection[];
};

const blogPostRecords: BlogPostRecord[] = [
  {
    slug: "best-time-for-nepal-trekking",
    image: "/backgrounds/bg8.jpeg",
    author: "Altigo Editorial Team",
    publishedAt: "2026-03-12",
    readTime: "6 min read",
    featured: true,
    locales: {
      en: {
        title: "Best Time for Trekking in Nepal by Route and Season",
        excerpt:
          "Understand how spring, autumn, monsoon, and winter affect Everest, Annapurna, Langtang, Mustang, and remote restricted routes.",
        category: "Planning",
        seoDescription:
          "Learn the best time for trekking in Nepal with practical route-by-route guidance for Everest, Annapurna, Langtang, Mustang, and more.",
        sections: [
          {
            heading: "Why season matters more than people think",
            paragraphs: [
              "Choosing a trek in Nepal is not just about the route. The month you travel changes visibility, flight reliability, trail traffic, temperature, and the kind of support you may need on the mountain.",
              "A route that feels balanced in October can become much harder in winter or far less predictable during monsoon. Good planning starts by matching the season to the route, not forcing the route into any date that looks convenient.",
            ],
          },
          {
            heading: "Autumn for classic visibility",
            paragraphs: [
              "Autumn, especially October and November, remains the strongest all-around season for Everest Base Camp, Annapurna Circuit, and many first-time treks. Skies are often clearer, mountain views are stronger, and trail infrastructure is fully active.",
              "The tradeoff is traffic. Popular tea houses, mountain flights, and transport segments need earlier booking, and the most photographed routes can feel busy at peak times.",
            ],
          },
          {
            heading: "Spring for color and steadier conditions",
            paragraphs: [
              "Spring is excellent for trekkers who want strong weather windows but slightly softer visibility expectations than autumn. Forest routes feel especially beautiful with rhododendron bloom, and temperatures are often more forgiving at mid-elevation.",
              "This season works well for Annapurna, Langtang, and many Everest itineraries, especially if your group values comfortable daytime movement over perfectly crisp horizon lines every day.",
            ],
          },
          {
            heading: "When off-season can still work",
            paragraphs: [
              "Winter and monsoon are not automatic no-go seasons. They simply require sharper route selection. Lower-elevation trails, rain-shadow regions like Upper Mustang, and shorter itineraries can still work when the plan is realistic.",
              "If your dates are fixed, the smarter move is usually to adapt the route and pacing rather than chase a flagship trail in poor seasonal conditions.",
            ],
          },
        ],
      },
      es: {
        title: "La mejor época para hacer trekking en Nepal según ruta y temporada",
        excerpt:
          "Entiende cómo la primavera, el otoño, el monzón y el invierno afectan rutas como Everest, Annapurna, Langtang, Mustang y los itinerarios remotos.",
        category: "Planificación",
        seoDescription:
          "Descubre la mejor época para hacer trekking en Nepal con consejos prácticos según la ruta: Everest, Annapurna, Langtang, Mustang y más.",
        sections: [
          {
            heading: "Por qué la temporada importa tanto",
            paragraphs: [
              "Elegir un trekking en Nepal no depende solo de la ruta. El mes del viaje cambia la visibilidad, la fiabilidad de los vuelos, la afluencia en el sendero, la temperatura y el tipo de apoyo que puedes necesitar.",
              "Una ruta que se siente equilibrada en octubre puede volverse mucho más exigente en invierno o menos predecible durante el monzón. La buena planificación empieza alinear la temporada con la ruta.",
            ],
          },
          {
            heading: "Otoño para vistas clásicas",
            paragraphs: [
              "El otoño, especialmente octubre y noviembre, sigue siendo la mejor temporada general para Everest Base Camp, Annapurna Circuit y muchas rutas para primeros viajeros. Suele haber cielos más limpios y mejor operación logística.",
              "La contrapartida es la demanda. Los alojamientos, vuelos de montaña y traslados suelen requerir reserva anticipada, y las rutas más populares pueden sentirse bastante concurridas.",
            ],
          },
          {
            heading: "Primavera para color y equilibrio",
            paragraphs: [
              "La primavera funciona muy bien para quienes quieren buenas ventanas climáticas con temperaturas algo más amables. Las rutas de bosque se ven especialmente bien cuando florecen los rododendros.",
              "Es una temporada muy sólida para Annapurna, Langtang y varios itinerarios del Everest, sobre todo si el grupo prioriza comodidad diaria y ritmo estable.",
            ],
          },
          {
            heading: "Cuándo también funciona la temporada baja",
            paragraphs: [
              "Invierno y monzón no significan cancelar automáticamente. Lo importante es seleccionar bien la ruta. Los senderos más bajos, las zonas de sombra de lluvia como Upper Mustang y los itinerarios más cortos siguen siendo viables.",
              "Si tus fechas son fijas, normalmente es mejor adaptar la ruta y el ritmo que insistir en una travesía emblemática en malas condiciones estacionales.",
            ],
          },
        ],
      },
      zh: {
        title: "按路线与季节选择尼泊尔徒步最佳时间",
        excerpt:
          "了解春季、秋季、冬季和雨季如何影响珠峰、安娜普尔纳、朗塘、木斯塘及偏远受限区线路。",
        category: "行程规划",
        seoDescription:
          "按路线了解尼泊尔徒步最佳季节，涵盖珠峰、安娜普尔纳、朗塘、木斯塘及更多区域的实用建议。",
        sections: [
          {
            heading: "为什么季节比很多人想得更重要",
            paragraphs: [
              "在尼泊尔选择徒步线路时，不能只看路线本身。出发月份会直接影响山景可见度、航班稳定性、步道拥挤程度、气温以及你需要的支持方式。",
              "同一条线路在十月可能节奏舒适，但在冬季会明显更难，在雨季也可能变得更不稳定。合理规划的第一步，是让季节匹配路线。",
            ],
          },
          {
            heading: "秋季适合经典山景路线",
            paragraphs: [
              "十月和十一月仍然是珠峰大本营、安娜普尔纳环线等经典线路最稳妥的季节之一。通常天空更清透、山景更强、沿线配套也更完整。",
              "代价是旺季人多。热门茶屋、山地航班和交通衔接通常需要更早确认，主流线路在高峰时段会比较热闹。",
            ],
          },
          {
            heading: "春季适合平衡气候与体验",
            paragraphs: [
              "如果你希望天气稳定，同时白天气温更友好，春季通常是很好的选择。林线附近的路线在杜鹃花季尤其漂亮。",
              "这一季非常适合安娜普尔纳、朗塘以及不少珠峰线路，特别适合重视舒适节奏与连续体验的团队。",
            ],
          },
          {
            heading: "淡季并不等于不能走",
            paragraphs: [
              "冬季和雨季并不意味着完全不能徒步，而是更考验路线选择。较低海拔线路、雨影区如上木斯塘，以及时间更短的行程，仍然可以安排得很合理。",
              "如果你的时间固定，通常更明智的做法是调整路线与节奏，而不是勉强去走不适合当季的热门线路。",
            ],
          },
        ],
      },
    },
  },
  {
    slug: "how-to-choose-between-everest-annapurna-langtang",
    image: "/gallery/image8.jpeg",
    author: "Altigo Route Desk",
    publishedAt: "2026-02-18",
    readTime: "5 min read",
    locales: {
      en: {
        title: "How to Choose Between Everest, Annapurna, and Langtang",
        excerpt:
          "A practical comparison of Nepal’s most requested trekking regions based on scenery, pace, altitude, access, and overall trip feel.",
        category: "Route Selection",
        seoDescription:
          "Compare Everest, Annapurna, and Langtang trekking routes in Nepal by scenery, altitude, logistics, pace, and overall experience.",
        sections: [
          {
            heading: "Everest for iconic scale",
            paragraphs: [
              "If your priority is the emotional pull of the Khumbu region, glacier valleys, and the world’s most iconic mountain setting, Everest usually wins. It feels bigger, sharper, and more dramatic from the start.",
              "The tradeoff is that flights and altitude management matter more. Everest asks for patience and buffer time, especially if you want the experience to feel smooth rather than rushed.",
            ],
          },
          {
            heading: "Annapurna for variety",
            paragraphs: [
              "Annapurna is strong for trekkers who want changing terrain, cultural shifts, and a fuller sense of landscape progression. Forest, villages, river valleys, and high passes all show up differently across the region.",
              "It is often the easiest region to tailor because you can choose between shorter comfort-first routes and longer high-pass itineraries depending on your team’s appetite.",
            ],
          },
          {
            heading: "Langtang for efficiency",
            paragraphs: [
              "Langtang is a great answer when you want serious Himalayan scenery but do not want the logistics weight of a longer expedition. It is closer to Kathmandu and works well for shorter travel windows.",
              "The route still feels meaningful, but the planning burden is lighter, which makes it attractive for couples, small groups, and travelers with limited leave.",
            ],
          },
          {
            heading: "The simplest way to decide",
            paragraphs: [
              "Choose Everest if the dream is non-negotiable, Annapurna if you want the broadest trekking experience, and Langtang if you want a compact but rewarding mountain trip.",
              "Most good itineraries are not about finding the objectively best route. They are about matching the route to your time, recovery pace, and tolerance for logistics.",
            ],
          },
        ],
      },
      es: {
        title: "Cómo elegir entre Everest, Annapurna y Langtang",
        excerpt:
          "Una comparación práctica entre las regiones de trekking más solicitadas de Nepal según paisaje, ritmo, altura, acceso y estilo de viaje.",
        category: "Selección de ruta",
        seoDescription:
          "Compara Everest, Annapurna y Langtang según paisaje, altitud, logística, ritmo y experiencia general de trekking en Nepal.",
        sections: [
          {
            heading: "Everest para una escala icónica",
            paragraphs: [
              "Si tu prioridad es vivir Khumbu, caminar entre glaciares y acercarte al entorno más emblemático del Himalaya, Everest suele ser la opción más fuerte.",
              "A cambio, los vuelos y la aclimatación pesan más en la planificación. Esta región premia a quienes viajan con paciencia y días de margen.",
            ],
          },
          {
            heading: "Annapurna para variedad",
            paragraphs: [
              "Annapurna encaja muy bien con quienes quieren sentir cambios reales de terreno, aldeas, cultura y paisaje a lo largo del recorrido.",
              "Además, es una región muy flexible: puedes plantearla como una ruta accesible o como una travesía más exigente con pasos altos y jornadas largas.",
            ],
          },
          {
            heading: "Langtang para viajes más eficientes",
            paragraphs: [
              "Langtang es una gran opción si buscas una experiencia alpina seria sin el peso logístico de una expedición más larga. Está más cerca de Katmandú y encaja mejor en calendarios reducidos.",
              "Sigue ofreciendo sensación de montaña real, pero con una carga de planificación más ligera.",
            ],
          },
          {
            heading: "La forma más simple de decidir",
            paragraphs: [
              "Elige Everest si es el sueño principal, Annapurna si quieres la experiencia más variada, y Langtang si buscas una ruta compacta pero muy gratificante.",
              "La mejor decisión no suele ser la ruta más famosa, sino la que mejor encaja con tus días disponibles, tu ritmo y tu tolerancia a la logística.",
            ],
          },
        ],
      },
      zh: {
        title: "珠峰、安娜普尔纳和朗塘之间该怎么选",
        excerpt:
          "从景观、节奏、海拔、交通与整体体验角度，对尼泊尔最受欢迎的三大徒步区域做实用比较。",
        category: "路线选择",
        seoDescription:
          "从景观、海拔、节奏和交通难度比较珠峰、安娜普尔纳与朗塘三大尼泊尔徒步区域。",
        sections: [
          {
            heading: "珠峰适合追求标志性体验的人",
            paragraphs: [
              "如果你最在意的是昆布地区的情绪价值、冰川谷地以及最具代表性的雪山环境，珠峰线路通常最能打动人。",
              "但相应地，山地航班和高海拔适应会更重要。珠峰线路更适合愿意留足缓冲和节奏的人。",
            ],
          },
          {
            heading: "安娜普尔纳适合喜欢变化的人",
            paragraphs: [
              "安娜普尔纳区域最大的优势是丰富度。森林、村庄、峡谷、垭口和地貌变化都非常明显，整条线路的层次感更强。",
              "它也更容易做定制，你可以选择轻松一些的版本，也可以安排更完整、更高海拔的穿越。",
            ],
          },
          {
            heading: "朗塘适合时间更紧凑的人",
            paragraphs: [
              "如果你希望看到很有质量的喜马拉雅景观，但不想承担更长线路的交通和时间成本，朗塘通常是很聪明的选择。",
              "它离加德满都更近，整体组织难度更低，非常适合假期有限的小团队或第一次来尼泊尔的人。",
            ],
          },
          {
            heading: "最简单的判断方式",
            paragraphs: [
              "如果珠峰是你的核心梦想，就选珠峰；如果你想要变化最丰富的整体体验，就选安娜普尔纳；如果你想在较短时间里获得高质量山地体验，就选朗塘。",
              "真正合适的路线，不是最有名的那条，而是最符合你时间、恢复节奏和后勤承受力的那条。",
            ],
          },
        ],
      },
    },
  },
  {
    slug: "permits-insurance-and-safety-basics-for-first-time-trekkers",
    image: "/backgrounds/bg4.jpeg",
    author: "Altigo Support Team",
    publishedAt: "2026-01-26",
    readTime: "7 min read",
    locales: {
      en: {
        title: "Permits, Insurance, and Safety Basics for First-Time Trekkers",
        excerpt:
          "What first-time Nepal trekkers should sort out before arrival, from permits and coverage limits to acclimatization and communication habits.",
        category: "Safety",
        seoDescription:
          "A simple guide to Nepal trekking permits, travel insurance, acclimatization, and safety basics for first-time trekkers.",
        sections: [
          {
            heading: "Permits are route-specific, not generic",
            paragraphs: [
              "A common mistake is assuming one trekking permit covers every region. Nepal permit requirements vary by route, and restricted areas add additional documentation, timing, and logistics.",
              "It is much easier to confirm permit needs early than to redesign a route after flights and dates are already fixed.",
            ],
          },
          {
            heading: "Insurance wording matters",
            paragraphs: [
              "Travel insurance is only useful if the actual wording includes your route profile. Altitude limits, emergency helicopter evacuation, and trekking activity coverage should be confirmed before departure, not after symptoms appear.",
              "Many first-time trekkers buy a policy that sounds broad but excludes the part of the trip that matters most.",
            ],
          },
          {
            heading: "Safety comes from pacing, not bravado",
            paragraphs: [
              "Most trek safety decisions are not dramatic. They are about moving at a realistic pace, eating and hydrating well, respecting rest days, and speaking up early when something feels off.",
              "The strongest itineraries build margin into the route so your group can respond to conditions instead of pretending conditions do not exist.",
            ],
          },
          {
            heading: "A better first-trek mindset",
            paragraphs: [
              "First-time trekkers do best when they plan conservatively and travel with enough information to make good decisions without overcomplicating the experience.",
              "You do not need to know everything before you arrive. You do need the basics sorted: permits, valid insurance, realistic route selection, and a support team that communicates clearly.",
            ],
          },
        ],
      },
      es: {
        title: "Permisos, seguro y bases de seguridad para quienes hacen su primer trekking",
        excerpt:
          "Lo esencial que conviene resolver antes de llegar a Nepal: permisos, límites de cobertura, aclimatación y hábitos simples de seguridad.",
        category: "Seguridad",
        seoDescription:
          "Guía práctica sobre permisos, seguro, aclimatación y seguridad básica para quienes harán su primer trekking en Nepal.",
        sections: [
          {
            heading: "Los permisos dependen de la ruta",
            paragraphs: [
              "Uno de los errores más comunes es pensar que un solo permiso sirve para todo Nepal. En realidad, cada región tiene requisitos distintos y las zonas restringidas suman trámites adicionales.",
              "Confirmar esto con tiempo es mucho más fácil que cambiar toda la ruta después de cerrar fechas y vuelos.",
            ],
          },
          {
            heading: "El seguro hay que leerlo bien",
            paragraphs: [
              "Un seguro solo ayuda si la póliza cubre de verdad el tipo de trekking que vas a hacer. Hay que revisar límite de altura, evacuación en helicóptero y cobertura específica para caminatas en montaña.",
              "Muchos viajeros compran una póliza que parece amplia, pero deja fuera justo la parte más importante del viaje.",
            ],
          },
          {
            heading: "La seguridad nace del ritmo",
            paragraphs: [
              "La mayoría de las decisiones de seguridad no son espectaculares. Tienen que ver con caminar a un ritmo realista, hidratarse, descansar y decir temprano cuando algo no va bien.",
              "Los mejores itinerarios dejan margen para adaptarse a las condiciones en lugar de obligar al grupo a cumplir un plan rígido.",
            ],
          },
          {
            heading: "Una mejor mentalidad para el primer trekking",
            paragraphs: [
              "El primer trekking sale mucho mejor cuando la planificación es conservadora y la información útil está clara desde el inicio.",
              "No hace falta saberlo todo antes de llegar. Sí hace falta tener lo básico resuelto: permisos, seguro válido, una ruta realista y un equipo que comunique bien.",
            ],
          },
        ],
      },
      zh: {
        title: "第一次来尼泊尔徒步前要弄清楚的许可、保险与安全基础",
        excerpt:
          "首次徒步前最需要提前确认的事项，包括许可类型、保险条款、高反节奏和基础安全习惯。",
        category: "安全准备",
        seoDescription:
          "给第一次来尼泊尔徒步的人准备的实用指南，涵盖许可、保险、适应海拔与安全基础。",
        sections: [
          {
            heading: "许可不是一张通用证件",
            paragraphs: [
              "很多人会以为尼泊尔徒步只需要一种通用许可，但实际上不同区域的要求并不相同，受限区还会增加额外手续与时间安排。",
              "越早确认许可要求，越不容易在已经订好机票和日期后被迫改线路。",
            ],
          },
          {
            heading: "保险一定要看条款细节",
            paragraphs: [
              "保险是否有用，关键不在宣传页，而在具体条款。高海拔上限、直升机救援以及徒步活动本身是否被涵盖，都需要在出发前确认。",
              "很多首次徒步者买到的保单看起来全面，但最关键的高海拔部分其实并未真正覆盖。",
            ],
          },
          {
            heading: "真正的安全来自节奏",
            paragraphs: [
              "大多数安全决策并不是戏剧性的，而是体现在每天的节奏管理里: 走得现实一点、喝水吃饭、尊重休整日，并在不舒服时尽早沟通。",
              "好的行程会给团队留出调整空间，而不是要求所有人无论状态如何都硬撑着完成既定进度。",
            ],
          },
          {
            heading: "第一次徒步最好的心态",
            paragraphs: [
              "第一次来徒步，最理想的状态不是知道所有细节，而是把真正重要的基础准备到位。",
              "你不需要出发前就成为专家，但你需要把基本项处理好: 许可、有效保险、合理路线，以及一个沟通透明的支持团队。",
            ],
          },
        ],
      },
    },
  },
];

function mapLocalizedPost(post: BlogPostRecord, locale: Locale): BlogPost {
  const localized = post.locales[locale] ?? post.locales.en;

  return {
    slug: post.slug,
    image: post.image,
    author: post.author,
    publishedAt: post.publishedAt,
    readTime: post.readTime,
    featured: Boolean(post.featured),
    title: localized.title,
    excerpt: localized.excerpt,
    category: localized.category,
    seoDescription: localized.seoDescription,
    sections: localized.sections,
  };
}

export function getAllBlogPosts(localeInput?: string | null): BlogPost[] {
  const locale = resolveLocale(localeInput);

  return blogPostRecords
    .map((post) => mapLocalizedPost(post, locale))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getFeaturedBlogPost(localeInput?: string | null): BlogPost | null {
  return getAllBlogPosts(localeInput).find((post) => post.featured) ?? null;
}

export function getBlogPostBySlug(slug: string, localeInput?: string | null): BlogPost | null {
  const locale = resolveLocale(localeInput);
  const post = blogPostRecords.find((item) => item.slug === slug);
  return post ? mapLocalizedPost(post, locale) : null;
}

export function getAllBlogSlugs(): string[] {
  return blogPostRecords.map((post) => post.slug);
}
