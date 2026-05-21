import { NextResponse } from "next/server";
import { editAd } from "@/lib/ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const ALLOWED = new Set([
  "regenerate",
  "regenerate_similar",
  "similar",
  "more_premium",
  "more_emotional",
  "more_aggressive",
  "bolder",
  "create_social",
  "create_retargeting",
  "shorten",
  "tone",
]);

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { ad, action, tone, scraped } = body || {};
    if (!ad || !ad.headline) {
      return NextResponse.json({ error: "Missing campaign." }, { status: 400 });
    }
    if (!ALLOWED.has(action)) {
      return NextResponse.json({ error: "Unknown workflow action." }, { status: 400 });
    }
    const { ad: next, usedAI } = await editAd({ ad, action, tone, scraped });
    return NextResponse.json({ ad: next, campaign: next, usedAI });
  } catch (err) {
    return NextResponse.json(
      { error: err?.message || "Failed to refine campaign." },
      { status: 500 }
    );
  }
}
