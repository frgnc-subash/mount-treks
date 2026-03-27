"use client"

import { Suspense } from "react"
import { usePathname } from "next/navigation"

import CookieConsentBanner from "@/components/cookie-consent-banner"
import Footer from "@/components/footer"
import Navbar from "@/components/navbar"
import GuideFloat from "@/components/guide-float"

export default function SiteChrome({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const hideMarketingChrome =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up")

  if (hideMarketingChrome) {
    return (
      <>
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Suspense fallback={null}>
          <CookieConsentBanner />
        </Suspense>
      </>
    )
  }

  return (
    <>
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
      <Suspense fallback={null}>
        <GuideFloat />
      </Suspense>
      <Suspense fallback={null}>
        <CookieConsentBanner />
      </Suspense>
    </>
  )
}
