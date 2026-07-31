"use client";

import { useActionState } from "react";
import { deleteProduct, updateProduct } from "@/lib/actions/products";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Table, Td, Th, Tr } from "@/components/ui/table";
import type { Product, Store } from "@/lib/types";

/**
 * The product editor.
 *
 * One form covering details, organisation, pricing and per-variant stock, so a
 * merchant saves once rather than hunting for several save buttons. Prices are
 * shown and typed in rupees; the action converts to paise on the way in.
 */
export function ProductForm({ store, product }: { store: Store; product: Product }) {
  const [state, formAction, pending] = useActionState<{ error: string } | null, FormData>(
    async (prev, form) => {
      const r = await updateProduct(store.handle, product.id, prev, form);
      return "error" in r ? r : null;
    },
    null,
  );

  const rupees = (minor: number) => (minor / 100).toFixed(2);

  return (
    <form action={formAction} className="contents">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-semibold tracking-tight">{product.title}</h1>
        <div className="ml-auto flex gap-2">
          <Button
            type="button"
            variant="danger"
            size="sm"
            formAction={async () => {
              await deleteProduct(store.handle, product.id);
            }}
          >
            Delete
          </Button>
          <Button type="submit" variant="primary" size="sm" disabled={pending}>
            {pending ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>

      {state?.error ? (
        <p role="alert" className="iso-block-sm bg-danger-soft px-3 py-2 text-[13px] text-danger">
          {state.error}
        </p>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Card>
            <CardHeader title="Details" />
            <div className="mt-4 flex flex-col gap-4">
              <Field label="Title">
                <Input name="title" defaultValue={product.title} required />
              </Field>
              <Field label="Description" hint="Shown on the product page.">
                <Textarea name="description" defaultValue={product.description} />
              </Field>
            </div>
          </Card>

          <Card padded={false}>
            <div className="p-5">
              <CardHeader
                title="Stock"
                description="Edit the numbers and save with the rest of the product."
              />
            </div>
            <div className="overflow-x-auto">
              <Table>
                <thead>
                  <tr>
                    <Th>Variant</Th>
                    <Th>SKU</Th>
                    <Th align="right">In stock</Th>
                  </tr>
                </thead>
                <tbody>
                  {product.variants.map((v) => (
                    <Tr key={v.id}>
                      <Td className="font-medium">{v.title}</Td>
                      <Td className="font-mono text-xs text-text-2">{v.sku || "—"}</Td>
                      <Td align="right">
                        <input
                          name={`inv:${v.id}`}
                          type="number"
                          min={0}
                          defaultValue={v.inventory}
                          className="nums h-8 w-24 rounded-md border border-line-strong bg-surface px-2 text-right text-sm focus:border-accent focus:outline-none"
                        />
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader title="Organisation" />
            <div className="mt-4 flex flex-col gap-4">
              <Field label="Status" hint="Only active products appear in your store.">
                <Select name="status" defaultValue={product.status}>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </Select>
              </Field>
              <Field label="Category">
                <Input name="category" defaultValue={product.category} />
              </Field>
              <Field label="Tags" hint="Comma separated">
                <Input name="tags" defaultValue={product.tags.join(", ")} />
              </Field>
            </div>
          </Card>

          <Card>
            <CardHeader title="Pricing" description={`In ${store.currency}`} />
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Field label="Price">
                <Input name="price" inputMode="decimal" defaultValue={rupees(product.price)} />
              </Field>
              <Field label="Compare at">
                <Input
                  name="compareAtPrice"
                  inputMode="decimal"
                  placeholder="—"
                  defaultValue={
                    product.compareAtPrice ? rupees(product.compareAtPrice) : ""
                  }
                />
              </Field>
            </div>
          </Card>
        </div>
      </div>
    </form>
  );
}
