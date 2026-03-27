"use client"

import { IconCalendarEvent, IconMapPin, IconUsers } from "@tabler/icons-react"

import { formatAnalyticsRangeLabel, formatMediumDate, type AnalyticsRangeValue } from "@/lib/analytics"
import { formatBookingStatusLabel, getBookingStatusBadgeClass } from "@/lib/booking-status"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type RecentBooking = {
  id: string
  customerName: string
  customerEmail: string
  packageName: string
  destination: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  createdAt: string
  startDateLabel: string
  people: number
  amountLabel: string | null
}

function formatSegmentLabel(segment: "all" | "pending" | "approved" | "rejected") {
  if (segment === "all") return "All statuses"
  return `${segment.slice(0, 1).toUpperCase()}${segment.slice(1)} only`
}

export function DataTable({
  data,
  activeSegment,
  activeRange,
}: {
  data: RecentBooking[]
  activeSegment: "all" | "pending" | "approved" | "rejected"
  activeRange: AnalyticsRangeValue
}) {
  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="gap-3 border-b border-border">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-white">Recent enquiries</CardTitle>
            <CardDescription>
              Latest booking requests from {formatAnalyticsRangeLabel(activeRange)}. The list follows the selected
              status filter.
            </CardDescription>
          </div>

          <Badge variant="outline" className="w-fit border-border bg-muted/40 text-foreground">
            {formatSegmentLabel(activeSegment)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="px-0 py-0">
        {data.length === 0 ? (
          <div className="m-4 rounded-2xl border border-dashed border-border bg-muted/20 p-10 text-center sm:m-6">
            <p className="text-base font-medium text-white">No enquiries in this view</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try another status filter or widen the date range above the chart.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[880px]">
              <div className="grid grid-cols-[minmax(0,1.3fr)_minmax(180px,1.1fr)_140px_120px_140px_80px_140px] gap-4 border-b border-border px-4 py-3 text-[11px] uppercase tracking-[0.18em] text-muted-foreground sm:px-6">
                <div>Traveller</div>
                <div>Trek</div>
                <div>Status</div>
                <div>Amount</div>
                <div>Start</div>
                <div>Size</div>
                <div>Requested</div>
              </div>

              {data.map((booking) => (
                <article
                  key={booking.id}
                  className="grid grid-cols-[minmax(0,1.3fr)_minmax(180px,1.1fr)_140px_120px_140px_80px_140px] gap-4 border-b border-border/80 px-4 py-4 transition-colors hover:bg-muted/20 sm:px-6"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-white">{booking.customerName}</div>
                    <div className="mt-1 truncate text-xs text-muted-foreground">{booking.customerEmail}</div>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-sm text-foreground/90">
                      <IconMapPin className="size-4 shrink-0 text-muted-foreground" />
                      <span className="truncate">{booking.packageName}</span>
                    </div>
                    <div className="mt-1 truncate text-xs text-muted-foreground">{booking.destination}</div>
                  </div>

                  <div className="flex items-center">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold ${getBookingStatusBadgeClass(booking.status)}`}
                    >
                      {formatBookingStatusLabel(booking.status)}
                    </span>
                  </div>

                  <div className="flex items-center text-sm font-medium text-white">
                    {booking.amountLabel ?? "—"}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-foreground/85">
                    <IconCalendarEvent className="size-4 shrink-0 text-muted-foreground" />
                    <span>{booking.startDateLabel}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-foreground/85">
                    <IconUsers className="size-4 shrink-0 text-muted-foreground" />
                    <span>{booking.people}</span>
                  </div>

                  <div className="flex items-center">
                    <Badge variant="outline" className="border-border bg-background/70 text-muted-foreground">
                      {formatMediumDate(booking.createdAt)}
                    </Badge>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
