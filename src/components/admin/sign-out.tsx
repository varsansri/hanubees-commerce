"use client";

import { useTransition } from "react";
import { signOut } from "@/lib/actions/auth";

export function SignOut() {
  const [pending, start] = useTransition();
  return (
    <button
      onClick={() => start(() => void signOut())}
      disabled={pending}
      className="rounded-[var(--radius)] px-2 py-1 text-[12px] font-medium text-text-3 transition-colors hover:bg-surface-2 hover:text-text"
    >
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}
