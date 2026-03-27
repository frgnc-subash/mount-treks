export const analyticsRangeValues = [7, 30, 90] as const
export type AnalyticsRangeValue = (typeof analyticsRangeValues)[number]

export const defaultAnalyticsRange: AnalyticsRangeValue = 7
export const maxAnalyticsRange: AnalyticsRangeValue = 90

export const analyticsRangeOptions: Array<{
  value: AnalyticsRangeValue
  shortLabel: string
  fullLabel: string
}> = [
  { value: 7, shortLabel: "7D", fullLabel: "Last 7 days" },
  { value: 30, shortLabel: "1M", fullLabel: "Last 1 month" },
  { value: 90, shortLabel: "90D", fullLabel: "Last 90 days" },
]

export function parseAnalyticsRange(value?: string): AnalyticsRangeValue {
  const numeric = Number(value)
  if (analyticsRangeValues.includes(numeric as AnalyticsRangeValue)) {
    return numeric as AnalyticsRangeValue
  }
  return defaultAnalyticsRange
}

export function formatAnalyticsRangeLabel(range: AnalyticsRangeValue) {
  if (range === 30) return "the last month"
  return `the last ${range} days`
}

export function formatAnalyticsActiveRangeLabel(range: AnalyticsRangeValue) {
  const selected = analyticsRangeOptions.find((option) => option.value === range)
  return selected?.fullLabel.toLowerCase() ?? "the selected period"
}

export function getLocalDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function formatMediumDate(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(date)
}
