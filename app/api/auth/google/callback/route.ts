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

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const nextPath = state ? readOauthState(state) : null;

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
          },
          select: { id: true },
        });
      } else {
        user = await prisma.user.create({
          data: {
            fullName: googleUser.name || email.split("@")[0],
            email,
            googleId: googleUser.sub,
            role: UserRole.CUSTOMER,
          },
          select: { id: true },
        });
      }
    }

    const { token, expiresAt } = await createUserSession(user.id);
    const response = NextResponse.redirect(new URL(nextPath, request.url));
    attachSessionCookie(response, token, expiresAt);
    return response;
  } catch (error) {
    console.error("Google auth failed:", error);
    const errorCode = error instanceof GoogleAuthError ? error.code : "google_auth";
    return NextResponse.redirect(new URL(`/sign-in?error=${errorCode}`, request.url));
  }
}
