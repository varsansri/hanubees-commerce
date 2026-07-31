import type {
  Customer,
  Discount,
  MetricPoint,
  Order,
  Product,
  Store,
  StoreMetrics,
} from "../types";

/* --------------------------------------------------------------------------
   Deterministic seed data.

   Everything is generated from a fixed-seed PRNG so the UI renders identically
   on every build — no hydration drift, no snapshot churn. Product imagery is
   generated as gradient swatches rather than stock photography, so nothing here
   has to be licence-cleared before launch.
   -------------------------------------------------------------------------- */

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const rand = rng(20260730);
const pick = <T,>(arr: readonly T[]) => arr[Math.floor(rand() * arr.length)];
const between = (min: number, max: number) =>
  Math.floor(rand() * (max - min + 1)) + min;

/** A gradient swatch stands in for product photography. */
export function swatch(index: number): string {
  const pairs = [
    ["#f6d365", "#fda085"],
    ["#a8edea", "#fed6e3"],
    ["#d4a373", "#faedcd"],
    ["#cdb4db", "#ffc8dd"],
    ["#b8c0ff", "#bbd0ff"],
    ["#ffd6a5", "#fdffb6"],
    ["#caffbf", "#9bf6ff"],
    ["#e2c391", "#c99e6a"],
  ];
  const [a, b] = pairs[index % pairs.length];
  return `linear-gradient(135deg, ${a}, ${b})`;
}

/* ------------------------------------------------------------------ stores */

export const stores: Store[] = [
  {
    id: "st_bloom",
    handle: "bloom",
    name: "Bloom & Bark",
    tagline: "Slow-made ceramics from Puducherry",
    customDomain: "bloomandbark.in",
    currency: "INR",
    plan: "growth",
    createdAt: "2026-02-11T09:00:00Z",
    theme: { accent: "#7c6a52", typography: "editorial", heroImage: swatch(2) },
  },
  {
    id: "st_volt",
    handle: "volt",
    name: "Volt Athletics",
    tagline: "Performance basics, engineered in Bengaluru",
    customDomain: null,
    currency: "INR",
    plan: "scale",
    createdAt: "2025-11-03T09:00:00Z",
    theme: { accent: "#1f6feb", typography: "modern", heroImage: swatch(4) },
  },
  {
    id: "st_saffron",
    handle: "saffron",
    name: "Saffron Supply Co.",
    tagline: "Single-origin spice, direct from growers",
    customDomain: null,
    currency: "INR",
    plan: "starter",
    createdAt: "2026-05-22T09:00:00Z",
    theme: { accent: "#c2410c", typography: "playful", heroImage: swatch(0) },
  },
  {
    id: "st_gs",
    handle: "gs-cosmatics",
    name: "GS Cosmatics",
    tagline: "Colour that behaves like skincare",
    customDomain: null,
    // Priced in USD as the source catalogue is; change it in Settings.
    currency: "USD",
    plan: "growth",
    createdAt: "2026-07-30T09:00:00Z",
    theme: { accent: "#b8912f", typography: "editorial", heroImage: swatch(7) },
  },
];

/* ---------------------------------------------------------------- products */

