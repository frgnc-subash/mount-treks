"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
// 1. Import Lucide Icons
import {
  Facebook,
  Instagram,
  MessageCircle, // Using this for WhatsApp
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { resolveLocale } from "@/lib/i18n";

export default function Footer() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = resolveLocale(searchParams.get("lang"));
  const currentYear = new Date().getFullYear();
  const withLang = (path: string) => {
    if (locale === "en") return path;
    const separator = path.includes("?") ? "&" : "?";
    return `${path}${separator}lang=${locale}`;
  };

  const copy =
    locale === "zh"
      ? {
          about:
            "我们专注于高海拔徒步探险，以安全、专业和在地经验带你深入壮丽喜马拉雅。",
          menu: "菜单",
          office: "办公室",
          payment: "我们支持多种国际支付方式。",
          rights: "版权所有",
          born: "源自尼泊尔",
          terms: "服务条款",
          privacy: "隐私政策",
          nav: {
            home: "首页",
            destinations: "目的地",
            guide: "指南",
            packages: "产品",
            contact: "联系",
          },
          addressLine1: "泰米尔区 - Yapikhya Marg",
          addressLine2: "加德满都，尼泊尔",
        }
      : locale === "es"
        ? {
            about:
              "Nos especializamos en trekking de altura, con rutas seguras y experiencias inolvidables en el Himalaya.",
            menu: "Menú",
            office: "Oficina",
            payment: "Aceptamos pagos internacionales.",
            rights: "Todos los derechos reservados",
            born: "Nacido en Nepal",
            terms: "Términos del servicio",
            privacy: "Política de privacidad",
            nav: {
              home: "Inicio",
              destinations: "Destinos",
              guide: "Guía",
              packages: "Paquetes",
              contact: "Contacto",
            },
            addressLine1: "Área de Thamel - Yapikhya Marg",
            addressLine2: "Katmandú, Nepal",
          }
        : {
            about:
              "We specialize in high-altitude trekking adventures, ensuring safe and unforgettable journeys through the majestic Himalayas.",
            menu: "Menu",
            office: "Office",
            payment: "We accept all international payments.",
            rights: "All rights reserved",
            born: "Born in Nepal",
            terms: "Terms of Service",
            privacy: "Privacy Policy",
            nav: {
              home: "Home",
              destinations: "Destinations",
              guide: "Guide",
              packages: "Packages",
              contact: "Contact Us",
            },
            addressLine1: "Thamel Area - Yapikhya Marg",
            addressLine2: "Kathmandu, Nepal",
          };

  const paymentMethods = [
    { key: "Visa", src: "https://cdn.simpleicons.org/visa" },
    { key: "Mastercard", src: "https://cdn.simpleicons.org/mastercard" },
    { key: "American Express", src: "https://cdn.simpleicons.org/americanexpress" },
    { key: "PayPal", src: "https://cdn.simpleicons.org/paypal" },
    { key: "Cash App", src: "https://cdn.simpleicons.org/cashapp" },
    { key: "Apple Pay", src: "https://cdn.simpleicons.org/applepay" },
  ];

  const navLinks = [
    { name: copy.nav.home, path: "/" },
    { name: copy.nav.destinations, path: "/destinations" },
    { name: copy.nav.guide, path: "/guide" },
    { name: copy.nav.packages, path: "/packages" },
    { name: copy.nav.contact, path: "/contact" },
  ];

  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up")
  ) {
    return null;
  }

  return (
    <footer className="bg-[#050505] border-t border-white/5 pt-16 md:pt-20 pb-10 relative">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16 md:mb-20">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-5 space-y-6 md:space-y-8">
            <Link href={withLang("/")} className="flex items-center gap-3 group w-fit">
              <div className="relative h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10">
                <Image
                  src="/logo.webp"
                  alt="Altigo Treks Logo"
                  fill
                  className="object-contain transition-transform duration-500 group-hover:rotate-3"
                />
              </div>
              <div className="flex flex-col leading-[1.1]">
                <span className="text-white font-black text-sm md:text-base lg:text-lg tracking-tighter uppercase whitespace-nowrap">
                  Altigo
                </span>
                <span className="text-primary font-black text-[10px] md:text-[11px] lg:text-xs tracking-tighter uppercase whitespace-nowrap">
                  Himalayan Treks
                </span>
              </div>
            </Link>

            <p className="text-zinc-500 text-sm leading-relaxed max-w-sm">
              {copy.about}
            </p>

            <div className="flex gap-3">
              {[
                { Icon: Facebook, url: "https://www.facebook.com/profile.php?id=61584054197541" },
                { Icon: Instagram, url: "https://www.instagram.com/altigohimalayantreksofficial/" },
                { Icon: MessageCircle, url: "https://wa.me/9779707921000" }, // WhatsApp
              ].map((item, idx) => (
                <a
                  key={idx}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white hover:bg-white/5 transition-all duration-300"
                >
                  <item.Icon size={19} strokeWidth={2.3} />
                </a>
              ))}
            </div>

          </div>

          <div className="hidden md:block md:col-span-1" />

          <div className="col-span-1 md:col-span-3">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-600 mb-6 md:mb-8">
              {copy.menu}
            </h4>
            <ul className="space-y-4">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={withLang(link.path)}
                    className="text-sm font-medium text-zinc-400 hover:text-white transition-all duration-300 flex items-center group gap-2"
                  >
                    <ArrowRight className="h-3 w-3 text-primary opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Office Section */}
          <div className="col-span-1 md:col-span-3">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-600 mb-6 md:mb-8">
              {copy.office}
            </h4>
            <div className="space-y-6">
              <a
                href="mailto:info@altigohimalayantreks.com"
                className="flex min-w-0 items-center gap-3 text-sm font-medium text-zinc-400 transition-colors group hover:text-white"
              >
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 transition-colors group-hover:bg-primary/20">
                  <Mail
                    size={14}
                    className="group-hover:text-primary transition-colors"
                  />
                </div>
                <span className="max-w-[220px] truncate whitespace-nowrap text-zinc-300 transition-colors group-hover:text-white sm:max-w-[280px] md:max-w-none">
                  info@altigohimalayantreks.com
                </span>
              </a>

              <a
                href="mailto:partner@altigohimalayantreks.com"
                className="flex min-w-0 items-center gap-3 text-sm font-medium text-zinc-400 transition-colors group hover:text-white"
              >
                <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary/20 transition-colors">
                  <Mail
                    size={14}
                    className="group-hover:text-primary transition-colors"
                  />
                </div>
                <span className="max-w-[220px] truncate whitespace-nowrap text-zinc-300 transition-colors group-hover:text-white sm:max-w-[280px] md:max-w-none">
                  partner@altigohimalayantreks.com
                </span>
              </a>

              <div className="flex items-center gap-3 text-sm font-medium text-zinc-400 group">
                <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Phone
                    size={14}
                    className="group-hover:text-primary transition-colors"
                  />
                </div>
                +977 9707921000
              </div>

              <div className="flex items-start gap-3 text-sm font-medium text-zinc-400 group">
                <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <MapPin
                    size={14}
                    className="group-hover:text-primary transition-colors"
                  />
                </div>
                <span className="leading-relaxed">
                  {copy.addressLine1},
                  <br /> {copy.addressLine2}
                </span>
              </div>

            </div>
          </div>
        </div>

        <div className="mb-10 flex flex-col gap-2">
          <p className="text-xs font-medium text-zinc-500">
            {copy.payment}
          </p>
          <div className="flex flex-wrap gap-2">
            {paymentMethods.map((method) => (
              <span
                key={method.key}
                title={method.key}
                aria-label={method.key}
                className="inline-flex h-[30px] w-[44px] items-center justify-center rounded-md bg-white px-1"
              >
                <img
                  src={method.src}
                  alt={method.key}
                  className={`w-auto ${method.key === "Apple Pay" ? "h-5" : "h-4"}`}
                  loading="lazy"
                />
              </span>
            ))}
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest text-center md:text-left">
            © {currentYear} ALTIGO HIMALAYAN TREKS. {copy.rights}.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href={withLang("/terms-of-service")}
              className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {copy.terms}
            </Link>
            <Link
              href={withLang("/privacy-policy")}
              className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {copy.privacy}
            </Link>
            <span className="text-[9px] font-black uppercase tracking-[0.6em] text-zinc-800 select-none">
              {copy.born}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
