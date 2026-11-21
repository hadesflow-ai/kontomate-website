# AI session logs

Short summaries of Claude Code working sessions on this repo: what was investigated, what changed (in the repo **and** outside it: Cloudflare, Search Console, Bing, third-party accounts), and what is still open.

The repo and git history show *what* changed. These logs keep the *why*, the decisions, and the actions that leave no trace in git.

The folder is not public: the middleware answers 404 for `/ai-sessions/*` (see `CLAUDE.md`).

## How to use (for Claude Code and humans)

- **Before starting work**, skim the index and read any log whose topic overlaps the task. Logs reflect the state *at the time*, so verify before relying on them.
- **At the end of every session**, add a log and a line in the index.
- Never put secrets (passwords, tokens, API keys, phone numbers) in a log.

## Naming

`YYYY-MM-DD-short-topic.md`, one file per session, newest at the top of the index.

## Template

```markdown
# <Topic> (<YYYY-MM-DD>)
## Context — why the session happened
## Changes — repo + Cloudflare + search tools + external accounts
## Decisions — what the user chose, and what was declined
## Open follow-ups — what the user / next session must do
```

## Index

| Date | Session | Summary |
|---|---|---|
| 2026-11-21 | [Search and AI visibility basics](2026-11-21-search-visibility.md) | SEO/GEO/AEO audit (private artifact "KontoMate Search Plan"); About page, JSON-LD (HadesFlow + KontoMate), share image and icons, noindex on pages.dev, 404 for internal files, CLAUDE.md and ai-sessions; Bulgarian page postponed; hadesflow.com address fixed in its own repo |
| 2026-11-16 | [Premium redesign](2026-11-16-premium-redesign.md) | "Quiet confidence" redesign with the ui-ux-pro-max skill: self-hosted IBM Plex, paper/ink/graphite tokens, vault band with key card, demo preview card, new pricing/FAQ/footer, scroll motion; same design applied to the app |
| 2026-11-12 | Earlier work (no log) | Site built and hosted on Cloudflare Pages (Soon mode, waitlist in KV, 8 languages, legal texts, phone layout). See `../finassist-app/ai-sessions/2026-11-11-public-demo-and-landing.md` and git history |
