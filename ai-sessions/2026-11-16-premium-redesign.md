# Premium redesign (2026-11-16)

## Context — why the session happened
The owner asked for a premium redesign of kontomate.com, guided by the ui-ux-pro-max skill, that keeps the brand and messaging. A proposal was published first as a private artifact ("KontoMate Redesign Concept"), then built.

## Changes — repo + Cloudflare + search tools + external accounts
- IBM Plex Sans and Mono self-hosted in `assets/fonts/` (OFL, @fontsource 5.3.0; Latin, Latin Extended, Cyrillic). Before this, the font was declared but never loaded.
- New tokens in `assets/site.css`: paper `#f5f5f2`, ink `#16181d`, graphite, a single yellow for actions; dark theme `#0f1115` / `#171a20`.
- Hero: one status pill, shorter lead in all 8 languages, chart that draws in once, dark chat bubble.
- The read-only promise is now the only dark band, with a key card (Read ✓, Trade ✗, Withdraw ✗; new `promise.key.*` keys).
- Demo band replaced by a card with a dashboard preview.
- Pricing with Pro raised, a two-column FAQ with a contact line (`faq.more`), a four-column footer.
- Header blur, scroll-spy and fade-up reveal; all off with reduced motion.
- Asset tags on the cards were added, then removed at the owner's request.
- Commit 453b533 on `dev`; the owner merged it to `main`.
- Same design system applied to the app (`../finassist-app`, commit 71ec21f on `dev`).

## Decisions — what the user chose, and what was declined
- The skill's trust-blue palette was not used: yellow and graphite stay, for continuity with the app.
- Motion is plain CSS, not GSAP.
- The demo preview is HTML/CSS rather than a screenshot.

## Open follow-ups — what the user / next session must do
- In the app, check the less-used pages (Import, Connections, Settings, Activity logs) in both themes.
