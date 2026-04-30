import { NextResponse } from "next/server";
import { generateAds, hasAI } from "@/lib/ai";
import { clamp } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const scraped = body.scraped;
    if (!scraped || !scraped.url) {
      return NextResponse.json(
        { error: "Missing scraped page data." },
        { status: 400 }
      );
    }
    const count = clamp(parseInt(body.count, 10) || 4, 3, 5);
    const ads = await generateAds(scraped, count);
    return NextResponse.json({ ads, usedAI: hasAI() });
  } catch (err) {
    return NextResponse.json(
      { error: err?.message || "Failed to generate ads." },
      { status: 500 }
    );
  }
}
