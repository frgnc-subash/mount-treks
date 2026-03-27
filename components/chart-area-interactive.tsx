"use client"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  analyticsRangeOptions,
  formatAnalyticsActiveRangeLabel,
  type AnalyticsRangeValue,
} from "@/lib/analytics"

type TrendDatum = {
  label: string
  bookings: number
  approved: number
  pending: number
  rejected: number
}

type RangeValue = AnalyticsRangeValue
type SegmentValue = "all" | "pending" | "approved" | "rejected"

const seriesColors = {
  bookings: "#f59e0b",
  approved: "#22c55e",
  pending: "#38bdf8",
  rejected: "#ef4444",
} as const

const chartConfig = {
  bookings: {
    label: "Requests",
    color: seriesColors.bookings,
  },
  approved: {
    label: "Approved",
    color: seriesColors.approved,
  },
  pending: {
    label: "Pending",
    color: seriesColors.pending,
  },
  rejected: {
    label: "Rejected",
    color: seriesColors.rejected,
  },
} satisfies ChartConfig

const segmentButtonOptions: { value: SegmentValue; label: string; color: string }[] = [
  { value: "all", label: "Requests", color: seriesColors.bookings },
  { value: "approved", label: "Approved", color: seriesColors.approved },
  { value: "pending", label: "Pending", color: seriesColors.pending },
  { value: "rejected", label: "Rejected", color: seriesColors.rejected },
]

export function ChartAreaInteractive({
  data,
  activeRange,
  activeSegment,
  onRangeChange,
  onSegmentChange,
}: {
  data: TrendDatum[]
  activeRange: RangeValue
  activeSegment: SegmentValue
  onRangeChange: (value: RangeValue) => void
  onSegmentChange: (value: SegmentValue) => void
}) {
  const showRequests = activeSegment === "all"
  const showApproved = activeSegment === "all" || activeSegment === "approved"
  const showPending = activeSegment === "all" || activeSegment === "pending"
  const showRejected = activeSegment === "all" || activeSegment === "rejected"

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="gap-4 border-b border-border">
        <div>
          <CardTitle className="text-white">Booking trend</CardTitle>
          <CardDescription>
            Daily booking activity for {formatAnalyticsActiveRangeLabel(activeRange)}. Use the status buttons to narrow
            the trend and recent activity.
          </CardDescription>
        </div>

        <CardAction className="flex w-full flex-col items-stretch gap-3 md:w-auto">
          <ToggleGroup
            type="single"
            value={String(activeRange)}
            onValueChange={(value) => {
              if (!value) return
              onRangeChange(Number(value) as RangeValue)
            }}
            variant="outline"
            className="hidden @[760px]/card:flex"
          >
            {analyticsRangeOptions.map((option) => (
              <ToggleGroupItem key={option.value} value={String(option.value)}>
                {option.shortLabel}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          <div className="@[760px]/card:hidden">
            <Select value={String(activeRange)} onValueChange={(value) => onRangeChange(Number(value) as RangeValue)}>
              <SelectTrigger size="sm" className="w-full rounded-xl border-border bg-card">
                <SelectValue placeholder="Range" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border bg-popover text-popover-foreground">
                {analyticsRangeOptions.map((option) => (
                  <SelectItem key={option.value} value={String(option.value)}>
                    {option.fullLabel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardAction>
      </CardHeader>

      <CardContent className="px-3 pt-5 sm:px-6">
        <div className="mb-4 flex flex-wrap gap-2">
          {segmentButtonOptions.map((option) => {
            const isActive = activeSegment === option.value
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={isActive}
                onClick={() => onSegmentChange(option.value)}
                className={
                  isActive
                    ? "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold text-white transition-colors"
                    : "inline-flex items-center gap-2 rounded-full border border-border bg-muted/20 px-3 py-1.5 text-xs font-medium text-white/85 transition-colors hover:bg-muted/35"
                }
                style={
                  isActive
                    ? {
                        borderColor: `${option.color}66`,
                        backgroundColor: `${option.color}20`,
                      }
                    : undefined
                }
              >
                <span className="inline-block size-3 shrink-0 rounded-full" style={{ backgroundColor: option.color }} />
                {option.label}
              </button>
            )
          })}
        </div>

        <ChartContainer config={chartConfig} className="aspect-auto h-[260px] w-full sm:h-[280px]">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fillBookings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-bookings)" stopOpacity={0.55} />
                <stop offset="95%" stopColor="var(--color-bookings)" stopOpacity={0.06} />
              </linearGradient>
              <linearGradient id="fillApproved" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-approved)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--color-approved)" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="fillPending" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-pending)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--color-pending)" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="fillRejected" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-rejected)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--color-rejected)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={24}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
            {showRequests ? (
              <Area
                dataKey="bookings"
                type="monotone"
                fill="url(#fillBookings)"
                stroke="var(--color-bookings)"
                strokeWidth={2}
              />
            ) : null}
            {showApproved ? (
              <Area
                dataKey="approved"
                type="monotone"
                fill="url(#fillApproved)"
                stroke="var(--color-approved)"
                strokeWidth={2}
              />
            ) : null}
            {showPending ? (
              <Area
                dataKey="pending"
                type="monotone"
                fill="url(#fillPending)"
                stroke="var(--color-pending)"
                strokeWidth={2}
              />
            ) : null}
            {showRejected ? (
              <Area
                dataKey="rejected"
                type="monotone"
                fill="url(#fillRejected)"
                stroke="var(--color-rejected)"
                strokeWidth={2}
              />
            ) : null}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
