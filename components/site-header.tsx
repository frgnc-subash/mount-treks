"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { IconArchive, IconBell } from "@tabler/icons-react"
import { useEffect, useMemo, useState } from "react"

import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"

type HeaderNotification = {
  id: string
  title: string
  description: string
  href: string
  tone: "blue" | "green" | "red"
}

type ArchivedStore = {
  ids: string[]
  items: HeaderNotification[]
}

const EMPTY_ARCHIVE_STORE: ArchivedStore = {
  ids: [],
  items: [],
}

function isTone(value: unknown): value is HeaderNotification["tone"] {
  return value === "blue" || value === "green" || value === "red"
}

function isNotification(value: unknown): value is HeaderNotification {
  if (typeof value !== "object" || value === null) return false
  const item = value as Record<string, unknown>
  return (
    typeof item.id === "string" &&
    typeof item.title === "string" &&
    typeof item.description === "string" &&
    typeof item.href === "string" &&
    isTone(item.tone)
  )
}

function dedupeNotifications(items: HeaderNotification[]) {
  const seen = new Set<string>()
  const unique: HeaderNotification[] = []

  for (const item of items) {
    if (seen.has(item.id)) continue
    seen.add(item.id)
    unique.push(item)
  }

  return unique
}

function normalizeArchivedStore(raw: unknown): ArchivedStore {
  if (Array.isArray(raw)) {
    const stringIds = raw.filter((item): item is string => typeof item === "string")
    if (stringIds.length === raw.length) {
      return {
        ids: Array.from(new Set(stringIds)),
        items: [],
      }
    }

    const items = raw.filter(isNotification)
    return {
      ids: Array.from(new Set(items.map((item) => item.id))),
      items: dedupeNotifications(items),
    }
  }

  if (typeof raw !== "object" || raw === null) {
    return EMPTY_ARCHIVE_STORE
  }

  const value = raw as Record<string, unknown>
  const ids = Array.isArray(value.ids)
    ? Array.from(new Set(value.ids.filter((item): item is string => typeof item === "string")))
    : []
  const items = Array.isArray(value.items)
    ? dedupeNotifications(value.items.filter(isNotification))
    : []

  const itemIds = items.map((item) => item.id)
  return {
    ids: Array.from(new Set([...ids, ...itemIds])),
    items,
  }
}

function getHeaderMeta(pathname: string) {
  if (pathname.startsWith("/dashboard/admin/managers")) {
    return {
      section: "Admin",
      title: "Manager Access",
      description: "Review the internal team handling bookings and customer accounts.",
    }
  }

  if (pathname.startsWith("/dashboard/admin/customers")) {
    return {
      section: "Admin",
      title: "Bookings",
      description: "Review booking requests, customer details, and approval activity in one place.",
    }
  }

  if (pathname.startsWith("/dashboard/admin/packages")) {
    return {
      section: "Admin",
      title: "Package Catalog",
      description: "Maintain trek offers, itinerary quality, and sales-ready package details.",
    }
  }

  if (pathname.startsWith("/dashboard/admin/destinations")) {
    return {
      section: "Admin",
      title: "Destination Control",
      description: "Keep route information, mapping points, and destination copy consistent.",
    }
  }

  if (pathname.startsWith("/dashboard/profile")) {
    return {
      section: "Account",
      title: "Profile Settings",
      description: "Manage your personal details and how your profile appears in the dashboard.",
    }
  }

  if (pathname.startsWith("/dashboard/customer")) {
    if (pathname.startsWith("/dashboard/customer/new-booking")) {
      return {
        section: "Traveller",
        title: "New Booking",
        description: "Create a new trek booking request directly from your dashboard workspace.",
      }
    }

    if (pathname.startsWith("/dashboard/customer/packages")) {
      return {
        section: "Traveller",
        title: "Packages",
        description: "Browse available trek packages without leaving your dashboard.",
      }
    }

    if (pathname.startsWith("/dashboard/customer/destinations")) {
      return {
        section: "Traveller",
        title: "Destinations",
        description: "Explore destination routes and details from your dashboard.",
      }
    }

    return {
      section: "Traveller",
      title: "Booking Overview",
      description: "Track requests, follow approvals, and start new trekking enquiries.",
    }
  }

  return {
    section: "Admin",
    title: "Analytics Dashboard",
    description: "Monitor demand, booking flow, and the current state of Altigo's trekking operations.",
  }
}

