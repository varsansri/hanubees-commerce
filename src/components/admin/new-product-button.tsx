"use client";

import { useTransition } from "react";
import { createProduct } from "@/lib/actions/products";
import { Button } from "@/components/ui/button";

/** Creates a draft immediately and opens it — no blank "new product" screen. */
export function NewProductButton({ handle }: { handle: string }) {
  const [pending, start] = useTransition();
  return (
    <Button
      variant="primary"
      disabled={pending}
      onClick={() => start(() => void createProduct(handle))}
    >
      {pending ? "Creating…" : "Add product"}
    </Button>
  );
}
