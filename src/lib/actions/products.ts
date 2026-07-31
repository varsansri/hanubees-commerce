"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Product writes.
 *
 * Every action re-reads the store by handle through the user's own client, so
 * Row Level Security decides whether it exists for them. A handle from the URL
 * belonging to someone else simply resolves to nothing — there is no separate
 * ownership check to forget.
 */

type Result = { error: string } | { ok: true };

async function storeIdFor(handle: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("stores")
    .select("id")
    .eq("handle", handle)
    .maybeSingle();
  return data?.id as string | undefined;
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/** Money arrives as rupees from the form and is stored in paise. */
function toMinor(v: FormDataEntryValue | null): number {
  const n = Number(String(v ?? "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? Math.round(n * 100) : 0;
}

export async function createProduct(handle: string): Promise<Result> {
  const storeId = await storeIdFor(handle);
  if (!storeId) return { error: "Store not found." };

  const supabase = await createClient();
  const stamp = Date.now().toString(36);
  const { data, error } = await supabase
    .from("products")
    .insert({
      store_id: storeId,
      title: "Untitled product",
      slug: `untitled-${stamp}`,
      status: "draft",
      price: 0,
    })
    .select("slug")
    .single();
  if (error) return { error: error.message };

  revalidatePath(`/admin/${handle}/products`);
  redirect(`/admin/${handle}/products/${data.slug}`);
}

export async function updateProduct(
  handle: string,
  productId: string,
  _prev: unknown,
  form: FormData,
): Promise<Result> {
  const storeId = await storeIdFor(handle);
  if (!storeId) return { error: "Store not found." };

  const title = String(form.get("title") ?? "").trim();
  if (!title) return { error: "A product needs a title." };

  const compareRaw = String(form.get("compareAtPrice") ?? "").trim();
  const patch = {
    title,
    slug: slugify(title) || `product-${productId.slice(0, 6)}`,
    description: String(form.get("description") ?? ""),
    status: String(form.get("status") ?? "draft"),
    price: toMinor(form.get("price")),
    compare_at_price: compareRaw ? toMinor(compareRaw) : null,
    category: String(form.get("category") ?? "").trim(),
    tags: String(form.get("tags") ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    updated_at: new Date().toISOString(),
  };

  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update(patch)
    .eq("id", productId)
    .eq("store_id", storeId);
  if (error) {
    return {
      error:
        error.code === "23505"
          ? "Another product already uses that name."
          : error.message,
    };
  }

  // Stock is edited inline on the variant rows.
  for (const [key, value] of form.entries()) {
    if (!key.startsWith("inv:")) continue;
    const variantId = key.slice(4);
    await supabase
      .from("variants")
      .update({ inventory: Number(value) || 0 })
      .eq("id", variantId);
  }

  revalidatePath(`/admin/${handle}/products`);
  revalidatePath(`/admin/${handle}/products/${patch.slug}`);
  revalidatePath(`/store/${handle}`);
  redirect(`/admin/${handle}/products/${patch.slug}`);
}

export async function deleteProduct(handle: string, productId: string): Promise<Result> {
  const storeId = await storeIdFor(handle);
  if (!storeId) return { error: "Store not found." };
  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId)
    .eq("store_id", storeId);
  if (error) return { error: error.message };
  revalidatePath(`/admin/${handle}/products`);
  redirect(`/admin/${handle}/products`);
}

export async function addVariant(handle: string, productId: string): Promise<Result> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("variants")
    .insert({ product_id: productId, title: "New option", inventory: 0 });
  if (error) return { error: error.message };
  revalidatePath(`/admin/${handle}/products`);
  return { ok: true };
}
