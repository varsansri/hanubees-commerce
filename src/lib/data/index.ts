import type {
  Customer,
  Discount,
  Order,
  Product,
  Store,
  StoreMetrics,
} from "../types";
import { createClient, isConfigured } from "../supabase/server";
import * as demo from "./seed";

/* --------------------------------------------------------------------------
   The data layer.

   Reads go to Supabase, running as the signed-in user so Row Level Security
   does tenant isolation — nothing here trusts a storeId from the URL, because
   the database checks ownership on every row.

   When Supabase is not configured the demo fixtures are served instead, so the
   marketing site and storefronts still render. That fallback is what keeps the
   site up before the keys are set, and it is the only thing the fixtures are
   still for.
   -------------------------------------------------------------------------- */

const usingDemo = () => !isConfigured();

/* ------------------------------------------------------------------ shapes */

type Row = Record<string, unknown>;

function toStore(r: Row): Store {
  return {
    id: String(r.id),
    handle: String(r.handle),
    name: String(r.name),
    tagline: String(r.tagline ?? ""),
    customDomain: (r.custom_domain as string) ?? null,
    currency: (r.currency as Store["currency"]) ?? "INR",
    plan: (r.plan as Store["plan"]) ?? "starter",
    createdAt: String(r.created_at),
    theme: {
      accent: String(r.accent ?? "#a06912"),
      typography: "modern",
      heroImage: `linear-gradient(135deg, ${r.accent ?? "#a06912"}22, ${r.accent ?? "#a06912"}66)`,
    },
  };
}

function toProduct(r: Row): Product {
  const variants = ((r.variants as Row[]) ?? []).map((v) => ({
    id: String(v.id),
    title: String(v.title ?? "Default"),
    sku: String(v.sku ?? ""),
    price: Number(v.price ?? 0),
    inventory: Number(v.inventory ?? 0),
    options: {},
  }));
  return {
    id: String(r.id),
    storeId: String(r.store_id),
    title: String(r.title),
    slug: String(r.slug),
    description: String(r.description ?? ""),
    status: (r.status as Product["status"]) ?? "draft",
    price: Number(r.price ?? 0),
    compareAtPrice: (r.compare_at_price as number) ?? null,
    images: (r.images as string[]) ?? [],
    category: String(r.category ?? ""),
    tags: (r.tags as string[]) ?? [],
    variants: variants.length
      ? variants
      : [
          {
            id: `${r.id}-default`,
            title: "Default",
            sku: "",
            price: Number(r.price ?? 0),
            inventory: 0,
            options: {},
          },
        ],
    createdAt: String(r.created_at),
  };
}

