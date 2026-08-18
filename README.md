# FFB Guide

A reference for sim racing force feedback settings: what each setting does, how it
changes the feel, and which term every other manufacturer uses for the same
concept. Live at [ffbguide.com](https://ffbguide.com).

The site is a fully static export from markdown. No CMS, no database, no server
to maintain.

## Commands

```bash
npm run dev            # dev server on http://localhost:3000
npm run build          # validates content, then writes the static site to out/
npm run check:content  # content integrity only (runs as part of build)
npm run lint           # eslint
```

## Structure

```
content/               all site content as markdown + frontmatter — see content/README.md
src/lib/content/       schema (zod) and build-time loader; derives the cross-reference
src/app/               routes
src/components/        ui/ primitives, settings/ for the content model, layout/, shared/
scripts/               content integrity gate
public/_redirects      Cloudflare Pages redirect rules
parked/                finished-but-unbuilt code (Supabase community, Sanity) — see parked/README.md
```

## Routes

| Route | What it is |
|---|---|
| `/troubleshoot` | Describe a symptom in your own words; get the settings that influence it. |
| `/troubleshoot/[symptom]` | One complaint, with the advice resolved into your own base's controls. |
| `/glossary` | The cross-reference matrix: concepts × manufacturers. The primary page. |
| `/manufacturers` | One card per brand and its tuning software. |
| `/manufacturers/[manufacturer]` | Every setting in that software, grouped by category, plus concepts it does not expose. |
| `/manufacturers/[manufacturer]/[setting]` | The detail page: what it does, what you feel, where to start, equivalents elsewhere, interactions, sources. |
| `/categories/[category]` | All concepts in one category with every brand's term. |

## Brand

| Token | Value | Use |
|---|---|---|
| Electric blue | `#1E6BFF` | primary — buttons, fills, the logo's blue |
| Dark | `#0D1117` | page ink, the default background |
| Secondary blue | `#4CA9FF` | accent, and inline links on dark |
| Neutral | `#8B95A7` | muted text on dark |
| Light | `#F2F4F7` | text on dark, surfaces on light |

Type is Inter (300–700). Tokens live in [src/app/globals.css](src/app/globals.css); card,
border and surface steps are derived from the dark ink, since the brand defines
no separate values for them.

Two deliberate departures from a literal reading of the brand sheet, both for
legibility: inline links on dark use the secondary blue (`--link`) because the
electric blue only reaches ~3.6:1 on `#0D1117`, and light mode darkens the
neutral to `#5C6675` because `#8B95A7` on white is ~3:1. Solid fills and the
wordmark keep the electric blue.

The logo lives in [src/components/brand/Logo.tsx](src/components/brand/Logo.tsx) as
an inline SVG that follows `currentColor`, so it works on either background.
[src/app/icon.svg](src/app/icon.svg) is the favicon.

## Content model

Settings are described per manufacturer, and each one names a `concept`. The
cross-manufacturer equivalents are **derived** from that concept rather than
maintained by hand, which is what keeps adding a brand from turning into an edit
across every existing file. Categories are a fixed enum
(`damping`, `friction`, `inertia`, `spring_centering`, `filter_smoothing`,
`force_limit`, `slew_rate`, `other`); concepts and manufacturers are just files.

[content/README.md](content/README.md) has the authoring guide and the full list
of rules the build enforces.

## Two kinds of claim

The site makes two claims that must not be confused, and the content model keeps
them apart:

- **What a setting is and does** comes from the manufacturer — sourced, and
  marked `verified` only when there is a citation.
- **Which setting fixes which complaint** (`content/symptoms/`) is our own
  reasoning about how the controls interact. No manual states it, so every
  troubleshooting page says so in plain language.

Symptoms map to *concepts*, never to settings, so one symptom file works for all
eight manufacturers and adding a manufacturer never means editing symptoms. A
setting whose value runs the other way, or whose direction the manufacturer never
documents, carries a `polarity` so advice is not silently inverted.

## Content status

8 manufacturers, 35 concepts, 91 settings, 9 symptoms with 41 advice steps —
73 settings verified against manufacturer documentation or the software's own UI,
18 still draft. Draft means the label is
right but the manufacturer publishes no description, so the explanation is
inferred; the site labels those entries openly. See the promotion checklist in
[content/README.md](content/README.md).

## Deployment

Cloudflare Workers static assets, configured in
[wrangler.jsonc](wrangler.jsonc) — build command `npm run build`, deploy command
`npx wrangler deploy`. Full setup, redirects and the Pages alternative in
[deploy/CLOUDFLARE.md](deploy/CLOUDFLARE.md).
