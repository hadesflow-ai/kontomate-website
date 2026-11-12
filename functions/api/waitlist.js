// POST /api/waitlist: keeps an e-mail address to tell that person, once, when sign-up opens.
// Stored in the Workers KV namespace bound as WAITLIST: key = the address (lower case), value =
// {email, lang, at, consent}. Nothing else is kept (no IP address, no user agent). Each entry expires by itself
// 12 months after sign-up; delete the whole list once the launch e-mail has gone out (README → Waitlist).
//
// Accepts JSON (the page's script → JSON answer) or a plain form post (no JavaScript → 303 back to
// /?waitlist=<result>#waitlist). Results: ok | invalid | consent | closed | error.
const LANGS = ["en", "bg", "de", "es", "fr", "it", "pl", "ro"];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const YEAR = 365 * 24 * 60 * 60;
// Which consent wording the person agreed to (index.html waitlist.consent + legal/#waitlist). Bump it
// whenever either text changes, so each entry can be matched to the words it was given under.
const CONSENT_VERSION = "2026-11-12";

export async function onRequestPost({ request, env }) {
  const isJson = (request.headers.get("content-type") || "").includes("application/json");
  const reply = (status, result) =>
    isJson
      ? new Response(JSON.stringify({ result }), {
          status,
          headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
        })
      : Response.redirect(new URL(`/?waitlist=${result}#waitlist`, request.url).toString(), 303);

  // Only from our own pages.
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return reply(403, "error");
  if (env.SITE_MODE === "live") return reply(410, "closed");

  let data = {};
  try {
    data = isJson ? await request.json() : Object.fromEntries(await request.formData());
  } catch {
    return reply(400, "invalid");
  }

  // Honeypot filled in: a bot. Answer as if it worked, store nothing.
  if (data.website) return reply(200, "ok");

  const email = String(data.email || "").trim().toLowerCase();
  if (email.length > 254 || !EMAIL.test(email)) return reply(400, "invalid");
  if (data.consent !== true && data.consent !== "yes") return reply(400, "consent");
  const lang = LANGS.includes(data.lang) ? data.lang : "en";

  if (!env.WAITLIST) return reply(503, "error");
  try {
    // Already on the list: keep the first sign-up date, answer the same way (no way to probe the list).
    if (!(await env.WAITLIST.get(email))) {
      await env.WAITLIST.put(email, JSON.stringify({ email, lang, at: new Date().toISOString(), consent: CONSENT_VERSION }), {
        expirationTtl: YEAR,
      });
    }
  } catch {
    return reply(500, "error");
  }
  return reply(200, "ok");
}
