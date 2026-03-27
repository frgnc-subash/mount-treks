import type { ReactNode } from "react";
import { requireRole } from "@/lib/auth";

export default async function CustomerRoutesLayout({ children }: { children: ReactNode }) {
  await requireRole("CUSTOMER", "/dashboard/customer");
  return children;
}
