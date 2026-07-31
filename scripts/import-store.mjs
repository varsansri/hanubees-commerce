#!/usr/bin/env node
/**
 * Imports a store and its catalogue into Supabase.
 *
 *   node scripts/import-store.mjs gs-cosmatics
 *
 * Reads the same fixtures the demo site uses, so what you see before the keys
 * are set is exactly what lands in the database afterwards.
 *
 * Needs, in the environment or .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY   (server-side only — never ship this to the browser)
 *   IMPORT_OWNER_EMAIL          the account that should own the store
 *
 * The service role key bypasses Row Level Security, which is the point: this
 * runs as an operator, not as a merchant. It is the only place that key is used.
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";

for (const file of [".env.local", ".env"]) {
  if (!existsSync(file)) continue;
  for (const line of readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"\n]*)"?\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OWNER = process.env.IMPORT_OWNER_EMAIL;
const handle = process.argv[2];

if (!URL || !KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}
if (!handle) {
  console.error("Usage: node scripts/import-store.mjs <store-handle>");
  process.exit(1);
}
if (!OWNER) {
  console.error("Set IMPORT_OWNER_EMAIL to the account that should own the store.");
  process.exit(1);
}

const db = createClient(URL, KEY, { auth: { persistSession: false } });

// The fixtures are TypeScript, so pull the catalogue out of the source rather
// than adding a build step for a one-shot script.
const seed = readFileSync("src/lib/data/seed.ts", "utf8");

function storeBlock(h) {
  const re = new RegExp(`\\{[^{}]*handle:\\s*"${h}"[\\s\\S]*?\\n  \\}`, "m");
  const m = seed.match(re);
  if (!m) return null;
  const field = (k) => (m[0].match(new RegExp(`${k}:\\s*"([^"]*)"`)) || [])[1];
  return {
    id: (m[0].match(/id:\s*"([^"]*)"/) || [])[1],
    handle: h,
    name: field("name"),
    tagline: field("tagline") ?? "",
    currency: field("currency") ?? "INR",
    plan: field("plan") ?? "starter",
    accent: (m[0].match(/accent:\s*"([^"]*)"/) || [])[1] ?? "#a06912",
  };
}

function catalogue(storeId) {
  const re = new RegExp(`${storeId}:\\s*\\[([\\s\\S]*?)\\n  \\],`, "m");
  const m = seed.match(re);
  if (!m) return [];
  return [...m[1].matchAll(/\{\s*title:\s*"([^"]+)",\s*category:\s*"([^"]+)",\s*price:\s*(\d+)\s*\}/g)]
    .map(([, title, category, price]) => ({ title, category, price: Number(price) }));
}

const store = storeBlock(handle);
if (!store) {
  console.error(`No fixture found for handle "${handle}".`);
  process.exit(1);
}
const items = catalogue(store.id);
console.log(`${store.name}: ${items.length} products`);

const { data: users, error: userErr } = await db.auth.admin.listUsers();
if (userErr) throw userErr;
const owner = users.users.find((u) => u.email?.toLowerCase() === OWNER.toLowerCase());
if (!owner) {
  console.error(`No account found for ${OWNER}. Sign up at /login first.`);
  process.exit(1);
}

const { data: existing } = await db.from("stores").select("id").eq("handle", handle).maybeSingle();
let storeId = existing?.id;

if (storeId) {
  console.log("Store already exists — updating it and adding any missing products.");
  await db.from("stores").update({
    name: store.name, tagline: store.tagline, currency: store.currency,
    plan: store.plan, accent: store.accent,
  }).eq("id", storeId);
} else {
  const { data, error } = await db.from("stores").insert({
    owner_id: owner.id, handle, name: store.name, tagline: store.tagline,
    currency: store.currency, plan: store.plan, accent: store.accent,
  }).select("id").single();
  if (error) throw error;
  storeId = data.id;
  console.log(`Created store ${handle}`);
}

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
let added = 0, skipped = 0;

for (const item of items) {
  const s = slug(item.title);
  const { data: found } = await db
    .from("products").select("id").eq("store_id", storeId).eq("slug", s).maybeSingle();
  if (found) { skipped++; continue; }

  const { data: product, error } = await db.from("products").insert({
    store_id: storeId,
    title: item.title,
    slug: s,
    description: "",
    status: "active",
    price: item.price,
    category: item.category,
  }).select("id").single();
  if (error) { console.error(`  ${item.title}: ${error.message}`); continue; }

  await db.from("variants").insert({
    product_id: product.id, title: "Default",
    sku: `${handle.toUpperCase().slice(0, 6)}-${String(added + 1).padStart(3, "0")}`,
    price: item.price, inventory: 0,
  });
  added++;
}

console.log(`\nDone. ${added} added, ${skipped} already there.`);
console.log(`Open  https://hanubees.com/admin/${handle}`);
console.log("\nStock is 0 on everything — set real numbers in the admin.");
console.log("Product images are not imported: the source used stock photos.");
