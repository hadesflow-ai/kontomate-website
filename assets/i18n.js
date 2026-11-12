// Languages of the landing page. English is the text in the HTML itself (the source, and what search engines
// and no-JS visitors see). Every other language is a file in assets/locales/<code>.js that sets
// KM_I18N.strings.<code> = { "<data-i18n key>": "text", ... } and is loaded only when chosen.
//
// A language appears in the switcher only once it is listed in READY: add it there when
// `node scripts/check-i18n.mjs` reports it complete. Until then the switcher stays hidden (English only).
window.KM_I18N = {
  // Same codes and order as the app (finassist-app src/i18n/index.ts).
  languages: [
    { code: "en", label: "English" },
    { code: "bg", label: "Български" },
    { code: "de", label: "Deutsch" },
    { code: "es", label: "Español" },
    { code: "fr", label: "Français" },
    { code: "it", label: "Italiano" },
    { code: "pl", label: "Polski" },
    { code: "ro", label: "Română" },
  ],
  READY: ["en", "bg", "de", "es", "fr", "it", "pl", "ro"],
  strings: {},
};
