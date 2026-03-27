import type { CSSProperties, ReactNode } from "react"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { requireUser } from "@/lib/auth"
import { formatBookingStatusLabel } from "@/lib/booking-status"
import { prisma } from "@/lib/db"

const dashboardThemeVars = {
  "--background": "#050505",
  "--foreground": "oklch(0.985 0 0)",
  "--card": "#0b0b0b",
  "--card-foreground": "oklch(0.985 0 0)",
  "--popover": "#0c0c0c",
  "--popover-foreground": "oklch(0.985 0 0)",
  "--primary": "#084ea8",
  "--primary-foreground": "#ffffff",
  "--secondary": "#e02b34",
  "--secondary-foreground": "#ffffff",
  "--muted": "#101010",
  "--muted-foreground": "oklch(0.705 0.015 286.067)",
  "--accent": "#141414",
  "--accent-foreground": "oklch(0.985 0 0)",
  "--destructive": "#e02b34",
  "--border": "oklch(1 0 0 / 8%)",
  "--input": "oklch(1 0 0 / 12%)",
  "--ring": "#084ea8",
  "--sidebar": "#070707",
  "--sidebar-foreground": "oklch(0.985 0 0)",
  "--sidebar-primary": "#084ea8",
  "--sidebar-primary-foreground": "#ffffff",
  "--sidebar-accent": "#111111",
  "--sidebar-accent-foreground": "oklch(0.985 0 0)",
  "--sidebar-border": "oklch(1 0 0 / 8%)",
  "--sidebar-ring": "#084ea8",
} as CSSProperties

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await requireUser("/dashboard")

  let avatarUrl: string | null = null
  let notifications: Array<{
    id: string
    title: string
    description: string
    href: string
    tone: "blue" | "green" | "red"
  }> = []
  let notificationCount = 0

  try {
    const [profile, notificationPayload] = await Promise.all([
      prisma.user.findUnique({
        where: { id: user.id },
        select: {
          avatarUrl: true,
        },
      }),
      user.role === "ADMIN"
        ? Promise.all([
            prisma.booking.count({
              where: {
                status: "PENDING",
              },
            }),
            prisma.booking.findMany({
              where: {
                status: "PENDING",
              },
              orderBy: { createdAt: "desc" },
              take: 5,
              select: {
                id: true,
                packageName: true,
                createdAt: true,
                user: {
                  select: {
                    fullName: true,
                  },
                },
              },
            }),
          ])
        : Promise.all([
            prisma.booking.count({
              where: {
                userId: user.id,
              },
            }),
            prisma.booking.findMany({
              where: {
                userId: user.id,
              },
              orderBy: { updatedAt: "desc" },
              take: 5,
              select: {
                id: true,
                packageName: true,
                status: true,
                updatedAt: true,
              },
            }),
          ]),
    ])

    avatarUrl = profile?.avatarUrl ?? null

    if (user.role === "ADMIN") {
      const [pendingCount, pendingBookings] = notificationPayload as [
        number,
        Array<{
          id: string
          packageName: string
          createdAt: Date
          user: { fullName: string }
        }>
      ]

      notificationCount = pendingCount
      notifications = pendingBookings.map((booking) => ({
        id: booking.id,
        title: `${booking.user.fullName} needs a decision`,
        description: `${booking.packageName} was submitted ${new Intl.DateTimeFormat("en-US", {
          dateStyle: "medium",
        }).format(booking.createdAt)}.`,
        href: "/dashboard/admin/customers",
        tone: "blue",
      }))
    } else {
      const [bookingCount, recentBookings] = notificationPayload as [
        number,
        Array<{
          id: string
          packageName: string
          status: "PENDING" | "APPROVED" | "REJECTED"
          updatedAt: Date
        }>
      ]

      notificationCount = bookingCount
      notifications = recentBookings.map((booking) => ({
        id: booking.id,
        title: `${booking.packageName} is ${formatBookingStatusLabel(booking.status)}`,
        description: `Last updated ${new Intl.DateTimeFormat("en-US", {
          dateStyle: "medium",
        }).format(booking.updatedAt)}.`,
        href: "/dashboard/customer",
        tone:
          booking.status === "APPROVED"
            ? "green"
            : booking.status === "REJECTED"
              ? "red"
              : "blue",
      }))
    }
  } catch {
    avatarUrl = null
    notifications = []
    notificationCount = 0
  }

  return (
    <div
      className="relative min-h-screen overflow-x-hidden overflow-y-auto bg-background text-foreground"
      style={dashboardThemeVars}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-[-120px] top-10 h-72 w-72 rounded-full bg-primary/12 blur-3xl" />
        <div className="absolute left-[-100px] top-1/2 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <SidebarProvider defaultOpen>
        <AppSidebar
          user={{
            ...user,
            avatarUrl,
          }}
        />

        <SidebarInset className="min-h-screen min-w-0 bg-transparent">
          <SiteHeader
            notifications={notifications}
            notificationCount={notificationCount}
            notificationStorageKey={`altigo-archived-notifications-${user.id}`}
          />
          <div className="relative flex-1 min-w-0 px-4 py-4 lg:px-6">
            <div className="mx-auto w-full min-w-0 max-w-[1480px]">{children}</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
