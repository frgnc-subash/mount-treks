import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";

interface BookingAliasPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CustomerBookingAliasPage({ searchParams }: BookingAliasPageProps) {
  await requireRole("CUSTOMER", "/dashboard/customer/booking");

  const query = await searchParams;
  const queryParams = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (typeof value === "string") {
      queryParams.set(key, value);
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((entry) => queryParams.append(key, entry));
    }
  });

  const queryString = queryParams.toString();
  redirect(
    queryString ? `/dashboard/customer/new-booking?${queryString}` : "/dashboard/customer/new-booking",
  );
}
