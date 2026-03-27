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
  adminSubtleSurfaceClass,
} from "@/components/dashboard/admin-ui";
import { prisma } from "@/lib/db";

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(value);
}

export default async function ManagersPage() {
  const user = await requireUser("/dashboard/admin/managers");

  if (user.role !== "ADMIN") {
    redirect("/dashboard/customer");
  }

  const [managers, totalUsers, totalCustomers, recentCustomers] = await Promise.all([
    prisma.user.findMany({
      where: { role: "ADMIN" },
      orderBy: { createdAt: "asc" },
      include: {
        _count: {
          select: {
            bookings: true,
          },
        },
      },
    }),
    prisma.user.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.user.findMany({
      where: { role: "CUSTOMER" },
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        fullName: true,
        email: true,
        createdAt: true,
      },
    }),
  ]);

  const managerCount = managers.length;

  return (
    <AdminPage className="max-w-6xl">
      <AdminHeader
        title="Managers"
        description="Control who can operate the system, track account activity, and monitor signups from one place."
        actions={
          <>
            <Link
              href="/dashboard/admin/packages"
              className={adminPrimaryButtonClass}
            >
              Manage Packages
            </Link>
            <Link
              href="/dashboard/admin"
              className={adminSecondaryButtonClass}
            >
              Back to Overview
            </Link>
          </>
        }
      />

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStat label="Total Managers" value={managerCount} hint="Accounts with admin privileges" />
        <AdminStat label="Total Users" value={totalUsers} hint="All registered accounts" />
        <AdminStat label="Customers" value={totalCustomers} hint="Non-admin active users" />
        <AdminStat
          label="Current Session"
          value={<span className="text-lg">{user.fullName}</span>}
          hint={user.email}
        />
      </section>

      <AdminPanel
        title="Manager Accounts"
        description="Manager privileges should only be assigned to trusted internal team members."
        action={
          <span className="rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-foreground">
            {managerCount} active
          </span>
        }
      >
        {managers.length === 0 ? (
          <p className="text-sm text-muted-foreground">No manager accounts available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="text-muted-foreground">
                <tr>
                  <th className="pb-2 font-medium">Name</th>
                  <th className="pb-2 font-medium">Email</th>
                  <th className="pb-2 font-medium">Created</th>
                  <th className="pb-2 font-medium">Handled Bookings</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {managers.map((manager, index) => {
                  const isCurrentUser = manager.id === user.id;
                  const isPrimary = index === 0;

                  return (
                    <tr key={manager.id} className="transition hover:bg-muted/20">
                      <td className="py-3 font-medium text-white">{manager.fullName}</td>
                      <td className="py-3 text-foreground/85">{manager.email}</td>
                      <td className="py-3 text-foreground/85">{formatDate(manager.createdAt)}</td>
                      <td className="py-3 text-foreground/85">{manager._count.bookings}</td>
                      <td className="py-3">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                            isCurrentUser
                              ? "border-primary/28 bg-primary/12 text-primary"
                              : isPrimary
                                ? "border-primary/22 bg-primary/10 text-primary"
                                : "border-border bg-muted/40 text-foreground"
                          }`}
                        >
                          {isCurrentUser ? "Current Session" : isPrimary ? "Primary Manager" : "Manager"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </AdminPanel>

      <section className="grid gap-3 md:grid-cols-2">
        <article className={`${adminSubtleSurfaceClass} p-4`}>
          <h2 className="text-base font-semibold text-white">Security Checklist</h2>
          <ul className="mt-3 space-y-2 text-sm text-foreground/85">
            <li>Use strong passwords for all manager accounts.</li>
            <li>Require Google sign-in for easier account recovery.</li>
            <li>Review manager permissions every month.</li>
          </ul>
        </article>

        <article className={`${adminSubtleSurfaceClass} p-4`}>
          <h2 className="text-base font-semibold text-white">Recent Customer Signups</h2>
          {recentCustomers.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">No recent customer signups yet.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm text-foreground/85">
              {recentCustomers.map((customer) => (
                <li key={customer.id} className="rounded-xl border border-border bg-background/50 px-3 py-2">
                  <p className="font-medium text-white">{customer.fullName}</p>
                  <p className="text-xs text-muted-foreground">{customer.email}</p>
                </li>
              ))}
            </ul>
          )}
        </article>
      </section>
    </AdminPage>
  );
}
