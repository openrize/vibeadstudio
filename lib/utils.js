export function clean(text = "") {
  return String(text)
    .replace(/\s+/g, " ")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim();
}

export function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export function scoreFromText(headline = "", body = "", cta = "") {
  // Pseudo "AI quality" score, 80-100, deterministic for stability
  const lengthBonus = clamp(60 - Math.abs(40 - headline.length), 0, 60) / 6; // 0-10
  const ctaBonus = /\b(get|try|start|join|book|shop|learn|claim|unlock|build)\b/i.test(cta) ? 6 : 2;
  const bodyBonus = clamp(140 - Math.abs(140 - body.length), 0, 140) / 14; // 0-10
  const base = 80;
  const score = Math.round(base + lengthBonus * 0.6 + ctaBonus + bodyBonus * 0.4);
  return clamp(score, 80, 100);
}

export function pickImage(seed) {
  const s = encodeURIComponent(String(seed || "vibe").slice(0, 40));
  // Picsum is reliable, no auth, supports seeds for deterministic images.
  return `https://picsum.photos/seed/${s}/800/520`;
}

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export const TONES = [
  "Bold",
  "Friendly",
  "Playful",
  "Premium",
  "Minimal",
  "Urgent",
  "Inspiring",
];

export function ensureUrl(input) {
  if (!input) return null;
  let s = String(input).trim();
  if (!/^https?:\/\//i.test(s)) s = "https://" + s;
  try {
    const u = new URL(s);
    if (!u.hostname.includes(".")) return null;
    return u.toString();
  } catch {
    return null;
  }
}
