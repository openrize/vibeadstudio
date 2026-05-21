# Vibe Strategist

**AI Marketing Strategist System** — paste a business URL and receive brand intelligence, extracted website insights, and six full-funnel campaign strategies (not generic ad variations).

Built with **Next.js (App Router) + Tailwind + OpenAI + Cheerio**.

---

## What you get

1. **AI Brand Intelligence Engine** — industry, audience, positioning, personality, emotional tone, trust signals, pricing style, core offer, recommended direction
2. **Extracted Website Insights** — hero, products/services, testimonials, pricing, offers, features, trust, CTAs
3. **Strategic Campaign System** — six distinct campaigns:
   - Awareness · Conversion · Retargeting · Promotional · Emotional · Authority
4. **Strategy-first campaign cards** — goal, psychology, CTA strategy, competitive angle, visual direction, then creative copy
5. **Creative workflow actions** — regenerate similar, more premium, more emotional, more aggressive, social version, retargeting version
6. **Premium strategist loading** — staged analysis steps with progress

Works without an OpenAI key (demo strategist engine).

---

## Quick start

```bash
npm install
cp .env.example .env.local   # optional: OPENAI_API_KEY=sk-...
npm run dev
# → http://localhost:3000
```

---

## Project structure

```
├── app/
│   ├── api/
│   │   ├── scrape/route.js      # POST → deep website extraction
│   │   ├── generate/route.js    # POST → StrategyOutput
│   │   └── edit/route.js        # POST → per-card workflow actions
│   └── page.jsx
├── components/
│   ├── BrandIntelligencePanel.jsx
│   ├── ExtractedInsightsPanel.jsx
│   ├── CampaignGrid.jsx
│   ├── CampaignCard.jsx
│   ├── LoadingAnimation.jsx
│   └── UrlInput.jsx
├── lib/
│   ├── strategy.js              # Data model + fallbacks
│   ├── scraper.js
│   ├── ai.js
│   ├── campaignLocal.js
│   └── industry.js
```

---

## API

### `POST /api/scrape`

Body: `{ "url": "https://example.com" }`

Returns enriched scrape payload (hero sections, features, testimonials, pricing, CTAs, etc.).

### `POST /api/generate`

Body: `{ "scraped": { ... } }`

Returns:

```json
{
  "strategy": {
    "brandIntelligence": { ... },
    "extractedContent": { ... },
    "campaigns": [ ... ]
  },
  "usedAI": true
}
```

### `POST /api/edit`

Body: `{ "ad": { ...campaign }, "action": "more_premium|create_social|...", "scraped": { ... } }`

---

## Environment

| Variable | Required | Notes |
|----------|----------|-------|
| `OPENAI_API_KEY` | No | When unset → demo strategist mode |
| `OPENAI_MODEL` | No | Default `gpt-4o-mini` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | No | Shown on Contact page |

---

## License

MIT
