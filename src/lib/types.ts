/**
 * Domain model for the Hanubees commerce platform.
 *
 * These types are the contract between the UI and the data layer. The current
 * implementation in `lib/data` is in-memory; swapping it for Postgres means
 * satisfying these shapes and nothing in `app/` or `components/` changes.
 */

export type ID = string;

/* ------------------------------------------------------------------ tenant */

/** A merchant account. One store = one tenant, resolved from the subdomain. */
export interface Store {
  id: ID;
  /** Subdomain label — `acme` serves acme.hanubees.com */
  handle: string;
  name: string;
  tagline: string;
  /** Attached custom domain, once verified. */
  customDomain: string | null;
  currency: Currency;
  plan: Plan;
  createdAt: string;
  theme: StoreTheme;
}

export interface StoreTheme {
  /** Storefront accent, chosen per merchant. Admin chrome stays Hanubees honey. */
  accent: string;
  /** Display typeface pairing key. */
  typography: "modern" | "editorial" | "playful";
  heroImage: string;
}

export type Currency = "INR" | "USD" | "EUR" | "GBP";
export type Plan = "starter" | "growth" | "scale";

/* ----------------------------------------------------------------- catalog */

export interface Product {
  id: ID;
  storeId: ID;
  title: string;
  slug: string;
  description: string;
  status: ProductStatus;
  /** Lowest variant price, in minor units. */
  price: number;
  compareAtPrice: number | null;
  images: string[];
  category: string;
  tags: string[];
  variants: Variant[];
  createdAt: string;
}

export type ProductStatus = "active" | "draft" | "archived";

export interface Variant {
  id: ID;
  title: string;
  sku: string;
  price: number;
  inventory: number;
  options: Record<string, string>;
}

/* ------------------------------------------------------------------ orders */

export interface Order {
  id: ID;
  storeId: ID;
  /** Human-facing sequential number, e.g. #1042 */
  number: number;
  customer: CustomerRef;
  items: OrderLine[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  channel: Channel;
  placedAt: string;
  shippingAddress: Address;
}

export type OrderStatus = "open" | "closed" | "cancelled";
export type PaymentStatus = "paid" | "pending" | "refunded" | "partially_refunded";
export type FulfillmentStatus = "unfulfilled" | "fulfilled" | "partial";
export type Channel = "online" | "pos" | "instagram" | "whatsapp";

export interface OrderLine {
  productId: ID;
  title: string;
  variantTitle: string;
  quantity: number;
  price: number;
  image: string;
}

export interface CustomerRef {
  id: ID;
  name: string;
  email: string;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

/* --------------------------------------------------------------- customers */

export interface Customer {
  id: ID;
  storeId: ID;
  name: string;
  email: string;
  phone: string | null;
  ordersCount: number;
  totalSpent: number;
  /** Marketing consent — drives who can be emailed. */
  subscribed: boolean;
  location: string;
  createdAt: string;
  lastOrderAt: string | null;
}

/* --------------------------------------------------------------- discounts */

export interface Discount {
  id: ID;
  storeId: ID;
  code: string;
  type: "percentage" | "fixed" | "free_shipping";
  value: number;
  used: number;
  limit: number | null;
  status: "active" | "scheduled" | "expired";
  startsAt: string;
  endsAt: string | null;
}

/* --------------------------------------------------------------- analytics */

export interface MetricPoint {
  date: string;
  value: number;
}

export interface StoreMetrics {
  revenue: Metric;
  orders: Metric;
  sessions: Metric;
  conversionRate: Metric;
  /** Daily revenue for the sparkline / chart. */
  revenueSeries: MetricPoint[];
  topProducts: { title: string; units: number; revenue: number }[];
  trafficSources: { source: string; sessions: number }[];
}

export interface Metric {
  value: number;
  /** Fractional change vs the previous equivalent period. 0.12 = +12%. */
  change: number;
}
