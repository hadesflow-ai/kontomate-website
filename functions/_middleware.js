// Runs for the routes in _routes.json ("/" and "/api/*") and does two things:
//
// 1. Site mode. The HTML files say data-mode="soon" (waitlist, no sign-up or login), so the site is in Soon
//    mode unless the Cloudflare Pages variable SITE_MODE is "live": then this rewrites the <html> attribute
//    and the sign-up / login links show instead of the waitlist.
//    Change it in Cloudflare: Pages project kontomate-web → Settings → Variables and secrets → SITE_MODE
//    (Production), then redeploy (Deployments → latest → Retry deployment) so the new value is used.
//
// 2. Security headers. Cloudflare does not promise to apply _headers to responses that pass through a
//    Function, so the same headers are set here. KEEP THIS LIST IN STEP WITH _headers.
const SECURITY_HEADERS = {
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; form-action 'self'; base-uri 'self'; object-src 'none'",
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
};

export async function onRequest({ env, next }) {
  let response = await next();
  const isHtml = (response.headers.get("content-type") || "").includes("text/html");
  if (env.SITE_MODE === "live" && isHtml) {
    response = new HTMLRewriter()
      .on("html", { element(el) { el.setAttribute("data-mode", "live"); } })
      .transform(response);
  }
  response = new Response(response.body, response); // mutable headers
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    if (!response.headers.has(name)) response.headers.set(name, value);
  }
  return response;
}
