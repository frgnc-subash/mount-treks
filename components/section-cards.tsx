import {
  IconClockHour4,
  IconMountain,
  IconRosetteDiscountCheck,
  IconUsersGroup,
} from "@tabler/icons-react"

import { formatAnalyticsRangeLabel, type AnalyticsRangeValue } from "@/lib/analytics"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type DashboardStats = {
  totalUsers: number
  totalCustomers: number
  totalBookings: number
  pendingBookings: number
  approvedBookings: number
}

function formatPercent(value: number) {
  return `${Math.round(value)}%`
}

export function SectionCards({
  stats,
  activeRange,
}: {
  stats: DashboardStats
  activeRange: AnalyticsRangeValue
}) {
  const approvalRate =
    stats.totalBookings > 0 ? (stats.approvedBookings / stats.totalBookings) * 100 : 0
  const pendingRate =
    stats.totalBookings > 0 ? (stats.pendingBookings / stats.totalBookings) * 100 : 0

  const cards = [
    {
      title: "Trip enquiries",
      value: stats.totalBookings.toLocaleString(),
      description: `Filtered for ${formatAnalyticsRangeLabel(activeRange)}`,
      badge: `${stats.approvedBookings} approved`,
      trend: "Latest demand across all active packages",
      icon: IconMountain,
    },
    {
      title: "Customer accounts",
      value: stats.totalCustomers.toLocaleString(),
      description: "Registered travellers in the system",
      badge: `${stats.totalUsers.toLocaleString()} total users`,
      trend: "Sales and support visibility starts here",
      icon: IconUsersGroup,
    },
    {
      title: "Approval rate",
      value: formatPercent(approvalRate),
      description: "Approved against filtered requests",
      badge: `${stats.approvedBookings} confirmed`,
      trend: "Useful for measuring conversion quality",
      icon: IconRosetteDiscountCheck,
    },
    {
      title: "Follow-up queue",
      value: stats.pendingBookings.toLocaleString(),
      description: "Requests still awaiting action",
      badge: formatPercent(pendingRate),
      trend: "Prioritize these leads before they cool off",
      icon: IconClockHour4,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {cards.map((card) => (
        <Card
          key={card.title}
          className="border-border bg-card shadow-sm"
        >
          <CardHeader>
            <CardDescription>{card.title}</CardDescription>
            <CardTitle className="text-2xl font-semibold text-white tabular-nums @[250px]/card:text-3xl">
              {card.value}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="gap-1 border-border bg-muted/40 text-foreground">
                <card.icon className="size-3.5" />
                {card.badge}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="font-medium text-foreground/90">{card.description}</div>
            <div className="text-muted-foreground">{card.trend}</div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
