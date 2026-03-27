const LOCAL_ORIGIN = "http://localhost"
const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/

export function dashboardHomeForRole(role: string) {
  if (role === "ADMIN") return "/dashboard/admin"
  if (role === "CUSTOMER") return "/dashboard/customer"
  return "/dashboard"
}

export function sanitizeNextPath(value: string | null | undefined, fallback = "/dashboard") {
  if (!value) return fallback

  const trimmed = value.trim()

  if (!trimmed.startsWith("/") || trimmed.startsWith("//") || CONTROL_CHARACTERS.test(trimmed)) {
    return fallback
  }

  try {
    const parsed = new URL(trimmed, LOCAL_ORIGIN)

    if (parsed.origin !== LOCAL_ORIGIN) {
      return fallback
    }

    return `${parsed.pathname}${parsed.search}${parsed.hash}`
  } catch {
    return fallback
  }
}
