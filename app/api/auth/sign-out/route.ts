import { NextRequest, NextResponse } from "next/server";
import {
  clearSessionCookie,
  getSessionTokenFromRequest,
  invalidateSessionByToken,
} from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  const rawToken = getSessionTokenFromRequest(request);

  if (rawToken) {
    await invalidateSessionByToken(rawToken);
  }

  const response = NextResponse.json({ success: true });
  clearSessionCookie(response);
  return response;
}
