"use client"

import { useDeferredValue, useMemo, useState } from "react"
import { Search } from "lucide-react"

import { formatUsdAmount } from "@/lib/booking-amount"
import { formatBookingStatusLabel, getBookingStatusBadgeClass } from "@/lib/booking-status"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AdminPanel, AdminStat, adminSubtleSurfaceClass } from "@/components/dashboard/admin-ui"

type CustomerRow = {
  id: string
  fullName: string
  email: string
  country: string | null
  phoneNumber: string | null
  createdAtLabel: string
  bookingCount: number
  approvedBookingCount: number
  approvedAmount: number
  latestBookingStatus: "PENDING" | "APPROVED" | "REJECTED" | null
  latestBookingId: string | null
  latestBookingAmount: number
  bookings: Array<{
    id: string
    packageName: string
    status: "PENDING" | "APPROVED" | "REJECTED"
    createdAtLabel: string
    amount: number
  }>
}

function getRowTheme(status: CustomerRow["latestBookingStatus"]) {
  if (status === "APPROVED") {
    return {
      shell:
        "border-emerald-400/28 bg-[radial-gradient(95%_180%_at_0%_0%,rgba(16,185,129,0.14),rgba(11,11,11,0.96)_42%,rgba(8,8,8,0.98)_100%)] shadow-[0_18px_40px_rgba(16,185,129,0.1)]",
      chip: "border-emerald-400/30 bg-emerald-500/10 text-emerald-200",
      stat: "border-emerald-400/20 bg-emerald-500/[0.06]",
      action: "border-emerald-400/24 bg-black/45",
    } as const
  }

  if (status === "REJECTED") {
    return {
      shell:
        "border-rose-400/26 bg-[radial-gradient(95%_180%_at_0%_0%,rgba(244,63,94,0.14),rgba(11,11,11,0.96)_42%,rgba(8,8,8,0.98)_100%)] shadow-[0_18px_40px_rgba(244,63,94,0.09)]",
      chip: "border-rose-400/30 bg-rose-500/10 text-rose-200",
      stat: "border-rose-400/20 bg-rose-500/[0.05]",
      action: "border-rose-400/22 bg-black/45",
    } as const
  }

  if (status === "PENDING") {
    return {
      shell:
        "border-sky-400/26 bg-[radial-gradient(95%_180%_at_0%_0%,rgba(56,189,248,0.14),rgba(11,11,11,0.96)_42%,rgba(8,8,8,0.98)_100%)] shadow-[0_18px_40px_rgba(56,189,248,0.08)]",
      chip: "border-sky-400/30 bg-sky-500/10 text-sky-200",
      stat: "border-sky-400/20 bg-sky-500/[0.05]",
      action: "border-sky-400/22 bg-black/45",
    } as const
  }

  return {
    shell:
      "border-border bg-[radial-gradient(110%_180%_at_0%_0%,rgba(255,255,255,0.04),rgba(11,11,11,0.96)_45%,rgba(8,8,8,0.98)_100%)] shadow-[0_16px_36px_rgba(0,0,0,0.35)]",
    chip: "border-border bg-muted/20 text-muted-foreground",
    stat: "border-border/80 bg-background/60",
    action: "border-border/80 bg-black/45",
  } as const
}

function getStatusSummary(status: CustomerRow["latestBookingStatus"]) {
  if (status === "APPROVED") return "Latest booking is confirmed."
  if (status === "REJECTED") return "Latest booking was declined."
  if (status === "PENDING") return "Latest booking is waiting for review."
  return "No booking history yet."
}

function deriveBookingMetrics(bookings: CustomerRow["bookings"]) {
  const approvedBookingCount = bookings.filter((booking) => booking.status === "APPROVED").length
  const approvedAmount = bookings.reduce(
    (total, booking) => total + (booking.status === "APPROVED" ? booking.amount : 0),
    0
  )

  return {
    bookingCount: bookings.length,
    approvedBookingCount,
    approvedAmount,
    latestBookingStatus: bookings[0]?.status ?? null,
    latestBookingId: bookings[0]?.id ?? null,
    latestBookingAmount: bookings[0]?.amount ?? 0,
  }
}

