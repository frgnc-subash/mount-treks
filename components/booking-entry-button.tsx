"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type AuthUser = {
  role: "ADMIN" | "CUSTOMER";
};

export default function BookingEntryButton({
  bookingPath,
  className,
  children,
}: {
  bookingPath: string;
  className?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  const handleClick = async () => {
    if (checkingAuth) return;

    setCheckingAuth(true);

    try {
      const response = await fetch("/api/auth/me", { cache: "no-store" });
      const payload = response.ok
        ? ((await response.json()) as { user: AuthUser | null })
        : { user: null };

      if (payload.user?.role === "ADMIN") {
        router.push("/dashboard/admin");
        return;
      }

      if (payload.user) {
        router.push(bookingPath);
        return;
      }

      setShowAuthPrompt(true);
    } catch {
      setShowAuthPrompt(true);
    } finally {
      setCheckingAuth(false);
    }
  };

  return (
    <>
      <button type="button" className={className} onClick={handleClick} disabled={checkingAuth}>
        {children}
      </button>

      {showAuthPrompt ? (
        <div className="fixed inset-0 z-[2300] flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0c0c0e] p-5 shadow-[0_28px_68px_rgba(0,0,0,0.55)]">
            <p className="text-sm font-semibold tracking-[0.16em] text-primary uppercase">
              Access Required
            </p>
            <h2 className="mt-2 text-xl font-semibold text-white">
              Sign in to continue booking
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-300">
              Booking requests are available for signed-in users only. Sign in or create an account to continue.
            </p>
            <div className="mt-4 grid gap-2">
              <Button
                type="button"
                className="h-10 rounded-xl"
                onClick={() => router.push(`/sign-in?next=${encodeURIComponent(bookingPath)}`)}
              >
                Sign In
              </Button>
              <Button
                type="button"
                asChild
                variant="outline"
                className="h-10 rounded-xl border-white/15 bg-white/[0.03] text-white hover:bg-white/[0.08]"
              >
                <Link href={`/sign-up?next=${encodeURIComponent(bookingPath)}`}>Create Account</Link>
              </Button>
              <button
                type="button"
                onClick={() => setShowAuthPrompt(false)}
                className="mt-1 text-sm font-medium text-zinc-400 transition hover:text-zinc-200"
              >
                Continue browsing
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
