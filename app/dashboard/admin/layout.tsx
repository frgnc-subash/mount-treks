import type { ReactNode } from "react";
import { requireRole } from "@/lib/auth";

export default async function AdminRoutesLayout({ children }: { children: ReactNode }) {
  await requireRole("ADMIN", "/dashboard/admin");
  return children;
}