export function SiteHeader({
  notifications,
  notificationCount,
  notificationStorageKey,
}: {
  notifications: HeaderNotification[]
  notificationCount: number
  notificationStorageKey: string
}) {
  const pathname = usePathname()
  const { isMobile } = useSidebar()
  const meta = getHeaderMeta(pathname)
  const [activeTab, setActiveTab] = useState<"active" | "archived">("active")
  const [archivedStore, setArchivedStore] = useState<ArchivedStore>(EMPTY_ARCHIVE_STORE)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(notificationStorageKey)
      if (!stored) {
        setArchivedStore(EMPTY_ARCHIVE_STORE)
        return
      }

      setArchivedStore(normalizeArchivedStore(JSON.parse(stored) as unknown))
    } catch {
      setArchivedStore(EMPTY_ARCHIVE_STORE)
    }
  }, [notificationStorageKey])

  const archivedIdSet = useMemo(() => new Set(archivedStore.ids), [archivedStore.ids])
  const activeNotifications = useMemo(
    () => notifications.filter((notification) => !archivedIdSet.has(notification.id)),
    [archivedIdSet, notifications],
  )
  const archivedNotifications = useMemo(() => {
    const fromCurrent = notifications.filter((notification) => archivedIdSet.has(notification.id))
    const fromStore = archivedStore.items.filter((notification) => archivedIdSet.has(notification.id))
    return dedupeNotifications([...fromCurrent, ...fromStore])
  }, [archivedIdSet, archivedStore.items, notifications])

  const archivedCurrentCount = notifications.filter((notification) => archivedIdSet.has(notification.id)).length
  const visibleCount = Math.max(0, notificationCount - archivedCurrentCount)

  const persistArchivedStore = (nextStore: ArchivedStore) => {
    const normalizedStore = {
      ids: Array.from(new Set(nextStore.ids)),
      items: dedupeNotifications(nextStore.items),
    }
    setArchivedStore(normalizedStore)
    try {
      localStorage.setItem(notificationStorageKey, JSON.stringify(normalizedStore))
    } catch {
      // Ignore storage failures and keep UI responsive.
    }
  }

  const archiveOne = (notification: HeaderNotification) => {
    if (archivedIdSet.has(notification.id)) return
    persistArchivedStore({
      ids: [...archivedStore.ids, notification.id],
      items: [notification, ...archivedStore.items],
    })
  }

  const archiveAllActive = () => {
    persistArchivedStore({
      ids: [...archivedStore.ids, ...activeNotifications.map((notification) => notification.id)],
      items: [...activeNotifications, ...archivedStore.items],
    })
  }

  const restoreOne = (id: string) => {
    persistArchivedStore({
      ids: archivedStore.ids.filter((archivedId) => archivedId !== id),
      items: archivedStore.items.filter((notification) => notification.id !== id),
    })
  }

  const clearArchived = () => {
    persistArchivedStore(EMPTY_ARCHIVE_STORE)
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
      <div className="flex min-h-20 items-start gap-3 px-4 py-3 sm:items-center sm:py-4 lg:px-6">
        {isMobile ? (
          <SidebarTrigger className="mt-0.5 rounded-xl border border-border bg-card hover:bg-accent sm:mt-0" />
        ) : null}

        <div className="min-w-0 flex-1">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{meta.section}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="mt-1">
            <h1 className="text-base font-semibold text-white sm:text-xl">{meta.title}</h1>
            <p className="hidden text-sm text-muted-foreground md:block">{meta.description}</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 self-start sm:self-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="relative h-10 w-10 rounded-xl border-border bg-card p-0 text-foreground hover:bg-accent"
              >
                <IconBell />
                {visibleCount > 0 ? (
                  <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    {visibleCount > 9 ? "9+" : visibleCount}
                  </span>
                ) : null}
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              side="bottom"
              sideOffset={8}
              className="w-[min(24rem,calc(100vw-1.5rem))] rounded-2xl border-border bg-popover p-0 text-popover-foreground"
            >
              <div className="border-b border-border px-4 py-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">Notifications</p>
                    <p className="text-xs text-muted-foreground">
                      {activeTab === "active" && visibleCount > 0
                        ? `${visibleCount} item${visibleCount === 1 ? "" : "s"} requiring attention`
                        : activeTab === "archived" && archivedNotifications.length > 0
                          ? `${archivedNotifications.length} archived item${archivedNotifications.length === 1 ? "" : "s"}`
                        : "No new updates right now"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-border bg-muted/40 text-foreground">
                      {activeTab === "active" ? visibleCount : archivedNotifications.length}
                    </Badge>
                    {activeTab === "active" && activeNotifications.length > 0 ? (
                      <button
                        type="button"
                        onClick={archiveAllActive}
                        className="inline-flex h-7 items-center gap-1 rounded-md border border-border bg-card px-2 text-[11px] font-medium text-muted-foreground transition hover:bg-accent hover:text-white"
                      >
                        <IconArchive className="h-3.5 w-3.5" />
                        Archive all
                      </button>
                    ) : null}
                    {activeTab === "archived" && archivedNotifications.length > 0 ? (
                      <button
                        type="button"
                        onClick={clearArchived}
                        className="inline-flex h-7 items-center gap-1 rounded-md border border-border bg-card px-2 text-[11px] font-medium text-muted-foreground transition hover:bg-accent hover:text-white"
                      >
                        Clear archived
                      </button>
                    ) : null}
                  </div>
                </div>
                <div className="mt-3 inline-flex w-full rounded-lg border border-border bg-card p-0.5 sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setActiveTab("active")}
                    className={`flex-1 rounded-md px-2.5 py-1 text-xs font-medium transition sm:flex-none ${
                      activeTab === "active"
                        ? "bg-accent text-white"
                        : "text-muted-foreground hover:text-white"
                    }`}
                  >
                    Active ({activeNotifications.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("archived")}
                    className={`flex-1 rounded-md px-2.5 py-1 text-xs font-medium transition sm:flex-none ${
                      activeTab === "archived"
                        ? "bg-accent text-white"
                        : "text-muted-foreground hover:text-white"
                    }`}
                  >
                    Archived ({archivedNotifications.length})
                  </button>
                </div>
              </div>

              {activeTab === "active" && activeNotifications.length > 0 ? (
                <div className="max-h-[24rem] overflow-y-auto p-2">
                  {activeNotifications.map((notification) => (
                    <div key={notification.id} className="rounded-xl transition hover:bg-accent/45">
                      <DropdownMenuItem asChild>
                        <Link
                          href={notification.href}
                          className="flex cursor-pointer items-start gap-3 rounded-t-xl px-3 py-3 focus:bg-accent"
                        >
                          <span
                            className={
                              notification.tone === "green"
                                ? "mt-1 inline-block size-2.5 rounded-full bg-emerald-400"
                                : notification.tone === "red"
                                  ? "mt-1 inline-block size-2.5 rounded-full bg-rose-400"
                                  : "mt-1 inline-block size-2.5 rounded-full bg-[#084ea8]"
                            }
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-medium text-white">{notification.title}</span>
                            <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                              {notification.description}
                            </span>
                          </span>
                        </Link>
                      </DropdownMenuItem>
                      <div className="px-3 pb-2">
                        <button
                          type="button"
                          onClick={() => archiveOne(notification)}
                          className="inline-flex h-7 items-center gap-1 rounded-md border border-border bg-card px-2 text-[11px] font-medium text-muted-foreground transition hover:bg-accent hover:text-white"
                        >
                          <IconArchive className="h-3.5 w-3.5" />
                          Archive
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : activeTab === "archived" && archivedNotifications.length > 0 ? (
                <div className="max-h-[24rem] overflow-y-auto p-2">
                  {archivedNotifications.map((notification) => (
                    <div key={notification.id} className="rounded-xl transition hover:bg-accent/45">
                      <DropdownMenuItem asChild>
                        <Link
                          href={notification.href}
                          className="flex cursor-pointer items-start gap-3 rounded-t-xl px-3 py-3 opacity-85 focus:bg-accent"
                        >
                          <span
                            className={
                              notification.tone === "green"
                                ? "mt-1 inline-block size-2.5 rounded-full bg-emerald-400"
                                : notification.tone === "red"
                                  ? "mt-1 inline-block size-2.5 rounded-full bg-rose-400"
                                  : "mt-1 inline-block size-2.5 rounded-full bg-[#084ea8]"
                            }
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-medium text-white">{notification.title}</span>
                            <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                              {notification.description}
                            </span>
                          </span>
                        </Link>
                      </DropdownMenuItem>
                      <div className="px-3 pb-2">
                        <button
                          type="button"
                          onClick={() => restoreOne(notification.id)}
                          className="inline-flex h-7 items-center rounded-md border border-border bg-card px-2 text-[11px] font-medium text-muted-foreground transition hover:bg-accent hover:text-white"
                        >
                          Restore
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm font-medium text-white">
                    {activeTab === "active" ? "All caught up" : "No archived notifications"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {activeTab === "active"
                      ? "New dashboard activity will appear here."
                      : "Archived updates you save will appear here."}
                  </p>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
