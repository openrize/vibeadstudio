import { NextResponse } from "next/server";
import { scrapeUrl } from "@/lib/scraper";
import { ensureUrl } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const url = ensureUrl(body.url);
    if (!url) {
      return NextResponse.json(
        { error: "Please provide a valid URL." },
        { status: 400 }
      );
    }
    const scraped = await scrapeUrl(url);
    return NextResponse.json({ scraped });
  } catch (err) {
    return NextResponse.json(
      { error: err?.message || "Failed to scrape URL." },
      { status: 500 }
    );
  }
}
