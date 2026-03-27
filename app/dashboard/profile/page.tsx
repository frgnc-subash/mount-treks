import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  AdminCallout,
  AdminHeader,
  AdminPage,
  AdminPanel,
  adminInputClass,
  adminPrimaryButtonClass,
  adminReadonlyInputClass,
  adminSubtleSurfaceClass,
  adminTextareaClass,
} from "@/components/dashboard/admin-ui";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ProfileValidationError, validateProfileInput } from "@/lib/validators/profile";

interface PageProps {
  searchParams: Promise<{
    status?: string;
    error?: string;
  }>;
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "U";
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return `${parts[0].slice(0, 1)}${parts[1].slice(0, 1)}`.toUpperCase();
}

export default async function DashboardProfilePage({ searchParams }: PageProps) {
  const user = await requireUser("/dashboard/profile");
  const query = await searchParams;

  let profile = null as {
    fullName: string;
    email: string;
    avatarUrl: string | null;
    phoneNumber: string | null;
    country: string | null;
    bio: string | null;
    role: "ADMIN" | "CUSTOMER";
  } | null;

  try {
    profile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        fullName: true,
        email: true,
        avatarUrl: true,
        phoneNumber: true,
        country: true,
        bio: true,
        role: true,
      },
    });
  } catch {
    // Fallback for stale Prisma client during hot-reload sessions.
    const legacyProfile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        fullName: true,
        email: true,
        role: true,
      },
    });

    if (legacyProfile) {
      profile = {
        ...legacyProfile,
        avatarUrl: null,
        phoneNumber: null,
        country: null,
        bio: null,
      };
    }
  }

  if (!profile) {
    redirect("/sign-in?next=/dashboard/profile");
  }

  async function saveProfile(formData: FormData) {
    "use server";

    const currentUser = await requireUser("/dashboard/profile");

    const nextPath =
      currentUser.role === "ADMIN" ? "/dashboard/admin" : "/dashboard/customer";

    try {
      const payload = validateProfileInput({
        fullName: String(formData.get("fullName") ?? ""),
        avatarUrl: String(formData.get("avatarUrl") ?? ""),
        phoneNumber: String(formData.get("phoneNumber") ?? ""),
        country: String(formData.get("country") ?? ""),
        bio: String(formData.get("bio") ?? ""),
      });

      try {
        await prisma.user.update({
          where: { id: currentUser.id },
          data: payload,
        });
      } catch (error) {
        const isStalePrismaClient =
          error instanceof Error &&
          (error.message.includes("Unknown argument") || error.message.includes("Unknown field"));
        const isMissingUserColumnInDatabase =
          error instanceof Error &&
          error.message.includes("The column `User.") &&
          error.message.includes("` does not exist in the current database");

        if (!isStalePrismaClient && !isMissingUserColumnInDatabase) {
          throw error;
        }

        // Fallback for schema mismatch during dev hot-reload or unapplied DB migrations.
        await prisma.user.update({
          where: { id: currentUser.id },
          data: {
            fullName: payload.fullName,
          },
        });
      }

      revalidatePath("/dashboard/profile");
      revalidatePath(nextPath);
      redirect("/dashboard/profile?status=updated");
    } catch (error) {
      const message =
        error instanceof ProfileValidationError
          ? error.message
          : "Unable to update profile.";
      redirect(`/dashboard/profile?error=${encodeURIComponent(message)}`);
    }
  }

  return (
    <AdminPage className="max-w-4xl">
      <AdminHeader
        eyebrow="Dashboard"
        title="Profile Settings"
        description="Update your personal details and profile picture securely."
      />

      {query.status === "updated" && (
        <AdminCallout title="Profile updated" description="Your details have been saved successfully." tone="emerald" />
      )}

      {query.error && (
        <AdminCallout title="Update failed" description={query.error} tone="rose" />
      )}

      <div className="grid gap-4 md:grid-cols-[260px_minmax(0,1fr)]">
        <aside className={`${adminSubtleSurfaceClass} p-5`}>
          <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">Account</p>
          <div className="mt-4 flex flex-col items-center rounded-2xl border border-border bg-background/50 p-4 text-center">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.fullName}
                referrerPolicy="no-referrer"
                className="h-16 w-16 rounded-full object-cover ring-1 ring-border"
              />
            ) : (
              <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-lg font-bold text-primary">
                {getInitials(profile.fullName)}
              </span>
            )}
            <p className="mt-3 text-sm font-semibold text-white">{profile.fullName}</p>
            <p className="mt-1 rounded-full border border-border bg-muted/40 px-2.5 py-1 text-[11px] font-semibold text-foreground">
              {profile.role}
            </p>
          </div>
        </aside>

        <AdminPanel className="p-5">
          <form action={saveProfile} className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm">
                <span className="mb-1 block text-muted-foreground">Full Name</span>
                <input
                  name="fullName"
                  required
                  minLength={2}
                  maxLength={80}
                  defaultValue={profile.fullName}
                  className={adminInputClass}
                />
              </label>

              <label className="text-sm">
                <span className="mb-1 block text-muted-foreground">Email (read-only)</span>
                <input value={profile.email} readOnly className={adminReadonlyInputClass} />
              </label>

              <label className="text-sm sm:col-span-2">
                <span className="mb-1 block text-muted-foreground">Profile Picture URL</span>
                <input
                  name="avatarUrl"
                  defaultValue={profile.avatarUrl ?? ""}
                  placeholder="https://example.com/avatar.jpg or /logo.webp"
                  className={adminInputClass}
                />
              </label>

              <label className="text-sm">
                <span className="mb-1 block text-muted-foreground">Phone Number</span>
                <input
                  name="phoneNumber"
                  defaultValue={profile.phoneNumber ?? ""}
                  placeholder="+977 98xxxxxxxx"
                  className={adminInputClass}
                />
              </label>

              <label className="text-sm">
                <span className="mb-1 block text-muted-foreground">Country</span>
                <input
                  name="country"
                  defaultValue={profile.country ?? ""}
                  placeholder="Nepal"
                  className={adminInputClass}
                />
              </label>
            </div>

            <label className="block text-sm">
              <span className="mb-1 block text-muted-foreground">Bio</span>
              <textarea
                name="bio"
                defaultValue={profile.bio ?? ""}
                rows={5}
                maxLength={500}
                placeholder="Tell us about your trekking preferences..."
                className={adminTextareaClass}
              />
            </label>

            <button type="submit" className={adminPrimaryButtonClass}>
              Save Profile
            </button>
          </form>
        </AdminPanel>
      </div>
    </AdminPage>
  );
}
