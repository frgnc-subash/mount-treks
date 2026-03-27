import PackagesPage from "@/app/packages/page";
import { requireRole } from "@/lib/auth";

export default async function CustomerPackagesPage() {
  await requireRole("CUSTOMER", "/dashboard/customer/packages");
  return <PackagesPage embeddedInDashboard />;
}