const CATALOG: Record<string, { title: string; category: string; price: number }[]> = {
  st_bloom: [
    { title: "Ridged Stoneware Mug", category: "Drinkware", price: 128000 },
    { title: "Ash-Glaze Dinner Plate", category: "Tableware", price: 195000 },
    { title: "Speckled Serving Bowl", category: "Tableware", price: 245000 },
    { title: "Matte Ceramic Vase", category: "Decor", price: 320000 },
    { title: "Terracotta Planter, Small", category: "Garden", price: 89000 },
    { title: "Hand-thrown Teapot", category: "Drinkware", price: 410000 },
    { title: "Linen Table Runner", category: "Textiles", price: 156000 },
    { title: "Stoneware Butter Keeper", category: "Tableware", price: 142000 },
  ],
  st_volt: [
    { title: "Aero Training Tee", category: "Tops", price: 189000 },
    { title: "Contour Compression Shorts", category: "Bottoms", price: 224000 },
    { title: "Grid Fleece Hoodie", category: "Outerwear", price: 449000 },
    { title: "Featherweight Running Cap", category: "Accessories", price: 99000 },
    { title: "Zonal Merino Sock, 3-pack", category: "Accessories", price: 134000 },
    { title: "Storm Shell Jacket", category: "Outerwear", price: 689000 },
  ],
  st_saffron: [
    { title: "Kashmiri Saffron, 2g", category: "Spice", price: 149000 },
    { title: "Tellicherry Peppercorns", category: "Spice", price: 62000 },
    { title: "Wayanad Cardamom", category: "Spice", price: 84000 },
    { title: "Cold-pressed Sesame Oil", category: "Pantry", price: 74000 },
  ],
  st_gs: [
    { title: "Velvet Rose Lipstick", category: "Lips", price: 2499 },
    { title: "Glow Serum Foundation", category: "Face", price: 4200 },
    { title: "Midnight Eyeshadow Palette", category: "Eyes", price: 5499 },
    { title: "Silk Primer Spray", category: "Face", price: 2800 },
    { title: "Volumizing Mascara", category: "Eyes", price: 2250 },
    { title: "Cream Blush Duo", category: "Face", price: 3200 },
    { title: "Hydrating Lip Gloss", category: "Lips", price: 1800 },
    { title: "Brow Defining Pencil", category: "Eyes", price: 1600 },
    { title: "Radiance Moisturizer SPF 50", category: "Skin", price: 4800 },
    { title: "Luminous Highlighter", category: "Face", price: 3600 },
    { title: "Matte Liquid Lipstick", category: "Lips", price: 2000 },
    { title: "Eyeliner Pen – Ultra Black", category: "Eyes", price: 1400 },
  ],
};

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export const products: Product[] = stores.flatMap((store) =>
  CATALOG[store.id].map((entry, i) => {
    const status =
      i === 1 && store.id === "st_saffron"
        ? "draft"
        : i === 5 && store.id === "st_bloom"
          ? "draft"
          : "active";
    const variantNames =
      store.id === "st_volt" ? ["S", "M", "L", "XL"] : ["Default"];
    return {
      id: `pr_${store.handle}_${i}`,
      storeId: store.id,
      title: entry.title,
      slug: slugify(entry.title),
      description:
        "Made in small batches with materials we can trace back to their source. " +
        "Built to be used every day, not admired from a shelf.",
      status: status as Product["status"],
      price: entry.price,
      compareAtPrice: i % 3 === 0 ? Math.round(entry.price * 1.25) : null,
      images: [swatch(i), swatch(i + 3)],
      category: entry.category,
      tags: [entry.category.toLowerCase(), "bestseller"].slice(0, i % 2 ? 1 : 2),
      createdAt: new Date(2026, 3, (i % 28) + 1).toISOString(),
      variants: variantNames.map((v, vi) => ({
        id: `va_${store.handle}_${i}_${vi}`,
        title: v,
        sku: `${store.handle.toUpperCase()}-${String(i).padStart(3, "0")}-${v}`,
        price: entry.price,
        inventory: between(0, 140),
        options: { Size: v },
      })),
    } satisfies Product;
  }),
);

/* --------------------------------------------------------------- customers */

const NAMES = [
  "Ananya Reddy", "Karthik Menon", "Priya Nair", "Rohan Iyer", "Meera Krishnan",
  "Aditya Shetty", "Divya Raghavan", "Vikram Bose", "Sneha Pillai", "Arjun Desai",
  "Lakshmi Rao", "Nikhil Varma", "Tanvi Joshi", "Rahul Sethi", "Ishita Banerjee",
  "Sanjay Kulkarni", "Neha Chopra", "Vivek Anand", "Kavya Subramanian", "Aman Gupta",
];

const CITIES = [
  "Bengaluru, KA", "Chennai, TN", "Mumbai, MH", "Coimbatore, TN", "Pune, MH",
  "Hyderabad, TS", "Kochi, KL", "Delhi, DL", "Jaipur, RJ", "Kolkata, WB",
];

export const customers: Customer[] = stores.flatMap((store, si) =>
  NAMES.slice(0, store.id === "st_saffron" ? 8 : store.id === "st_gs" ? 20 : 16).map((name, i) => {
    const ordersCount = between(1, 9);
    return {
      id: `cu_${store.handle}_${i}`,
      storeId: store.id,
      name,
      email: `${slugify(name).replace("-", ".")}@example.com`,
      phone: i % 3 === 0 ? `+91 9${between(100000000, 899999999)}` : null,
      ordersCount,
      totalSpent: ordersCount * between(120000, 480000),
      subscribed: i % 4 !== 0,
      location: CITIES[(i + si) % CITIES.length],
      createdAt: new Date(2026, (i % 6) + 1, (i % 27) + 1).toISOString(),
      lastOrderAt:
        i % 7 === 0
          ? null
          : new Date(2026, 6, ((i * 3) % 28) + 1, 14, 30).toISOString(),
    } satisfies Customer;
  }),
);

/* ------------------------------------------------------------------ orders */

const STATUS_MIX: Order["fulfillmentStatus"][] = [
  "unfulfilled", "fulfilled", "fulfilled", "fulfilled", "partial", "unfulfilled",
];
const PAYMENT_MIX: Order["paymentStatus"][] = [
  "paid", "paid", "paid", "pending", "paid", "refunded",
];
const CHANNELS: Order["channel"][] = ["online", "online", "online", "instagram", "whatsapp", "pos"];

