import { createHash, randomBytes } from "node:crypto";
import type { UserRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const SESSION_COOKIE_NAME = "altigo_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export type SessionUser = {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  avatarUrl: string | null;
};

function isLegacyUserFieldSelectionError(error: unknown) {
  if (!(error instanceof Error)) return false;

  const message = error.message;

  const isStalePrismaClient = message.includes("Unknown field `avatarUrl`");
  const isMissingUserColumnInDatabase =
    message.includes("The column `User.") &&
    message.includes("` does not exist in the current database");

  return isStalePrismaClient || isMissingUserColumnInDatabase;
}

function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function cookieOptions(expiresAt: Date) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  };
}

export async function createUserSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);

  await prisma.session.create({
    data: {
      userId,
      tokenHash: hashSessionToken(token),
      expiresAt,
    },
  });

  return { token, expiresAt };
}

export function attachSessionCookie(response: NextResponse, token: string, expiresAt: Date) {
  response.cookies.set(SESSION_COOKIE_NAME, token, cookieOptions(expiresAt));
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
  });
}

export function getSessionTokenFromRequest(request: NextRequest) {
  return request.cookies.get(SESSION_COOKIE_NAME)?.value ?? null;
}

export async function invalidateSessionByToken(rawToken: string) {
  await prisma.session.deleteMany({
    where: {
      tokenHash: hashSessionToken(rawToken),
    },
  });
}

export async function getUserBySessionToken(rawToken: string): Promise<SessionUser | null> {
  let session: {
    id: string;
    expiresAt: Date;
    user: SessionUser;
  } | null = null;

  try {
    session = await prisma.session.findUnique({
      where: {
        tokenHash: hashSessionToken(rawToken),
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            avatarUrl: true,
          },
        },
      },
    });
  } catch (error) {
    if (!isLegacyUserFieldSelectionError(error)) {
      throw error;
    }

    // Fallback for schema mismatch during dev hot-reload or unapplied DB migrations.
    const legacySession = await prisma.session.findUnique({
      where: {
        tokenHash: hashSessionToken(rawToken),
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (legacySession) {
      session = {
        ...legacySession,
        user: {
          ...legacySession.user,
          avatarUrl: null,
        },
      };
    }
  }

  if (!session) return null;

  if (session.expiresAt <= new Date()) {
    await prisma.session.delete({ where: { id: session.id } });
    return null;
  }

  return session.user;
}
