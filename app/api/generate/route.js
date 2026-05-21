import { NextResponse } from "next/server";
import { generateStrategy } from "@/lib/ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const scraped = body.scraped;
    if (!scraped || !scraped.url) {
      return NextResponse.json({ error: "Missing website data." }, { status: 400 });
    }

    const { strategy, usedAI } = await generateStrategy(scraped);

    return NextResponse.json({
      strategy,
      campaigns: strategy.campaigns,
      brandIntelligence: strategy.brandIntelligence,
      extractedContent: strategy.extractedContent,
      brandIntel: strategy.brandIntelligence,
      ads: strategy.campaigns,
      usedAI,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err?.message || "Failed to build marketing strategy." },
      { status: 500 }
    );
  }
}
