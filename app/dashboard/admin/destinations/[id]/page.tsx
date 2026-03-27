import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import {
  AdminCallout,
  AdminHeader,
  AdminPage,
  AdminPanel,
  adminCodeTextareaClass,
  adminInputClass,
  adminNumberInputClass,
  adminPrimaryButtonClass,
  adminReadonlyInputClass,
  adminSecondaryButtonClass,
  adminStickyActionsClass,
  adminTextareaClass,
} from "@/components/dashboard/admin-ui";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { upsertDestination } from "@/lib/admin-content";
import { getDestinationById } from "@/lib/content";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditDestinationPage({ params }: PageProps) {
  const user = await requireUser("/dashboard/admin/destinations");

  if (user.role !== "ADMIN") {
    redirect("/dashboard/customer");
  }

  const { id } = await params;
  const destination = await getDestinationById(id);

  if (!destination) {
    notFound();
  }

  async function saveDestination(formData: FormData) {
    "use server";

    const currentUser = await requireUser(`/dashboard/admin/destinations/${id}`);

    if (currentUser.role !== "ADMIN") {
      redirect("/dashboard/customer");
    }

    await upsertDestination({
      id,
      name: String(formData.get("name") ?? ""),
      image: String(formData.get("image") ?? ""),
      region: String(formData.get("region") ?? ""),
      duration: String(formData.get("duration") ?? ""),
      elevation: String(formData.get("elevation") ?? ""),
      lat: Number(formData.get("lat") ?? 0),
      lng: Number(formData.get("lng") ?? 0),
      desc: String(formData.get("desc") ?? ""),
      difficulty: String(formData.get("difficulty") ?? ""),
      bestSeason: String(formData.get("bestSeason") ?? ""),
      permits: String(formData.get("permits") ?? ""),
      mapCenterLat: Number(formData.get("mapCenterLat") ?? 0),
      mapCenterLng: Number(formData.get("mapCenterLng") ?? 0),
      mapZoom: Number(formData.get("mapZoom") ?? 9),
      trailLines: String(formData.get("trailLines") ?? ""),
    });

    revalidatePath("/destinations");
    revalidatePath(`/destinations/${id}`);
    revalidatePath("/dashboard/admin/destinations");
    revalidatePath("/booking");
    redirect("/dashboard/admin/destinations");
  }

  const trailLines = destination.trailCoordinates
    .map((point) => `${point.name}|${point.pos[0]}|${point.pos[1]}`)
    .join("\n");

  return (
    <AdminPage className="max-w-6xl">
      <AdminHeader
        title="Edit Destination"
        description="Maintain destination content and coordinates used in route maps and booking pages."
        actions={
          <Link
            href="/dashboard/admin/destinations"
            className={adminSecondaryButtonClass}
          >
            Back
          </Link>
        }
      />

      <form action={saveDestination} className="space-y-4">
        <AdminPanel title="Destination Basics" description={destination.id}>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <label className="text-sm">
              <span className="mb-1.5 block text-muted-foreground">Destination ID</span>
              <Input value={destination.id} readOnly className={adminReadonlyInputClass} />
            </label>
            <label className="text-sm">
              <span className="mb-1.5 block text-muted-foreground">Name</span>
              <Input name="name" defaultValue={destination.name} required className={adminInputClass} />
            </label>
            <label className="text-sm">
              <span className="mb-1.5 block text-muted-foreground">Image Path</span>
              <Input name="image" defaultValue={destination.image} required className={adminInputClass} />
            </label>
            <label className="text-sm">
              <span className="mb-1.5 block text-muted-foreground">Region</span>
              <Input name="region" defaultValue={destination.region} required className={adminInputClass} />
            </label>
            <label className="text-sm">
              <span className="mb-1.5 block text-muted-foreground">Duration</span>
              <Input name="duration" defaultValue={destination.duration} required className={adminInputClass} />
            </label>
            <label className="text-sm">
              <span className="mb-1.5 block text-muted-foreground">Elevation</span>
              <Input name="elevation" defaultValue={destination.elevation} required className={adminInputClass} />
            </label>
            <label className="text-sm">
              <span className="mb-1.5 block text-muted-foreground">Difficulty</span>
              <Input
                name="difficulty"
                defaultValue={destination.difficulty}
                required
                className={adminNumberInputClass}
              />
            </label>
            <label className="text-sm">
              <span className="mb-1.5 block text-muted-foreground">Best Season</span>
              <Input name="bestSeason" defaultValue={destination.bestSeason} required className={adminInputClass} />
            </label>
            <label className="text-sm">
              <span className="mb-1.5 block text-muted-foreground">Permits</span>
              <Input name="permits" defaultValue={destination.permits} required className={adminInputClass} />
            </label>
          </div>
        </AdminPanel>

        <AdminPanel title="Map Coordinates" description="Verify map center and route points before saving.">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <label className="text-sm">
              <span className="mb-1.5 block text-muted-foreground">Latitude</span>
              <Input
                name="lat"
                defaultValue={destination.lat}
                type="number"
                step="any"
                required
                className={adminNumberInputClass}
              />
            </label>
            <label className="text-sm">
              <span className="mb-1.5 block text-muted-foreground">Longitude</span>
              <Input
                name="lng"
                defaultValue={destination.lng}
                type="number"
                step="any"
                required
                className={adminNumberInputClass}
              />
            </label>
            <label className="text-sm">
              <span className="mb-1.5 block text-muted-foreground">Map Zoom</span>
              <Input
                name="mapZoom"
                defaultValue={destination.mapZoom}
                type="number"
                required
                className={adminNumberInputClass}
              />
            </label>
            <label className="text-sm">
              <span className="mb-1.5 block text-muted-foreground">Map Center Lat</span>
              <Input
                name="mapCenterLat"
                defaultValue={destination.mapCenter[0]}
                type="number"
                step="any"
                required
                className={adminNumberInputClass}
              />
            </label>
            <label className="text-sm">
              <span className="mb-1.5 block text-muted-foreground">Map Center Lng</span>
              <Input
                name="mapCenterLng"
                defaultValue={destination.mapCenter[1]}
                type="number"
                step="any"
                required
                className={adminInputClass}
              />
            </label>
          </div>

          <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1fr)_320px]">
            <label className="block text-sm">
              <span className="mb-1.5 block text-muted-foreground">Destination Description</span>
              <Textarea
                name="desc"
                defaultValue={destination.desc}
                required
                rows={7}
                placeholder="Describe the landscape, cultural character, route profile, and what type of trekker this destination suits."
                className={adminTextareaClass}
              />
              <p className="mt-1.5 text-xs text-muted-foreground">
                Use short paragraphs for readability. This text is shown prominently on destination detail pages.
              </p>
            </label>

            <div className="space-y-3">
              <AdminCallout
                title="Description Focus"
                description="Mention terrain style, highlights, altitude feel, and expected daily effort."
              />
              <AdminCallout
                tone="amber"
                title="Formatting"
                description="Line breaks are preserved, so separate different ideas into 2-4 short paragraphs."
              />
            </div>
          </div>
        </AdminPanel>

        <AdminPanel title="Trail Route" description="Format each waypoint as Name|lat|lng.">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_320px]">
            <label className="block text-sm">
              <span className="mb-1.5 block text-muted-foreground">Trail Points</span>
              <Textarea
                name="trailLines"
                defaultValue={trailLines}
                required
                rows={10}
                className={adminCodeTextareaClass}
              />
              <p className="mt-1.5 text-xs text-muted-foreground">
                Keep waypoint names clear and coordinate precision consistent for map rendering.
              </p>
            </label>

            <div className="space-y-3">
              <AdminCallout
                title="Route Format"
                description="Each line must follow Name|lat|lng, with no extra separators."
              >
                <pre className="overflow-x-auto rounded-xl border border-border bg-background/70 p-2.5 text-[11px] text-foreground/85">
{`Kagbeni|28.841|83.771
Chele|28.892|83.824
Lo Manthang|29.188|83.964`}
                </pre>
              </AdminCallout>
              <AdminCallout
                tone="emerald"
                title="Mapping Tip"
                description="Arrange waypoints in actual trail order to keep polyline paths and map flow accurate."
              />
            </div>
          </div>
        </AdminPanel>

        <div className={adminStickyActionsClass}>
          <Link
            href="/dashboard/admin/destinations"
            className={adminSecondaryButtonClass}
          >
            Cancel
          </Link>
          <button type="submit" className={adminPrimaryButtonClass}>
            Update Destination
          </button>
        </div>
      </form>
    </AdminPage>
  );
}
