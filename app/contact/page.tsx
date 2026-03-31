"use client";

import React, { memo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  CalendarDays,
  ChevronDown,
  Facebook,
  Footprints,
  Instagram,
  Mail,
  Map,
  MapPin,
  Phone,
  Shield,
  MessageCircle,
} from "lucide-react";
import { resolveLocale, type Locale } from "@/lib/i18n";

const API_URL = "https://mount-treks.onrender.com/api/send-email";
const MAP_EMBED_URL =
  "https://www.google.com/maps?q=Altigo%20Himalayan%20Treks%2C%20Thamel%20Area%20-%20Yapikhya%20Marg%2C%20Kathmandu&z=15&output=embed";

const socialLinks = [
  { Icon: Facebook, url: "https://www.facebook.com/profile.php?id=61584054197541" },
  { Icon: Instagram, url: "https://www.instagram.com/altigohimalayantreksofficial/" },
  { Icon: MessageCircle, url: "https://wa.me/9779707921000" },
];

type ContactCopy = {
  header: {
    titleLine1: string;
    titleLine2: string;
    description: string;
  };
  details: {
    imageAlt: string;
    mapTitle: string;
    visitLabel: string;
    callLabel: string;
    emailLabel: string;
    address: string;
  };
  form: {
    title: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    topicPlaceholder: string;
    topicOptions: {
      packages: string;
      materials: string;
      custom: string;
      other: string;
    };
    messagePlaceholder: string;
    submitLabel: string;
    successMessage: string;
    errorMessage: string;
  };
  faq: {
    title: string;
    items: { q: string; a: string }[];
  };
};

