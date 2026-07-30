# Hanubees Commerce

A multi-tenant commerce platform — merchants get a storefront and a full admin
dashboard, the way Shopify works. Built by **Hanubees Technologies**.

- **Platform** — `hanubees.com`
- **Merchant storefronts** — `<store>.hanubees.com`, plus custom domains
- **Merchant admin** — `hanubees.com/admin/<store>`

## Status

**Design phase.** The whole product surface is built and deployable; the
persistence layer is deliberately not chosen yet. Every read goes through
`src/lib/data/index.ts`, which today resolves against deterministic in-memory
seed data. Swapping those function bodies for SQL is the entire backend
migration — no page or component changes.

What exists:

| Area | Routes |
|---|---|
| Marketing site | `/` |
| Store picker | `/admin` |
| Merchant admin | `/admin/[store]` — home, orders, order detail, products, product detail, customers, analytics, discounts, settings |
| Storefront | `/store/[handle]` — catalogue, product detail, cart |

Not built yet: authentication, checkout and payments, real cart state, and
writes of any kind. The admin's inputs and buttons are presentational.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind v4 ·
deployed on Vercel.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

To view a tenant subdomain locally, use `bloom.localhost:3000` — `src/proxy.ts`
resolves it the same way it resolves `bloom.hanubees.com`.

## How it is put together

**Tenant resolution** — `src/proxy.ts` (Next 16 renamed Middleware to Proxy)
maps `acme.hanubees.com/x` to `/store/acme/x`. Reserved labels (`www`, `admin`,
`api`, …) are never treated as stores. Vercel needs `*.hanubees.com` attached to
the project for this to receive traffic.

**The data seam** — `src/lib/data/index.ts`. Every function is `async` and takes
a `storeId`, so the tenant guard has a place to live when this becomes SQL.
`src/lib/data/seed.ts` generates the fixtures from a fixed-seed PRNG, so builds
are byte-identical and nothing drifts between server and client.

**Money** is stored in minor units (paise) everywhere and only formatted at the
edge, in `src/lib/format.ts`.

**Design tokens** live in `src/app/globals.css` as CSS custom properties, with
light and dark values that a `data-theme` stamp can override in both
directions. Admin chrome is always Hanubees honey; a storefront scopes its
merchant's accent over `--accent`, so one set of components renders every brand.

**Charts** (`src/components/charts.tsx`) each plot a single measure, so colour
does no identity work — magnitude is length or position, and the honey mark
colour is validated at ≥3:1 against both the light and dark surface. Deltas ship
an arrow glyph alongside the status colour, and the analytics page repeats its
charts as a table.

**Product imagery** is generated gradient swatches, not stock photography —
there is nothing here to licence-clear before launch, and no placeholder that
could accidentally ship as real.

## Next decisions

1. Persistence + auth (Postgres via Neon or Supabase; row-level tenant isolation).
2. Cart and checkout state, then payments (Razorpay for UPI/COD).
3. Writes: product editing, fulfilment, discount creation.
