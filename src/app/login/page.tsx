"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useActionState, useState } from "react";
import { signIn, signUp, type ActionResult } from "@/lib/actions/auth";
import { Logo } from "@/components/logo";

/**
 * One page for both signing in and signing up.
 *
 * Two forms behind a toggle rather than two routes: the fields differ by one
 * (store name), and a merchant arriving here does not know or care which of the
 * two they need.
 */
export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <Switcher />
    </Suspense>
  );
}

function Switcher() {
  // "Start free" links carry ?new=1, so the page opens on the right side
  // instead of making the visitor find a toggle.
  const wantsSignup = useSearchParams().get("new") !== null;
  const [mode, setMode] = useState<"in" | "up">(wantsSignup ? "up" : "in");
  return (
    <Shell
      mode={mode}
      onSwitch={() => setMode(mode === "in" ? "up" : "in")}
    />
  );
}

function Shell({ mode, onSwitch }: { mode: "in" | "up"; onSwitch: () => void }) {
  const action = mode === "in" ? signIn : signUp;
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    async (prev, form) => action(prev, form),
    null,
  );
  const error = state && "error" in state ? state.error : null;

  return (
    <main className="flex min-h-full items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 flex items-center gap-2">
          <Logo size={28} priority />
          <span className="text-[15px] font-semibold tracking-tight">Hanubees</span>
        </Link>

        <h1 className="iso-display text-[2rem]">
          {mode === "in" ? "Welcome back." : "Open your store."}
        </h1>
        <p className="mt-2 text-[14px] text-text-2">
          {mode === "in"
            ? "Sign in to your admin."
            : "Free until your 50th customer. No card."}
        </p>

        <form action={formAction} className="mt-7 flex flex-col gap-3">
          {mode === "up" ? (
            <Field
              label="Store name"
              name="store"
              type="text"
              placeholder="Bloom & Bark"
              autoComplete="organization"
            />
          ) : null}
          <Field
            label="Email"
            name="email"
            type="email"
            placeholder="you@email.com"
            autoComplete="email"
          />
          <Field
            label="Password"
            name="password"
            type="password"
            placeholder={mode === "up" ? "At least 8 characters" : ""}
            autoComplete={mode === "in" ? "current-password" : "new-password"}
          />

          {error ? (
            <p
              role="alert"
              className="iso-block-sm bg-danger-soft px-3 py-2 text-[13px] text-danger"
            >
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="iso-block iso-press mt-2 inline-flex h-12 items-center justify-center bg-iso-yellow text-[15px] font-semibold text-iso-black disabled:opacity-60"
          >
            {pending
              ? "Working…"
              : mode === "in"
                ? "Sign in"
                : "Create store"}
          </button>
        </form>

        <p className="mt-6 text-[13px] text-text-2">
          {mode === "in" ? "No account yet? " : "Already have one? "}
          <button
            onClick={onSwitch}
            className="font-semibold text-iso-sky-text underline underline-offset-2"
          >
            {mode === "in" ? "Open a store" : "Sign in"}
          </button>
        </p>
      </div>
    </main>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.ComponentProps<"input">) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-medium">{label}</span>
      <input
        {...props}
        required
        className="h-11 rounded-md border-2 border-iso-black bg-surface px-3 text-sm placeholder:text-text-3 focus:outline-none focus:ring-2 focus:ring-accent/30"
      />
    </label>
  );
}
