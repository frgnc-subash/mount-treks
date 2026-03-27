import { NextResponse } from "next/server";
import { getAllDestinations } from "@/lib/content";
import { resolveLocale } from "@/lib/i18n";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = resolveLocale(searchParams.get("lang"));
  const destinations = await getAllDestinations(locale);

  return NextResponse.json(
    { destinations },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
