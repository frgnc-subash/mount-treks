"use client"

import Link from "next/link"
import { DollarSign } from "lucide-react"
import { startTransition, useMemo, useState } from "react"
import {
  IconArrowUpRight,
  IconCalendarStats,
  IconClockHour4,
  IconMap2,
  IconRosetteDiscountCheck,
  IconRouteAltLeft,
} from "@tabler/icons-react"

import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import {
  defaultAnalyticsRange,
  formatAnalyticsRangeLabel,
  getLocalDateKey,
  type AnalyticsRangeValue,
} from "@/lib/analytics"
import { formatUsdAmount } from "@/lib/booking-amount"
import { bookingStatusHex } from "@/lib/booking-status"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type SummaryStats = {
  totalBookings: number
  pendingBookings: number
  approvedBookings: number
  rejectedBookings: number
}

type TrendDatum = {
  label: string
  bookings: number
  approved: number
  pending: number
  rejected: number
}

type StatusDatum = {
  name: string
  value: number
  fill: string
}

type RecentBooking = {
  id: string
  customerName: string
  customerEmail: string
  packageName: string
  destination: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  startDateLabel: string
  people: number
  amountLabel: string | null
}

type RangeValue = AnalyticsRangeValue
type SegmentValue = "all" | "pending" | "approved" | "rejected"

export type AdminAnalyticsProps = {
  userName: string
  activeRange: RangeValue
  activeSegment: SegmentValue
  bookings: Array<
    RecentBooking & {
      statusLabel: string
      createdAt: string
      startDate: string
      amount: number | null
    }
  >
}

const statusCopy: Record<SegmentValue, string> = {
  all: "Showing the full booking pipeline in the trend and recent activity.",
  pending: "Focused on requests that still need team action.",
  approved: "Focused on confirmed trips only.",
  rejected: "Focused on declined requests only.",
}

function formatSegmentLabel(segment: SegmentValue) {
  if (segment === "all") return "All statuses"
  return `${segment.slice(0, 1).toUpperCase()}${segment.slice(1)} only`
}

