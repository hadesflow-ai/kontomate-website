#!/usr/bin/env node
// Cache-busting for the static files. Cloudflare (and browsers) keep /assets/* for hours, so a changed
// site.js or site.css would not reach visitors until the cache expires. This script adds ?v=<hash of
// everything in assets/> to every assets/ link in the HTML pages; any change in assets/ gives new URLs.
// assets/site.js passes the same ?v= on to the language files it loads.
//
//   node scripts/stamp-assets.mjs           → update the links (run before committing a change in assets/)
//   node scripts/stamp-assets.mjs --check   → exit 1 if a page still points at an older version
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PAGES = ["index.html", "legal/index.html", "404.html"];

const files = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else files.push(full);
  }
})(path.join(root, "assets"));

const hash = crypto.createHash("sha256");
for (const file of files.sort()) {
  hash.update(path.relative(root, file).replace(/\\/g, "/"));
  hash.update(fs.readFileSync(file).toString("utf8").replace(/\r\n/g, "\n")); // same hash on Windows and Linux
}
const version = hash.digest("hex").slice(0, 10);

const check = process.argv.includes("--check");
let stale = false;
for (const page of PAGES) {
  const file = path.join(root, page);
  const html = fs.readFileSync(file, "utf8");
  const next = html.replace(/((?:src|href)="(?:\.\.\/|\/)?assets\/[^"?]+)(?:\?v=[0-9a-f]+)?"/g, `$1?v=${version}"`);
  if (next !== html) {
    stale = true;
    if (!check) fs.writeFileSync(file, next);
    console.log(`${check ? "stale" : "stamped"}: ${page}`);
  }
}
console.log(`assets version ${version}${stale ? "" : " (pages up to date)"}`);
if (check && stale) process.exit(1);
