"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { FormEvent, useState } from "react"
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

export function SignupForm({
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

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullName, email, password }),
      })

      const payload = (await response.json()) as { error?: string }

      if (!response.ok) {
        setError(payload.error || "Unable to create account.")
        return
      }

      router.push(nextPath)
      router.refresh()
    } catch {
      setError("Unable to create account.")
    } finally {
      setLoading(false)
    }
  }

  const startGoogleSignUp = () => {
    const nextParam = encodeURIComponent(nextPath)
    window.location.href = `/api/auth/google?next=${nextParam}`
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden border border-white/10 bg-[#0b0b0d] p-0 text-white shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <FieldGroup className="gap-5">
              <div className="flex flex-col items-center gap-1.5 text-center">
                <p className="text-xs font-semibold tracking-[0.24em] text-primary uppercase">
                  Account
                </p>
                <h1 className="text-2xl font-bold text-white">Create your account</h1>
                <p className="text-sm text-balance text-zinc-400">
                  Register to start planning your next trek
                </p>
              </div>
              {error && (
                <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
                  {error}
                </div>
              )}
              <Field className="gap-2">
                <FieldLabel htmlFor="full-name" className="text-zinc-200">
                  Full Name
                </FieldLabel>
                <Input
                  id="full-name"
                  required
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className="border-white/10 bg-[#060607] text-white placeholder:text-zinc-500 focus-visible:ring-primary/60"
                />
              </Field>
              <Field className="gap-2">
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
                <FieldDescription className="text-xs text-zinc-500">
                  We&apos;ll use this to contact you. We will not share your
                  email with anyone else.
                </FieldDescription>
              </Field>
              <Field className="grid gap-3 md:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="password" className="text-zinc-200">
                    Password
                  </FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="border-white/10 bg-[#060607] text-white placeholder:text-zinc-500 focus-visible:ring-primary/60"
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="confirm-password" className="text-zinc-200">
                    Confirm Password
                  </FieldLabel>
                  <Input
                    id="confirm-password"
                    type="password"
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className="border-white/10 bg-[#060607] text-white placeholder:text-zinc-500 focus-visible:ring-primary/60"
                  />
                </div>
                <FieldDescription className="text-xs text-zinc-500 md:col-span-2">
                  Must be at least 8 characters long.
                </FieldDescription>
              </Field>
              <Field className="gap-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white hover:bg-primary/90"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              </Field>
              <FieldSeparator className="text-xs text-zinc-500 *:data-[slot=field-separator-content]:bg-[#0b0b0d]">
                Or continue with
              </FieldSeparator>
              <Field className="gap-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={startGoogleSignUp}
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
              <FieldDescription className="text-center text-xs text-zinc-500">
                Already have an account?{" "}
                <Link
                  className="text-primary hover:underline"
                  href={withLang(`/sign-in?next=${encodeURIComponent(nextPath)}`)}
                >
                  Sign in
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="relative hidden md:block">
            <img
              src="/gallery/image11.jpeg"
              alt="Himalayan trail above the clouds"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 space-y-2">
              <p className="text-xs font-semibold tracking-[0.2em] text-white/80 uppercase">
                Altigo Treks
              </p>
              <p className="text-lg font-semibold text-white">
                Start your next Himalayan story today.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
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
