import { BookingStatus } from "@prisma/client";
import { redirect } from "next/navigation";
import AdminAnalyticsClient from "@/components/dashboard/admin-analytics-client";
import {
  maxAnalyticsRange,
  parseAnalyticsRange,
} from "@/lib/analytics";
import { extractBookingAmount, formatUsdAmount } from "@/lib/booking-amount";
import { requireUser } from "@/lib/auth";
import { formatBookingStatusLabel } from "@/lib/booking-status";
import { prisma } from "@/lib/db";

type SegmentValue = "all" | "pending" | "approved" | "rejected";

interface PageProps {
  searchParams: Promise<{
    range?: string;
    segment?: string;
  }>;
}

function parseSegment(value?: string): SegmentValue {
  if (value === "pending" || value === "approved" || value === "rejected") {
    return value;
  }
  return "all";
}

function formatDateLabel(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(value);
}

export default async function AdminDashboardPage({ searchParams }: PageProps) {
  const user = await requireUser("/dashboard/admin");

  if (user.role !== "ADMIN") {
    redirect("/dashboard/customer");
  }

  const query = await searchParams;
  const rangeDays = parseAnalyticsRange(query.range);
  const segment = parseSegment(query.segment);
  const ninetyDayStart = new Date();
  ninetyDayStart.setDate(ninetyDayStart.getDate() - (maxAnalyticsRange - 1));
  ninetyDayStart.setHours(0, 0, 0, 0);

  const [
    recentBookingsRaw,
  ] = await Promise.all([
    prisma.booking.findMany({
      where: {
        createdAt: {
          gte: ninetyDayStart,
        },
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        destination: true,
        packageName: true,
        startDate: true,
        people: true,
        status: true,
        createdAt: true,
        notes: true,
        user: {
          select: {
            fullName: true,
            email: true,
          },
        },
      },
    }),
  ]);

  const bookings = recentBookingsRaw.map((booking) => ({
    id: booking.id,
    customerName: booking.user.fullName,
    customerEmail: booking.user.email,
    packageName: booking.packageName,
    destination: booking.destination,
    status: booking.status,
    statusLabel: formatBookingStatusLabel(booking.status),
    createdAt: booking.createdAt.toISOString(),
    startDate: booking.startDate.toISOString(),
    startDateLabel: formatDateLabel(booking.startDate),
    people: booking.people,
    amount: extractBookingAmount(booking.notes),
    amountLabel:
      booking.status === BookingStatus.APPROVED
        ? (() => {
            const amount = extractBookingAmount(booking.notes)
            return amount !== null ? formatUsdAmount(amount) : null
          })()
        : null,
  }));

  return (
    <AdminAnalyticsClient
      userName={user.fullName}
      activeRange={rangeDays}
      activeSegment={segment}
      bookings={bookings}
    />
  );
}
