// Site mode switch. The HTML files say data-mode="soon" (waitlist, no sign-up or login), so the site is
// in Soon mode unless the Cloudflare Pages variable SITE_MODE is "live": then this rewrites the <html>
// attribute and the sign-up / login links show instead of the waitlist.
//
// Change it in Cloudflare: Pages project kontomate-web → Settings → Variables and secrets → SITE_MODE
// (Production), then redeploy (Deployments → latest → Retry deployment) so the new value is used.
// _routes.json limits the Functions to the pages and /api/*, so static assets never run through here.
export async function onRequest({ env, next }) {
  const response = await next();
  if (env.SITE_MODE !== "live") return response;
  if (!(response.headers.get("content-type") || "").includes("text/html")) return response;
  return new HTMLRewriter()
    .on("html", { element(el) { el.setAttribute("data-mode", "live"); } })
    .transform(response);
}
