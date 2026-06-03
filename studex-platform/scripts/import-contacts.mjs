#!/usr/bin/env node
// Import + dedupe B2B prospect spreadsheets from data/contacts/ into Supabase.
//
// Usage:
//   node --env-file=.env scripts/import-contacts.mjs --dry-run   # preview
//   node --env-file=.env scripts/import-contacts.mjs             # write
//
// Reads every .csv and .json in data/contacts/, normalises columns,
// dedupes across files (by email or name+website), and upserts to `contacts`.

import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync } from "node:fs";
import { join, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "data", "contacts");

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has("--dry-run");

// ------- inlined CSV parser (matches src/lib/csv.ts) -------
function parseCSV(text) {
  const rows = splitRows(text);
  if (rows.length === 0) return [];
  const headers = rows[0].map((h) => h.trim());
  const out = [];
  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i];
    if (cells.length === 1 && cells[0] === "") continue;
    const row = {};
    headers.forEach((h, j) => (row[h] = (cells[j] ?? "").trim()));
    out.push(row);
  }
  return out;
}
function splitRows(text) {
  const rows = []; let cur = []; let cell = ""; let inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"') { if (text[i+1] === '"') { cell += '"'; i++; } else inQ = false; }
      else cell += c;
      continue;
    }
    if (c === '"' && cell === "") { inQ = true; continue; }
    if (c === ",") { cur.push(cell); cell = ""; continue; }
    if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i+1] === "\n") i++;
      cur.push(cell); rows.push(cur); cur = []; cell = ""; continue;
    }
    cell += c;
  }
  if (cell !== "" || cur.length > 0) { cur.push(cell); rows.push(cur); }
  return rows;
}

// ------- normalisation (matches src/lib/contacts.ts) -------
const HEADER_MAP = {
  name: "name", business: "name", company: "name",
  email: "email", "e-mail": "email",
  website: "website", url: "website", site: "website",
  type: "business_type", "business type": "business_type",
  category: "tier", tier: "tier",
  region: "region", province: "region",
  country: "country",
  product: "product", products: "product", "product interest": "product",
  priority: "priority",
  biltong_score: "biltong_score", "biltong score": "biltong_score",
  website_score: "website_score", "website score": "website_score",
  status: "status_in",
  notes: "notes", comment: "notes", comments: "notes",
};
const VALID_TIERS = new Set(["A", "B", "C", "D"]);
const STATUS_RANK = { lead: 0, ready: 1, contacted: 2, responded: 3, customer: 4, rejected: 5, unsubscribed: 6, bounced: 7 };

