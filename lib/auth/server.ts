import type { UserRole } from "@prisma/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  getUserBySessionToken,
  SESSION_COOKIE_NAME,
  type SessionUser,
} from "@/lib/auth/session";
import { dashboardHomeForRole, sanitizeNextPath } from "@/lib/auth/redirect";

export async function getCurrentUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!rawToken) return null;

  return getUserBySessionToken(rawToken);
}

export async function requireUser(redirectTo?: string) {
  const user = await getCurrentUser();

  if (!user) {
    const safeNextPath = redirectTo ? sanitizeNextPath(redirectTo, "/dashboard") : null;
    const nextParam = safeNextPath ? `?next=${encodeURIComponent(safeNextPath)}` : "";
    redirect(`/sign-in${nextParam}`);
  }

  return user;
}

export async function requireRole(role: UserRole, redirectTo?: string) {
  const user = await requireUser(redirectTo);

  if (user.role !== role) {
    redirect(dashboardHomeForRole(user.role));
  }

  return user;
}
