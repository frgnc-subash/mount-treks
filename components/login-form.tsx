"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { FormEvent, useMemo, useState } from "react"
import { Compass, ShieldCheck, Timer } from "lucide-react"
import { sanitizeNextPath } from "@/lib/auth/redirect"
import { resolveLocale } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

function getErrorMessage(errorCode: string | null) {
  switch (errorCode) {
    case "google_not_configured":
      return "Google login is not configured yet. Please use email/password for now."
    case "google_state":
      return "Google login verification failed. Please try again."
    case "google_token":
      return "Google login failed during token exchange. Verify your OAuth redirect URL and client secret."
    case "google_profile":
      return "Google login failed while fetching your profile. Please try again."
    case "google_email":
      return "Your Google account does not have a verified email address."
    case "google_auth":
      return "Google login failed. Please try again."
    default:
      return ""
  }
}

const signInCards = [
  {
    title: "Saved Plans",
    description: "Open your shortlist and continue planning without starting again.",
    icon: Compass,
  },
  {
    title: "Verified Team",
    description: "Track bookings with the same certified local guide network.",
    icon: ShieldCheck,
  },
  {
    title: "Quick Support",
    description: "Reach our trek specialists fast when dates or routes change.",
    icon: Timer,
  },
]

function SignInFlashcards({ compact = false }: { compact?: boolean }) {
  return (
    <div className={cn("grid gap-2", compact ? "grid-cols-1" : "grid-cols-1")}>
      {signInCards.map((item) => (
        <article
          key={item.title}
          className={cn(
            "rounded-xl border border-white/15 bg-black/35 p-3 backdrop-blur-sm",
            compact ? "bg-white/[0.03]" : ""
          )}
        >
          <div className="flex items-start gap-3">
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/[0.06]">
              <item.icon className="h-4 w-4 text-zinc-100" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white">{item.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-zinc-300">{item.description}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const nextPath = sanitizeNextPath(searchParams.get("next"), "/dashboard")
  const locale = resolveLocale(searchParams.get("lang"))
  const withLang = (path: string) => {
    if (locale === "en") return path
    const separator = path.includes("?") ? "&" : "?"
    return `${path}${separator}lang=${locale}`
  }
  const queryError = useMemo(
    () => getErrorMessage(searchParams.get("error")),
    [searchParams]
  )

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const payload = (await response.json()) as { error?: string }

      if (!response.ok) {
        setError(payload.error || "Unable to sign in.")
        return
      }

      router.push(nextPath)
      router.refresh()
    } catch {
      setError("Unable to sign in.")
    } finally {
      setLoading(false)
    }
  }

  const startGoogleSignIn = () => {
    setError("")
    const nextParam = encodeURIComponent(nextPath)
    const googleAuthUrl = `/api/auth/google?next=${nextParam}`

    if (searchParams.get("error")) {
      window.history.replaceState({}, "", withLang(`/sign-in?next=${nextParam}`))
    }

    window.location.assign(googleAuthUrl)
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden border border-white/10 bg-[#0b0b0d] p-0 text-white shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
        <CardContent className="grid p-0 md:grid-cols-[1fr_0.95fr]">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <p className="text-xs font-semibold tracking-[0.24em] text-primary uppercase">
                  Account
                </p>
                <h1 className="text-2xl font-bold text-white">Welcome back</h1>
                <p className="text-balance text-sm text-zinc-400">
                  Sign in to your Altigo Himalayan Treks account
                </p>
              </div>
              {(queryError || error) && (
                <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
                  {error || queryError}
                </div>
              )}
              <Field>
                <FieldLabel htmlFor="email" className="text-zinc-200">
                  Email
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="border-white/10 bg-[#060607] text-white placeholder:text-zinc-500 focus-visible:ring-primary/60"
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password" className="text-zinc-200">
                    Password
                  </FieldLabel>
                  <span className="ml-auto text-xs text-zinc-500">
                    Forgot your password?
                  </span>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="border-white/10 bg-[#060607] text-white placeholder:text-zinc-500 focus-visible:ring-primary/60"
                />
              </Field>
              <Field>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white hover:bg-primary/90"
                >
                  {loading ? "Signing In..." : "Sign In"}
                </Button>
              </Field>
              <FieldSeparator className="text-zinc-400 *:data-[slot=field-separator-content]:bg-[#0b0b0d]">
                Or continue with
              </FieldSeparator>
              <Field>
                <Button
                  variant="outline"
                  type="button"
                  onClick={startGoogleSignIn}
                  className="w-full border-white/15 bg-white/5 text-white hover:border-white/30 hover:bg-white/10"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Continue with Google
                </Button>
              </Field>
              <FieldDescription className="text-center text-sm text-zinc-400">
                Don&apos;t have an account?{" "}
                <Link
                  className="text-primary hover:underline"
                  href={withLang(`/sign-up?next=${encodeURIComponent(nextPath)}`)}
                >
                  Sign up
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="relative hidden md:block">
            <img
              src="/gallery/image9.jpeg"
              alt="Himalayan ridge at sunrise"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
            <div className="absolute bottom-5 left-5 right-5 space-y-3">
              <p className="text-[11px] font-semibold tracking-[0.2em] text-white/85 uppercase">
                Member Access
              </p>
              <p className="text-xl font-semibold leading-tight text-white">
                Sign in and continue your Himalayan plan.
              </p>
              <SignInFlashcards />
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="md:hidden">
        <SignInFlashcards compact />
      </div>
      <FieldDescription className="px-6 text-center text-xs text-zinc-400">
        By clicking continue, you agree to our{" "}
        <Link className="text-primary hover:underline" href={withLang("/terms-of-service")}>
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link className="text-primary hover:underline" href={withLang("/privacy-policy")}>
          Privacy Policy
        </Link>
        .
      </FieldDescription>
    </div>
  )
}
