"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { ComponentType } from "react";
import {
  BookOpen,
  ChevronRight,
  DoorOpen,
  LayoutDashboard,
  Map,
  Menu,
  ShieldUser,
  UserRound,
  Users,
  X,
} from "lucide-react";
import {
  adminPrimaryButtonClass,
  adminSecondaryButtonClass,
} from "@/components/dashboard/admin-ui";

type DashboardUser = {
  id: string;
  fullName: string;
  email: string;
  role: "ADMIN" | "CUSTOMER";
  avatarUrl?: string | null;
};

type NavItem = {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  exact?: boolean;
};

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "U";
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return `${parts[0].slice(0, 1)}${parts[1].slice(0, 1)}`.toUpperCase();
}

function isActivePath(pathname: string, item: NavItem) {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export default function DashboardSidebar({ user }: { user: DashboardUser }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const navItems = useMemo<NavItem[]>(() => {
    const baseItems: NavItem[] = [
      {
        label: "Profile",
        href: "/dashboard/profile",
        icon: UserRound,
      },
    ];

    if (user.role === "ADMIN") {
      return [
        {
          label: "Overview",
          href: "/dashboard/admin",
          icon: LayoutDashboard,
          exact: true,
        },
        {
          label: "Managers",
          href: "/dashboard/admin/managers",
          icon: ShieldUser,
        },
        {
          label: "Packages",
          href: "/dashboard/admin/packages",
          icon: BookOpen,
        },
        {
          label: "Destinations",
          href: "/dashboard/admin/destinations",
          icon: Map,
        },
        ...baseItems,
      ];
    }

    return [
      {
        label: "Overview",
        href: "/dashboard/customer",
        icon: LayoutDashboard,
        exact: true,
      },
      ...baseItems,
    ];
  }, [user.role]);

  const closeMenu = () => setOpen(false);

  const signOut = async () => {
    try {
      await fetch("/api/auth/sign-out", {
        method: "POST",
      });
    } catch {
      // Ignore sign-out errors and force navigation refresh anyway.
    }

    router.push("/");
    router.refresh();
  };

  const roleHomePath = user.role === "ADMIN" ? "/dashboard/admin" : "/dashboard/customer";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-[2300] inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#8ad4ff]/18 bg-[#0b1723]/92 text-white shadow-[0_12px_30px_rgba(2,10,18,0.35)] backdrop-blur md:hidden"
        aria-label="Open dashboard menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div
        className={`fixed inset-0 z-[2250] bg-black/65 transition-opacity md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeMenu}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-[2260] w-[304px] border-r border-[#8ad4ff]/12 bg-[linear-gradient(180deg,rgba(10,24,36,0.96),rgba(8,19,29,0.98))] shadow-[24px_0_70px_rgba(2,10,18,0.32)] backdrop-blur transition-transform md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#8ad4ff]/45 to-transparent" />
        <div className="pointer-events-none absolute inset-x-6 top-0 h-40 rounded-full bg-[#5cc4ff]/10 blur-3xl" />

        <button
          type="button"
          onClick={closeMenu}
          className="absolute right-3 top-4 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#8ad4ff]/16 text-slate-300 md:hidden"
          aria-label="Close dashboard menu"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex h-full flex-col px-4 pb-5 pt-6 md:pt-6">
          <Link
            href={roleHomePath}
            className="rounded-2xl border border-[#8ad4ff]/12 bg-[#112434]/78 px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
          >
            <p className="text-[10px] font-semibold tracking-[0.16em] text-[#9adfff]/78 uppercase">
              Altigo Dashboard
            </p>
            <p className="mt-1 text-sm font-semibold text-white">
              {user.role === "ADMIN" ? "Admin Workspace" : "Customer Workspace"}
            </p>
          </Link>

          <div className="mt-4 rounded-[26px] border border-[#8ad4ff]/12 bg-[#112434]/78 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
            <p className="text-[10px] font-semibold tracking-[0.16em] text-slate-400 uppercase">Account</p>
            <div className="mt-3 flex items-center gap-3">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.fullName}
                  referrerPolicy="no-referrer"
                  className="h-11 w-11 rounded-full object-cover ring-1 ring-[#8ad4ff]/24"
                />
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#5cc4ff]/14 text-xs font-bold text-[#cdefff]">
                  {getInitials(user.fullName)}
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{user.fullName}</p>
                <p className="truncate text-xs text-slate-400">{user.email}</p>
              </div>
            </div>
            <Link
              href="/dashboard/profile"
              onClick={closeMenu}
              className={`mt-3 inline-flex ${adminSecondaryButtonClass} px-3 py-1.5 text-xs`}
            >
              Edit Profile
            </Link>
          </div>

          <div className="mt-5 px-1">
            <p className="text-[10px] font-semibold tracking-[0.16em] text-slate-400 uppercase">
              Navigation
            </p>
          </div>

          <nav className="mt-2 space-y-1.5">
            {navItems.map((item) => {
              const active = isActivePath(pathname, item);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  onClick={closeMenu}
                  className={`group relative flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition ${
                    active
                      ? "bg-[linear-gradient(135deg,rgba(92,196,255,0.2),rgba(48,123,220,0.22))] text-white ring-1 ring-[#5cc4ff]/35"
                      : "text-slate-300 hover:bg-[#112434] hover:text-white"
                  }`}
                >
                  <span className="inline-flex items-center gap-2.5">
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </span>
                  <ChevronRight
                    className={`h-3.5 w-3.5 transition ${active ? "opacity-100" : "opacity-50 group-hover:opacity-80"}`}
                  />
                </Link>
              );
            })}
          </nav>

          <Link
            href="/booking"
            onClick={closeMenu}
            className={`mt-4 flex items-center gap-2.5 ${adminPrimaryButtonClass} px-3 py-2.5`}
          >
            <Users className="h-4 w-4" />
            New Booking
          </Link>

          <button
            type="button"
            onClick={signOut}
            className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl border border-[#8ad4ff]/14 bg-[#112434]/78 px-3 py-2.5 text-sm font-semibold text-slate-100 transition hover:border-[#8ad4ff]/24 hover:bg-[#14293d]"
          >
            <DoorOpen className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