export const orders: Order[] = stores.flatMap((store) => {
  const storeProducts = products.filter((p) => p.storeId === store.id);
  const storeCustomers = customers.filter((c) => c.storeId === store.id);
  const count = store.id === "st_saffron" ? 14 : store.id === "st_gs" ? 41 : 32;

  return Array.from({ length: count }, (_, i) => {
    const lineCount = between(1, 3);
    const items = Array.from({ length: lineCount }, () => {
      const p = pick(storeProducts);
      const v = pick(p.variants);
      return {
        productId: p.id,
        title: p.title,
        variantTitle: v.title,
        quantity: between(1, 3),
        price: v.price,
        image: p.images[0],
      };
    });
    const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);
    const shipping = subtotal > 500000 ? 0 : 9900;
    const tax = Math.round(subtotal * 0.18);
    const customer = pick(storeCustomers);
    const placed = new Date(2026, 6, 30 - Math.floor(i / 1.4), 9 + (i % 12), (i * 7) % 60);

    return {
      id: `or_${store.handle}_${i}`,
      storeId: store.id,
      number: 1000 + count - i,
      customer: { id: customer.id, name: customer.name, email: customer.email },
      items,
      subtotal,
      shipping,
      tax,
      total: subtotal + shipping + tax,
      status: i % 11 === 0 ? "cancelled" : i > 6 ? "closed" : "open",
      paymentStatus: PAYMENT_MIX[i % PAYMENT_MIX.length],
      fulfillmentStatus: STATUS_MIX[i % STATUS_MIX.length],
      channel: CHANNELS[i % CHANNELS.length],
      placedAt: placed.toISOString(),
      shippingAddress: {
        line1: `${between(1, 240)} ${pick(["Church St", "MG Road", "Residency Rd", "Brigade Rd"])}`,
        city: customer.location.split(",")[0],
        state: customer.location.split(", ")[1],
        postalCode: String(between(560001, 641099)),
        country: "India",
      },
    } satisfies Order;
  });
});

/* --------------------------------------------------------------- discounts */

export const discounts: Discount[] = stores.flatMap((store, si) =>
  [
    { code: "WELCOME10", type: "percentage" as const, value: 10, status: "active" as const },
    { code: "FREESHIP", type: "free_shipping" as const, value: 0, status: "active" as const },
    { code: "MONSOON500", type: "fixed" as const, value: 50000, status: "scheduled" as const },
    { code: "LAUNCH25", type: "percentage" as const, value: 25, status: "expired" as const },
  ].map((d, i) => ({
    id: `di_${store.handle}_${i}`,
    storeId: store.id,
    ...d,
    used: between(0, 180),
    limit: i % 2 === 0 ? 500 : null,
    startsAt: new Date(2026, 5 + si, 1).toISOString(),
    endsAt: d.status === "expired" ? new Date(2026, 6, 1).toISOString() : null,
  })),
);

/* --------------------------------------------------------------- analytics */

export function metricsFor(storeId: string): StoreMetrics {
  const storeOrders = orders.filter(
    (o) => o.storeId === storeId && o.status !== "cancelled",
  );
  const revenue = storeOrders.reduce((s, o) => s + o.total, 0);

  const byDay = new Map<string, number>();
  for (const o of storeOrders) {
    const day = o.placedAt.slice(0, 10);
    byDay.set(day, (byDay.get(day) ?? 0) + o.total);
  }
  const revenueSeries: MetricPoint[] = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(2026, 6, 1 + i);
    const key = d.toISOString().slice(0, 10);
    return { date: key, value: byDay.get(key) ?? 0 };
  });

  const unitsByProduct = new Map<string, { units: number; revenue: number }>();
  for (const o of storeOrders) {
    for (const it of o.items) {
      const cur = unitsByProduct.get(it.title) ?? { units: 0, revenue: 0 };
      cur.units += it.quantity;
      cur.revenue += it.quantity * it.price;
      unitsByProduct.set(it.title, cur);
    }
  }

  // Derived, not random: metricsFor runs per request and must be stable.
  const sessions = storeOrders.length * 44 + storeId.length * 13;

  return {
    revenue: { value: revenue, change: 0.184 },
    orders: { value: storeOrders.length, change: 0.092 },
    sessions: { value: sessions, change: -0.031 },
    conversionRate: { value: storeOrders.length / sessions, change: 0.126 },
    revenueSeries,
    topProducts: [...unitsByProduct.entries()]
      .map(([title, v]) => ({ title, ...v }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5),
    trafficSources: [
      { source: "Instagram", sessions: Math.round(sessions * 0.38) },
      { source: "Direct", sessions: Math.round(sessions * 0.24) },
      { source: "Google", sessions: Math.round(sessions * 0.19) },
      { source: "WhatsApp", sessions: Math.round(sessions * 0.12) },
      { source: "Referral", sessions: Math.round(sessions * 0.07) },
    ],
  };
}
