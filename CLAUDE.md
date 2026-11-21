# CLAUDE.md — kontomate.com

Context for AI assistants working on this repo: the public landing page of KontoMate, a read-only wealth tracker made by HadesFlow Ltd. The app itself is `../finassist-app` (repo `kontomate-app`). The team playbook is `../docs/playbook/`.

> **Before starting:** read the index in `ai-sessions/README.md` and any log whose topic overlaps the task. `README.md` explains the files, Soon/Live mode, the waitlist, languages and the search setup.

## Stack and hosting

- Static HTML, CSS and JS, no build step. Cloudflare Pages project `kontomate-web`, output directory `/` (the repo root). Production branch `main` → kontomate.com; work on `dev` and merge to `main` to deploy.
- Pages Functions: `functions/_middleware.js` (Soon/Live via the `SITE_MODE` variable, security headers, noindex on `*.pages.dev`, 404 for internal files), `functions/api/waitlist.js` (Workers KV `WAITLIST`). `_routes.json` lists the paths the Functions run for.
- Preview locally: `.claude/launch.json` (`python -m http.server 4187`). The local server sends no CSP; the live site does.

## Internal files are public unless blocked

Pages serves every file in the repo. `README.md`, `CLAUDE.md`, `ai-sessions/` and `scripts/` answer 404 because the middleware blocks them, and they are listed in `_routes.json` so the middleware runs for them. **A new internal file or folder must be added in both places.** Never commit secrets.

## Rules

- **No third-party requests:** no font CDNs, analytics or trackers (the strict CSP in `_headers` and the middleware forbids them; the site promises "no ads, no trackers"). Fonts are self-hosted in `assets/fonts/`.
- **After any change in `assets/`:** run `node scripts/stamp-assets.mjs` (cache-busting `?v=`). After text changes: `node scripts/check-i18n.mjs` (all 8 languages must stay complete). New visible text gets a `data-i18n` key and a translation in every `assets/locales/*.js`.
- **Copy:** KontoMate is a wealth *tracker*: tracking only, never moves money, not investment advice, no bank connections (statements are imported). Don't call it an "investing app"; use "wealth management" only to say it isn't one.
- **Company facts** (HadesFlow Ltd., UIC 208438230, 7 Tsarnook St., Lozenets, 1407 Sofia) must match in `legal/` (legal notice), `about/` and the JSON-LD in `index.html` and `about/index.html`.
- **Search:** keep `sitemap.xml` (with `lastmod`) in step with indexable pages. `/legal/` stays `noindex` until the lawyer approves it. The plan is the private artifact "KontoMate Search Plan".
- **Design:** tokens in `assets/site.css` (paper / ink / graphite, yellow only for the main action). Check 375, 768 and 1366 px in light and dark.
- **ai-sessions:** at the end of every session write `ai-sessions/YYYY-MM-DD-topic.md` and an index line (repo changes **and** changes in Cloudflare, Search Console and other accounts; decisions; open follow-ups). No secrets.
