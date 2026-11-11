#!/usr/bin/env node
// Checks the landing page translations: every data-i18n key in the HTML pages against assets/locales/<code>.js.
//   node scripts/check-i18n.mjs           → per language: missing and unknown keys; exit 1 if a READY language is incomplete
//   node scripts/check-i18n.mjs --print   → every key with its English text (JSON), to hand to a translator
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PAGES = ["index.html", "legal/index.html"];

const english = {};
for (const page of PAGES) {
  const html = fs.readFileSync(path.join(root, page), "utf8");
  for (const m of html.matchAll(/data-i18n="([^"]+)"[^>]*>([^<]*)</g)) {
    const text = m[2].replace(/\s+/g, " ").trim();
    if (english[m[1]] !== undefined && english[m[1]] !== text) console.warn(`Key ${m[1]} has two different English texts`);
    english[m[1]] = text;
  }
  for (const m of html.matchAll(/(\w[\w-]*)="([^"]*)"[^>]*data-i18n-attr="\1:([^"]+)"/g)) english[m[3]] = m[2];
}

if (process.argv.includes("--print")) {
  console.log(JSON.stringify(english, null, 2));
  process.exit(0);
}

const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root, "assets/i18n.js"), "utf8"), ctx);
ctx.KM_I18N = ctx.window.KM_I18N;
let failed = false;
for (const { code } of ctx.KM_I18N.languages) {
  if (code === "en") continue;
  vm.runInContext(fs.readFileSync(path.join(root, `assets/locales/${code}.js`), "utf8"), ctx);
  const dict = ctx.KM_I18N.strings[code] ?? {};
  const missing = Object.keys(english).filter((k) => !dict[k]);
  const unknown = Object.keys(dict).filter((k) => !(k in english));
  const ready = ctx.KM_I18N.READY.includes(code);
  console.log(`${code}: ${Object.keys(english).length - missing.length}/${Object.keys(english).length} translated${unknown.length ? `, unknown keys: ${unknown.join(", ")}` : ""}${ready ? " (READY)" : ""}`);
  if (ready && (missing.length || unknown.length)) { failed = true; console.log(`  missing: ${missing.join(", ")}`); }
}
process.exit(failed ? 1 : 0);
