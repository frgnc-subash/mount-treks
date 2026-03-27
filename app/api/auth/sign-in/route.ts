import { NextResponse } from "next/server";
import { attachSessionCookie, createUserSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { getPrismaAuthFriendlyError } from "@/lib/prisma-errors";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const password = String(body?.password ?? "");

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        passwordHash: true,
      },
    });

    if (!user?.passwordHash || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

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

    return NextResponse.json({ error: "Unable to sign in." }, { status: 500 });
  }
}
