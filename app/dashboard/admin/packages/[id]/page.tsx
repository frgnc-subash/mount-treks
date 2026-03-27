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
  adminPrimaryButtonClass,
  adminReadonlyInputClass,
  adminSecondaryButtonClass,
  adminStickyActionsClass,
  adminTextareaClass,
} from "@/components/dashboard/admin-ui";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { upsertPackage } from "@/lib/admin-content";
import { getPackageById } from "@/lib/content";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPackagePage({ params }: PageProps) {
  const user = await requireUser("/dashboard/admin/packages");

  if (user.role !== "ADMIN") {
    redirect("/dashboard/customer");
  }

  const { id } = await params;
  const item = await getPackageById(id);

  if (!item) {
    notFound();
  }

  async function savePackage(formData: FormData) {
    "use server";

    const currentUser = await requireUser(`/dashboard/admin/packages/${id}`);

    if (currentUser.role !== "ADMIN") {
      redirect("/dashboard/customer");
    }

    await upsertPackage({
      id,
      name: String(formData.get("name") ?? ""),
      image: String(formData.get("image") ?? ""),
      duration: String(formData.get("duration") ?? ""),
      altitude: String(formData.get("altitude") ?? ""),
      difficulty: String(formData.get("difficulty") ?? ""),
      idealFor: String(formData.get("idealFor") ?? ""),
      summary: String(formData.get("summary") ?? ""),
      pricingLines: String(formData.get("pricingLines") ?? ""),
      itineraryLines: String(formData.get("itineraryLines") ?? ""),
      includesLines: String(formData.get("includesLines") ?? ""),
      excludesLines: String(formData.get("excludesLines") ?? ""),
    });

    revalidatePath("/packages");
    revalidatePath("/");
    revalidatePath(`/packages/${id}`);
    revalidatePath("/dashboard/admin/packages");
    revalidatePath("/booking");
    redirect("/dashboard/admin/packages");
  }

  const pricingLines = item.pricing
    .map((entry: { label: string; price: string }) => `${entry.label}|${entry.price}`)
    .join("\n");

  return (
    <AdminPage className="max-w-5xl">
      <AdminHeader
        title="Edit Package"
        description="Update package details safely. Changes are reflected in both listing and booking pages."
        actions={
          <Link
            href="/dashboard/admin/packages"
            className={adminSecondaryButtonClass}
          >
            Back
          </Link>
        }
      />

      <form action={savePackage} className="space-y-4">
        <AdminPanel title="Core Package Details" description={item.id}>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm">
              <span className="mb-1.5 block text-muted-foreground">Package ID</span>
              <Input value={item.id} readOnly className={adminReadonlyInputClass} />
            </label>
            <label className="text-sm">
              <span className="mb-1.5 block text-muted-foreground">Name</span>
              <Input name="name" defaultValue={item.name} required className={adminInputClass} />
            </label>
            <label className="text-sm">
              <span className="mb-1.5 block text-muted-foreground">Image Path (optional)</span>
              <Input
                name="image"
                defaultValue={item.image ?? ""}
                placeholder="/gallery/image8.jpeg"
                className={adminInputClass}
              />
            </label>
            <label className="text-sm">
              <span className="mb-1.5 block text-muted-foreground">Duration</span>
              <Input name="duration" defaultValue={item.duration} required className={adminInputClass} />
            </label>
            <label className="text-sm">
              <span className="mb-1.5 block text-muted-foreground">Altitude</span>
              <Input name="altitude" defaultValue={item.altitude} required className={adminInputClass} />
            </label>
            <label className="text-sm">
              <span className="mb-1.5 block text-muted-foreground">Difficulty</span>
              <Input name="difficulty" defaultValue={item.difficulty} required className={adminInputClass} />
            </label>
          </div>

          <label className="mt-3 block text-sm">
            <span className="mb-1.5 block text-muted-foreground">Ideal For</span>
            <Input name="idealFor" defaultValue={item.idealFor} required className={adminInputClass} />
          </label>

          <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1fr)_320px]">
            <label className="block text-sm">
              <span className="mb-1.5 block text-muted-foreground">Package Description</span>
              <Textarea
                name="summary"
                defaultValue={item.summary}
                required
                rows={7}
                placeholder="Describe the route style, highlights, acclimatization pace, and who this trek is ideal for."
                className={adminTextareaClass}
              />
              <p className="mt-1.5 text-xs text-muted-foreground">
                Write 2-4 concise paragraphs. This appears in package pages and influences booking decisions.
              </p>
            </label>

            <div className="space-y-3">
              <AdminCallout
                title="Strong Description Checklist"
                description="Include trail character, altitude context, daily pacing, and expected comfort level."
              >
                Keep wording clear and realistic. Avoid generic phrases and mention what makes this route distinct.
              </AdminCallout>
              <AdminCallout
                tone="amber"
                title="Formatting"
                description="Line breaks are kept, so separate ideas into short paragraphs for easier reading."
              />
            </div>
          </div>
        </AdminPanel>

        <AdminPanel
          title="Pricing & Program"
          description="Use one item per line. The same parser is used in create and update flows."
        >
          <label className="block text-sm">
            <span className="mb-1.5 block text-muted-foreground">Pricing (Label|Price)</span>
            <Textarea
              name="pricingLines"
              defaultValue={pricingLines}
              required
              rows={4}
              placeholder={"2-4 Pax|$900 / person\n5-8 Pax|$780 / person"}
              className={adminCodeTextareaClass}
            />
          </label>

          <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1.3fr)_320px]">
            <div className="space-y-3">
              <label className="block text-sm">
                <span className="mb-1.5 block text-muted-foreground">Itinerary (one line each)</span>
                <Textarea
                  name="itineraryLines"
                  defaultValue={item.itinerary.join("\n")}
                  required
                  rows={12}
                  placeholder={
                    "Day 1: Arrive in Kathmandu and pre-trek briefing.\nDay 2: Drive to trailhead and short acclimatization walk."
                  }
                  className={adminCodeTextareaClass}
                />
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Use one day per line. If you skip the day prefix, it will be auto-numbered when saved.
                </p>
              </label>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="block text-sm">
                  <span className="mb-1.5 block text-muted-foreground">Includes (one line each)</span>
                  <Textarea
                    name="includesLines"
                    defaultValue={item.includes.join("\n")}
                    required
                    rows={8}
                    className={adminCodeTextareaClass}
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1.5 block text-muted-foreground">Excludes (one line each)</span>
                  <Textarea
                    name="excludesLines"
                    defaultValue={item.excludes.join("\n")}
                    required
                    rows={8}
                    className={adminCodeTextareaClass}
                  />
                </label>
              </div>
            </div>

            <div className="space-y-3">
              <AdminCallout
                title="Itinerary Template"
                description="Follow this structure for clean package-page rendering."
              >
                <pre className="overflow-x-auto rounded-xl border border-border bg-background/70 p-2.5 text-[11px] text-foreground/85">
{`Day 1: Arrival and briefing in Kathmandu.
Day 2: Travel to trailhead and easy hike.
Day 3: Trek to next stop with altitude gain.`}
                </pre>
              </AdminCallout>
              <AdminCallout
                tone="emerald"
                title="Quality Tip"
                description="Each itinerary line should mention route movement and a practical context such as hours, altitude, or objective."
              />
            </div>
          </div>
        </AdminPanel>

        <div className={adminStickyActionsClass}>
          <Link
            href="/dashboard/admin/packages"
            className={adminSecondaryButtonClass}
          >
            Cancel
          </Link>
          <button type="submit" className={adminPrimaryButtonClass}>
            Update Package
          </button>
        </div>
      </form>
    </AdminPage>
  );
}
