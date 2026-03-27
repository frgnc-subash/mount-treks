import Link from "next/link";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import {
  AdminHeader,
  AdminPage,
  AdminPanel,
  AdminStat,
  adminPrimaryButtonClass,
  adminSecondaryButtonClass,
} from "@/components/dashboard/admin-ui";
import { getAllPackages } from "@/lib/content";

export default async function AdminPackagesPage() {
  const user = await requireUser("/dashboard/admin/packages");

  if (user.role !== "ADMIN") {
    redirect("/dashboard/customer");
  }

  const packages = await getAllPackages();
  const uniqueDifficultyCount = new Set(packages.map((pkg) => pkg.difficulty.trim().toLowerCase())).size;
  const avgItineraryDays = packages.length
    ? Math.round(
        packages.reduce((sum, pkg) => sum + Math.max(1, pkg.itinerary.length), 0) / packages.length,
      )
    : 0;

  return (
    <AdminPage className="max-w-6xl">
      <AdminHeader
        title="Manage Packages"
        description="Create, review, and maintain trek packages with consistent information for sales and operations."
        actions={
          <>
            <Link
              href="/dashboard/admin/packages/new"
              className={adminPrimaryButtonClass}
            >
              Add Package
            </Link>
            <Link
              href="/dashboard/admin"
              className={adminSecondaryButtonClass}
            >
              Back
            </Link>
          </>
        }
      />

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStat label="Total Packages" value={packages.length} hint="Visible in listings and booking flow" />
        <AdminStat label="Difficulty Profiles" value={uniqueDifficultyCount} hint="Unique difficulty tags in catalog" />
        <AdminStat label="Average Itinerary Days" value={avgItineraryDays} hint="Based on saved day-by-day itinerary lines" />
        <AdminStat label="Quick Action" value={<span className="text-base">Keep IDs slug-safe</span>} hint="Use lowercase and hyphens for package IDs" />
      </section>

      <AdminPanel
        title="Package Library"
        description="Edit package details to keep pricing, itinerary, and difficulty data aligned."
      >
        {packages.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-6 text-sm text-muted-foreground">
            No packages found. Add your first package to start accepting bookings.
          </div>
        ) : (
          <div className="space-y-2.5">
            {packages.map((pkg) => (
              <article
                key={pkg.id}
                className="rounded-2xl border border-border bg-muted/30 p-3.5 transition hover:bg-accent"
              >
                <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
                  <div className="min-w-0">
                    <p className="text-[11px] text-muted-foreground">Package</p>
                    <p className="truncate text-base font-semibold text-white">{pkg.name}</p>
                    <span className="mt-2 inline-flex max-w-full rounded-lg border border-border bg-background/50 px-2 py-1 text-xs text-foreground/85">
                      {pkg.id}
                    </span>
                  </div>

                  <div className="md:text-right">
                    <Link
                      href={`/dashboard/admin/packages/${pkg.id}`}
                      className="inline-flex items-center justify-center rounded-xl border border-border bg-background/50 px-3 py-1.5 text-xs font-semibold text-foreground whitespace-nowrap transition hover:bg-accent"
                    >
                      Edit Package
                    </Link>
                  </div>
                </div>

                <div className="mt-3 grid gap-2 border-t border-border pt-2.5 text-sm sm:grid-cols-3">
                  <p className="text-foreground/85">
                    <span className="text-muted-foreground">Duration:</span> {pkg.duration}
                  </p>
                  <p className="text-foreground/85">
                    <span className="text-muted-foreground">Difficulty:</span> {pkg.difficulty}
                  </p>
                  <p className="text-foreground/85 sm:col-span-3 lg:col-span-1">
                    <span className="text-muted-foreground">Ideal for:</span> {pkg.idealFor}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </AdminPanel>
    </AdminPage>
  );
}
