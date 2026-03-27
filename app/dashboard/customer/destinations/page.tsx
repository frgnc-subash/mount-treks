import DestinationsPage from "@/app/destinations/page";
import { requireRole } from "@/lib/auth";

export default async function CustomerDestinationsPage() {
  await requireRole("CUSTOMER", "/dashboard/customer/destinations");
  return <DestinationsPage embeddedInDashboard />;
}
