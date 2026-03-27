import BookingPage from "@/app/booking/page";
import { requireRole } from "@/lib/auth";

export default async function CustomerNewBookingPage() {
  await requireRole("CUSTOMER", "/dashboard/customer/new-booking");
  return <BookingPage embeddedInDashboard />;
}
