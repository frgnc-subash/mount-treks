import Link from "next/link"
import { redirect } from "next/navigation"

import { AdminCustomers } from "@/components/dashboard/admin-customers"
import { AdminHeader, AdminPage, adminPrimaryButtonClass, adminSecondaryButtonClass } from "@/components/dashboard/admin-ui"
import { extractBookingAmount, formatUsdAmount } from "@/lib/booking-amount"
import { requireUser } from "@/lib/auth"
import { prisma } from "@/lib/db"

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(value)
}

export default async function CustomersPage() {
  const user = await requireUser("/dashboard/admin/customers")

  if (user.role !== "ADMIN") {
    redirect("/dashboard/customer")
  }

  const customersRaw = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      fullName: true,
      email: true,
      country: true,
      phoneNumber: true,
      createdAt: true,
      bookings: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          status: true,
          notes: true,
          createdAt: true,
        },
      },
    },
  })

  const customers = customersRaw.map((customer) => {
    const approvedAmount = customer.bookings.reduce((total, booking) => {
      return booking.status === "APPROVED" ? total + (extractBookingAmount(booking.notes) ?? 0) : total
    }, 0)

    const approvedBookingCount = customer.bookings.filter((booking) => booking.status === "APPROVED").length

    return {
      id: customer.id,
      fullName: customer.fullName,
      email: customer.email,
      country: customer.country,
      phoneNumber: customer.phoneNumber,
      createdAtLabel: formatDate(customer.createdAt),
      bookingCount: customer.bookings.length,
      approvedBookingCount,
      approvedAmount,
      latestBookingStatus: customer.bookings[0]?.status ?? null,
      latestBookingId: customer.bookings[0]?.id ?? null,
      latestBookingAmount: extractBookingAmount(customer.bookings[0]?.notes) ?? 0,
    }
  })

  return (
    <AdminPage className="max-w-7xl">
      <AdminHeader
        title="Bookings"
        description="Review booking activity, traveller details, and approval decisions from one place."
        actions={
          <>
            <Link href="/dashboard/admin/managers" className={adminSecondaryButtonClass}>
              Managers
            </Link>
            <Link href="/dashboard/admin" className={adminPrimaryButtonClass}>
              Back to Overview
            </Link>
          </>
        }
      />

      <AdminCustomers customers={customers} />
    </AdminPage>
  )
}
