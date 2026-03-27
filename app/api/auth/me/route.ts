import { NextRequest, NextResponse } from "next/server";
import { getSessionTokenFromRequest, getUserBySessionToken } from "@/lib/auth/session";

export async function GET(request: NextRequest) {
  const rawToken = getSessionTokenFromRequest(request);

  if (!rawToken) {
    return NextResponse.json(
      { user: null },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }

  const user = await getUserBySessionToken(rawToken);

  return NextResponse.json(
    { user },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