const CONTACT_COPY: Record<Locale, ContactCopy> = {
  en: {
    header: {
      titleLine1: "Let's Start Your",
      titleLine2: "Himalayan Journey",
      description:
        "Have questions about a trek? Need a custom itinerary? Our team of experts is ready to help you plan the adventure of a lifetime.",
    },
    details: {
      imageAlt: "Himalayas",
      mapTitle: "Altigo Himalayan Treks Office Location",
      visitLabel: "Visit Us",
      callLabel: "Call Us",
      emailLabel: "Email Us",
      address: "Thamel Area - Yapikhya Marg, Kathmandu",
    },
    form: {
      title: "Send a Message",
      namePlaceholder: "Your Name",
      emailPlaceholder: "Your Email",
      topicPlaceholder: "Select a Topic",
      topicOptions: {
        packages: "Packages",
        materials: "Materials",
        custom: "Custom Itinerary",
        other: "Other topics",
      },
      messagePlaceholder: "Tell us about your plans...",
      submitLabel: "Send Message",
      successMessage: "Message sent! Our experts will reach out shortly.",
      errorMessage: "Failed to send message. Please try again later.",
    },
    faq: {
      title: "Common Questions",
      items: [
        {
          q: "What is the best time for Himalayan trekking?",
          a: "The best trekking seasons are Spring (March to May) and Autumn (September to November) when skies are clear and temperatures are moderate.",
        },
        {
          q: "Do I need insurance for high-altitude treks?",
          a: "Yes, comprehensive travel insurance that covers emergency helicopter evacuation up to 6,000m is mandatory for all our treks.",
        },
        {
          q: "Can I customize a private trekking itinerary?",
          a: "Absolutely. We specialize in custom itineraries. Mention your needs in the contact form or message us on WhatsApp.",
        },
        {
          q: "Are the treks suitable for beginners?",
          a: "We offer easy to challenging treks. Ghorepani Poon Hill is great for beginners, while Everest Base Camp requires stronger stamina.",
        },
      ],
    },
  },
  es: {
    header: {
      titleLine1: "Comencemos tu",
      titleLine2: "Aventura en el Himalaya",
      description:
        "¿Tienes preguntas sobre un trekking? ¿Necesitas un itinerario a medida? Nuestro equipo de expertos está listo para ayudarte a planear la aventura de tu vida.",
    },
    details: {
      imageAlt: "Himalaya",
      mapTitle: "Ubicación de la oficina de Altigo Himalayan Treks",
      visitLabel: "Visítanos",
      callLabel: "Llámanos",
      emailLabel: "Escríbenos",
      address: "Zona Thamel - Yapikhya Marg, Katmandú",
    },
    form: {
      title: "Envíanos un mensaje",
      namePlaceholder: "Tu nombre",
      emailPlaceholder: "Tu correo",
      topicPlaceholder: "Selecciona un tema",
      topicOptions: {
        packages: "Paquetes",
        materials: "Materiales",
        custom: "Itinerario a medida",
        other: "Otros temas",
      },
      messagePlaceholder: "Cuéntanos tus planes...",
      submitLabel: "Enviar mensaje",
      successMessage: "¡Mensaje enviado! Nuestro equipo se pondrá en contacto pronto.",
      errorMessage: "No se pudo enviar el mensaje. Inténtalo más tarde.",
    },
    faq: {
      title: "Preguntas frecuentes",
      items: [
        {
          q: "¿Cuál es la mejor época para hacer trekking en el Himalaya?",
          a: "Las mejores temporadas son primavera (marzo a mayo) y otoño (septiembre a noviembre), con cielos despejados y temperaturas moderadas.",
        },
        {
          q: "¿Necesito seguro para trekkings de gran altitud?",
          a: "Sí. Es obligatorio un seguro de viaje completo que cubra evacuación en helicóptero hasta 6.000 m.",
        },
        {
          q: "¿Puedo personalizar un itinerario privado de trekking?",
          a: "Claro. Nos especializamos en itinerarios a medida. Indica tus necesidades en el formulario o escríbenos por WhatsApp.",
        },
        {
          q: "¿Los trekkings son aptos para principiantes?",
          a: "Ofrecemos rutas de fáciles a exigentes. Ghorepani Poon Hill es ideal para principiantes, mientras que el Campo Base del Everest requiere más resistencia.",
        },
      ],
    },
  },
  zh: {
    header: {
      titleLine1: "开启你的",
      titleLine2: "喜马拉雅之旅",
      description:
        "想咨询徒步行程？需要定制路线？我们的专家团队随时帮你规划一生难忘的冒险。",
    },
    details: {
      imageAlt: "喜马拉雅山脉",
      mapTitle: "Altigo Himalayan Treks 办公室位置",
      visitLabel: "来访我们",
      callLabel: "致电我们",
      emailLabel: "发送邮件",
      address: "泰米尔区 - Yapikhya Marg, 加德满都",
    },
    form: {
      title: "发送消息",
      namePlaceholder: "你的姓名",
      emailPlaceholder: "你的邮箱",
      topicPlaceholder: "选择主题",
      topicOptions: {
        packages: "线路套餐",
        materials: "装备物资",
        custom: "定制行程",
        other: "其他主题",
      },
      messagePlaceholder: "告诉我们你的计划...",
      submitLabel: "发送消息",
      successMessage: "消息已发送！我们的团队将尽快联系你。",
      errorMessage: "发送失败，请稍后再试。",
    },
    faq: {
      title: "常见问题",
      items: [
        {
          q: "喜马拉雅徒步的最佳季节是什么时候？",
          a: "最佳季节是春季（3–5月）和秋季（9–11月），天气晴朗、气温适中。",
        },
        {
          q: "高海拔徒步需要保险吗？",
          a: "需要。必须具备涵盖最高 6000 米紧急直升机撤离的综合旅行保险。",
        },
        {
          q: "可以定制私人徒步行程吗？",
          a: "当然可以。我们专注于定制行程。请在表单中说明需求或通过 WhatsApp 联系我们。",
        },
        {
          q: "路线适合初学者吗？",
          a: "我们提供从轻松到挑战的路线。Ghorepani Poon Hill 适合新手，而珠峰大本营需要更强体能。",
        },
      ],
    },
  },
};

