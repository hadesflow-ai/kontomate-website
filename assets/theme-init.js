// Applies the saved light/dark theme before first paint (no flash). External file: the CSP blocks inline scripts.
// Same logic as the app's public/theme-init.js; its own key, since the landing and the app are different origins.
(function () {
  var pref = "system";
  try { pref = localStorage.getItem("kontomate-theme") || "system"; } catch (e) { /* storage blocked */ }
  var dark = pref === "dark" || (pref !== "light" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", dark ? "#181a20" : "#f5f5f5");
})();
