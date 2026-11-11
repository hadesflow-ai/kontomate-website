# kontomate-website

The public landing page of **KontoMate** (kontomate.com). Plain static HTML, CSS and a little JavaScript: no build step, no framework, no trackers, no cookies, and no requests to other sites (the CSP in `_headers` allows only this origin).

The app itself lives in the `finassist-app` repository (app.kontomate.com); the public demo is that repository's `npm run build:demo` (demo.kontomate.com).

## Files

| Path | What |
|---|---|
| `index.html` | The page, in English (the source text). |
| `legal/index.html` | Placeholder for the legal texts until the lawyer approves them (`noindex`). |
| `404.html` | Served by Cloudflare Pages for unknown paths. |
| `assets/site.css` | Styles. Tokens match the app (`finassist-app` `src/index.css`): light `#f5f5f5` / white cards, dark `#181a20` / `#1e2329`, yellow `#fcd535` actions. |
| `assets/theme-init.js` | Applies light/dark before first paint (external because the CSP forbids inline scripts). |
| `assets/site.js` | Theme switch and language switcher. |
| `assets/i18n.js` | Language list and `READY` (languages shown in the switcher). |
| `assets/locales/<code>.js` | Translations for bg, de, es, fr, it, pl, ro (empty for now). |
| `scripts/check-i18n.mjs` | Translation check. |
| `_headers`, `robots.txt`, `sitemap.xml` | Cloudflare Pages headers (CSP, security), crawler rules. |

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
- Not investment advice: describe facts and features, never recommend assets.
- Prices and plan contents must match the app (`finassist-app` `api.plan_limits()` and Settings → Plan). Payments are not open yet.
- No trackers, analytics, font CDNs or embeds. If analytics are ever wanted, use a cookieless one and update the CSP, the footer line and the legal texts together.

## Deploying (owner's steps)

Cloudflare Pages project **`kontomate-web`**, connected to this repository once it is on GitHub:

- Framework preset: none. Build command: empty. Output directory: `/` (the repository root).
- Custom domains: `kontomate.com`, plus `www.kontomate.com` with a 301 redirect to the apex (a Bulk Redirect or a Redirect Rule in the zone).
- Not behind Cloudflare Access: it is public.
- Or upload by hand: `npx wrangler pages deploy . --project-name kontomate-web`.