const StaticBackground = memo(function StaticBackground({
  copy,
}: {
  copy: ContactCopy["details"];
}) {
  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      <img
        src="/backgrounds/bg1.jpeg"
        alt={copy.imageAlt}
        className="h-full w-full object-cover object-center opacity-40"
      />
      <div className="absolute inset-0 bg-black/70" />
    </div>
  );
});

const StaticHeader = memo(function StaticHeader({
  copy,
}: {
  copy: ContactCopy["header"];
}) {
  return (
    <div className="mb-10 text-center lg:mb-0 lg:text-left">
      <h2 className="mb-4 text-3xl leading-tight font-black text-white sm:text-4xl md:text-5xl">
        {copy.titleLine1} <br className="hidden sm:block" />
        <span className="text-transparent bg-clip-text bg-linear-to-r from-white to-gray-400">
          {copy.titleLine2}
        </span>
      </h2>
      <p className="mx-auto max-w-lg text-sm leading-relaxed text-gray-400 md:text-base lg:mx-0 lg:max-w-md">
        {copy.description}
      </p>
    </div>
  );
});

const StaticContactDetails = memo(function StaticContactDetails({
  copy,
}: {
  copy: ContactCopy["details"];
}) {
  return (
    <div className="mt-8 space-y-6 lg:mt-10">
      <div className="group relative h-48 w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl sm:h-64 lg:h-52">
        <iframe
          title={copy.mapTitle}
          src={MAP_EMBED_URL}
          className="h-full w-full grayscale transition-all duration-700 group-hover:grayscale-0"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <div className="group flex items-center rounded-xl border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:bg-white/10">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-all group-hover:bg-primary">
            <MapPin size={18} />
          </div>
          <div className="ml-4">
            <h4 className="text-[10px] font-bold tracking-wider text-gray-500 uppercase">
              {copy.visitLabel}
            </h4>
            <p className="text-sm font-medium text-white sm:text-base">
              {copy.address}
            </p>
          </div>
        </div>

        <div className="group flex items-center rounded-xl border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:bg-white/10">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-all group-hover:bg-primary">
            <Phone size={18} />
          </div>
          <div className="ml-4">
            <h4 className="text-[10px] font-bold tracking-wider text-gray-500 uppercase">
              {copy.callLabel}
            </h4>
            <p className="text-sm font-medium text-white sm:text-base">
              +977 9707921000
            </p>
          </div>
        </div>

        <div className="group flex items-center rounded-xl border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:bg-white/10">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-all group-hover:bg-primary">
            <Mail size={18} />
          </div>
          <div className="ml-4">
            <h4 className="text-[10px] font-bold tracking-wider text-gray-500 uppercase">
              {copy.emailLabel}
            </h4>
            <a
              href="mailto:info@altigohimalayantreks.com"
              className="text-sm font-medium text-white transition-colors hover:text-primary sm:text-base"
            >
              info@altigohimalayantreks.com
            </a>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4 pt-2 lg:justify-start">
        {socialLinks.map((social, idx) => (
          <a
            key={idx}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-400 transition-all duration-300 hover:bg-primary hover:text-white"
          >
            <social.Icon size={18} />
          </a>
        ))}
      </div>
    </div>
  );
});

