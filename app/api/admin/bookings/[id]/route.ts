import { BookingStatus } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"

import { getSessionTokenFromRequest, getUserBySessionToken } from "@/lib/auth/session"
import { prisma } from "@/lib/db"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const sessionToken = getSessionTokenFromRequest(request)

  if (!sessionToken) {
    return NextResponse.json({ error: "Please sign in first." }, { status: 401 })
  }

  const user = await getUserBySessionToken(sessionToken)

  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 })
  }

  const { id } = await params

  try {
    const body = await request.json()
    const status = String(body?.status ?? "").toUpperCase()

    if (status !== BookingStatus.APPROVED && status !== BookingStatus.REJECTED) {
      return NextResponse.json({ error: "Invalid booking status." }, { status: 400 })
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: {
        status,
      },
      select: {
        id: true,
        status: true,
      },
    })

    return NextResponse.json({ success: true, booking })
  } catch {
    return NextResponse.json({ error: "Unable to update booking status." }, { status: 500 })
  }
}
