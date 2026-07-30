import type {
  Customer,
  Discount,
  Order,
  Product,
  Store,
  StoreMetrics,
} from "../types";
import * as seed from "./seed";

/* --------------------------------------------------------------------------
   The data seam.

   Every read the UI performs goes through this module and every function is
   async. Today they resolve against the in-memory seed; replacing the bodies
   with SQL is the whole backend migration — no call site changes.

   When that happens, each function also gains a tenant guard: `storeId` must
   match the session's store, so one merchant can never read another's rows.
   -------------------------------------------------------------------------- */

export async function listStores(): Promise<Store[]> {
  return seed.stores;
}

export async function getStore(handle: string): Promise<Store | null> {
  return seed.stores.find((s) => s.handle === handle) ?? null;
}

export async function getStoreById(id: string): Promise<Store | null> {
  return seed.stores.find((s) => s.id === id) ?? null;
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
  const { status = "all", search = "", category } = query;
  const needle = search.trim().toLowerCase();

  return seed.products
    .filter((p) => p.storeId === storeId)
    .filter((p) => (status === "all" ? true : p.status === status))
    .filter((p) => (category ? p.category === category : true))
    .filter((p) =>
      needle
        ? p.title.toLowerCase().includes(needle) ||
          p.variants.some((v) => v.sku.toLowerCase().includes(needle))
        : true,
    );
}

export async function getProduct(
  storeId: string,
  slug: string,
): Promise<Product | null> {
  return (
    seed.products.find((p) => p.storeId === storeId && p.slug === slug) ?? null
  );
}

export async function getProductById(id: string): Promise<Product | null> {
  return seed.products.find((p) => p.id === id) ?? null;
}

/** Total units across variants — what the products table shows as stock. */
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
  const { status = "all", fulfillment = "all", search = "" } = query;
  const needle = search.trim().toLowerCase().replace("#", "");

  return seed.orders
    .filter((o) => o.storeId === storeId)
    .filter((o) => (status === "all" ? true : o.status === status))
    .filter((o) =>
      fulfillment === "all" ? true : o.fulfillmentStatus === fulfillment,
    )
    .filter((o) =>
      needle
        ? String(o.number).includes(needle) ||
          o.customer.name.toLowerCase().includes(needle) ||
          o.customer.email.toLowerCase().includes(needle)
        : true,
    )
    .sort((a, b) => b.placedAt.localeCompare(a.placedAt));
}

export async function getOrder(
  storeId: string,
  id: string,
): Promise<Order | null> {
  return seed.orders.find((o) => o.storeId === storeId && o.id === id) ?? null;
}

/* --------------------------------------------------------------- customers */

export async function listCustomers(
  storeId: string,
  search = "",
): Promise<Customer[]> {
  const needle = search.trim().toLowerCase();
  return seed.customers
    .filter((c) => c.storeId === storeId)
    .filter((c) =>
      needle
        ? c.name.toLowerCase().includes(needle) ||
          c.email.toLowerCase().includes(needle)
        : true,
    )
    .sort((a, b) => b.totalSpent - a.totalSpent);
}

export async function getCustomer(
  storeId: string,
  id: string,
): Promise<Customer | null> {
  return (
    seed.customers.find((c) => c.storeId === storeId && c.id === id) ?? null
  );
}

/* --------------------------------------------------------------- discounts */

export async function listDiscounts(storeId: string): Promise<Discount[]> {
  return seed.discounts.filter((d) => d.storeId === storeId);
}

/* --------------------------------------------------------------- analytics */

export async function getMetrics(storeId: string): Promise<StoreMetrics> {
  return seed.metricsFor(storeId);
}

/* ------------------------------------------------------- storefront reads */

/** Only active products are ever exposed to shoppers. */
export async function listStorefrontProducts(
  storeId: string,
): Promise<Product[]> {
  return seed.products.filter(
    (p) => p.storeId === storeId && p.status === "active",
  );
}
