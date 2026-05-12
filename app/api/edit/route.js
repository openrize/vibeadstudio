import { NextResponse } from "next/server";
import { editAd, hasAI } from "@/lib/ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const ALLOWED = new Set([
  "regenerate",
  "shorten",
  "bolder",
  "tone",
  "similar",
  "more_aggressive",
  "more_premium",
  "more_conversion",
]);

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { ad, action, tone, scraped } = body || {};
    if (!ad || !ad.headline) {
      return NextResponse.json({ error: "Missing campaign payload." }, { status: 400 });
    }
    if (!ALLOWED.has(action)) {
      return NextResponse.json({ error: "Unknown action." }, { status: 400 });
    }
    const next = await editAd({ ad, action, tone, scraped });
    return NextResponse.json({ ad: next, usedAI: hasAI() });
  } catch (err) {
    return NextResponse.json(
      { error: err?.message || "Failed to edit campaign." },
      { status: 500 }
    );
  }
}
