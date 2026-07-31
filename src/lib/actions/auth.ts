"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ActionResult = { error: string } | { ok: true };

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 38);
}

export async function signIn(_prev: unknown, form: FormData): Promise<ActionResult> {
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  if (!email || !password) return { error: "Email and password are both needed." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function signUp(_prev: unknown, form: FormData): Promise<ActionResult> {
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  const storeName = String(form.get("store") ?? "").trim();

  if (!email || !password) return { error: "Email and password are both needed." };
  if (password.length < 8) return { error: "Use at least 8 characters for the password." };
  if (!storeName) return { error: "Your store needs a name." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return { error: error.message };

  // With email confirmation on, there is no session yet — the store is created
  // on first sign-in instead. Tell the user rather than failing silently.
  if (!data.session) {
    return { error: "Check your email to confirm the account, then sign in." };
  }

  const made = await createStoreFor(storeName);
  if ("error" in made) return made;

  revalidatePath("/", "layout");
  redirect(`/admin/${made.handle}`);
}

/** Creates a store for the signed-in user, picking a free handle. */
export async function createStoreFor(
  name: string,
): Promise<{ error: string } | { handle: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You need to be signed in." };

  const base = slugify(name) || "store";
  for (let i = 0; i < 12; i++) {
    const handle = i === 0 ? base : `${base}-${i + 1}`;
    const { error } = await supabase.from("stores").insert({
      owner_id: user.id,
      handle,
      name,
      tagline: "",
    });
    if (!error) return { handle };
    // 23505 = unique violation: that handle is taken, try the next one.
    if (error.code !== "23505") return { error: error.message };
  }
  return { error: "Could not find a free store address. Try another name." };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
