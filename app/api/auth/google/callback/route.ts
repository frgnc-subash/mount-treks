import { UserRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import {
  createUserSession,
  attachSessionCookie,
} from "@/lib/auth/session";
import {
  getGoogleConfig,
  getGoogleRedirectUri,
  readOauthState,
} from "@/lib/auth/google";
import { prisma } from "@/lib/db";
import { getPrismaAuthFriendlyError } from "@/lib/prisma-errors";

type GoogleTokenResponse = {
  access_token: string;
};

type GoogleUserInfo = {
  sub: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
};

class GoogleAuthError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

function isConfiguredAdminEmail(email: string) {
  const configuredAdminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  return Boolean(configuredAdminEmail) && email === configuredAdminEmail;
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const oauthError = request.nextUrl.searchParams.get("error");
  const nextPath = state ? readOauthState(state) : null;

  if (oauthError) {
    return NextResponse.redirect(new URL(`/sign-in?error=google_${oauthError}`, request.url));
  }

  if (!code || !nextPath) {
    return NextResponse.redirect(new URL("/sign-in?error=google_state", request.url));
  }

  try {
    const { clientId, clientSecret } = getGoogleConfig();
    const redirectUri = getGoogleRedirectUri(request);

    const tokenParams = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    });

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: tokenParams,
    });

    if (!tokenRes.ok) {
      const details = await tokenRes.text();
      throw new GoogleAuthError(
        "google_token",
        `Token exchange failed: ${tokenRes.status} ${details}`,
      );
    }

    const tokenData = (await tokenRes.json()) as GoogleTokenResponse;

    const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!userInfoRes.ok) {
      const details = await userInfoRes.text();
      throw new GoogleAuthError(
        "google_profile",
        `Failed to fetch Google user profile: ${userInfoRes.status} ${details}`,
      );
    }

    const googleUser = (await userInfoRes.json()) as GoogleUserInfo;
    const email = googleUser.email?.toLowerCase().trim();

    if (!email || !googleUser.sub || googleUser.email_verified === false) {
      throw new GoogleAuthError(
        "google_email",
        "Google account is missing a verified email.",
      );
    }

    const shouldBeAdmin = isConfiguredAdminEmail(email);

    let user = await prisma.user.findUnique({
      where: { googleId: googleUser.sub },
      select: { id: true },
    });

    if (!user) {
      const existingByEmail = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          googleId: true,
        },
      });

      if (existingByEmail) {
        user = await prisma.user.update({
          where: { id: existingByEmail.id },
          data: {
            googleId: googleUser.sub,
            fullName: googleUser.name || undefined,
            role: shouldBeAdmin ? UserRole.ADMIN : undefined,
          },
          select: { id: true },
        });
      } else {
        user = await prisma.user.create({
          data: {
            fullName: googleUser.name || email.split("@")[0],
            email,
            googleId: googleUser.sub,
            role: shouldBeAdmin ? UserRole.ADMIN : UserRole.CUSTOMER,
          },
          select: { id: true },
        });
      }
    } else if (shouldBeAdmin) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          role: UserRole.ADMIN,
          fullName: googleUser.name || undefined,
        },
        select: { id: true },
      });
    }

    const { token, expiresAt } = await createUserSession(user.id);
    const response = NextResponse.redirect(new URL(nextPath, request.url));
    attachSessionCookie(response, token, expiresAt);
    return response;
  } catch (error) {
    console.error("Google auth failed:", error);
    const friendlyError = getPrismaAuthFriendlyError(error);
    let errorCode = "google_auth";

    if (error instanceof GoogleAuthError) {
      errorCode = error.code;
    } else if (friendlyError?.message.includes("not configured")) {
      errorCode = "google_db_config";
    } else if (friendlyError?.message.includes("schema is missing")) {
      errorCode = "google_db_schema";
    }

    return NextResponse.redirect(new URL(`/sign-in?error=${errorCode}`, request.url));
  }
}
