import { NextRequest, NextResponse } from "next/server";
import {
  getSessionTokenFromRequest,
  getUserBySessionToken,
} from "@/lib/auth/session";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  const sessionToken = getSessionTokenFromRequest(request);

  if (!sessionToken) {
    return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
  }

  const user = await getUserBySessionToken(sessionToken);

  if (!user) {
    return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const destination = String(body?.destination ?? "").trim();
    const packageName = String(body?.packageName ?? "").trim();
    const notes = String(body?.notes ?? "").trim();
    const people = Number(body?.people ?? 0);
    const startDateRaw = String(body?.startDate ?? "");
    const startDate = new Date(startDateRaw);

    if (!destination || !packageName || !startDateRaw || Number.isNaN(startDate.getTime())) {
      return NextResponse.json(
        { error: "Destination, package, and start date are required." },
        { status: 400 },
      );
    }

    if (!Number.isInteger(people) || people < 1) {
      return NextResponse.json({ error: "People must be at least 1." }, { status: 400 });
    }

    const booking = await prisma.booking.create({
      data: {
        destination,
        packageName,
        startDate,
        people,
        notes: notes || null,
        userId: user.id,
      },
      select: {
        id: true,
      },
    });

    return NextResponse.json({ success: true, bookingId: booking.id });
  } catch {
    return NextResponse.json({ error: "Unable to create booking." }, { status: 500 });
  }
}