function ContactForm({ copy }: { copy: ContactCopy["form"] }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: null, message: "" });

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setStatus({
          type: "success",
          message: copy.successMessage,
        });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        throw new Error(result.error || "Submission failed");
      }
    } catch (err) {
      console.error("Submission error:", err);
      setStatus({
        type: "error",
        message: copy.errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute -inset-1 rounded-2xl bg-linear-to-r from-primary to-indigo-600 opacity-20 blur-xl" />
      <div className="relative rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl sm:p-8 md:p-12">
        <h3 className="mb-8 text-center text-2xl font-black text-gray-900 sm:text-left">
          {copy.title}
        </h3>

        {status.type && (
          <div
            className={`mb-6 rounded-lg p-4 text-sm font-medium ${
              status.type === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              required
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={copy.namePlaceholder}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 outline-hidden transition-all focus:border-primary focus:ring-2 focus:ring-primary/50"
            />
            <input
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={copy.emailPlaceholder}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 outline-hidden transition-all focus:border-primary focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="relative">
            <select
              required
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 outline-hidden focus:ring-2 focus:ring-primary/50"
            >
              <option value="" disabled>
                {copy.topicPlaceholder}
              </option>
              <option value="packages">{copy.topicOptions.packages}</option>
              <option value="materials">{copy.topicOptions.materials}</option>
              <option value="custom-itinerary">{copy.topicOptions.custom}</option>
              <option value="other">{copy.topicOptions.other}</option>
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-gray-500" size={14} />
          </div>

          <textarea
            required
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={6}
            placeholder={copy.messagePlaceholder}
            className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 outline-hidden transition-all focus:ring-2 focus:ring-primary/50"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-black py-4 font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-primary active:scale-95"
          >
            {isSubmitting ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              copy.submitLabel
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

const FAQ_ICONS = [CalendarDays, Shield, Map, Footprints];

function FAQSection({ copy }: { copy: ContactCopy["faq"] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mt-16 w-full pb-10 sm:mt-24">
      <div className="mb-10 text-center">
        <h3 className="mb-3 text-2xl font-black text-white sm:text-3xl">
          {copy.title}
        </h3>
        <div className="mx-auto h-1 w-16 rounded-full bg-primary" />
      </div>

      <div className="mx-auto grid max-w-5xl gap-3">
        {copy.items.map((faq, idx) => {
          const Icon = FAQ_ICONS[idx] ?? CalendarDays;
          return (
          <div
            key={idx}
            className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all"
          >
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="flex w-full items-center justify-between p-4 text-left focus:outline-hidden sm:p-6"
            >
              <div className="flex items-center gap-4">
                <Icon
                  className={`shrink-0 text-lg sm:text-xl ${
                    openIndex === idx ? "text-primary" : "text-gray-500"
                  }`}
                />
                <span className="text-sm font-bold text-white transition-colors group-hover:text-primary sm:text-base">
                  {faq.q}
                </span>
              </div>
              <ChevronDown
                className={`shrink-0 text-gray-500 transition-transform duration-300 ${
                  openIndex === idx ? "rotate-180 text-primary" : ""
                }`}
              />
            </button>

            <div
              className={`transition-all duration-300 ease-in-out ${
                openIndex === idx
                  ? "max-h-60 p-4 pt-0 opacity-100 sm:p-6 sm:pt-0 sm:pl-16"
                  : "max-h-0 overflow-hidden opacity-0"
              }`}
            >
              <p className="text-sm leading-relaxed text-gray-400">{faq.a}</p>
            </div>
          </div>
        );
        })}
      </div>
    </div>
  );
}

export default function ContactPage() {
  const searchParams = useSearchParams();
  const locale = resolveLocale(searchParams.get("lang"));
  const copy = CONTACT_COPY[locale];

  return (
    <section className="relative min-h-screen w-full overflow-x-hidden bg-black pt-28 pb-12 font-sans sm:py-20 sm:pt-28 lg:pt-36">
      <StaticBackground copy={copy.details} />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-20">
          <div className="flex w-full flex-col lg:w-1/2">
            <StaticHeader copy={copy.header} />
            <div className="mt-auto hidden lg:block">
              <StaticContactDetails copy={copy.details} />
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <ContactForm copy={copy.form} />
            <div className="mt-12 block lg:hidden">
              <StaticContactDetails copy={copy.details} />
            </div>
          </div>
        </div>
        <FAQSection copy={copy.faq} />
      </div>
    </section>
  );
}
