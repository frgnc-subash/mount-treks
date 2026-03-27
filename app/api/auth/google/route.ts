import { NextRequest, NextResponse } from "next/server";
import {
  createOauthState,
  getGoogleConfig,
  getGoogleRedirectUri,
} from "@/lib/auth/google";
import { sanitizeNextPath } from "@/lib/auth/redirect";

export async function GET(request: NextRequest) {
  try {
    const { clientId } = getGoogleConfig();
    const redirectUri = getGoogleRedirectUri(request);
    const nextPath = sanitizeNextPath(request.nextUrl.searchParams.get("next"), "/dashboard");
    const state = createOauthState(nextPath);

    const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    googleAuthUrl.searchParams.set("client_id", clientId);
    googleAuthUrl.searchParams.set("redirect_uri", redirectUri);
    googleAuthUrl.searchParams.set("response_type", "code");
    googleAuthUrl.searchParams.set("scope", "openid email profile");
    googleAuthUrl.searchParams.set("state", state);
    googleAuthUrl.searchParams.set("prompt", "select_account");

    return NextResponse.redirect(googleAuthUrl);
  } catch {
    return NextResponse.redirect(new URL("/sign-in?error=google_not_configured", request.url));
  }
}
