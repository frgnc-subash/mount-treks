import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { attachSessionCookie, createUserSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { getPrismaAuthFriendlyError } from "@/lib/prisma-errors";

function isStrongPassword(password: string) {
  return password.length >= 8;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const fullName = String(body?.fullName ?? "").trim();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const password = String(body?.password ?? "");

    if (!fullName) {
      return NextResponse.json({ error: "Full name is required." }, { status: 400 });
    }

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
    }

    if (!isStrongPassword(password)) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 },
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 },
      );
    }

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        passwordHash: hashPassword(password),
        role: UserRole.CUSTOMER,
      },
      select: {
        id: true,
      },
    });

    const { token, expiresAt } = await createUserSession(user.id);
    const response = NextResponse.json({ success: true });
    attachSessionCookie(response, token, expiresAt);
    return response;
  } catch (error) {
    const friendlyError = getPrismaAuthFriendlyError(error);
    if (friendlyError) {
      return NextResponse.json(
        { error: friendlyError.message },
        { status: friendlyError.status },
      );
    }

    return NextResponse.json({ error: "Unable to create account." }, { status: 500 });
  }
}