export default function AdminAnalytics({
  userName,
  activeRange: initialActiveRange,
  activeSegment: initialActiveSegment,
  bookings,
}: AdminAnalyticsProps) {
  const [activeRange, setActiveRange] = useState<RangeValue>(initialActiveRange)
  const [activeSegment, setActiveSegment] = useState<SegmentValue>(initialActiveSegment)

  const filteredBookings = useMemo(() => {
    const start = new Date()
    start.setDate(start.getDate() - (activeRange - 1))
    start.setHours(0, 0, 0, 0)

    return bookings.filter((booking) => {
      const createdAt = new Date(booking.createdAt)
      if (createdAt < start) return false

      if (activeSegment === "all") return true
      return booking.status === activeSegment.toUpperCase()
    })
  }, [activeRange, activeSegment, bookings])

  const stats = useMemo<SummaryStats>(() => {
    let pendingBookings = 0
    let approvedBookings = 0
    let rejectedBookings = 0

    for (const booking of filteredBookings) {
      if (booking.status === "PENDING") pendingBookings += 1
      if (booking.status === "APPROVED") approvedBookings += 1
      if (booking.status === "REJECTED") rejectedBookings += 1
    }

    return {
      totalBookings: filteredBookings.length,
      pendingBookings,
      approvedBookings,
      rejectedBookings,
    }
  }, [filteredBookings])

  const trendData = useMemo<TrendDatum[]>(() => {
    const start = new Date()
    start.setDate(start.getDate() - (activeRange - 1))
    start.setHours(0, 0, 0, 0)

    const dayBuckets = Array.from({ length: activeRange }, (_, index) => {
      const date = new Date(start)
      date.setDate(start.getDate() + index)
      return date
    })

    const trendMap = new Map(
      dayBuckets.map((date) => [
        getLocalDateKey(date),
        {
          label: new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
          }).format(date),
          bookings: 0,
          approved: 0,
          pending: 0,
          rejected: 0,
        },
      ])
    )

    for (const booking of filteredBookings) {
      const key = getLocalDateKey(new Date(booking.createdAt))
      const day = trendMap.get(key)

      if (!day) continue

      day.bookings += 1
      if (booking.status === "APPROVED") day.approved += 1
      if (booking.status === "PENDING") day.pending += 1
      if (booking.status === "REJECTED") day.rejected += 1
    }

    return dayBuckets.map((date) => trendMap.get(getLocalDateKey(date))!)
  }, [activeRange, filteredBookings])

  const statusData = useMemo<StatusDatum[]>(
    () => [
      {
        name: "Approved",
        value: stats.approvedBookings,
        fill: bookingStatusHex.APPROVED,
      },
      {
        name: "Pending",
        value: stats.pendingBookings,
        fill: bookingStatusHex.PENDING,
      },
      {
        name: "Rejected",
        value: stats.rejectedBookings,
        fill: bookingStatusHex.REJECTED,
      },
    ],
    [stats]
  )

  const recentBookings = useMemo(() => filteredBookings.slice(0, 8), [filteredBookings])

  const approvedRevenueLabel = useMemo(() => {
    const approvedRevenue = filteredBookings.reduce((total, booking) => {
      return booking.status === "APPROVED" ? total + (booking.amount ?? 0) : total
    }, 0)

    return formatUsdAmount(approvedRevenue)
  }, [filteredBookings])

  const approvalRate =
    stats.totalBookings > 0 ? Math.round((stats.approvedBookings / stats.totalBookings) * 100) : 0
  const rejectionRate =
    stats.totalBookings > 0 ? Math.round((stats.rejectedBookings / stats.totalBookings) * 100) : 0
  const focusStatus =
    stats.totalBookings > 0
      ? statusData.reduce((highest, item) => (item.value > highest.value ? item : highest), statusData[0])
      : null
  const firstName = userName.split(" ")[0]

  const updateFilters = (next: { range?: RangeValue; segment?: SegmentValue }) => {
    const nextRange = next.range ?? activeRange
    const nextSegment = next.segment ?? activeSegment
    const params = new URLSearchParams(window.location.search)

    if (nextRange === defaultAnalyticsRange) {
      params.delete("range")
    } else {
      params.set("range", String(nextRange))
    }

    if (nextSegment === "all") {
      params.delete("segment")
    } else {
      params.set("segment", nextSegment)
    }

    const query = params.toString()
    startTransition(() => {
      setActiveRange(nextRange)
      setActiveSegment(nextSegment)
      window.history.replaceState(null, "", query ? `?${query}` : window.location.pathname)
    })
  }

  const metricCards = [
    {
      title: "Approved amount",
      value: approvedRevenueLabel,
      description: "Total value from approved bookings in this period",
      icon: DollarSign,
      accent: "text-[#9cc3ff]",
      highlighted: true,
    },
    {
      title: "Total enquiries",
      value: stats.totalBookings.toLocaleString(),
      description: `All booking requests from ${formatAnalyticsRangeLabel(activeRange)}`,
      icon: IconCalendarStats,
      accent: "text-primary",
      highlighted: false,
    },
    {
      title: "Pending action",
      value: stats.pendingBookings.toLocaleString(),
      description: "Requests currently waiting for team follow-up",
      icon: IconClockHour4,
      accent: "text-sky-400",
      highlighted: false,
    },
    {
      title: "Approval rate",
      value: `${approvalRate}%`,
      description: `${stats.approvedBookings} approved and ${rejectionRate}% rejected in this period`,
      icon: IconRosetteDiscountCheck,
      accent: "text-emerald-400",
      highlighted: false,
    },
  ]

  return (
    <section className="@container/main flex flex-col gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Badge variant="outline" className="border-border bg-muted/40 text-foreground">
            Analytics overview
          </Badge>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Booking analytics</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            A cleaner view of demand, conversion, and requests that still need attention. Prepared for {firstName}.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button asChild className="rounded-xl">
            <Link href="/dashboard/admin/packages/new">
              Add package
              <IconArrowUpRight />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="rounded-xl border-border bg-muted/30 text-foreground hover:bg-accent"
          >
            <Link href="/dashboard/admin/destinations/new">
              Add destination
              <IconMap2 />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((card) => (
          <Card
            key={card.title}
            className={
              card.highlighted
                ? "border-[#084ea8]/35 bg-[linear-gradient(180deg,rgba(8,78,168,0.22),rgba(8,78,168,0.08))] shadow-[0_16px_40px_rgba(8,78,168,0.12)]"
                : "border-border bg-card shadow-sm"
            }
          >
            <CardContent className="flex items-start justify-between gap-4 px-5 py-4">
              <div>
                <p
                  className={
                    card.highlighted
                      ? "text-xs uppercase tracking-[0.18em] text-[#b8d3ff]/85"
                      : "text-xs uppercase tracking-[0.18em] text-muted-foreground"
                  }
                >
                  {card.title}
                </p>
                <p className="mt-2 text-2xl font-semibold text-white xl:text-[1.75rem]">{card.value}</p>
                <p className={card.highlighted ? "mt-2 text-sm text-[#d7e6ff]/80" : "mt-2 text-sm text-muted-foreground"}>
                  {card.description}
                </p>
              </div>
              <div
                className={
                  card.highlighted
                    ? "rounded-xl border border-[#4b88d3]/25 bg-[#084ea8]/18 p-2.5"
                    : "rounded-xl border border-border bg-muted/30 p-2.5"
                }
              >
                <card.icon className={`size-5 ${card.accent}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6">
        <ChartAreaInteractive
          data={trendData}
          activeRange={activeRange}
          activeSegment={activeSegment}
          onRangeChange={(value) => updateFilters({ range: value })}
          onSegmentChange={(value) => updateFilters({ segment: value })}
        />

        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="gap-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle className="text-white">Pipeline summary</CardTitle>
                <CardDescription>
                  A quick read of the overall booking mix for {formatAnalyticsRangeLabel(activeRange)}.
                </CardDescription>
              </div>

              <Badge variant="outline" className="border-border bg-muted/40 text-foreground">
                {formatSegmentLabel(activeSegment)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
              <div className="rounded-2xl border border-border bg-muted/30 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Current focus</p>
                    <p className="mt-2 text-lg font-semibold text-white">{formatSegmentLabel(activeSegment)}</p>
                  </div>
                  <IconRouteAltLeft className="size-5 text-sky-400" />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{statusCopy[activeSegment]}</p>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-border bg-background/60 p-3">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Approval</p>
                    <p className="mt-1.5 text-2xl font-semibold text-white">{approvalRate}%</p>
                  </div>
                  <div className="rounded-xl border border-border bg-background/60 p-3">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Approved amount</p>
                    <p className="mt-1.5 text-2xl font-semibold text-white">{approvedRevenueLabel}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-background/60 p-3">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Rejected</p>
                    <p className="mt-1.5 text-2xl font-semibold text-white">{rejectionRate}%</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-muted/30 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Main signal</p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {focusStatus?.name ?? "No data"} leads the current mix
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {focusStatus
                    ? `${focusStatus.value} requests are currently in the ${focusStatus.name.toLowerCase()} stage.`
                    : "No bookings were created in this time range."}
                </p>
                <div className="mt-4 rounded-xl border border-border bg-background/60 p-3">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Period total</p>
                  <p className="mt-1.5 text-2xl font-semibold text-white">{stats.totalBookings}</p>
                  <p className="mt-1 text-sm text-muted-foreground">Counts below always reflect the full selected period.</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Status breakdown</p>
                  <p className="mt-1 text-sm text-muted-foreground">Compact readout of the booking funnel.</p>
                </div>
                <p className="text-sm font-medium text-white">{stats.totalBookings} total</p>
              </div>
              {statusData.map((item) => {
                const share = stats.totalBookings > 0 ? Math.round((item.value / stats.totalBookings) * 100) : 0
                const width = stats.totalBookings > 0 ? Math.max(10, share) : 0

                return (
                  <div key={item.name} className="rounded-2xl border border-border bg-background/60 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="inline-block size-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                          <p className="text-sm font-medium text-white">{item.name}</p>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{item.value} requests</p>
                      </div>
                      <span
                        className="inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold"
                        style={{
                          color: item.fill,
                          backgroundColor: `${item.fill}1f`,
                        }}
                      >
                        {share}%
                      </span>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-muted/60">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${width}%`,
                          backgroundColor: item.fill,
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <DataTable data={recentBookings} activeSegment={activeSegment} activeRange={activeRange} />
    </section>
  )
}
