import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const adminSurfaceClass =
  "rounded-[28px] border border-border bg-card shadow-sm";

export const adminSubtleSurfaceClass =
  "rounded-2xl border border-border bg-muted/30";

export const adminInputClass =
  "h-11 w-full rounded-xl border border-input bg-background/70 px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary/35";

export const adminNumberInputClass =
  `${adminInputClass} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`;

export const adminReadonlyInputClass =
  "h-11 w-full rounded-xl border border-input bg-muted/50 px-3 text-sm text-muted-foreground";

export const adminTextareaClass =
  "w-full resize-none rounded-xl border border-input bg-background/70 px-3 py-2.5 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary/35";

export const adminCodeTextareaClass =
  `${adminTextareaClass} font-mono text-[13px] leading-6 tracking-[0.01em]`;

export const adminSecondaryButtonClass =
  "rounded-xl border border-border bg-muted/30 px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-accent";

export const adminPrimaryButtonClass =
  "rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90";

export const adminStickyActionsClass =
  "sticky bottom-3 z-10 flex flex-wrap items-center justify-end gap-2 rounded-3xl border border-border bg-card/95 p-3 backdrop-blur";

export function AdminPage({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <main className="text-foreground">
      <section className={cn("mx-auto w-full min-w-0 space-y-6 pb-3", className)}>{children}</section>
    </main>
  );
}

export function AdminHeader({
  title,
  description,
  actions,
  eyebrow = "Admin",
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  eyebrow?: string;
}) {
  return (
    <header className={cn(adminSurfaceClass, "p-5 sm:p-6")}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">{eyebrow}</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">{title}</h1>
          {description ? <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  );
}

export function AdminPanel({
  title,
  description,
  action,
  children,
  className,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn(adminSurfaceClass, "min-w-0 p-5 sm:p-6", className)}>
      {title || description || action ? (
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            {title ? <h2 className="text-lg font-semibold text-white">{title}</h2> : null}
            {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
          </div>
          {action ? <div>{action}</div> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function AdminStat({
  label,
  value,
  hint,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
}) {
  return (
    <article className={cn(adminSubtleSurfaceClass, "p-4")}>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-white">{value}</p>
      {hint ? <p className="mt-2 text-xs text-muted-foreground">{hint}</p> : null}
    </article>
  );
}

export function AdminCallout({
  title,
  description,
  children,
  tone = "blue",
}: {
  title: string;
  description?: string;
  children?: ReactNode;
  tone?: "blue" | "amber" | "emerald" | "rose";
}) {
  const toneClass =
    tone === "rose"
      ? "border border-secondary/25 bg-secondary/12 text-secondary"
      : tone === "amber"
        ? "border border-secondary/22 bg-secondary/10 text-secondary"
      : tone === "emerald"
        ? "border border-primary/22 bg-primary/10 text-primary"
        : "border border-primary/25 bg-primary/12 text-primary";

  return (
    <aside className={cn("rounded-xl p-3.5", toneClass)}>
      <p className="text-sm font-semibold">{title}</p>
      {description ? <p className="mt-1 text-xs leading-relaxed text-foreground/85">{description}</p> : null}
      {children ? <div className="mt-2 text-xs leading-relaxed text-foreground/90">{children}</div> : null}
    </aside>
  );
}
