# Search and AI visibility basics (2026-11-21)

## Context — why the session happened
Typing "kontomate" in a browser or in Google didn't find kontomate.com. Google offered "Did you mean" and its AI Overview pointed to Kontomatik, Pan Kontomate and Cotomate. The owner asked for an SEO/GEO/AEO audit and a plan for the brand query and for category queries, with English as the main task.

## Changes — repo + Cloudflare + search tools + external accounts
- **Audit:** the private artifact "KontoMate Search Plan" (claude.ai) has the evidence, diagnosis and prioritized actions A1–D4.
  - Findings: the site is new and not indexed, nothing links to it, there are no entity signals, and the name collides with Kontomatik. Redirects, canonical and robots.txt are fine.
- **Commit 2afd37d (merged to `main` by the owner):**
  - `about/` page and a footer link to it (`footer.about` in all 8 languages); it is in the sitemap.
  - JSON-LD in `index.html` and `about/index.html`: HadesFlow Organization (`@id` `https://hadesflow.com/#organization`), KontoMate WebSite (alternate name Kontomate) and WebApplication.
  - Share image `assets/og-image.png` (rendered with headless Edge), og/Twitter tags, `favicon.ico` and PNG icons.
  - `X-Robots-Tag: noindex` on `*.pages.dev` (`_headers` plus the middleware).
  - `/about/` routed through the Function; the side margin on text pages fixed on phones.
- **Second commit:** the middleware answers 404 for `README.md`, `CLAUDE.md`, `ai-sessions/` and `scripts/`. Before this, README.md and scripts were publicly downloadable. Also added `CLAUDE.md` and this folder.
- **hadesflow.com** (repo `../website`, commit 5694f7d on `dev`): JSON-LD address set to 7 Tsarnook St., 1407 Sofia (was "Sofia", 1592).
- Cloudflare, Search Console and Bing: nothing changed by Claude; these steps are for the owner.

## Decisions — what the user chose, and what was declined
- English first; the static Bulgarian page (`/bg/` with hreflang) is postponed.
- No KontoMate block or footer links on hadesflow.com for now; KontoMate will appear later on its Portfolio page only.
- Registered office confirmed: 7 Tsarnook St., Lozenets, 1407 Sofia.
- Category wording: wealth tracker, net worth and portfolio tracker, money management. Not "investing app".
- No `offers` in the JSON-LD until sign-up opens.

## Open follow-ups — what the user / next session must do
- Owner: Google Search Console and Bing Webmaster Tools (verify, sitemap, request indexing), Cloudflare Crawler Hints and AI Crawl Control, Rich Results Test (plan A1–A3).
- Owner: create KontoMate profiles (LinkedIn showcase, Product Hunt at launch, AlternativeTo, Crunchbase) and add them to `sameAs`.
- Next: English content pages (plan B5), monthly brand and AI prompt checks (D1–D3).
