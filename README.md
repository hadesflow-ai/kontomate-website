# kontomate-website

The public landing page of **KontoMate** (kontomate.com). Plain static HTML, CSS and a little JavaScript: no build step, no framework, no trackers, no cookies, and no requests to other sites (the CSP in `_headers` allows only this origin). Two small Cloudflare Pages Functions switch the site between **Soon** and **Live** and keep the launch waitlist.

The app itself lives in the `finassist-app` repository (app.kontomate.com); the public demo is that repository's `npm run build:demo` (demo.kontomate.com).

## Files

| Path | What |
|---|---|
| `index.html` | The page, in English (the source text). |
| `legal/index.html` | The legal texts (English; derived from `finassist-app` `docs/legal/`, to be confirmed by the lawyer). |
| `404.html` | Served by Cloudflare Pages for unknown paths. |
| `assets/site.css` | Styles. Tokens match the app (`finassist-app` `src/index.css`): light `#f5f5f5` / white cards, dark `#181a20` / `#1e2329`, yellow `#fcd535` actions. |
| `assets/theme-init.js` | Applies light/dark before first paint (external because the CSP forbids inline scripts). |
| `assets/site.js` | Theme switch and language switcher. |
| `assets/i18n.js` | Language list and `READY` (languages shown in the switcher). |
| `assets/locales/<code>.js` | Translations for bg, de, es, fr, it, pl, ro (same languages as the app). |
| `scripts/check-i18n.mjs` | Translation check. |
| `functions/_middleware.js` | Soon / Live switch from the `SITE_MODE` variable (see below). |
| `functions/api/waitlist.js` | `POST /api/waitlist`: keeps an e-mail in Workers KV for the launch notice. |
| `_routes.json` | Runs the Functions only for `/` and `/api/*`; everything else is plain static files. |
| `_headers`, `robots.txt`, `sitemap.xml` | Cloudflare Pages headers (CSP, security), crawler rules. |

## Soon and Live

The site has two modes, set by the Cloudflare Pages variable **`SITE_MODE`**:

| `SITE_MODE` | What visitors see |
|---|---|
| missing or anything but `live` (**Soon**, the default) | "Opening soon" badge, the demo as the main button, a "notify me" e-mail form. No sign-up, no login links. |
| `live` | Sign-up and login buttons; the waitlist form and the Soon texts are hidden, and `/api/waitlist` answers `closed`. |

In the HTML, Soon-only elements have the class `soon-only` and Live-only ones `live-only`; the files themselves say `data-mode="soon"` on `<html>`, and `functions/_middleware.js` rewrites it to `live` when the variable says so. So a local static preview always shows Soon (set `document.documentElement.dataset.mode = "live"` in the console to see Live).

To go live: Cloudflare → Workers & Pages → `kontomate-web` → Settings → Variables and secrets → add `SITE_MODE` = `live` for Production → Deployments → latest → **Retry deployment** (a variable change applies to the next deployment). Back to Soon: delete the variable or set it to `soon`, and redeploy.

## Waitlist

The form posts to `/api/waitlist`, which stores `{email, lang, at, consent}` (consent = the version date of the consent wording, `CONSENT_VERSION`: bump it when the checkbox text or the privacy section changes) under the key `email` in a Workers KV namespace. Nothing else is kept (no IP address). Each entry expires by itself after 12 months.

One-time setup:

1. Cloudflare → Storage & Databases → KV → create a namespace `kontomate-waitlist`.
2. Pages project `kontomate-web` → Settings → Bindings → add KV namespace, variable name **`WAITLIST`**, the namespace above (Production, and Preview if you test there). Redeploy.
3. Recommended: a rate-limiting rule (Security → WAF → Rate limiting) on `/api/waitlist`, e.g. 5 requests per minute per IP.

Without the binding the form answers "Something went wrong", nothing is lost silently.

Export the list (for the launch e-mail):

```bash
npx wrangler kv key list --namespace-id <id> > waitlist-keys.json
```

The keys are the addresses; `npx wrangler kv key get --namespace-id <id> "<email>"` shows the language and date. After the launch e-mail has gone out, delete the namespace (or every key): the privacy text promises the addresses are deleted then. Requests to be removed earlier: `npx wrangler kv key delete --namespace-id <id> "<email>"`.

Local test of the Functions (needs the KV binding): `npx wrangler pages dev . --port 4180 --kv WAITLIST --binding SITE_MODE=soon`.

## Preview locally

Any static server from this folder works. With Python:

```bash
python -m http.server 4180 --bind 127.0.0.1
```

Then open http://localhost:4180. Or with Cloudflare's own server (also applies `_headers`):

```bash
npx wrangler pages dev . --port 4180
```

Check light and dark (the moon/sun button, or your system setting) at 375, 768 and 1280 px.

## Languages

English is the text in the HTML; every translatable element has a `data-i18n="key"` (or `data-i18n-attr="attribute:key"`). Other languages live in `assets/locales/<code>.js` and are loaded only when chosen.

1. List every key with its English text for a translator:

   ```bash
   node scripts/check-i18n.mjs --print > strings-en.json
   ```

2. Put the translations in `assets/locales/<code>.js` (`KM_I18N.strings.<code> = { "hero.title": "…", … }`).
3. Run `node scripts/check-i18n.mjs`; when a language shows all keys translated, add its code to `READY` in `assets/i18n.js`. The switcher appears as soon as two languages are ready. `?lang=bg` picks a language from a link.

When the page grows, consider one pre-rendered page per language (`/bg/`, `/de/`…) for search engines; the keys stay the same.

## Rules for the copy

- KontoMate only reads. Never write anything suggesting it pays, transfers, buys, sells or invests.
- No bank connections (no PSD2 / open banking): bank accounts come in by importing statements (file, PDF or photo). Brokers and exchanges connect with read-only keys.
- Say "wealth app" or "wealth tracker", not "wealth management": KontoMate is not a regulated adviser or manager.
- Not investment advice: describe facts and features, never recommend assets.
- Prices and plan contents must match the app (`finassist-app` `api.plan_limits()` and Settings → Plan). Payments are not open yet.
- No trackers, analytics, font CDNs or embeds. If analytics are ever wanted, use a cookieless one and update the CSP, the footer line and the legal texts together.

## Deploying (owner's steps)

Cloudflare Pages project **`kontomate-web`**, connected to this repository once it is on GitHub:

- Framework preset: none. Build command: empty. Output directory: `/` (the repository root).
- Custom domains: `kontomate.com`, plus `www.kontomate.com` with a 301 redirect to the apex (a Bulk Redirect or a Redirect Rule in the zone).
- Not behind Cloudflare Access: it is public.
- Or upload by hand: `npx wrangler pages deploy . --project-name kontomate-web`.
