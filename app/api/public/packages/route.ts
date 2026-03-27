import { NextResponse } from "next/server";
import { getAllPackages } from "@/lib/content";
import { resolveLocale } from "@/lib/i18n";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = resolveLocale(searchParams.get("lang"));
  const packages = await getAllPackages(locale);

  return NextResponse.json(
    { packages },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