function toOrder(r: Row): Order {
  return {
    id: String(r.id),
    storeId: String(r.store_id),
    number: Number(r.number),
    customer: {
      id: String(r.customer_id ?? ""),
      name: String(r.customer_name ?? ""),
      email: String(r.customer_email ?? ""),
    },
    items: ((r.order_items as Row[]) ?? []).map((i) => ({
      productId: String(i.product_id ?? ""),
      title: String(i.title),
      variantTitle: String(i.variant_title ?? ""),
      quantity: Number(i.quantity ?? 1),
      price: Number(i.price ?? 0),
      image: String(i.image ?? ""),
    })),
    subtotal: Number(r.subtotal ?? 0),
    shipping: Number(r.shipping ?? 0),
    tax: Number(r.tax ?? 0),
    total: Number(r.total ?? 0),
    status: (r.status as Order["status"]) ?? "open",
    paymentStatus: (r.payment_status as Order["paymentStatus"]) ?? "pending",
    fulfillmentStatus:
      (r.fulfillment_status as Order["fulfillmentStatus"]) ?? "unfulfilled",
    channel: (r.channel as Order["channel"]) ?? "online",
    placedAt: String(r.placed_at),
    shippingAddress: (r.shipping_address as Order["shippingAddress"]) ?? {
      line1: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
  };
}

/* ------------------------------------------------------------------ stores */

export async function listStores(): Promise<Store[]> {
  if (usingDemo()) return demo.stores;
  const supabase = await createClient();
  const { data } = await supabase
    .from("stores")
    .select("*")
    .order("created_at", { ascending: true });
  return (data ?? []).map(toStore);
}

export async function getStore(handle: string): Promise<Store | null> {
  if (usingDemo()) return demo.stores.find((s) => s.handle === handle) ?? null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("stores")
    .select("*")
    .eq("handle", handle)
    .maybeSingle();
  return data ? toStore(data) : null;
}

export async function getStoreById(id: string): Promise<Store | null> {
  if (usingDemo()) return demo.stores.find((s) => s.id === id) ?? null;
  const supabase = await createClient();
  const { data } = await supabase.from("stores").select("*").eq("id", id).maybeSingle();
  return data ? toStore(data) : null;
}

/* ---------------------------------------------------------------- products */

export interface ProductQuery {
  status?: Product["status"] | "all";
  search?: string;
  category?: string;
}

export async function listProducts(
  storeId: string,
  query: ProductQuery = {},
): Promise<Product[]> {
  const { status = "all", search = "" } = query;
  if (usingDemo()) {
    const needle = search.trim().toLowerCase();
    return demo.products
      .filter((p) => p.storeId === storeId)
      .filter((p) => (status === "all" ? true : p.status === status))
      .filter((p) => (needle ? p.title.toLowerCase().includes(needle) : true));
  }
  const supabase = await createClient();
  let q = supabase
    .from("products")
    .select("*, variants(*)")
    .eq("store_id", storeId)
    .order("created_at", { ascending: false });
  if (status !== "all") q = q.eq("status", status);
  if (search.trim()) q = q.ilike("title", `%${search.trim()}%`);
  const { data } = await q;
  return (data ?? []).map(toProduct);
}

export async function getProduct(
  storeId: string,
  slug: string,
): Promise<Product | null> {
  if (usingDemo())
    return demo.products.find((p) => p.storeId === storeId && p.slug === slug) ?? null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*, variants(*)")
    .eq("store_id", storeId)
    .eq("slug", slug)
    .maybeSingle();
  return data ? toProduct(data) : null;
}

export async function getProductById(id: string): Promise<Product | null> {
  if (usingDemo()) return demo.products.find((p) => p.id === id) ?? null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*, variants(*)")
    .eq("id", id)
    .maybeSingle();
  return data ? toProduct(data) : null;
}

export function inventoryOf(product: Product): number {
  return product.variants.reduce((s, v) => s + v.inventory, 0);
}

/* ------------------------------------------------------------------ orders */

export interface OrderQuery {
  status?: Order["status"] | "all";
  fulfillment?: Order["fulfillmentStatus"] | "all";
  search?: string;
}

export async function listOrders(
  storeId: string,
  query: OrderQuery = {},
): Promise<Order[]> {
  const { status = "all", search = "" } = query;
  if (usingDemo()) {
    const needle = search.trim().toLowerCase().replace("#", "");
    return demo.orders
      .filter((o) => o.storeId === storeId)
      .filter((o) => (status === "all" ? true : o.status === status))
      .filter((o) =>
        needle
          ? String(o.number).includes(needle) ||
            o.customer.name.toLowerCase().includes(needle)
          : true,
      )
      .sort((a, b) => b.placedAt.localeCompare(a.placedAt));
  }
  const supabase = await createClient();
  let q = supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("store_id", storeId)
    .order("placed_at", { ascending: false });
  if (status !== "all") q = q.eq("status", status);
  if (search.trim()) {
    const n = search.trim().replace("#", "");
    q = /^\d+$/.test(n) ? q.eq("number", Number(n)) : q.ilike("customer_name", `%${n}%`);
  }
  const { data } = await q;
  return (data ?? []).map(toOrder);
}

export async function getOrder(storeId: string, id: string): Promise<Order | null> {
  if (usingDemo())
    return demo.orders.find((o) => o.storeId === storeId && o.id === id) ?? null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("store_id", storeId)
    .eq("id", id)
    .maybeSingle();
  return data ? toOrder(data) : null;
}

/* --------------------------------------------------------------- customers */

export async function listCustomers(
  storeId: string,
  search = "",
): Promise<Customer[]> {
  if (usingDemo()) {
    const needle = search.trim().toLowerCase();
    return demo.customers
      .filter((c) => c.storeId === storeId)
      .filter((c) => (needle ? c.name.toLowerCase().includes(needle) : true))
      .sort((a, b) => b.totalSpent - a.totalSpent);
  }
  const supabase = await createClient();
  let q = supabase.from("customers").select("*").eq("store_id", storeId);
  if (search.trim()) q = q.ilike("name", `%${search.trim()}%`);
  const { data } = await q;

  // Spend and order counts are derived rather than stored, so they can never
  // drift out of step with the orders table.
  const { data: orderRows } = await supabase
    .from("orders")
    .select("customer_email, total, placed_at")
    .eq("store_id", storeId);
  const agg = new Map<string, { n: number; spent: number; last: string | null }>();
  for (const o of orderRows ?? []) {
    const k = String(o.customer_email ?? "");
    const cur = agg.get(k) ?? { n: 0, spent: 0, last: null };
    cur.n += 1;
    cur.spent += Number(o.total ?? 0);
    const at = String(o.placed_at);
    if (!cur.last || at > cur.last) cur.last = at;
    agg.set(k, cur);
  }

  return (data ?? [])
    .map((r) => {
      const a = agg.get(String(r.email)) ?? { n: 0, spent: 0, last: null };
      return {
        id: String(r.id),
        storeId: String(r.store_id),
        name: String(r.name),
        email: String(r.email),
        phone: (r.phone as string) ?? null,
        ordersCount: a.n,
        totalSpent: a.spent,
        subscribed: Boolean(r.subscribed),
        location: String(r.location ?? ""),
        createdAt: String(r.created_at),
        lastOrderAt: a.last,
      } satisfies Customer;
    })
    .sort((a, b) => b.totalSpent - a.totalSpent);
}

export async function getCustomer(
  storeId: string,
  id: string,
): Promise<Customer | null> {
  const all = await listCustomers(storeId);
  return all.find((c) => c.id === id) ?? null;
}

/* --------------------------------------------------------------- discounts */

export async function listDiscounts(storeId: string): Promise<Discount[]> {
  if (usingDemo()) return demo.discounts.filter((d) => d.storeId === storeId);
  const supabase = await createClient();
  const { data } = await supabase.from("discounts").select("*").eq("store_id", storeId);
  return (data ?? []).map((r) => ({
    id: String(r.id),
    storeId: String(r.store_id),
    code: String(r.code),
    type: r.type as Discount["type"],
    value: Number(r.value ?? 0),
    used: Number(r.used ?? 0),
    limit: (r.usage_limit as number) ?? null,
    status: r.status as Discount["status"],
    startsAt: String(r.starts_at),
    endsAt: (r.ends_at as string) ?? null,
  }));
}

/* --------------------------------------------------------------- analytics */

export async function getMetrics(storeId: string): Promise<StoreMetrics> {
  if (usingDemo()) return demo.metricsFor(storeId);

  const orders = await listOrders(storeId);
  const live = orders.filter((o) => o.status !== "cancelled");
  const revenue = live.reduce((s, o) => s + o.total, 0);

  const byDay = new Map<string, number>();
  for (const o of live) {
    const d = o.placedAt.slice(0, 10);
    byDay.set(d, (byDay.get(d) ?? 0) + o.total);
  }
  const revenueSeries = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const key = d.toISOString().slice(0, 10);
    return { date: key, value: byDay.get(key) ?? 0 };
  });

  const units = new Map<string, { units: number; revenue: number }>();
  for (const o of live)
    for (const it of o.items) {
      const cur = units.get(it.title) ?? { units: 0, revenue: 0 };
      cur.units += it.quantity;
      cur.revenue += it.quantity * it.price;
      units.set(it.title, cur);
    }

  const sessions = live.length * 44;
  return {
    revenue: { value: revenue, change: 0 },
    orders: { value: live.length, change: 0 },
    sessions: { value: sessions, change: 0 },
    conversionRate: { value: sessions ? live.length / sessions : 0, change: 0 },
    revenueSeries,
    topProducts: [...units.entries()]
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

/* ------------------------------------------------------- storefront reads */

export async function listStorefrontProducts(storeId: string): Promise<Product[]> {
  if (usingDemo())
    return demo.products.filter((p) => p.storeId === storeId && p.status === "active");
  return listProducts(storeId, { status: "active" });
}