function normalizeEmail(v) {
  if (!v) return null;
  const t = v.trim().toLowerCase();
  return t && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t) ? t : null;
}
function normalizeWebsite(v) {
  if (!v) return null;
  let s = v.trim();
  if (!s || s.toUpperCase() === "N/A") return null;
  if (!/^https?:\/\//i.test(s)) s = "https://" + s;
  try { const u = new URL(s); return u.protocol + "//" + u.host.toLowerCase().replace(/^www\./, ""); }
  catch { return null; }
}
function parseProducts(v) {
  if (!v) return [];
  return v.split(/[+,/]/).map((s) => s.trim()).filter(Boolean);
}
function toInt(v) { if (!v) return null; const n = parseInt(v, 10); return Number.isFinite(n) ? n : null; }

function normalizeRow(row, source) {
  const raw = {};
  for (const [k, v] of Object.entries(row)) {
    const key = HEADER_MAP[k.trim().toLowerCase()];
    if (key && v) raw[key] = v;
  }
  let name = (raw.name || "").trim();
  if (!name && raw.website) {
    try { name = new URL(/^https?:/i.test(raw.website) ? raw.website : "https://" + raw.website).host.replace(/^www\./, ""); } catch {}
  }
  if (!name) return null;
  const tierUpper = (raw.tier || "").trim().toUpperCase().charAt(0);
  const tier = VALID_TIERS.has(tierUpper) ? tierUpper : null;
  let status = "lead";
  const statusRaw = (raw.status_in || "").trim().toLowerCase();
  if (statusRaw === "ready") status = "ready";
  else if (statusRaw === "contacted") status = "contacted";
  return {
    name,
    email: normalizeEmail(raw.email),
    website: normalizeWebsite(raw.website),
    business_type: (raw.business_type || "").trim() || null,
    tier,
    region: (raw.region || "").trim() || null,
    country: (raw.country || "").trim() || null,
    product_interest: parseProducts(raw.product),
    priority: toInt(raw.priority),
    biltong_score: toInt(raw.biltong_score),
    website_score: toInt(raw.website_score),
    status,
    notes: (raw.notes || "").trim() || null,
    tags: [],
    source: [source],
  };
}
function dedupKey(c) {
  if (c.email) return `e:${c.email}`;
  try { const host = c.website ? new URL(c.website).host : ""; return `nw:${c.name.toLowerCase()}|${host}`; }
  catch { return `n:${c.name.toLowerCase()}`; }
}
function mergeContacts(a, b) {
  const pickStr = (x, y) => x || y;
  const pickNum = (x, y) => (x == null ? y : y == null ? x : Math.max(x, y));
  return {
    name: a.name.length >= b.name.length ? a.name : b.name,
    email: a.email || b.email,
    website: a.website || b.website,
    business_type: pickStr(a.business_type, b.business_type),
    tier: pickStr(a.tier, b.tier),
    region: pickStr(a.region, b.region),
    country: pickStr(a.country, b.country),
    product_interest: [...new Set([...a.product_interest, ...b.product_interest])],
    priority: pickNum(a.priority, b.priority),
    biltong_score: pickNum(a.biltong_score, b.biltong_score),
    website_score: pickNum(a.website_score, b.website_score),
    status: STATUS_RANK[a.status] >= STATUS_RANK[b.status] ? a.status : b.status,
    notes: a.notes && b.notes && a.notes !== b.notes ? `${a.notes}\n${b.notes}` : a.notes || b.notes,
    tags: [...new Set([...a.tags, ...b.tags])],
    source: [...new Set([...a.source, ...b.source])],
  };
}

// ------- main -------
const files = readdirSync(DATA_DIR).filter((f) => /\.(csv|json)$/i.test(f) && !f.startsWith("."));
if (files.length === 0) {
  console.error(`No .csv or .json files in ${DATA_DIR}`);
  process.exit(1);
}

const merged = new Map();
const stats = { perFile: {}, totalRows: 0, withEmail: 0 };

for (const file of files) {
  const text = readFileSync(join(DATA_DIR, file), "utf8");
  let rows = [];
  if (file.toLowerCase().endsWith(".json")) {
    const json = JSON.parse(text);
    rows = Array.isArray(json) ? json : [];
  } else {
    rows = parseCSV(text);
  }
  const source = basename(file);
  let added = 0;
  for (const r of rows) {
    const c = normalizeRow(r, source);
    if (!c) continue;
    added++;
    const key = dedupKey(c);
    const existing = merged.get(key);
    merged.set(key, existing ? mergeContacts(existing, c) : c);
  }
  stats.perFile[source] = added;
  stats.totalRows += added;
}

const contacts = [...merged.values()];
stats.withEmail = contacts.filter((c) => c.email).length;

// Tier / country / product breakdowns
const byTier = {}, byCountry = {}, byProduct = {};
for (const c of contacts) {
  byTier[c.tier || "—"] = (byTier[c.tier || "—"] || 0) + 1;
  byCountry[c.country || "—"] = (byCountry[c.country || "—"] || 0) + 1;
  for (const p of c.product_interest) byProduct[p] = (byProduct[p] || 0) + 1;
}

console.log("\n== Import preview ==");
console.log(`Files:        ${files.length}`);
console.log(`Rows seen:    ${stats.totalRows}`);
console.log(`Unique:       ${contacts.length}`);
console.log(`With email:   ${stats.withEmail}`);
console.log(`Per file:    `, stats.perFile);
console.log(`By tier:     `, byTier);
console.log(`By country:  `, byCountry);
console.log(`By product:  `, byProduct);

if (DRY_RUN) {
  console.log("\n(dry-run — nothing written)\n");
  console.log("Sample row:", contacts[0]);
  process.exit(0);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env.");
  process.exit(1);
}
const sb = createClient(url, key, { auth: { persistSession: false } });

// Upsert in chunks. Conflict target: lower(email) when present.
// Rows without email use the partial unique index on (lower(name), lower(website)).
let written = 0, failed = 0;
for (const batch of chunk(contacts, 200)) {
  // Split by has-email vs no-email so we can target the right conflict index.
  const withE = batch.filter((c) => c.email);
  const noE = batch.filter((c) => !c.email);

  if (withE.length) {
    const { error } = await sb.from("contacts").upsert(withE, { onConflict: "email", ignoreDuplicates: false });
    if (error) { console.error("[withE] upsert error:", error.message); failed += withE.length; }
    else written += withE.length;
  }
  if (noE.length) {
    // No clean upsert target without email; fall back to insert + skip-duplicate.
    const { error } = await sb.from("contacts").insert(noE);
    if (error && !/duplicate key/i.test(error.message)) {
      console.error("[noE] insert error:", error.message); failed += noE.length;
    } else { written += noE.length; }
  }
}

console.log(`\nWritten: ${written}  Failed: ${failed}\n`);

function* chunk(arr, n) { for (let i = 0; i < arr.length; i += n) yield arr.slice(i, i + n); }
