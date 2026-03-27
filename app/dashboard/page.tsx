import { redirect } from "next/navigation"

import { requireUser } from "@/lib/auth"
import { dashboardHomeForRole } from "@/lib/auth/redirect"

export default async function DashboardEntryPage() {
  const user = await requireUser("/dashboard")
  redirect(dashboardHomeForRole(user.role))
}
