export function extractBookingAmount(notes?: string | null) {
  if (!notes) return null

  const match = notes.match(/Total Price:\s*\$?([\d,]+(?:\.\d+)?)/i)
  if (!match) return null

  const amount = Number(match[1].replace(/,/g, ""))
  return Number.isFinite(amount) ? amount : null
}

export function formatUsdAmount(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount)
}
