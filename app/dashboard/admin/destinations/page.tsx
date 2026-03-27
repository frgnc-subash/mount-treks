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
import { getAllDestinations } from "@/lib/content";

export default async function AdminDestinationsPage() {
  const user = await requireUser("/dashboard/admin/destinations");

  if (user.role !== "ADMIN") {
    redirect("/dashboard/customer");
  }

  const destinations = await getAllDestinations();
  const regionCount = new Set(destinations.map((destination) => destination.region.trim().toLowerCase()))
    .size;
  const avgTrailPoints = destinations.length
    ? Math.round(
        destinations.reduce(
          (sum, destination) => sum + Math.max(destination.trailCoordinates.length, 1),
          0,
        ) / destinations.length,
      )
    : 0;

  return (
    <AdminPage className="max-w-6xl">
      <AdminHeader
        title="Manage Destinations"
        description="Maintain destination pages, region metadata, and map coordinates used across the site."
        actions={
          <>
            <Link
              href="/dashboard/admin/destinations/new"
              className={adminPrimaryButtonClass}
            >
              Add Destination
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
        <AdminStat label="Total Destinations" value={destinations.length} hint="Published or draft destination entries" />
        <AdminStat label="Active Regions" value={regionCount} hint="Unique region categories in catalog" />
        <AdminStat label="Avg Trail Points" value={avgTrailPoints} hint="Coordinate markers per destination" />
        <AdminStat label="Map Quality" value={<span className="text-base">Coordinate accuracy matters</span>} hint="Review lat/lng and map center before publishing" />
      </section>

      <AdminPanel
        title="Destination Library"
        description="Keep descriptions, terrain details, and coordinates consistent for customers and guides."
      >
        {destinations.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-6 text-sm text-muted-foreground">
            No destinations found. Add your first destination to start mapping routes.
          </div>
        ) : (
          <div className="space-y-2.5">
            {destinations.map((destination) => (
              <article
                key={destination.id}
                className="rounded-2xl border border-border bg-muted/30 p-3.5 transition hover:bg-accent"
              >
                <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
                  <div className="min-w-0">
                    <p className="text-[11px] text-muted-foreground">Destination</p>
                    <p className="truncate text-base font-semibold text-white">{destination.name}</p>
                    <span className="mt-2 inline-flex max-w-full rounded-lg border border-border bg-background/50 px-2 py-1 text-xs text-foreground/85">
                      {destination.id}
                    </span>
                  </div>

                  <div className="md:text-right">
                    <Link
                      href={`/dashboard/admin/destinations/${destination.id}`}
                      className="inline-flex items-center justify-center rounded-xl border border-border bg-background/50 px-3 py-1.5 text-xs font-semibold text-foreground whitespace-nowrap transition hover:bg-accent"
                    >
                      Edit Destination
                    </Link>
                  </div>
                </div>

                <div className="mt-3 grid gap-2 border-t border-border pt-2.5 text-sm sm:grid-cols-3">
                  <p className="text-foreground/85">
                    <span className="text-muted-foreground">Region:</span> {destination.region}
                  </p>
                  <p className="text-foreground/85">
                    <span className="text-muted-foreground">Duration:</span> {destination.duration}
                  </p>
                  <p className="text-foreground/85 sm:col-span-3 lg:col-span-1">
                    <span className="text-muted-foreground">Difficulty:</span> {destination.difficulty}
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
