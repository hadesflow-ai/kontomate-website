# 27.11.2026: import only, and why KontoMate is safe

## Why
On 27.11.2026 the app (`../finassist-app`) became import-only, after a legal review:
- no bank connections;
- no platform API keys or sync (Binance, Trading 212, IBKR, eToro, Kraken, Coinbase, Bybit);
- everything comes from files the user imports.

The site still promised read-only API keys and named the platforms. The owner wanted to:
- remove those promises;
- show plainly that KontoMate can't reach anything else;
- align the legal texts with the app's drafts.

## Owner decisions (asked this session)
- **AI provider in the legal texts:** Eden AI (EU, France), matching the app's drafts. The switch from OpenRouter is still on the app's TODO (L4) and must happen before launch.
- **E-mail:** Brevo (France, EU) for everything, including the waitlist launch e-mail. Google Workspace is no longer listed.
- **Pricing:** use the app's real limits.
  - Free: unlimited accounts and platforms by import, 10 assistant messages and 5 AI imports a month, 3 goals.
  - Pro: 100 messages and 30 AI imports a month, unlimited goals.
- **No platform names in features or FAQ.** Brokers and exchanges are "imported the same way". This also avoids implying a partnership.

## Changes
- **`index.html` and all 7 locale files:**
  - **Hero and features:** the hero lead now says "from the files you import, never connects to your accounts". The trust row says "No logins or keys" (was "Encrypted keys"). The stocks and crypto cards describe statements, exports and screenshots.
  - **Security section ("It can look. It can't touch."):** the key card became "What KontoMate can reach": files you import ✓; your bank, your brokers and exchanges, your other apps ✗ (no access). The cards are now "No logins, no passwords, no keys", "Walled off from your other apps" and "Your data, under your control".
  - **Pricing:** Free and Pro lines use the real limits.
  - **FAQ:** a new question, "Can KontoMate see my bank or my other apps?". "Is it secure?", "Which banks and platforms work?" and "Can KontoMate move my money?" were rewritten.
  - **Metadata:** og:description and the JSON-LD featureList updated.
- **`about/`:** the investments bullet and "Your data" updated (no keys, can't reach other apps); dated 27.11.2026.
- **`legal/` (dated 27.11.2026):**
  - where brokers' and exchanges' data comes from (imported, no connection);
  - privacy sources and security;
  - transfers outside the EU (OpenRouter and Google removed);
  - recipients: Eden AI (France) and Anthropic through it, Brevo for every e-mail, brokers removed, "no bank, broker, exchange or open-banking provider";
  - AI notice: the model is reached through Eden AI;
  - the AI support sees imported accounts, not connections;
  - acceptable use.
- **Other files:** `README.md` copy rule, `sitemap.xml` lastmod, and the `site.css` comment. Assets were stamped and `check-i18n` passes (8 × 151).
- **App repo (`finassist-app` `docs/legal`):** Google Workspace replaced by Brevo in the subprocessors, privacy, brief and records of processing.

## Checked
- Local server (`.claude/launch.json` "website" in the app repo), English and Bulgarian, 1280 px and 375 px: no overflow.
- The "can reach" card and the FAQ show in both languages.

## Follow-ups
- Eden AI switch and its data processing agreement (app TODO L4) before the legal page goes public. Accept Brevo's data processing agreement in the Brevo account.
- Lawyer review of the legal texts (app TODO L5); `/legal/` stays noindex until then.
- Use "wealth tracker", not "wealth management", in the copy (README rule): KontoMate isn't a regulated manager.
