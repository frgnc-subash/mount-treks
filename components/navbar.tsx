"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { Menu, X } from "lucide-react";
import { dashboardHomeForRole } from "@/lib/auth/redirect";
import { resolveLocale } from "@/lib/i18n";
import LanguageSelector from "@/components/language-selector";

type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
  avatarUrl: string | null;
};

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "U";
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return `${parts[0].slice(0, 1)}${parts[1].slice(0, 1)}`.toUpperCase();
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = resolveLocale(searchParams.get("lang"));
  const navRef = useRef<HTMLDivElement>(null);

  const copy =
    locale === "zh"
      ? {
          home: "首页",
          destinations: "目的地",
          packages: "产品",
          blog: "博客",
          contact: "联系",
          signIn: "登录",
          profile: "账户",
          navigation: "导航",
          language: "语言",
        }
      : locale === "es"
        ? {
            home: "Inicio",
            destinations: "Destinos",
            packages: "Paquetes",
            blog: "Blog",
            contact: "Contacto",
            signIn: "Ingresar",
            profile: "Perfil",
            navigation: "Navegación",
            language: "Idioma",
          }
        : {
            home: "Home",
            destinations: "Destinations",
            packages: "Packages",
            blog: "Blog",
            contact: "Contact Us",
            signIn: "Sign In",
            profile: "Profile",
            navigation: "Navigation",
            language: "Language",
          };

  const withLang = (path: string) => {
    if (locale === "en") return path;
    const separator = path.includes("?") ? "&" : "?";
    return `${path}${separator}lang=${locale}`;
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseEnter = useCallback((element: HTMLAnchorElement) => {
    if (window.innerWidth >= 1024) {
      setIndicatorStyle({
        left: element.offsetLeft,
        width: element.offsetWidth,
        opacity: 1,
      });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
  }, []);

  useEffect(() => {
    setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen]);

  useEffect(() => {
    let canceled = false;

    const loadCurrentUser = async () => {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" });
        if (!response.ok) return;
        const payload = (await response.json()) as { user: AuthUser | null };
        if (!canceled) {
          setAuthUser(payload.user);
        }
      } catch {
        if (!canceled) {
          setAuthUser(null);
        }
      }
    };

    loadCurrentUser();

    return () => {
      canceled = true;
    };
  }, [pathname]);

  const navItems = [
    { label: copy.home, path: "/" },
    { label: copy.destinations, path: "/destinations" },
    { label: copy.packages, path: "/packages" },
    { label: copy.blog, path: "/blog" },
    { label: copy.contact, path: "/contact" },
  ];

  const dashboardPath = authUser ? dashboardHomeForRole(authUser.role) : "/dashboard";

  const isItemActive = (item: (typeof navItems)[number]) =>
    item.path === "/"
      ? pathname === "/"
      : pathname === item.path || pathname.startsWith(`${item.path}/`);

  const hideOnDashboard =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up");

  if (hideOnDashboard) {
    return null;
  }

  const commonLinkClasses =
    "relative px-4 lg:px-5 py-2 text-sm font-medium transition-all duration-300 rounded-lg flex items-center justify-center gap-2";

  return (
    <>
      <nav
        className={`fixed top-0 inset-x-0 z-[2200] transition-all duration-500 ${
          scrolled || isOpen
            ? "bg-[#050505]/95 py-3 shadow-2xl backdrop-blur-xl"
            : "bg-linear-to-b from-black/80 via-black/20 to-transparent py-5"
        }`}
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex items-center justify-between">
            <div className="flex w-full items-center justify-between lg:w-auto lg:flex-none">
              <Link
                href={withLang("/")}
                className="relative flex shrink-0 items-center gap-3 group"
              >
                <div className="relative h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10">
                  <Image
                    src="/logo.webp"
                    alt="Altigo Treks Logo"
                    fill
                    className="object-contain transition-transform duration-500 group-hover:scale-105"
                    priority
                  />
                </div>
                <div className="flex flex-col leading-[1.1]">
                  <span className="relative z-10 text-sm font-black tracking-tighter text-white uppercase whitespace-nowrap md:text-base lg:text-lg">
                    Altigo
                  </span>
                  <span className="relative z-10 text-[10px] font-black tracking-tighter text-primary uppercase whitespace-nowrap md:text-[11px] lg:text-xs">
                    Himalayan Treks
                  </span>
                </div>
              </Link>

              <button
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={isOpen}
                aria-controls="mobile-navigation"
                className="ml-4 rounded-xl border border-white/20 bg-white/10 p-2.5 text-white transition-all active:scale-95 lg:hidden"
              >
                {isOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>

            <div
              id="site-navigation"
              ref={navRef}
              onMouseLeave={handleMouseLeave}
              className="relative z-40 hidden lg:flex lg:flex-row lg:items-center lg:justify-center"
            >
              <div
                className="absolute hidden -z-10 rounded-lg bg-white/10 transition-all duration-300 lg:block"
                style={{
                  left: `${indicatorStyle.left}px`,
                  width: `${indicatorStyle.width}px`,
                  height: "100%",
                  opacity: indicatorStyle.opacity,
                }}
              />
              {navItems.map((item) => {
                const isActive = isItemActive(item);
                return (
                  <Link
                    key={item.path}
                    href={withLang(item.path)}
                    onMouseEnter={(e) => handleMouseEnter(e.currentTarget)}
                    className={`${commonLinkClasses} w-auto ${
                      isActive ? "font-bold text-secondary" : "text-white/90 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="z-40 hidden items-center justify-end gap-2 lg:flex lg:flex-none">
              <LanguageSelector
                align="end"
                triggerClassName="h-9 rounded-full border-white/20 bg-white/5 px-2 text-white"
                contentClassName="rounded-xl"
                size="sm"
              />
              {authUser ? (
                <>
                  <Link
                    href={withLang(dashboardPath)}
                    aria-label="Open dashboard profile"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 transition hover:bg-white/10"
                  >
                    {authUser.avatarUrl ? (
                      <img
                        src={authUser.avatarUrl}
                        alt={authUser.fullName}
                        referrerPolicy="no-referrer"
                        className="h-9 w-9 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-xs font-bold text-white">{getInitials(authUser.fullName)}</span>
                    )}
                  </Link>
                </>
              ) : (
                <Link
                  href={withLang("/sign-in")}
                  className="rounded-full bg-primary px-5 py-2.5 text-[10px] font-black tracking-widest text-white uppercase shadow-lg shadow-primary/20 transition-all active:scale-95 hover:bg-primary/90"
                >
                  {copy.signIn}
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div
        id="mobile-navigation"
        className={`fixed inset-0 z-[2100] transition-opacity duration-300 lg:hidden ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          aria-label="Close mobile menu"
          className="absolute inset-0 bg-black/65"
        />

        <aside
          className={`absolute right-0 top-0 h-full w-[88vw] max-w-[360px] border-l border-white/10 bg-[#070709] shadow-[0_20px_50px_rgba(0,0,0,0.55)] transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col px-4 pb-6 pt-24">
            <div className="mb-4 px-2">
              <p className="text-[10px] font-semibold tracking-[0.22em] text-zinc-400 uppercase">
                {copy.navigation}
              </p>
            </div>

            <div className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = isItemActive(item);
                return (
                  <Link
                    key={item.path}
                    href={withLang(item.path)}
                    onClick={() => setIsOpen(false)}
                    className={`inline-flex w-full items-center rounded-xl px-4 py-3.5 text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-white/[0.12] text-secondary"
                        : "text-zinc-100 hover:bg-white/[0.08] hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="my-4 h-px bg-white/10" />

            <div className="grid grid-cols-2 gap-2">
              <div className="col-span-2">
                <LanguageSelector
                  align="start"
                  triggerClassName="h-10 w-full rounded-xl border-white/20 bg-white/[0.03] px-2 text-white sm:h-11"
                  contentClassName="rounded-xl"
                  size="sm"
                />
              </div>
              {authUser ? (
                <>
                  <Link
                    href={withLang(dashboardPath)}
                    onClick={() => setIsOpen(false)}
                    className="col-span-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[0.03] text-[11px] font-black tracking-[0.12em] text-white uppercase transition-colors hover:bg-white/[0.08]"
                  >
                    {authUser.avatarUrl ? (
                      <img
                        src={authUser.avatarUrl}
                        alt={authUser.fullName}
                        referrerPolicy="no-referrer"
                        className="h-6 w-6 rounded-full object-cover"
                      />
                    ) : (
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
                        {getInitials(authUser.fullName)}
                      </span>
                    )}
                    {copy.profile}
                  </Link>
                </>
              ) : (
                <Link
                  href={withLang("/sign-in")}
                  onClick={() => setIsOpen(false)}
                  className="col-span-2 inline-flex h-11 w-full items-center justify-center rounded-xl bg-primary text-[11px] font-black tracking-[0.18em] text-white uppercase transition-colors hover:bg-primary/90"
                >
                  {copy.signIn}
                </Link>
              )}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
