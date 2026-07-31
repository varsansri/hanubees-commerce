"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/** Order writes. Ownership is enforced by RLS, same as products. */

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

export async function setFulfillment(
  handle: string,
  orderId: string,
  status: "unfulfilled" | "partial" | "fulfilled",
): Promise<Result> {
  const storeId = await storeIdFor(handle);
  if (!storeId) return { error: "Store not found." };

  const supabase = await createClient();
  // Fulfilling the last item closes the order — that is what a merchant means
  // by "done", and leaving it open would keep it in the needs-attention count.
  const patch: Record<string, unknown> = { fulfillment_status: status };
  if (status === "fulfilled") patch.status = "closed";

  const { error } = await supabase
    .from("orders")
    .update(patch)
    .eq("id", orderId)
    .eq("store_id", storeId);
  if (error) return { error: error.message };

  revalidatePath(`/admin/${handle}/orders`);
  revalidatePath(`/admin/${handle}/orders/${orderId}`);
  revalidatePath(`/admin/${handle}`);
  return { ok: true };
}

export async function setPayment(
  handle: string,
  orderId: string,
  status: "paid" | "pending" | "refunded",
): Promise<Result> {
  const storeId = await storeIdFor(handle);
  if (!storeId) return { error: "Store not found." };
  const supabase = await createClient();
  const { error } = await supabase
    .from("orders")
    .update({ payment_status: status })
    .eq("id", orderId)
    .eq("store_id", storeId);
  if (error) return { error: error.message };
  revalidatePath(`/admin/${handle}/orders`);
  revalidatePath(`/admin/${handle}/orders/${orderId}`);
  return { ok: true };
}

export async function cancelOrder(handle: string, orderId: string): Promise<Result> {
  const storeId = await storeIdFor(handle);
  if (!storeId) return { error: "Store not found." };
  const supabase = await createClient();
  const { error } = await supabase
    .from("orders")
    .update({ status: "cancelled" })
    .eq("id", orderId)
    .eq("store_id", storeId);
  if (error) return { error: error.message };
  revalidatePath(`/admin/${handle}/orders`);
  revalidatePath(`/admin/${handle}/orders/${orderId}`);
  return { ok: true };
}