export function AdminCustomers({
  customers,
}: {
  customers: CustomerRow[]
}) {
  const [rows, setRows] = useState(customers)
  const [query, setQuery] = useState("")
  const [pendingBookingId, setPendingBookingId] = useState<string | null>(null)
  const deferredQuery = useDeferredValue(query)
  const normalizedQuery = deferredQuery.trim().toLowerCase()

  const filteredCustomers = useMemo(() => {
    if (!normalizedQuery) return rows

    return rows.filter((customer) =>
      [
        customer.fullName,
        customer.email,
        customer.country ?? "",
        customer.phoneNumber ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)
    )
  }, [rows, normalizedQuery])

  const activeBookers = rows.filter((customer) => customer.bookingCount > 0).length
  const customersWithApprovals = rows.filter((customer) => customer.approvedBookingCount > 0).length

  const updateBookingStatus = async (
    customerId: string,
    bookingId: string,
    nextStatus: "APPROVED" | "REJECTED"
  ) => {
    setPendingBookingId(bookingId)

    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: nextStatus,
        }),
      })

      if (!response.ok) {
        return
      }

      setRows((currentRows) =>
        currentRows.map((row) => {
          if (row.id !== customerId) return row

          const bookings = row.bookings.map((booking) =>
            booking.id === bookingId ? { ...booking, status: nextStatus } : booking
          )
          const metrics = deriveBookingMetrics(bookings)

          return {
            ...row,
            bookings,
            ...metrics,
          }
        })
      )
    } finally {
      setPendingBookingId(null)
    }
  }

  return (
    <>
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStat label="Customers" value={rows.length} hint="Registered traveller accounts" />
        <AdminStat label="Active bookers" value={activeBookers} hint="Customers with at least one booking" />
        <AdminStat label="Approved customers" value={customersWithApprovals} hint="Customers with confirmed requests" />
        <AdminStat
          label="Search scope"
          value={<span className="text-lg">{filteredCustomers.length}</span>}
          hint={normalizedQuery ? `Matching “${deferredQuery}”` : "All customer records"}
        />
      </section>

      <AdminPanel
        title="Booking Directory"
        description="Review traveller booking activity, approval value, and decisions from one searchable list."
        action={
          <div className="w-full sm:max-w-sm">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by name, email, country, or phone"
                className="h-11 rounded-xl border-border bg-background/70 pl-9 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                aria-label="Search customers"
              />
            </div>
          </div>
        }
      >
        {filteredCustomers.length === 0 ? (
          <div className={`${adminSubtleSurfaceClass} p-8 text-center`}>
            <p className="text-base font-medium text-white">No customers match this search</p>
            <p className="mt-2 text-sm text-muted-foreground">Try a name, email, country, or phone number.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredCustomers.map((customer) => {
              const tone = getRowTheme(customer.latestBookingStatus)

              return (
                <article
                  key={customer.id}
                  className={`rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_46px_rgba(0,0,0,0.42)] sm:p-5 ${tone.shell}`}
                >
                  <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_250px] xl:items-start">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <p className="truncate text-base font-semibold text-white">{customer.fullName}</p>
                        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] ${tone.chip}`}>
                          {customer.country ?? "Unknown"}
                        </span>
                      </div>
                      <p className="mt-1 truncate text-sm text-muted-foreground">{customer.email}</p>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <span className={`rounded-md border px-2.5 py-1 ${tone.stat}`}>
                          Joined {customer.createdAtLabel}
                        </span>
                        {customer.phoneNumber ? (
                          <span className={`rounded-md border px-2.5 py-1 ${tone.stat}`}>
                            {customer.phoneNumber}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
                      <div className={`rounded-xl border p-3 ${tone.stat}`}>
                        <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Bookings</p>
                        <p className="mt-1 text-lg font-semibold text-white">{customer.bookingCount}</p>
                        <p className="text-xs text-muted-foreground">Total requests</p>
                      </div>
                      <div className={`rounded-xl border p-3 ${tone.stat}`}>
                        <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Confirmed</p>
                        <p className="mt-1 text-lg font-semibold text-white">{customer.approvedBookingCount}</p>
                        <p className="text-xs text-muted-foreground">Approved trips</p>
                      </div>
                      <div className={`rounded-xl border p-3 sm:col-span-2 xl:col-span-1 ${tone.stat}`}>
                        <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Approved value</p>
                        <p className="mt-1 text-lg font-semibold text-white">{formatUsdAmount(customer.approvedAmount)}</p>
                      </div>
                    </div>

                    <div className={`rounded-xl border p-3 ${tone.action}`}>
                      <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Requests</p>
                      <div className="mt-2">
                        {customer.latestBookingStatus ? (
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold ${getBookingStatusBadgeClass(
                              customer.latestBookingStatus
                            )}`}
                          >
                            {formatBookingStatusLabel(customer.latestBookingStatus)}
                          </span>
                        ) : (
                          <Badge variant="outline" className="border-border bg-background/70 text-muted-foreground">
                            No bookings
                          </Badge>
                        )}
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">{getStatusSummary(customer.latestBookingStatus)}</p>

                      <div className="mt-3 space-y-2">
                        {customer.bookings.length ? (
                          customer.bookings.map((booking, index) => (
                            <div
                              key={booking.id}
                              className="rounded-lg border border-white/8 bg-black/30 p-3"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div>
                                  <p className="text-sm font-medium text-white">
                                    Request {index + 1}: {booking.packageName}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {booking.createdAtLabel}
                                    {booking.amount > 0 ? ` • ${formatUsdAmount(booking.amount)}` : ""}
                                  </p>
                                </div>
                                <span
                                  className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold ${getBookingStatusBadgeClass(
                                    booking.status
                                  )}`}
                                >
                                  {formatBookingStatusLabel(booking.status)}
                                </span>
                              </div>

                              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  disabled={pendingBookingId === booking.id || booking.status === "APPROVED"}
                                  className="h-9 rounded-lg border-emerald-500/26 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/18"
                                  onClick={() =>
                                    updateBookingStatus(customer.id, booking.id, "APPROVED")
                                  }
                                >
                                  Approve
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  disabled={pendingBookingId === booking.id || booking.status === "REJECTED"}
                                  className="h-9 rounded-lg border-rose-500/26 bg-rose-500/10 text-rose-200 hover:bg-rose-500/18"
                                  onClick={() =>
                                    updateBookingStatus(customer.id, booking.id, "REJECTED")
                                  }
                                >
                                  Reject
                                </Button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <span className="inline-flex items-center text-xs text-muted-foreground">
                            No action available
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              )})}
          </div>
        )}
      </AdminPanel>
    </>
  )
}
