import Link from "next/link";
import { redirect } from "next/navigation";
import { IconBackpack } from "@tabler/icons-react";
import {
  AdminHeader,
  AdminPage,
  AdminPanel,
  adminPrimaryButtonClass,
  adminSecondaryButtonClass,
} from "@/components/dashboard/admin-ui";
import { requireUser } from "@/lib/auth";
import { formatBookingStatusLabel, getBookingStatusBadgeClass } from "@/lib/booking-status";
import { prisma } from "@/lib/db";

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(value);
}

export default async function CustomerDashboardPage() {
  const user = await requireUser("/dashboard/customer");

  if (user.role === "ADMIN") {
    redirect("/dashboard/admin");
  }

  const bookings = await prisma.booking.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 12,
  });
  const pendingCount = bookings.filter((booking) => booking.status === "PENDING").length;
  const approvedCount = bookings.filter((booking) => booking.status === "APPROVED").length;
  const rejectedCount = bookings.filter((booking) => booking.status === "REJECTED").length;

  return (
    <AdminPage className="max-w-6xl">
      <AdminHeader
        eyebrow="Customer"
        title="My Bookings"
        description="Track all your requests, see current statuses, and book your next trek."
        actions={
          <>
            <Link href="/dashboard/customer/new-booking" className={adminPrimaryButtonClass}>
              New Booking
            </Link>
            <Link href="/dashboard/customer/packages" className={adminSecondaryButtonClass}>
              <IconBackpack className="mr-2 inline-block size-4" />
              Packages
            </Link>
          </>
        }
      />

      <AdminPanel
        title="Booking History"
        description={`Signed in as ${user.fullName} (${user.email})`}
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-muted/30 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Total</p>
            <p className="mt-1 text-xl font-semibold text-white">{bookings.length}</p>
          </div>
          <div className="rounded-xl border border-border bg-muted/30 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Approved</p>
            <p className="mt-1 text-xl font-semibold text-emerald-300">{approvedCount}</p>
          </div>
          <div className="rounded-xl border border-border bg-muted/30 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Pending / Rejected</p>
            <p className="mt-1 text-xl font-semibold text-white">
              {pendingCount} / <span className="text-rose-300">{rejectedCount}</span>
            </p>
          </div>
        </div>
        {bookings.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            No booking requests yet. Submit your first one from the booking page.
          </p>
        ) : (
          <>
            <div className="mt-4 space-y-3 md:hidden">
              {bookings.map((booking) => (
                <article key={booking.id} className="rounded-xl border border-border bg-muted/20 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-white">{booking.packageName}</p>
                      <p className="mt-1 truncate text-xs text-muted-foreground">{booking.destination}</p>
                    </div>
                    <span
                      className={`inline-flex shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${getBookingStatusBadgeClass(
                        booking.status,
                      )}`}
                    >
                      {formatBookingStatusLabel(booking.status)}
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-foreground/85">
                    <div>
                      <p className="text-muted-foreground">Start date</p>
                      <p className="mt-1">{formatDate(booking.startDate)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Requested</p>
                      <p className="mt-1">{formatDate(booking.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">People</p>
                      <p className="mt-1">{booking.people}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-4 hidden md:block">
              <table className="w-full table-fixed text-left text-sm">
                <colgroup>
                  <col className="w-[24%]" />
                  <col className="w-[20%]" />
                  <col className="w-[16%]" />
                  <col className="w-[10%]" />
                  <col className="w-[14%]" />
                  <col className="w-[16%]" />
                </colgroup>
              <thead className="text-muted-foreground">
                <tr>
                  <th className="pb-3 font-medium">Package</th>
                  <th className="pb-3 font-medium">Destination</th>
                  <th className="pb-3 font-medium">Start Date</th>
                  <th className="pb-3 font-medium">People</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Requested</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="text-foreground">
                    <td className="py-3 pr-3">
                      <p className="truncate">{booking.packageName}</p>
                    </td>
                    <td className="py-3 pr-3 text-foreground/85">
                      <p className="truncate">{booking.destination}</p>
                    </td>
                    <td className="py-3 text-foreground/85">{formatDate(booking.startDate)}</td>
                    <td className="py-3 text-foreground/85">{booking.people}</td>
                    <td className="py-3">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold ${getBookingStatusBadgeClass(
                          booking.status,
                        )}`}
                      >
                        {formatBookingStatusLabel(booking.status)}
                      </span>
                    </td>
                    <td className="py-3 text-foreground/85">{formatDate(booking.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
          </>
        )}
      </AdminPanel>
    </AdminPage>
  );
}
