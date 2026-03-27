export type BookingStatusValue = "PENDING" | "APPROVED" | "REJECTED"

export const bookingStatusHex: Record<BookingStatusValue, string> = {
  APPROVED: "#10b981",
  PENDING: "#3b82f6",
  REJECTED: "#ef4444",
}

export function getBookingStatusBadgeClass(status: BookingStatusValue) {
  if (status === "APPROVED") {
    return "border-emerald-500/30 bg-emerald-500/12 text-emerald-300"
  }

  if (status === "PENDING") {
    return "border-sky-500/30 bg-sky-500/12 text-sky-300"
  }

  return "border-rose-500/30 bg-rose-500/12 text-rose-300"
}

export function formatBookingStatusLabel(status: BookingStatusValue) {
  return `${status.slice(0, 1)}${status.slice(1).toLowerCase()}`
}
